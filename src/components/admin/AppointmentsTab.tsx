import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Appointment, AppointmentStatus } from '../../types';
import { updateAppointment, deleteAppointment } from '../../services/dbService';
import { buildWhatsAppUrl } from '../../lib/storageFallback';
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Scissors,
  FileText,
  Trash2,
  Check,
  Search,
  Filter
} from 'lucide-react';

interface AppointmentsTabProps {
  appointments: Appointment[];
  onRefresh: () => Promise<void>;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ appointments, onRefresh }) => {
  const { language } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [internalNotesText, setInternalNotesText] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        a.customerName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.requestedDate.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleStatusChange = async (apt: Appointment, newStatus: AppointmentStatus) => {
    setSavingId(apt.id);
    try {
      await updateAppointment(apt.id, { status: newStatus });
      await onRefresh();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleStartEditNotes = (apt: Appointment) => {
    setEditingNotesId(apt.id);
    setInternalNotesText(apt.internalNotes || '');
  };

  const handleSaveNotes = async (aptId: string) => {
    setSavingId(aptId);
    try {
      await updateAppointment(aptId, { internalNotes: internalNotesText.trim() });
      setEditingNotesId(null);
      await onRefresh();
    } catch (err: any) {
      alert(`Save notes failed: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (apt: Appointment) => {
    if (!window.confirm(`Delete appointment record for ${apt.customerName}?`)) {
      return;
    }
    try {
      await deleteAppointment(apt.id);
      await onRefresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleWhatsAppCustomer = (apt: Appointment) => {
    const msg = `Hello ${apt.customerName}, this is Janapriya Garments & Clothing regarding your tailoring appointment for ${apt.requestedDate} (${apt.requestedTime}). How can we assist you?`;
    const url = buildWhatsAppUrl(apt.phone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, date..."
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
              <option value="all">All Statuses ({appointments.length})</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Cards / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 border border-[#E9E1D4] text-center text-xs text-[#A8A29E]">
          No appointment requests found matching filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isSaving = savingId === apt.id;
            const isEditingNotes = editingNotesId === apt.id;

            return (
              <div
                key={apt.id}
                className="bg-white border border-[#E9E1D4] shadow-sm p-5 transition-all hover:border-[#D4BC88]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E9E1D4]/60">
                  {/* Customer info */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-base text-[#171717]">
                        {apt.customerName}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                          apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'contacted'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                      <span className="text-[10px] text-[#A8A29E] uppercase font-mono">
                        Lang: {apt.language}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#68645E] mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#B89A62]" />
                        <span>{apt.requestedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#B89A62]" />
                        <span>{apt.requestedTime}</span>
                      </div>
                      {apt.serviceName && (
                        <div className="flex items-center gap-1">
                          <Scissors className="w-3.5 h-3.5 text-[#B89A62]" />
                          <span>{apt.serviceName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Contact & Status selector */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${apt.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F8F5EF] hover:bg-[#E9E1D4] text-[#171717] text-xs font-semibold border border-[#E9E1D4]"
                    >
                      <Phone className="w-3 h-3 text-[#B89A62]" />
                      <span>{apt.phone}</span>
                    </a>

                    <button
                      onClick={() => handleWhatsAppCustomer(apt)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>

                    <select
                      value={apt.status}
                      disabled={isSaving}
                      onChange={(e) => handleStatusChange(apt, e.target.value as AppointmentStatus)}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-[#F8F5EF] border border-[#E9E1D4] text-[#171717]"
                    >
                      <option value="pending">Status: Pending</option>
                      <option value="contacted">Status: Contacted</option>
                      <option value="scheduled">Status: Scheduled</option>
                      <option value="completed">Status: Completed</option>
                      <option value="cancelled">Status: Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleDelete(apt)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Customer Notes */}
                {apt.customerNotes && (
                  <div className="pt-3 text-xs">
                    <span className="font-semibold text-[#68645E]">Customer Notes: </span>
                    <span className="text-[#292824] italic">"{apt.customerNotes}"</span>
                  </div>
                )}

                {/* Internal Admin Notes */}
                <div className="pt-3 mt-2 border-t border-[#E9E1D4]/40 flex items-start gap-2 text-xs">
                  <FileText className="w-3.5 h-3.5 text-[#B89A62] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {isEditingNotes ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={internalNotesText}
                          onChange={(e) => setInternalNotesText(e.target.value)}
                          placeholder="Private staff notes (e.g. Fabric chosen, fitting finalized)..."
                          className="flex-1 px-2.5 py-1 text-xs bg-[#F8F5EF] border border-[#B89A62]"
                        />
                        <button
                          onClick={() => handleSaveNotes(apt.id)}
                          className="px-3 py-1 bg-[#171717] text-white font-semibold text-xs uppercase"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2 py-1 text-[#68645E]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-[#68645E]">
                          <strong className="text-[#171717]">Staff Notes: </strong>
                          {apt.internalNotes || 'No internal notes added yet.'}
                        </span>
                        <button
                          onClick={() => handleStartEditNotes(apt)}
                          className="text-[11px] text-[#B89A62] hover:underline ml-2"
                        >
                          {apt.internalNotes ? 'Edit Notes' : '+ Add Note'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
