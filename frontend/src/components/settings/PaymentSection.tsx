/**
 * @file PaymentSection.tsx
 * Payment & HSA/FSA Accounts section of the Settings page.
 */
import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, X } from 'lucide-react';

export interface PaymentAccount {
  id: string;
  type: 'HSA / FSA Pre-Tax' | 'Credit Card' | 'Debit Card';
  title: string;
  last4: string;
  expiry: string;
  isPrimary: boolean;
  notes?: string;
}

const INITIAL_PAYMENTS: PaymentAccount[] = [
  {
    id: 'pay-1',
    type: 'HSA / FSA Pre-Tax',
    title: 'Optum Bank Health Savings Card',
    last4: '4109',
    expiry: '08/29',
    isPrimary: true,
    notes: 'Zero sales tax on all generic prescriptions',
  },
  {
    id: 'pay-2',
    type: 'Credit Card',
    title: 'Chase Sapphire Visa (Backup)',
    last4: '8831',
    expiry: '11/28',
    isPrimary: false,
  },
];

interface PaymentSectionProps {
  onSaved?: () => void;
}

export function PaymentSection({ onSaved }: PaymentSectionProps) {
  const [payments, setPayments] = useState<PaymentAccount[]>(INITIAL_PAYMENTS);
  const [showModal, setShowModal] = useState(false);

  const [payType, setPayType] = useState<PaymentAccount['type']>('HSA / FSA Pre-Tax');
  const [payTitle, setPayTitle] = useState('Fidelity Health HSA Debit');
  const [payCardNumber, setPayCardNumber] = useState('4712 9012 3844 7192');
  const [payExpiry, setPayExpiry] = useState('06/30');
  const [payPrimary, setPayPrimary] = useState(false);

  const handleSetPrimary = (id: string) =>
    setPayments((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === id })));

  const handleDelete = (id: string) => {
    if (payments.length <= 1) return;
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = payCardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '9912';
    const newPay: PaymentAccount = {
      id: `pay-${Date.now()}`,
      type: payType,
      title: payTitle,
      last4,
      expiry: payExpiry,
      isPrimary: payPrimary,
      notes: payType === 'HSA / FSA Pre-Tax' ? 'Pre-tax medical savings card' : undefined,
    };
    if (payPrimary) {
      setPayments((prev) => prev.map((p) => ({ ...p, isPrimary: false })).concat(newPay));
    } else {
      setPayments((prev) => [...prev, newPay]);
    }
    setShowModal(false);
    onSaved?.();
  };

  const inputCls =
    'w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-teal-700 dark:focus:border-teal-500 focus:outline-none text-slate-900 dark:text-slate-100 text-xs';
  const labelCls = 'block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1';

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Payment & HSA / FSA Accounts</h2>
          </div>
          <button
            type="button"
            id="link-card-btn"
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link New Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {payments.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-xl relative transition-all ${
                card.isPrimary
                  ? 'border-2 border-teal-700 dark:border-teal-500 bg-teal-50/30 dark:bg-teal-900/20'
                  : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    card.type === 'HSA / FSA Pre-Tax'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {card.type} {card.isPrimary && '• Primary'}
                </span>
                <div className="flex items-center gap-2">
                  {!card.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(card.id)}
                      className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline font-semibold"
                    >
                      Make Primary
                    </button>
                  )}
                  {payments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(card.id)}
                      aria-label={`Remove payment method ${card.title}`}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-2">{card.title}</p>
              <p className="text-slate-600 dark:text-slate-400 font-mono">•••• •••• •••• {card.last4}</p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">Expires {card.expiry}</p>
              {card.notes && <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">{card.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Link Payment Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="link-payment-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <h3 id="link-payment-modal-title" className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Link Pre-Tax HSA / Credit Card
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close link card dialog"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className={labelCls}>Account Type</label>
                <select value={payType} onChange={(e) => setPayType(e.target.value as PaymentAccount['type'])} className={inputCls}>
                  <option value="HSA / FSA Pre-Tax">HSA / FSA Pre-Tax Healthcare Card (Tax-Free)</option>
                  <option value="Credit Card">Visa / Mastercard / Amex Credit Card</option>
                  <option value="Debit Card">Personal Checking Debit Card</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Card Nickname / Bank</label>
                <input type="text" value={payTitle} onChange={(e) => setPayTitle(e.target.value)} placeholder="e.g. Fidelity HSA, Chase Freedom" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Card Number</label>
                <input type="text" value={payCardNumber} onChange={(e) => setPayCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" required className={`${inputCls} font-mono`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Expiry (MM/YY)</label>
                  <input type="text" value={payExpiry} onChange={(e) => setPayExpiry(e.target.value)} placeholder="MM/YY" required className={`${inputCls} font-mono`} />
                </div>
                <div>
                  <label className={labelCls}>CVC Code</label>
                  <input type="password" maxLength={4} defaultValue="821" required className={`${inputCls} font-mono`} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={payPrimary} onChange={(e) => setPayPrimary(e.target.checked)} className="rounded border-slate-300 text-teal-700 focus:ring-teal-600" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Make primary payment for automatic refills</span>
              </label>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs">Link Card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
