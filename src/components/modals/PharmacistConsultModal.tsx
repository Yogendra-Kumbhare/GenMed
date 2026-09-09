import React, { useEffect, useState } from 'react';
import {
  X,
  PhoneCall,
  ShieldCheck,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Award,
} from 'lucide-react';

interface PharmacistConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacistConsultModal: React.FC<PharmacistConsultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [phone, setPhone] = useState('(512) 555-0112');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuestion('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
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
                Dr. Julian Scott will call you back at {phone} within 5 minutes. A summary will also be recorded in your HIPAA portal notes.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Done
              </button>
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
      </div>
    </div>
  );
};
