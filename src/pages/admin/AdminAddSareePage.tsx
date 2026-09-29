import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Upload, Image as ImageIcon, CheckCircle, X, Plus } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_SAREE_IMAGE, LUXURY_IMAGE_PRESETS } from '../../data/sampleSarees';
import { compressImageFile } from '../../utils/imageCompressor';

const DEFAULT_FABRICS = ['Silk', 'Cotton', 'Linen', 'Chiffon', 'Georgette', 'Organza', 'Tussar', 'Velvet'];
const DEFAULT_CATEGORIES = ['Kanchipuram', 'Banarasi', 'Party Wear', 'Traditional', 'Bandhani', 'Chanderi'];
const DEFAULT_COLORS = ['Red', 'Pink', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Maroon', 'Gold', 'Beige'];
const DEFAULT_BADGES = ['None', 'Bestseller', 'New Launch', 'Trending', 'Handloom Pure Silk', 'Limited Edition'];

export const AdminAddSareePage: React.FC = () => {
  const { sarees, addNewSaree } = useShop();
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

  const fabricOptions = useMemo(() => {
    return Array.from(new Set([...DEFAULT_FABRICS, ...sarees.map(s => s.fabric)]));
  }, [sarees]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...sarees.map(s => s.category)]));
  }, [sarees]);

  const colorOptions = useMemo(() => {
    return Array.from(new Set([...DEFAULT_COLORS, ...sarees.map(s => s.color)]));
  }, [sarees]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    fabric: 'Silk',
    category: 'Kanchipuram',
    color: 'Pink',
    badge: 'New Launch',
    description: '',
    stock: '10',
    image: LUXURY_IMAGE_PRESETS[0].url
  });

  const [imagePreview, setImagePreview] = useState<string>(LUXURY_IMAGE_PRESETS[0].url);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle Photo File Upload with Canvas Compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        return;
      }

      try {
        setIsCompressing(true);
        showToast('Optimizing image for fast web display...', 'info');
        const compressedBase64 = await compressImageFile(file, 800, 1000, 0.82);
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: '' }));
        }
        showToast('Photo optimized and loaded successfully!', 'success');
      } catch (err) {
        console.error('Image compression failed:', err);
        showToast('Failed to process image file. Try another photo.', 'error');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSelectPreset = (preset: typeof LUXURY_IMAGE_PRESETS[0]) => {
    setImagePreview(preset.url);
    setFormData(prev => ({
      ...prev,
      image: preset.url,
      fabric: preset.fabric,
      category: preset.category,
      color: preset.color
    }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = 'Saree Name is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Enter a valid price';
    if (isCustomFabric && !customFabric.trim()) errs.fabric = 'Fabric name is required';
    if (isCustomCategory && !customCategory.trim()) errs.category = 'Saree category is required';
    if (isCustomColor && !customColor.trim()) errs.color = 'Color name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.stock || Number(formData.stock) < 0) errs.stock = 'Enter valid stock count';
    if (!formData.image.trim()) errs.image = 'Please choose a preset photo, upload an image file, or provide an image link';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    const finalFabric = isCustomFabric ? customFabric.trim() : formData.fabric;
    const finalCategory = isCustomCategory ? customCategory.trim() : formData.category;
    const finalColor = isCustomColor ? customColor.trim() : formData.color;
    const finalBadge = formData.badge === 'None' ? undefined : formData.badge;

    await addNewSaree({
      name: formData.name.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      fabric: finalFabric,
      category: finalCategory,
      color: finalColor,
      badge: finalBadge,
      description: formData.description.trim(),
      stock: Number(formData.stock),
      image: formData.image.trim() || FALLBACK_SAREE_IMAGE
    });

    navigate('/admin/sarees');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-card flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/sarees')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-burgundy hover:text-brand-rose transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            <span>Back to Saree Catalog</span>
          </button>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
            Add New Saree to Catalog
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Publish a new saree instantly to the customer storefront with high-resolution imagery.
          </p>
        </div>
      </div>

      {/* Add Saree Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card space-y-6">
        
        <div className="space-y-6">
          
          {/* PHOTO SELECTION / UPLOAD SECTION */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy">
                Saree Photo *
              </label>
              
              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadMode('presets')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    uploadMode === 'presets'
                      ? 'bg-brand-burgundy text-white font-bold shadow-sm'
                      : 'text-brand-muted hover:text-brand-burgundy'
                  }`}
                >
                  Preset Gallery
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    uploadMode === 'file'
                      ? 'bg-brand-burgundy text-white font-bold shadow-sm'
                      : 'text-brand-muted hover:text-brand-burgundy'
                  }`}
                >
                  Upload File
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    uploadMode === 'url'
                      ? 'bg-brand-burgundy text-white font-bold shadow-sm'
                      : 'text-brand-muted hover:text-brand-burgundy'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {/* PRESETS MODE */}
            {uploadMode === 'presets' && (
              <div className="space-y-3 bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/30">
                <p className="text-xs font-semibold text-brand-burgundy">
                  Choose from high-res curated saree photos (1-click select):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {LUXURY_IMAGE_PRESETS.map((preset, idx) => {
                    const isSelected = formData.image === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-brand-burgundy ring-2 ring-brand-gold scale-95 shadow-md'
                            : 'border-brand-gold/30 hover:border-brand-gold opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-burgundy/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white drop-shadow" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white p-1 truncate text-center">
                          {preset.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FILE UPLOAD MODE WITH CANVAS COMPRESSION */}
            {uploadMode === 'file' && (
              <div className="border-2 border-dashed border-brand-gold/40 hover:border-brand-gold rounded-2xl p-6 text-center bg-brand-cream/40 transition-colors">
                {imagePreview ? (
                  <div className="relative inline-block group">
                    <img
                      src={imagePreview}
                      alt="Saree Preview"
                      className="w-44 h-56 object-cover rounded-xl border-2 border-brand-gold shadow-md mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                      title="Remove Photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs font-bold text-emerald-700 mt-3 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Photo Loaded (Compressed &amp; Ready)
                    </p>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-3 py-4">
                    <div className="w-14 h-14 rounded-full bg-brand-lightGold text-brand-burgundy flex items-center justify-center border border-brand-gold shadow-sm">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-burgundy">
                        {isCompressing ? 'Compressing & Optimizing Photo...' : 'Click here to upload saree photo'}
                      </p>
                      <p className="text-xs text-brand-muted mt-1">
                        Auto-compressed for ultra-fast storage and customer page loading.
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* URL INPUT MODE */}
            {uploadMode === 'url' && (
              <div className="space-y-3">
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="Paste saree photo URL (e.g. https://images.unsplash.com/...)"
                    value={formData.image}
                    onChange={e => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                      errors.image ? 'border-red-500' : 'border-brand-gold/30'
                    }`}
                  />
                </div>
                {formData.image && (
                  <div className="flex items-center gap-3 bg-brand-cream p-2.5 rounded-xl border border-brand-gold/20">
                    <img
                      src={formData.image}
                      alt="Preview"
                      onError={e => (e.currentTarget.src = FALLBACK_SAREE_IMAGE)}
                      className="w-12 h-16 object-cover rounded-lg border border-brand-gold/30"
                    />
                    <span className="text-xs font-semibold text-brand-burgundy">Live Image Link Preview</span>
                  </div>
                )}
              </div>
            )}
            {errors.image && <p className="text-xs text-red-600 font-medium">{errors.image}</p>}
          </div>

          {/* Saree Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
              Saree Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Maroon Kanchipuram Silk Saree"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-brand-gold/30'
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Price, Original Price, Stock, Badge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                Selling Price (₹ INR) *
              </label>
              <input
                type="number"
                placeholder="3499"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                  errors.price ? 'border-red-500' : 'border-brand-gold/30'
                }`}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                Original MRP (Strike-through)
              </label>
              <input
                type="number"
                placeholder="5999"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-gold/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                placeholder="10"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                  errors.stock ? 'border-red-500' : 'border-brand-gold/30'
                }`}
              />
              {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                Highlight Badge
              </label>
              <select
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                className="w-full bg-brand-cream/50 border border-brand-gold/30 rounded-xl px-3 py-3 text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold cursor-pointer"
              >
                {DEFAULT_BADGES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fabric, Category, Color Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Fabric */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy">
                  Fabric *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomFabric(!isCustomFabric);
                    if (isCustomFabric) setCustomFabric('');
                  }}
                  className="text-[11px] font-bold text-brand-burgundy hover:text-brand-wine underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 text-brand-gold" />
                  {isCustomFabric ? 'Select Existing' : 'New Fabric'}
                </button>
              </div>

              {isCustomFabric ? (
                <div>
                  <input
                    type="text"
                    placeholder="Enter fabric (e.g. Velvet)"
                    value={customFabric}
                    onChange={e => setCustomFabric(e.target.value)}
                    className={`w-full px-3 py-3 bg-brand-cream/50 border rounded-xl text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                      errors.fabric ? 'border-red-500' : 'border-brand-gold/30'
                    }`}
                  />
                  {errors.fabric && <p className="text-xs text-red-600 mt-1">{errors.fabric}</p>}
                </div>
              ) : (
                <select
                  value={formData.fabric}
                  onChange={e => {
                    if (e.target.value === '__ADD_NEW__') {
                      setIsCustomFabric(true);
                      setCustomFabric('');
                    } else {
                      setFormData({ ...formData, fabric: e.target.value });
                    }
                  }}
                  className="w-full bg-brand-cream/50 border border-brand-gold/30 rounded-xl px-3 py-3 text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold cursor-pointer"
                >
                  {fabricOptions.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                  <option value="__ADD_NEW__" className="font-bold text-brand-burgundy">
                    + Add New Fabric...
                  </option>
                </select>
              )}
            </div>

            {/* Saree Type / Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy">
                  Saree Type *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCategory(!isCustomCategory);
                    if (isCustomCategory) setCustomCategory('');
                  }}
                  className="text-[11px] font-bold text-brand-burgundy hover:text-brand-wine underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 text-brand-gold" />
                  {isCustomCategory ? 'Select Existing' : 'New Type'}
                </button>
              </div>

              {isCustomCategory ? (
                <div>
                  <input
                    type="text"
                    placeholder="Enter type (e.g. Patola)"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className={`w-full px-3 py-3 bg-brand-cream/50 border rounded-xl text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                      errors.category ? 'border-red-500' : 'border-brand-gold/30'
                    }`}
                  />
                  {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
                </div>
              ) : (
                <select
                  value={formData.category}
                  onChange={e => {
                    if (e.target.value === '__ADD_NEW__') {
                      setIsCustomCategory(true);
                      setCustomCategory('');
                    } else {
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  className="w-full bg-brand-cream/50 border border-brand-gold/30 rounded-xl px-3 py-3 text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold cursor-pointer"
                >
                  {categoryOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__ADD_NEW__" className="font-bold text-brand-burgundy">
                    + Add New Saree Type...
                  </option>
                </select>
              )}
            </div>

            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy">
                  Color *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomColor(!isCustomColor);
                    if (isCustomColor) setCustomColor('');
                  }}
                  className="text-[11px] font-bold text-brand-burgundy hover:text-brand-wine underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 text-brand-gold" />
                  {isCustomColor ? 'Select Existing' : 'New Color'}
                </button>
              </div>

              {isCustomColor ? (
                <div>
                  <input
                    type="text"
                    placeholder="Enter color (e.g. Peach)"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    className={`w-full px-3 py-3 bg-brand-cream/50 border rounded-xl text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                      errors.color ? 'border-red-500' : 'border-brand-gold/30'
                    }`}
                  />
                  {errors.color && <p className="text-xs text-red-600 mt-1">{errors.color}</p>}
                </div>
              ) : (
                <select
                  value={formData.color}
                  onChange={e => {
                    if (e.target.value === '__ADD_NEW__') {
                      setIsCustomColor(true);
                      setCustomColor('');
                    } else {
                      setFormData({ ...formData, color: e.target.value });
                    }
                  }}
                  className="w-full bg-brand-cream/50 border border-brand-gold/30 rounded-xl px-3 py-3 text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold cursor-pointer"
                >
                  {colorOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__ADD_NEW__" className="font-bold text-brand-burgundy">
                    + Add New Color...
                  </option>
                </select>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
              Saree Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the weave, zari work, pallu details, and occasion suitability..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                errors.description ? 'border-red-500' : 'border-brand-gold/30'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-brand-gold/20 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg border border-brand-gold/40 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-brand-gold" />
            <span>Publish Saree to Catalog</span>
          </button>
        </div>

      </form>
    </div>
  );
};
