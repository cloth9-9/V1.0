import React, { useState } from 'react';
import { Enquiry, EnquiryStatus } from '../../types';
import { updateEnquiryStatus, deleteEnquiry } from '../../services/dbService';
import { buildWhatsAppUrl } from '../../lib/storageFallback';
import { MessageSquare, Phone, MessageCircle, Trash2, Search, Filter } from 'lucide-react';

interface EnquiriesTabProps {
  enquiries: Enquiry[];
  onRefresh: () => Promise<void>;
}

export const EnquiriesTab: React.FC<EnquiriesTabProps> = ({ enquiries, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        e.customerName.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.message.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleStatusChange = async (enq: Enquiry, newStatus: EnquiryStatus) => {
    setUpdatingId(enq.id);
    try {
      await updateEnquiryStatus(enq.id, newStatus);
      await onRefresh();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (enq: Enquiry) => {
    if (!window.confirm(`Delete enquiry from ${enq.customerName}?`)) return;
    try {
      await deleteEnquiry(enq.id);
      await onRefresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleWhatsApp = (enq: Enquiry) => {
    const msg = `Hello ${enq.customerName}, Janapriya Garments here regarding your enquiry: "${enq.message.slice(0, 50)}...". How can we assist you?`;
    const url = buildWhatsAppUrl(enq.phone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries by name, phone, text..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#B89A62]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] text-[#292824]"
            >
              <option value="all">All Enquiries ({enquiries.length})</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {filteredEnquiries.length === 0 ? (
        <div className="bg-white p-12 border border-[#E9E1D4] text-center text-xs text-[#A8A29E]">
          No customer messages found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white border border-[#E9E1D4] shadow-sm p-5 space-y-3 hover:border-[#D4BC88] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-[#171717]">{enq.customerName}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                      enq.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : enq.status === 'contacted'
                        ? 'bg-purple-100 text-purple-800'
                        : enq.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {enq.status}
                  </span>
                  {enq.createdAt && (
                    <span className="text-[10px] text-[#A8A29E]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8F5EF] text-xs font-semibold text-[#171717] border border-[#E9E1D4]"
                  >
                    <Phone className="w-3 h-3 text-[#B89A62]" />
                    <span>{enq.phone}</span>
                  </a>

                  <button
                    onClick={() => handleWhatsApp(enq)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>

                  <select
                    value={enq.status}
                    disabled={updatingId === enq.id}
                    onChange={(e) => handleStatusChange(enq, e.target.value as EnquiryStatus)}
                    className="px-2 py-1 text-xs font-semibold bg-[#F8F5EF] border border-[#E9E1D4]"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    onClick={() => handleDelete(enq)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete enquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-[#F8F5EF] p-3 text-xs text-[#292824] leading-relaxed border border-[#E9E1D4]">
                "{enq.message}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
