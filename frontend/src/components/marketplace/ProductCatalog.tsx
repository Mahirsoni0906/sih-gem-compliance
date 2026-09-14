import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCatalogProps {
  initialCategory?: string;
  initialQuery?: string;
  onOpenTenderScrutiny: (tenderRef: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialCategory = 'All',
  initialQuery = '',
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

  const categories = [
    'All',
    'Industrial & Mechanical',
    'Medical & Healthcare',
    'IT & Electronics',
    'Safety & Security',
    'Furniture & Office',
  ];

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(category, searchQuery);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    if (miiOnly && p.mii_percentage < 50) return false;
    if (msmeOnly && !p.msme_verified) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9]">
      {/* Top Banner with Breadcrumb */}
      <div className="bg-[#082435] text-white py-6 px-4 sm:px-6 shadow-sm border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <span>GeM Portal</span>
            <span>&gt;</span>
            <span className="text-yellow-400 font-bold">Public Procurement Marketplace</span>
            {category !== 'All' && (
              <>
                <span>&gt;</span>
                <span className="text-white font-bold">{category}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                GeM Product Marketplace & Catalog
              </h1>
              <p className="text-xs text-gray-300 mt-1">
                Verified public procurement items with statutory Make in India (MII) certification and MSME preference.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-yellow-400 text-blue-950 font-black text-xs px-3 py-1.5 rounded-full shadow-xs">
                SIH26100 Statutory Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Search & Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px]">
            <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, model, or certified vendor..."
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition ml-2"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Statutory Toggles */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer bg-orange-50/70 border border-orange-200 px-3 py-2 rounded-xl hover:bg-orange-100 transition">
              <input
                type="checkbox"
                checked={miiOnly}
                onChange={(e) => setMiiOnly(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-extrabold text-orange-900">
                🇮🇳 Class-I MII (&gt;50%)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-emerald-50/70 border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-100 transition">
              <input
                type="checkbox"
                checked={msmeOnly}
                onChange={(e) => setMsmeOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-extrabold text-emerald-900">
                🏭 MSME Udyam Verified
              </span>
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap shadow-2xs border ${
                category === cat
                  ? 'bg-[#162c5b] text-white border-[#162c5b]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
            <p className="text-xs text-gray-500 font-bold">Querying GeM Statutory Product Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border space-y-3">
            <span className="text-4xl">📦</span>
            <h3 className="text-base font-bold text-gray-800">No matching products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your category filter, clearing Make-in-India filters, or searching for general procurement equipment.
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setSearchQuery('');
                setMiiOnly(false);
                setMsmeOnly(false);
              }}
              className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg"
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
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {p.sub_category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            isClassI
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.mii_class} ({p.mii_percentage}%)
                        </span>
                        {p.msme_verified && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-1.5 py-0.5 rounded" title="Verified MSME Supplier">
                            MSME
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 border flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition">
                        {p.image_icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#162c5b] leading-snug group-hover:text-blue-900 transition">
                          {p.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <span>Vendor:</span>
                          <span className="font-bold text-gray-700">{p.seller_name}</span>
                        </p>
                      </div>
                    </div>

                    {/* Technical Specifications Preview */}
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1 text-[11px]">
                      {Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-500">{k}:</span>
                          <span className="font-medium text-gray-800">{v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xs text-gray-400">GeM Unit Price:</span>
                        <p className="text-lg font-black text-[#162c5b]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-500">★ {p.rating}</span>
                        <span className="text-[10px] text-gray-400 ml-1">({p.reviews_count} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="text-blue-900 hover:text-blue-950 font-bold text-xs py-1.5 px-2"
                    >
                      View Specs ↗
                    </button>

                    {p.tender_eligible ? (
                      <button
                        onClick={() => onOpenTenderScrutiny('GEM/2026/B/9012481')}
                        className="bg-[#e67e22] hover:bg-[#d35400] text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow transition"
                      >
                        ⚡ Verify in Tender &gt;
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-100 text-gray-400 font-bold text-xs px-3 py-1.5 rounded-lg cursor-not-allowed"
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
          <div className="bg-white rounded-2xl shadow-2xl border max-w-2xl w-full my-8 overflow-hidden">
            <div className="bg-[#082435] text-white p-5 flex items-center justify-between border-b-2 border-yellow-400">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider">
                  Public Procurement Specification Sheet
                </span>
                <h3 className="text-base font-extrabold">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-xl border">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Base Price</span>
                  <p className="text-base font-black text-[#162c5b] mt-0.5">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Local Content</span>
                  <p className="text-base font-black text-emerald-700 mt-0.5">
                    {selectedProduct.mii_percentage}%
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">MSME Exemption</span>
                  <p className="text-base font-black text-blue-900 mt-0.5">
                    {selectedProduct.msme_verified ? 'Eligible' : 'Not Eligible'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Available Stock</span>
                  <p className="text-base font-black text-gray-800 mt-0.5">
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
