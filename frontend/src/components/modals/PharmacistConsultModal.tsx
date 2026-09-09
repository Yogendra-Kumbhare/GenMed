import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  PhoneCall,
  Send,
  CheckCircle2,
  MessageSquare,
  Award,
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import type { ConsultationRecord } from '../../types';

interface PharmacistConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Patient's current medication names for AI context */
  medicationNames?: string[];
}

type TabId = 'consult' | 'history';

export const PharmacistConsultModal: React.FC<PharmacistConsultModalProps> = ({
  isOpen,
  onClose,
  medicationNames = [],
}) => {
  const [tab, setTab] = useState<TabId>('consult');
  const [question, setQuestion] = useState('');
  const [phone, setPhone] = useState('(512) 555-0112');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Consultation history
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('genericmed_token');
      const res = await fetch('/api/consultations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { consultations: ConsultationRecord[] };
        setHistory(data.consultations);
      }
    } catch {
      // offline — keep existing list
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuestion('');
      setIsSubmitted(false);
      setTab('consult');
      loadHistory();
    }
  }, [isOpen, loadHistory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Persist the consultation to history (fire-and-forget; we add a placeholder)
    const placeholder: ConsultationRecord = {
      id: `local-${Date.now()}`,
      question,
      answer: 'Dr. Julian Scott will call you back shortly to follow up.',
      medicationContext: medicationNames,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('genericmed_token');
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          answer: placeholder.answer,
          medicationContext: medicationNames,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { consultation: ConsultationRecord };
        setHistory((prev) => [data.consultation, ...prev]);
      } else {
        setHistory((prev) => [placeholder, ...prev]);
      }
    } catch {
      setHistory((prev) => [placeholder, ...prev]);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    setHistory((prev) => prev.filter((c) => c.id !== id));
    try {
      const token = localStorage.getItem('genericmed_token');
      await fetch(`/api/consultations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // best-effort
    }
  };

  return (
    <div
      id="pharmacist-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="pharmacist-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700/80 border border-teal-500/40 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">GenericMed Clinical Pharmacy Desk</h3>
              <p className="text-xs text-teal-200">24/7 Licensed Pharmacist Direct Line</p>
            </div>
          </div>
          <button
            aria-label="Close pharmacist consultation"
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {(['consult', 'history'] as TabId[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-colors ${
                tab === t
                  ? 'text-teal-800 border-b-2 border-teal-700 bg-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'consult' ? <MessageSquare className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
              {t === 'consult' ? 'Consult' : `History ${history.length > 0 ? `(${history.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {tab === 'consult' && (
            <div className="p-6 space-y-5">
              {/* Duty Pharmacist Profile */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                  alt="Pharmacist on duty"
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-teal-700/30"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Dr. Julian Scott, PharmD, RPh</span>
                    <Award className="w-3.5 h-3.5 text-teal-700" />
                  </div>
                  <p className="text-[11px] text-teal-900 font-medium">
                    Clinical Pharmacist on Duty • TX License #74192
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online Now
                    </span>
                    <span>Avg. callback: &lt; 5 minutes</span>
                  </div>
                </div>
              </div>

              {/* Direct Calling Hotline */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500 block">Toll-Free Clinical Hotline</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">1-800-436-6337 (1-800-GEN-MEDS)</span>
                </div>
                <a
                  href="tel:18004366337"
                  className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>

              {isSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-900">Consultation Request Queued</h4>
                  <p className="text-[11px] text-emerald-800">
                    Dr. Julian Scott will call you back at {phone} within 5 minutes. A summary has been saved to your consultation history.
                  </p>
                  <div className="flex justify-center gap-3 mt-2">
                    <button
                      onClick={() => setTab('history')}
                      className="px-4 py-1.5 text-xs font-semibold bg-white border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50"
                    >
                      View History
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-teal-700" />
                    <span>Or Request an Immediate Pharmacist Callback</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Callback Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      What would you like to discuss?
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g. Inquiring about generic equivalence for Lipitor, food timing, or interaction with Arthur's blood pressure medication..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  {medicationNames.length > 0 && (
                    <p className="text-[10px] text-teal-700 font-medium">
                      Context: sharing your {medicationNames.length} active medication{medicationNames.length !== 1 ? 's' : ''} with the pharmacist.
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Instant Callback</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                In case of life-threatening medical emergency or severe allergic reaction, immediately call 911.
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="p-4 space-y-3">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-10 gap-2 text-slate-500 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading history…
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-10">
                  <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">No consultations yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted callbacks and queries will appear here.
                  </p>
                </div>
              ) : (
                history.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                      className="w-full flex items-start justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                          {record.question}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(record.createdAt).toLocaleDateString()} ·{' '}
                          {new Date(record.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          aria-label="Delete consultation"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHistory(record.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {expandedId === record.id ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {expandedId === record.id && (
                      <div className="p-3 text-xs space-y-2 border-t border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-700 mb-0.5">Pharmacist Response</p>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {record.answer}
                          </p>
                        </div>
                        {record.medicationContext.length > 0 && (
                          <div className="text-[10px] text-slate-400">
                            Context: {record.medicationContext.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
