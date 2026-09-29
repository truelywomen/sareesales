import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { BRAND_INFO } from '../../config/authConfig';

// -----------------------------------------------------------
// Web3Forms is used here — FREE, no backend needed.
// Sign up at https://web3forms.com to get your Access Key.
// Replace the access_key value below with your own key.
// -----------------------------------------------------------
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_KEY_HERE';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Your name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'A valid email address is required';
    if (!formData.message.trim()) errs.message = 'Please write your message';
    return errs;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || 'New Enquiry from TrueWomen Website',
          message: formData.message,
          from_name: 'TrueWomen Contact Form'
        })
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setErrors({ form: 'Something went wrong. Please try again or contact us directly.' });
      }
    } catch {
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/60 px-4 py-1.5 rounded-full border border-brand-gold/30">
          <Sparkles className="w-3.5 h-3.5" /> Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-burgundy">
          We'd Love to Hear<br className="hidden sm:block" /> From You
        </h1>
        <p className="text-brand-charcoal/70 max-w-xl mx-auto text-sm leading-relaxed">
          Whether you have a question about a saree, want to place a bulk order, or simply want to say hello — our team is here and happy to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Contact Info Cards */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center flex-shrink-0 border border-brand-gold/30">
              <Mail className="w-5 h-5 text-brand-burgundy" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Email Us</p>
              <p className="font-serif text-base font-semibold text-brand-burgundy mt-0.5">{BRAND_INFO.contactEmail}</p>
              <p className="text-xs text-brand-muted mt-1">We respond within 24 hours</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center flex-shrink-0 border border-brand-gold/30">
              <Phone className="w-5 h-5 text-brand-burgundy" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Call / WhatsApp</p>
              <p className="font-serif text-base font-semibold text-brand-burgundy mt-0.5">{BRAND_INFO.contactPhone}</p>
              <p className="text-xs text-brand-muted mt-1">Mon–Sat, 10 AM – 7 PM IST</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center flex-shrink-0 border border-brand-gold/30">
              <MapPin className="w-5 h-5 text-brand-burgundy" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Our Store</p>
              <p className="font-serif text-base font-semibold text-brand-burgundy mt-0.5">Heritage Handloom Plaza</p>
              <p className="text-xs text-brand-muted mt-1">MG Road, India</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center flex-shrink-0 border border-brand-gold/30">
              <Clock className="w-5 h-5 text-brand-burgundy" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Store Hours</p>
              <p className="text-xs text-brand-charcoal/80 mt-1 space-y-0.5">
                <span className="block">Mon – Sat: 10:00 AM – 7:00 PM</span>
                <span className="block">Sunday: 11:00 AM – 5:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-2">
          {isSuccess ? (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-card p-12 flex flex-col items-center justify-center text-center h-full space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-burgundy">Message Sent!</h2>
                <p className="text-sm text-brand-charcoal/70 mt-2 max-w-sm">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-4 text-xs font-bold text-brand-burgundy underline underline-offset-2 hover:text-brand-rose transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-2xl bg-brand-burgundy flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-brand-burgundy">Send Us a Message</h2>
                  <p className="text-xs text-brand-muted">We'll respond as soon as possible</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-brand-rose">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-brand-gold/30 bg-brand-ivory/40'}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-brand-rose">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-brand-gold/30 bg-brand-ivory/40'}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full border border-brand-gold/30 bg-brand-ivory/40 rounded-xl px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => handleChange('subject', e.target.value)}
                      className="w-full border border-brand-gold/30 bg-brand-ivory/40 rounded-xl px-4 py-3 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors cursor-pointer"
                    >
                      <option value="">Select a topic...</option>
                      <option>Saree Enquiry</option>
                      <option>Bulk / Wholesale Order</option>
                      <option>Order Status</option>
                      <option>Return or Exchange</option>
                      <option>Custom Saree Request</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-1.5">
                    Message <span className="text-brand-rose">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => handleChange('message', e.target.value)}
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-brand-gold/30 bg-brand-ivory/40'}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                {errors.form && (
                  <p className="text-xs text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-200">{errors.form}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-4 rounded-2xl font-bold text-sm shadow-md border border-brand-gold/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-brand-muted">
                  Your message is delivered securely. We typically respond within 24 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
