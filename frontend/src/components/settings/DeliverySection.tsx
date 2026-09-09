/**
 * @file DeliverySection.tsx
 * Registered Delivery Addresses section of the Settings page.
 */
import React, { useState } from 'react';
import { MapPin, Plus, Trash2, X } from 'lucide-react';

export interface DeliveryAddress {
  id: string;
  label: string;
  recipientName: string;
  street: string;
  cityStateZip: string;
  notes?: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    label: 'Default Home',
    recipientName: 'Eleanor Vance (Residence)',
    street: '4218 Shady Hollow Dr',
    cityStateZip: 'Austin, TX 78739',
    notes: 'Gate code on file • Ring doorbell',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Arthur (Father)',
    recipientName: 'Arthur Vance (Oak Crest Residence)',
    street: '2804 Oak Crest Terrace',
    cityStateZip: 'Austin, TX 78704',
    notes: 'Senior Assisted Living Suite #204',
    isDefault: false,
  },
];

interface DeliverySectionProps {
  onSaved?: () => void;
}

export function DeliverySection({ onSaved }: DeliverySectionProps) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(INITIAL_ADDRESSES);
  const [showModal, setShowModal] = useState(false);

  // Form state for new address
  const [addrLabel, setAddrLabel] = useState('Work Office');
  const [addrRecipient, setAddrRecipient] = useState('Eleanor Vance');
  const [addrStreet, setAddrStreet] = useState('100 Congress Ave, Suite 1200');
  const [addrCity, setAddrCity] = useState('Austin');
  const [addrState, setAddrState] = useState('TX');
  const [addrZip, setAddrZip] = useState('78701');
  const [addrNotes, setAddrNotes] = useState('Front desk security acceptance');
  const [addrDefault, setAddrDefault] = useState(false);

  const handleSetDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  const handleDelete = (id: string) => {
    if (addresses.length <= 1) return;
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: addrLabel || 'Secondary Address',
      recipientName: addrRecipient,
      street: addrStreet,
      cityStateZip: `${addrCity}, ${addrState} ${addrZip}`,
      notes: addrNotes,
      isDefault: addrDefault,
    };
    if (addrDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
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
            <MapPin className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Registered Delivery Addresses</h2>
          </div>
          <button
            type="button"
            id="add-address-btn"
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl relative transition-all ${
                addr.isDefault
                  ? 'border-2 border-teal-700 dark:border-teal-500 bg-teal-50/30 dark:bg-teal-900/20'
                  : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    addr.isDefault
                      ? 'bg-teal-700 dark:bg-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {addr.label} {addr.isDefault && '• Default'}
                </span>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline font-semibold"
                    >
                      Set Default
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      aria-label={`Remove address ${addr.label}`}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-2">{addr.recipientName}</p>
              <p className="text-slate-600 dark:text-slate-400">{addr.street}</p>
              <p className="text-slate-600 dark:text-slate-400">{addr.cityStateZip}</p>
              {addr.notes && (
                <span className="text-[11px] text-teal-800 dark:text-teal-400 font-semibold block pt-1">
                  {addr.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-address-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <h3 id="add-address-modal-title" className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Add New Delivery Address
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close add address dialog"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className={labelCls}>Address Label</label>
                <input type="text" value={addrLabel} onChange={(e) => setAddrLabel(e.target.value)} placeholder="e.g. Work Office, Vacation Home" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Recipient Name</label>
                <input type="text" value={addrRecipient} onChange={(e) => setAddrRecipient(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Street Address</label>
                <input type="text" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} required className={inputCls} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={labelCls}>City</label>
                  <input type="text" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input type="text" value={addrState} onChange={(e) => setAddrState(e.target.value)} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>ZIP Code</label>
                  <input type="text" value={addrZip} onChange={(e) => setAddrZip(e.target.value)} required className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Delivery Notes / Gate Code</label>
                <input type="text" value={addrNotes} onChange={(e) => setAddrNotes(e.target.value)} placeholder="Gate code, door ring instructions..." className={inputCls} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)} className="rounded border-slate-300 text-teal-700 focus:ring-teal-600" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Set as primary delivery address</span>
              </label>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
