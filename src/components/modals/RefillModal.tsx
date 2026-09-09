import React, { useEffect, useState } from 'react';
import {
  X,
  Pill,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  TrendingDown,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Medication, Order } from '../../types';

interface RefillModalProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRefill: (order: Partial<Order>) => void;
  recipientName: string;
  recipientAddress: string;
}

export const RefillModal: React.FC<RefillModalProps> = ({
  medication,
  isOpen,
  onClose,
  onConfirmRefill,
  recipientName,
  recipientAddress,
}) => {
  const [supplyChoice, setSupplyChoice] = useState<'30' | '90'>('90');
  const [addressChoice, setAddressChoice] = useState<string>(recipientAddress);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSupplyChoice('90');
      setAddressChoice(recipientAddress);
      setIsProcessing(false);
      setIsSuccess(false);
      setGeneratedOrderNumber('');
    }
  }, [isOpen, medication?.id, recipientAddress]);

  if (!isOpen || !medication) return null;

  const is90Day = supplyChoice === '90';
  const genericCost = is90Day ? medication.priceGeneric : Number((medication.priceGeneric * 0.4).toFixed(2));
  const brandCostEquivalent = is90Day ? medication.priceBrand : Number((medication.priceBrand * 0.38).toFixed(2));
  const savings = Number((brandCostEquivalent - genericCost).toFixed(2));
  const qtyPills = is90Day ? 90 : 30;
  const canRefill = medication.refillsRemaining > 0;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderNum = `GM-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedOrderNumber(orderNum);
      setIsProcessing(false);
      setIsSuccess(true);

      onConfirmRefill({
        orderNumber: orderNum,
        orderDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: 'Tomorrow by 2:00 PM',
        status: 'Processing',
        carrier: 'GenericMed Express Cold-Chain',
        trackingNumber: `GMP-TX-${orderNum}-PRIORITY`,
        temperatureControlled: true,
        tamperSealVerified: true,
        recipientName: recipientName,
        recipientAddress: addressChoice,
        dependentId: medication.dependentId,
        items: [
          {
            id: `item-${Date.now()}`,
            medicationName: `${medication.name} (${supplyChoice}-Day Supply)`,
            genericName: medication.genericName,
            brandEquivalent: `${medication.brandEquivalent} ($${brandCostEquivalent.toFixed(2)})`,
            strength: medication.strength,
            quantity: qtyPills,
            daysSupply: is90Day ? 90 : 30,
            batchNumber: `BT-${Math.floor(10000 + Math.random() * 90000)}-G`,
            expirationDate: '2028-06-30',
            priceGeneric: genericCost,
            priceBrand: brandCostEquivalent,
            savedAmount: savings,
          },
        ],
        subtotal: genericCost,
        genericDiscountSavings: savings,
        shippingFee: 0,
        tax: 0,
        totalPaid: genericCost,
        paymentMethod: 'HSA / FSA Card ending in 4109',
      });
    }, 800);
  };

  return (
    <div
      id="refill-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="refill-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isSuccess ? 'Refill Order Dispatched' : 'Request Generic Medication Refill'}
              </h3>
              <p className="text-xs text-slate-500">
                {medication.rxNumber} • {medication.name}
              </p>
            </div>
          </div>
          <button
            id="close-refill-modal-btn"
            aria-label="Close refill request"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Refill Successfully Placed!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Order <span className="font-semibold text-slate-900">#{generatedOrderNumber}</span> is routed
                  to GenericMed fulfillment for pharmacist verification and tamper-proof packing.
                </p>
              </div>

              {/* Order quick summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Medication:</span>
                  <span className="font-semibold text-slate-800">
                    {medication.name} ({supplyChoice}-Day Supply)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <span className="font-semibold text-teal-700">Tomorrow by 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Charged to HSA/FSA:</span>
                  <span className="font-bold text-slate-900">${genericCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-emerald-700 font-semibold">
                  <span>Your Generic Savings vs Brand:</span>
                  <span>${savings.toFixed(2)} saved</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="finish-refill-modal-btn"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Return to Cabinet & View Tracking
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Medication Card Preview */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950">{medication.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-700 text-white font-bold">
                      {medication.bioequivalenceRating}-Rated
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Bioequivalent generic for <span className="font-semibold">{medication.brandEquivalent}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prescribed by: {medication.prescribingDoctor}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Refills Left</span>
                  <span className="text-sm font-bold text-slate-900">{medication.refillsRemaining} remaining</span>
                </div>
              </div>

              {/* Supply Duration Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Supply Quantity
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* 90-Day Supply (Recommended) */}
                  <button
                    type="button"
                    aria-pressed={supplyChoice === '90'}
                    onClick={() => setSupplyChoice('90')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${
                      supplyChoice === '90'
                        ? 'border-teal-700 bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">90-Day Supply</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Best Value
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">90 tablets • 3 months</p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-base font-black text-teal-800">
                        ${medication.priceGeneric.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ${medication.priceBrand.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Save ${(medication.priceBrand - medication.priceGeneric).toFixed(2)} (95%)
                    </span>
                  </button>

                  {/* 30-Day Supply */}
                  <button
                    type="button"
                    aria-pressed={supplyChoice === '30'}
                    onClick={() => setSupplyChoice('30')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${
                      supplyChoice === '30'
                        ? 'border-teal-700 bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">30-Day Supply</span>
                    </div>
                    <p className="text-[11px] text-slate-500">30 tablets • 1 month</p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-base font-black text-slate-800">
                        ${(medication.priceGeneric * 0.4).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ${(medication.priceBrand * 0.38).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Save ${(medication.priceBrand * 0.38 - medication.priceGeneric * 0.4).toFixed(2)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Delivery Address Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Delivery Destination
                </label>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">{recipientName}</p>
                    <p className="text-slate-600">{recipientAddress}</p>
                    <p className="text-[11px] text-teal-700 font-medium mt-1 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Free Standard Cold-Chain Delivery • Arrives Tomorrow</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Payment Method
                </label>
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                    <div>
                      <span className="font-semibold text-slate-900">
                        HSA / FSA Card ending in 4109
                      </span>
                      <span className="text-[10px] ml-2 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Pre-Tax Eligible
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Default</span>
                </div>
              </div>

              {/* Final Pricing Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Generic Medication Cost ({supplyChoice} Days):</span>
                  <span>${genericCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cold-Chain Courier Shipping:</span>
                  <span className="text-emerald-400 font-semibold">FREE ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Pharmacist Verification:</span>
                  <span className="text-emerald-400 font-semibold">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Total Due Now:</span>
                  <span className="font-black text-lg text-emerald-400">
                    ${genericCost.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>You are saving ${savings.toFixed(2)} vs retail brand price!</span>
                </div>
              </div>

              {!canRefill && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  This prescription has no refills remaining. Contact the prescriber to request a renewal before placing another order.
                </div>
              )}

              {/* Action Button */}
              <div className="pt-1">
                <button
                  id="confirm-refill-dispatch-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !canRefill}
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Routing to Pharmacy Fulfillment...</span>
                  ) : !canRefill ? (
                    <span>Prescription Renewal Required</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Dispatch Refill (${genericCost.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
