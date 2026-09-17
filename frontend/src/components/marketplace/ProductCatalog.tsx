import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import type { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCatalogProps {
  initialCategory?: string;
  initialQuery?: string;
  onClose?: () => void;
  onOpenTenderScrutiny: (tenderRef: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialCategory = 'All',
  initialQuery = '',
  onClose,
  onOpenTenderScrutiny,
}) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [miiOnly, setMiiOnly] = useState<boolean>(false);
  const [msmeOnly, setMsmeOnly] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'The Saras Collection',
    'ODOP GeM BAZAAR',
    'Startup Runway',
    'The Aabhaar Collection',
    'Handloom & Textiles',
    'Tribal & Khadi India',
    'WOMANIYA ON GEM',
    'Millet (Shree Anna)',
    'Industrial & Mechanical',
    'Medical & Healthcare',
    'IT & Electronics',
    'Safety & Security',
    'Furniture & Office',
  ];

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // Ensure items section opens directly on the screen without requiring manual scroll down
  useEffect(() => {
    const timer = setTimeout(() => {
      if (itemsContainerRef.current) {
        itemsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [category, initialCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(category, searchQuery);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
    setTimeout(() => {
      if (itemsContainerRef.current) {
        itemsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((p) => {
    if (!p) return false;
    if (miiOnly && (p.mii_percentage ?? 0) < 50) return false;
    if (msmeOnly && !p.msme_verified) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] dark:bg-[#071324] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sleek Compact Header Strip */}
      <div className="bg-[#082435] text-white py-3 px-4 sm:px-6 shadow-sm border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb & Title */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={onClose}
              className="hover:text-yellow-400 font-bold transition flex items-center gap-1 cursor-pointer"
              title="Return to GeM Home Portal"
            >
              <span>← GeM Portal</span>
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="text-yellow-400 font-bold">Marketplace & Catalog</span>
            {category !== 'All' && (
              <>
                <span className="text-gray-400">&gt;</span>
                <span className="text-white font-extrabold bg-blue-600/70 px-2.5 py-0.5 rounded-full border border-blue-400/40 text-xs">
                  {category}
                </span>
              </>
            )}
          </div>

          {/* Right Badges & Back Button */}
          <div className="flex items-center gap-2.5">
            <span className="bg-yellow-400 text-blue-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wide">
              SIH26100 Statutory Compliant
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/20 transition flex items-center gap-1 cursor-pointer"
              >
                <span>✕</span>
                <span>Back to Home</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container - Auto-scrolled into view so items appear on screen directly */}
      <div
        ref={itemsContainerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-8 flex-1 w-full space-y-4 scroll-mt-14"
      >
        {/* Search & Filter Controls Bar */}
        <div className="bg-white dark:bg-[#0c1e33] rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 transition-colors">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px]">
            <div className="relative flex items-center bg-gray-50 dark:bg-[#132842] rounded-xl border border-gray-300 dark:border-slate-700 px-3 py-2 focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-[#0f243c] transition">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, model, or certified vendor..."
                className="w-full text-xs text-gray-800 dark:text-slate-100 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-[#162c5b] dark:bg-blue-600 hover:bg-[#0d1d3d] dark:hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition ml-2 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Statutory Toggles */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/30 px-3 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-950/60 transition">
              <input
                type="checkbox"
                checked={miiOnly}
                onChange={(e) => setMiiOnly(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-extrabold text-orange-900 dark:text-orange-200">
                🇮🇳 Class-I MII (&gt;50%)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-3 py-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition">
              <input
                type="checkbox"
                checked={msmeOnly}
                onChange={(e) => setMsmeOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
                🏭 MSME Udyam Verified
              </span>
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap shadow-2xs border cursor-pointer ${
                category === cat
                  ? 'bg-[#162c5b] dark:bg-blue-600 text-white border-[#162c5b] dark:border-blue-500'
                  : 'bg-white dark:bg-[#0c1e33] text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-bold">Querying GeM Statutory Product Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#0c1e33] rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800 space-y-3 transition-colors">
            <span className="text-4xl">📦</span>
            <h3 className="text-base font-bold text-gray-800 dark:text-slate-100">No matching products found</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your category filter, clearing Make-in-India filters, or searching for general procurement equipment.
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setSearchQuery('');
                setMiiOnly(false);
                setMsmeOnly(false);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const isClassI = p.mii_percentage >= 50;
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-[#0c1e33] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">
                        {p.sub_category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            isClassI
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/40'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/40'
                          }`}
                        >
                          {p.mii_class} ({p.mii_percentage}%)
                        </span>
                        {p.msme_verified && (
                          <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-600/40" title="Verified MSME Supplier">
                            MSME
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-[#132842] border border-gray-200 dark:border-slate-700 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition">
                        {p.image_icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#162c5b] dark:text-slate-100 leading-snug group-hover:text-blue-900 dark:group-hover:text-blue-400 transition">
                          {p.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                          <span>Vendor:</span>
                          <span className="font-bold text-gray-700 dark:text-slate-200">{p.seller_name}</span>
                        </p>
                      </div>
                    </div>

                    {/* Technical Specifications Preview */}
                    <div className="bg-gray-50 dark:bg-[#132842] p-2.5 rounded-xl border border-gray-100 dark:border-slate-700/60 space-y-1 text-[11px]">
                      {Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-500 dark:text-slate-400">{k}:</span>
                          <span className="font-medium text-gray-800 dark:text-slate-200">{v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xs text-gray-400 dark:text-slate-400">GeM Unit Price:</span>
                        <p className="text-lg font-black text-[#162c5b] dark:text-white">
                          ₹{p.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-500">★ {p.rating}</span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-400 ml-1">({p.reviews_count} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="text-blue-900 dark:text-blue-400 hover:text-blue-950 dark:hover:text-blue-300 font-bold text-xs py-1.5 px-2 cursor-pointer transition"
                    >
                      View Specs ↗
                    </button>

                    {p.tender_eligible ? (
                      <button
                        onClick={() => onOpenTenderScrutiny('GEM/2026/B/9012481')}
                        className="bg-[#e67e22] hover:bg-[#d35400] text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow transition cursor-pointer"
                      >
                        ⚡ Verify in Tender &gt;
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 font-bold text-xs px-3 py-1.5 rounded-lg cursor-not-allowed"
                        title="Vendor flagged for statutory discrepancy"
                      >
                        Under Scrutiny
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0c1e33] rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-2xl w-full my-8 overflow-hidden text-slate-900 dark:text-slate-100">
            <div className="bg-[#082435] text-white p-5 flex items-center justify-between border-b-2 border-yellow-400">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider">
                  Public Procurement Specification Sheet
                </span>
                <h3 className="text-base font-extrabold">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 dark:bg-[#132842] p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase">Base Price</span>
                  <p className="text-base font-black text-[#162c5b] dark:text-white mt-0.5">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#132842] p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase">Local Content</span>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {selectedProduct.mii_percentage}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#132842] p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase">MSME Exemption</span>
                  <p className="text-base font-black text-blue-900 dark:text-blue-300 mt-0.5">
                    {selectedProduct.msme_verified ? 'Eligible' : 'Not Eligible'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#132842] p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase">Available Stock</span>
                  <p className="text-base font-black text-gray-800 dark:text-slate-200 mt-0.5">
                    {selectedProduct.available_qty} Units
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-gray-900 mb-2 uppercase">
                  Technical Specifications (Tested via GeM QA Standards)
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border divide-y divide-gray-200">
                  {Object.entries(selectedProduct.specs).map(([k, v]) => (
                    <div key={k} className="py-2 flex justify-between">
                      <span className="font-bold text-gray-600">{k}</span>
                      <span className="text-gray-900 font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900">Registered Vendor: {selectedProduct.seller_name}</p>
                  <p className="text-[11px] text-blue-700">GST Status: {selectedProduct.gst_status} • Verified GeM Supplier</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    onOpenTenderScrutiny('GEM/2026/B/9012481');
                  }}
                  className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white font-bold text-xs px-4 py-2 rounded-lg shadow"
                >
                  Scrutinize Vendor &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
