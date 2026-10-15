import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { updateProductStock } from '../../services/dbService';
import { DEFAULT_FALLBACK_IMAGE } from '../../lib/storageFallback';
import { AlertTriangle, Plus, Minus, Check, RefreshCw } from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { language, t } = useLanguage();
  const { products, categories, refreshStore } = useStore();
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (filterMode === 'out') return p.stockQuantity <= 0;
    if (filterMode === 'low') {
      return p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 3);
    }
    return true;
  });

  const handleAdjustStock = async (productId: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    setUpdatingId(productId);
    try {
      await updateProductStock(productId, newQty);
      await refreshStore();
    } catch (err: any) {
      alert(`Stock update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDirectSet = async (productId: string, val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    setUpdatingId(productId);
    try {
      await updateProductStock(productId, num);
      await refreshStore();
    } catch (err: any) {
      alert(`Stock update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#171717] text-white'
                : 'bg-[#F8F5EF] text-[#68645E] hover:text-[#171717]'
            }`}
          >
            All Inventory ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              filterMode === 'low'
                ? 'bg-[#C2410C] text-white'
                : 'bg-[#F8F5EF] text-[#C2410C] hover:bg-amber-50'
            }`}
          >
            Low Stock Alert ({products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 3)).length})
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              filterMode === 'out'
                ? 'bg-red-800 text-white'
                : 'bg-[#F8F5EF] text-red-700 hover:bg-red-50'
            }`}
          >
            Out of Stock ({products.filter((p) => p.stockQuantity <= 0).length})
          </button>
        </div>

        <button
          onClick={() => refreshStore()}
          className="inline-flex items-center gap-1.5 text-xs text-[#68645E] hover:text-[#171717]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Inventory List */}
      <div className="bg-white border border-[#E9E1D4] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-[#292824]">
          <thead className="bg-[#F8F5EF] text-[#68645E] uppercase tracking-wider text-[10px] border-b border-[#E9E1D4]">
            <tr>
              <th className="py-3 px-4">Garment</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Threshold</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Current Quantity</th>
              <th className="py-3 px-4 text-right">Quick Stock Adjuster</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E1D4]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#A8A29E]">
                  No garments matching this stock filter.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const img = p.imageUrls?.[0] || DEFAULT_FALLBACK_IMAGE;
                const categoryObj = categories.find((c) => c.slug === p.categoryId);
                const isOut = p.stockQuantity <= 0;
                const isLow = !isOut && p.stockQuantity <= (p.lowStockThreshold || 3);
                const isUpdating = updatingId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt=""
                          className="w-10 h-12 object-cover bg-[#E9E1D4] border border-[#E9E1D4] shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-[#171717]">{p.nameEn}</div>
                          <div className="text-[11px] text-[#A8A29E] font-mono">{p.sku || 'No SKU'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#68645E]">
                      {categoryObj?.nameEn || p.categoryId}
                    </td>

                    <td className="py-3 px-4 text-[#68645E]">
                      ≤ {p.lowStockThreshold || 3} pcs
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isOut ? 'Sold Out' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={p.stockQuantity}
                        onChange={(e) => handleDirectSet(p.id, e.target.value)}
                        disabled={isUpdating}
                        className="w-16 px-2 py-1 text-center font-bold text-sm bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
                      />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(p.id, p.stockQuantity, -1)}
                          disabled={isUpdating || p.stockQuantity <= 0}
                          className="p-1.5 bg-[#E9E1D4] hover:bg-[#D4BC88] text-[#171717] disabled:opacity-30 cursor-pointer"
                          title="-1 Stock"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, p.stockQuantity, 1)}
                          disabled={isUpdating}
                          className="p-1.5 bg-[#E9E1D4] hover:bg-[#D4BC88] text-[#171717] disabled:opacity-30 cursor-pointer"
                          title="+1 Stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, p.stockQuantity, 5)}
                          disabled={isUpdating}
                          className="px-2 py-1 bg-[#171717] hover:bg-[#292824] text-white text-[11px] font-semibold disabled:opacity-30 cursor-pointer"
                          title="+5 Stock"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
