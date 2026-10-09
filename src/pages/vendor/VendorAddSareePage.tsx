import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Upload, Image as ImageIcon, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_SAREE_IMAGE, LUXURY_IMAGE_PRESETS } from '../../data/sampleSarees';
import { compressImageFile } from '../../utils/imageCompressor';

const DEFAULT_FABRICS = ['Silk', 'Cotton', 'Linen', 'Chiffon', 'Georgette', 'Organza', 'Tussar', 'Velvet'];
const DEFAULT_CATEGORIES = ['Kanchipuram', 'Banarasi', 'Party Wear', 'Traditional', 'Bandhani', 'Chanderi'];
const DEFAULT_COLORS = ['Red', 'Pink', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Maroon', 'Gold', 'Beige'];

export const VendorAddSareePage: React.FC = () => {
  const { addVendorSaree } = useShop();
  const { vendor } = useVendorAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [uploadMode, setUploadMode] = useState<'presets' | 'file' | 'url'>('presets');
  const [isCompressing, setIsCompressing] = useState(false);

  const [isCustomFabric, setIsCustomFabric] = useState(false);
  const [customFabric, setCustomFabric] = useState('');

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    vendorPrice: '',        // Vendor Quoted Cost / Wholesale Cost
    suggestedPrice: '',     // Suggested Customer Price / MRP
    fabric: 'Silk',
    category: 'Kanchipuram',
    color: 'Pink',
    description: '',
    stock: '5',
    image: LUXURY_IMAGE_PRESETS[0].url
  });

  const [imagePreview, setImagePreview] = useState<string>(LUXURY_IMAGE_PRESETS[0].url);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload with compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        return;
      }

      try {
        setIsCompressing(true);
        showToast('Optimizing photo for high quality display...', 'info');
        const compressedBase64 = await compressImageFile(file, 800, 1000, 0.82);
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: '' }));
        }
        showToast('Photo optimized successfully!', 'success');
      } catch (err) {
        console.error('Image compression failed:', err);
        showToast('Failed to process image. Try another photo.', 'error');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSelectPreset = (url: string) => {
    setImagePreview(url);
    setFormData(prev => ({ ...prev, image: url }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Saree title is required';
    }

    if (!formData.vendorPrice || isNaN(Number(formData.vendorPrice)) || Number(formData.vendorPrice) <= 0) {
      newErrors.vendorPrice = 'Please enter a valid vendor quoted cost (₹)';
    }

    if (formData.suggestedPrice && (isNaN(Number(formData.suggestedPrice)) || Number(formData.suggestedPrice) <= 0)) {
      newErrors.suggestedPrice = 'Suggested price must be a valid number';
    }

    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 1) {
      newErrors.stock = 'Enter available stock quantity (min 1)';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Saree image is required';
    }

    if (isCustomFabric && !customFabric.trim()) {
      newErrors.fabric = 'Please specify custom fabric';
    }

    if (isCustomCategory && !customCategory.trim()) {
      newErrors.category = 'Please specify custom category';
    }

    if (isCustomColor && !customColor.trim()) {
      newErrors.color = 'Please specify custom color';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please fix the form errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalFabric = isCustomFabric ? customFabric.trim() : formData.fabric;
      const finalCategory = isCustomCategory ? customCategory.trim() : formData.category;
      const finalColor = isCustomColor ? customColor.trim() : formData.color;
      const vendorCost = Number(formData.vendorPrice);
      const suggestedPrice = formData.suggestedPrice ? Number(formData.suggestedPrice) : vendorCost * 1.35;

      await addVendorSaree({
        name: formData.name.trim(),
        price: Math.round(suggestedPrice), // Temporary selling price pending admin approval
        originalPrice: formData.suggestedPrice ? Number(formData.suggestedPrice) * 1.3 : undefined,
        image: formData.image,
        category: finalCategory,
        fabric: finalFabric,
        color: finalColor,
        description: formData.description.trim() || `Authentic handloom ${finalFabric} saree in ${finalColor}. Supplied by ${vendor?.username || 'Vendor'}.`,
        stock: Number(formData.stock),
        vendorPrice: vendorCost,
        vendorName: vendor?.username || 'Vendor Partner',
        vendorEmail: vendor?.email || 'vendor@truewomen.in',
        approvalStatus: 'pending'
      });

      showToast('Saree submitted successfully! Admin will review & approve pricing.', 'success');
      navigate('/vendor/sarees');
    } catch (err) {
      console.error('Failed to submit vendor saree:', err);
      showToast('Failed to submit saree. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-burgundy hover:text-brand-rose transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-gold" />
          <span>Back to Vendor Dashboard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-deepBurgundy to-[#4a0e28] text-white p-6 sm:p-8 rounded-3xl border border-brand-gold/40 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-gold bg-black/30 px-3 py-1 rounded-full border border-brand-gold/30 mb-2">
            <Sparkles className="w-3 h-3" /> New Saree Submission
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-ivory">
            Submit Saree for Approval
          </h1>
          <p className="text-xs text-brand-ivory/80 mt-1 max-w-xl">
            Provide your saree details and quoted wholesale cost. Admin will review, fix the store selling price, and publish it to the customer boutique.
          </p>
        </div>

        <div className="bg-black/30 border border-brand-gold/30 rounded-2xl p-3.5 text-xs text-brand-gold space-y-1 sm:text-right">
          <p className="font-bold text-white">Submitting As:</p>
          <p className="font-semibold">{vendor?.username}</p>
          <p className="text-[11px] text-brand-gold/70">{vendor?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Saree Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card space-y-5">
            <h2 className="font-serif text-lg font-bold text-brand-burgundy border-b border-brand-gold/20 pb-3 flex items-center gap-2">
              <span>Saree Details</span>
            </h2>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                Saree Title / Design Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Royal Maroon Kanchipuram Pure Zari Silk Saree"
                className={`w-full px-4 py-3 bg-brand-cream/40 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-brand-gold/30'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Price Row: Vendor Quoted Cost & Suggested Retail Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-lightGold/30 border border-brand-gold/30">
              
              {/* Vendor Quoted Cost (The Amount They Told) */}
              <div>
                <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1">
                  Vendor Quoted Cost (₹) <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-brand-muted mb-1.5">
                  Your wholesale payout price per saree.
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-brand-burgundy text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.vendorPrice}
                    onChange={e => setFormData(prev => ({ ...prev, vendorPrice: e.target.value }))}
                    placeholder="2500"
                    className={`w-full pl-8 pr-4 py-3 bg-white border rounded-xl text-sm font-semibold text-brand-burgundy focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                      errors.vendorPrice ? 'border-red-400' : 'border-brand-gold/40'
                    }`}
                  />
                </div>
                {errors.vendorPrice && <p className="text-xs text-red-500 mt-1">{errors.vendorPrice}</p>}
              </div>

              {/* Suggested Retail Price */}
              <div>
                <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1">
                  Suggested Retail Price (₹) <span className="text-brand-muted text-[10px] font-normal">(Optional)</span>
                </label>
                <p className="text-[11px] text-brand-muted mb-1.5">
                  Proposed store selling price for customers.
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-brand-muted text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.suggestedPrice}
                    onChange={e => setFormData(prev => ({ ...prev, suggestedPrice: e.target.value }))}
                    placeholder="3999"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-brand-gold/40 rounded-xl text-sm font-semibold text-brand-charcoal focus:ring-2 focus:ring-brand-gold focus:outline-none"
                  />
                </div>
                {errors.suggestedPrice && <p className="text-xs text-red-500 mt-1">{errors.suggestedPrice}</p>}
              </div>
            </div>

            {/* Category & Fabric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                  Category
                </label>
                {!isCustomCategory ? (
                  <select
                    value={formData.category}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategory(true);
                      } else {
                        setFormData(prev => ({ ...prev, category: e.target.value }));
                      }
                    }}
                    className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none cursor-pointer"
                  >
                    {DEFAULT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__custom__">+ Custom Category...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new category"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="px-3 py-2 text-xs font-bold text-brand-burgundy bg-brand-lightGold/60 rounded-xl border border-brand-gold/40"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>

              {/* Fabric */}
              <div>
                <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                  Fabric Type
                </label>
                {!isCustomFabric ? (
                  <select
                    value={formData.fabric}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setIsCustomFabric(true);
                      } else {
                        setFormData(prev => ({ ...prev, fabric: e.target.value }));
                      }
                    }}
                    className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none cursor-pointer"
                  >
                    {DEFAULT_FABRICS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                    <option value="__custom__">+ Custom Fabric...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new fabric"
                      value={customFabric}
                      onChange={e => setCustomFabric(e.target.value)}
                      className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomFabric(false)}
                      className="px-3 py-2 text-xs font-bold text-brand-burgundy bg-brand-lightGold/60 rounded-xl border border-brand-gold/40"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {errors.fabric && <p className="text-xs text-red-500 mt-1">{errors.fabric}</p>}
              </div>

            </div>

            {/* Color & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                  Primary Color
                </label>
                {!isCustomColor ? (
                  <select
                    value={formData.color}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setIsCustomColor(true);
                      } else {
                        setFormData(prev => ({ ...prev, color: e.target.value }));
                      }
                    }}
                    className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none cursor-pointer"
                  >
                    {DEFAULT_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__custom__">+ Custom Color...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter color"
                      value={customColor}
                      onChange={e => setCustomColor(e.target.value)}
                      className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomColor(false)}
                      className="px-3 py-2 text-xs font-bold text-brand-burgundy bg-brand-lightGold/60 rounded-xl border border-brand-gold/40"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                  Stock Units Ready <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.stock}
                  onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="5"
                  className={`w-full px-4 py-3 bg-brand-cream/40 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                    errors.stock ? 'border-red-400 bg-red-50' : 'border-brand-gold/30'
                  }`}
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                Weaving Details & Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the zari craftsmanship, pallu design, blouse piece details, etc."
                className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none resize-none"
              />
            </div>

          </div>

          {/* Section: Image Selection / Upload */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card space-y-5">
            <h2 className="font-serif text-lg font-bold text-brand-burgundy border-b border-brand-gold/20 pb-3">
              Saree Photograph
            </h2>

            {/* Upload Mode Switcher */}
            <div className="flex border border-brand-gold/30 rounded-xl p-1 bg-brand-cream/40">
              <button
                type="button"
                onClick={() => setUploadMode('presets')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  uploadMode === 'presets' ? 'bg-brand-burgundy text-white shadow-sm' : 'text-brand-charcoal hover:text-brand-burgundy'
                }`}
              >
                Sample Catalog Presets
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  uploadMode === 'file' ? 'bg-brand-burgundy text-white shadow-sm' : 'text-brand-charcoal hover:text-brand-burgundy'
                }`}
              >
                Upload File (JPG / PNG)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  uploadMode === 'url' ? 'bg-brand-burgundy text-white shadow-sm' : 'text-brand-charcoal hover:text-brand-burgundy'
                }`}
              >
                Image URL
              </button>
            </div>

            {/* Presets Mode */}
            {uploadMode === 'presets' && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                {LUXURY_IMAGE_PRESETS.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPreset(p.url)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all aspect-[3/4] ${
                      formData.image === p.url ? 'border-brand-burgundy ring-2 ring-brand-gold scale-95' : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    {formData.image === p.url && (
                      <div className="absolute inset-0 bg-brand-burgundy/40 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-brand-gold" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* File Upload Mode */}
            {uploadMode === 'file' && (
              <div className="border-2 border-dashed border-brand-gold/40 rounded-2xl p-6 text-center hover:border-brand-burgundy transition-colors bg-brand-cream/30">
                <input
                  type="file"
                  id="vendor-file-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="vendor-file-upload" className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 rounded-full bg-brand-lightGold mx-auto flex items-center justify-center border border-brand-gold">
                    <Upload className="w-6 h-6 text-brand-burgundy" />
                  </div>
                  <p className="text-xs font-bold text-brand-burgundy">Click to upload photo from your device</p>
                  <p className="text-[11px] text-brand-muted">Supported: JPG, PNG, WEBP (auto-compressed for fast loading)</p>
                </label>
                {isCompressing && <p className="text-xs text-brand-gold font-bold mt-2 animate-pulse">Processing image...</p>}
              </div>
            )}

            {/* URL Mode */}
            {uploadMode === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    setImagePreview(e.target.value || FALLBACK_SAREE_IMAGE);
                  }}
                  className="w-full px-4 py-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                />
              </div>
            )}

            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
          </div>

          {/* Submit Action */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-4 rounded-2xl font-bold text-sm shadow-md border border-brand-gold/40 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-brand-gold" />
              <span>{isSubmitting ? 'Submitting Saree...' : 'Submit Saree for Admin Approval'}</span>
            </button>
          </div>

        </div>

        {/* Right 1 Col: Live Preview Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card sticky top-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="font-serif text-base font-bold text-brand-burgundy">Submission Preview</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                Pending Review
              </span>
            </div>

            {/* Saree Card Mockup */}
            <div className="rounded-2xl overflow-hidden border border-brand-gold/30 bg-brand-ivory/50">
              <div className="aspect-[3/4] relative overflow-hidden bg-brand-charcoal/5">
                <img
                  src={imagePreview || FALLBACK_SAREE_IMAGE}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-brand-burgundy/90 text-brand-gold text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-brand-gold/30">
                  {isCustomCategory ? customCategory || 'Custom' : formData.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                  {isCustomFabric ? customFabric || 'Silk' : formData.fabric} • {isCustomColor ? customColor || 'Color' : formData.color}
                </p>
                <h4 className="font-serif font-bold text-brand-burgundy text-sm line-clamp-2">
                  {formData.name || 'Your Saree Title Here'}
                </h4>

                <div className="pt-2 border-t border-brand-gold/20 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-brand-muted block">Quoted Cost:</span>
                    <span className="font-serif font-bold text-brand-burgundy text-base">
                      {formData.vendorPrice ? `₹${Number(formData.vendorPrice).toLocaleString('en-IN')}` : '₹—'}
                    </span>
                  </div>
                  {formData.suggestedPrice && (
                    <div className="text-right">
                      <span className="text-[10px] text-brand-muted block">Suggested Retail:</span>
                      <span className="font-serif text-xs font-semibold text-brand-charcoal">
                        ₹{Number(formData.suggestedPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notice Info */}
            <div className="p-3 bg-brand-cream/60 rounded-xl border border-brand-gold/25 text-xs text-brand-charcoal/80 flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Once submitted, this saree will appear in your vendor dashboard as <strong>Pending</strong>. Admin will review the product and finalize the store pricing.
              </p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
