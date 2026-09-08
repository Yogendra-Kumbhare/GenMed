import React, { useState } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Download,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Thermometer,
  ShieldAlert,
  Calendar,
  Printer,
  X,
  FileText,
} from 'lucide-react';
import { Order, Dependent } from '../../types';

interface OrdersTrackingPageProps {
  orders: Order[];
  dependents: Dependent[];
  activeDependent: Dependent | null;
  onReorder: (order: Order) => void;
}

export const OrdersTrackingPage: React.FC<OrdersTrackingPageProps> = ({
  orders,
  dependents,
  activeDependent,
  onReorder,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find((o) => o.status === 'Out for Delivery')?.id || orders[0]?.id || ''
  );
  const [showHsaModal, setShowHsaModal] = useState(false);
  const [receiptNotice, setReceiptNotice] = useState<string | null>(null);

  const downloadReceiptFile = (order: Order) => {
    const text = `=====================================================
GENERICMED PHARMACY TAX RECEIPT & HSA/FSA STATEMENT
Qualified Medical Expense - IRS Code Section 213(d)
State Board of Pharmacy License #PHY-89102 • EIN 74-9910412
=====================================================

STATEMENT DETAILS
-----------------------------------------------------
Order Number:        ${order.orderNumber}
Order Date:          ${order.orderDate}
Delivery Date:       ${order.deliveredAt || order.estimatedDelivery}
Recipient:           ${order.recipientName}
Delivery Address:    ${order.recipientAddress}
Payment Method:      ${order.paymentMethod}
Courier Tracking:    ${order.carrier} (${order.trackingNumber})

COLD-CHAIN & COMPLIANCE VERIFICATION
-----------------------------------------------------
Continuous Temp:     38.4°F (Safe zone 36°F - 46°F)
Tamper-Evident Seal: VERIFIED & INTACT
NCPDP Pharmacy NPI:  1487920194

ITEMIZED PRESCRIPTION MEDICATIONS
-----------------------------------------------------
${order.items
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.medicationName}
   Generic:          ${item.genericName} (${item.strength})
   Supply:           ${item.daysSupply} days (${item.quantity} units)
   Batch / Lot:      ${item.batchNumber} (Exp: ${item.expirationDate})
   Retail Brand Ref: ${item.brandEquivalent}
   Generic Price:    $${item.priceGeneric.toFixed(2)}
   Savings:          $${item.savedAmount.toFixed(2)}`
  )
  .join('\n\n')}

FINANCIAL SUMMARY
-----------------------------------------------------
Subtotal:                    $${order.subtotal.toFixed(2)}
Express Cold-Chain Shipping: FREE ($0.00)
Sales Tax (Prescription):    $0.00 (Exempt)
-----------------------------------------------------
TOTAL CHARGED (PRE-TAX HSA): $${order.totalPaid.toFixed(2)}
TOTAL GENERIC SAVINGS:       $${order.genericDiscountSavings.toFixed(2)}

IRS ATTESTATION
This statement certifies that the prescription items listed above were
dispensed pursuant to a valid medical order from a licensed prescriber and
qualify as deductible medical expenses under Section 213(d) of the Internal
Revenue Code for HSA, HRA, and FSA reimbursement.
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GenericMed_HSA_Receipt_${order.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setReceiptNotice(`HSA & Tax Statement for order ${order.orderNumber} downloaded.`);
    setTimeout(() => setReceiptNotice(null), 4000);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeDependent && o.dependentId !== activeDependent.id) {
      return false;
    }
    return true;
  });

  const currentOrder =
    orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0];

  const isLive = currentOrder?.status === 'Out for Delivery';

  return (
    <div id="orders-tracking-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              Fulfillment & Delivery
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live GPS Courier Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Orders & Live Delivery Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Cold-chain temperature monitoring, tamper-evident seals, and real-time courier tracking.
          </p>
        </div>
      </div>

      {receiptNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
            <span>{receiptNotice}</span>
          </div>
          <button
            onClick={() => setReceiptNotice(null)}
            className="text-teal-700 hover:text-teal-900 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {currentOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Live Tracking & Stepper (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Delivery Map & Telematics Panel */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {/* Map Canvas / Simulated Live Map */}
              <div className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
                {/* Visual Map Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* SVG Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 60 180 Q 180 80 320 120 T 560 70"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Pharmacy Hub Marker */}
                <div className="absolute left-12 bottom-12 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center shadow-lg ring-4 ring-teal-700/30">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded mt-1 shadow-xs whitespace-nowrap">
                    Austin Central Fulfillment
                  </span>
                </div>

                {/* Moving Courier Van Marker */}
                <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce duration-1000">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-400/40">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-white"></span>
                  </div>
                  <span className="text-[11px] font-black text-white bg-slate-900/90 px-2.5 py-0.5 rounded-full mt-1.5 shadow-md flex items-center gap-1">
                    <span>ETA: 24 mins</span>
                  </span>
                </div>

                {/* Destination Marker */}
                <div className="absolute right-12 top-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-4 ring-rose-500/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded mt-1 shadow-xs whitespace-nowrap">
                    {currentOrder.recipientName}
                  </span>
                </div>

                {/* Overlay live telemetry badge */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Live GPS Transponder</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    4th St & Congress Ave, Austin TX
                  </span>
                </div>
              </div>

              {/* Courier & Telematics Details */}
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                      alt="Courier Driver"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-700/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {currentOrder.driverName || 'Marcus Torres'}
                        </h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Certified Courier ★ 4.9
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        GenericMed Priority Fleet • Vehicle: Ford E-Transit Cold-Chain #14
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="tel:5125550391"
                      className="px-3 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Contact Driver</span>
                    </a>
                  </div>
                </div>

                {/* Telemetry Sensor Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center gap-2.5">
                    <Thermometer className="w-5 h-5 text-teal-700 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Cold-Chain Temperature
                      </span>
                      <span className="font-bold text-teal-900">4.8°C (Optimal 2°C - 8°C)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Tamper-Evident Seal
                      </span>
                      <span className="font-bold text-emerald-900">Barcode Verified & Intact</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-slate-600 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Estimated Drop-Off
                      </span>
                      <span className="font-bold text-slate-900">
                        {currentOrder.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Step Order Stepper */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Order Fulfillment Milestones</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-700">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Order Placed & Rx Matched</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sep 6, 2026 • 9:15 AM — Processed with HSA payment ending in 4109
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Pharmacist Review & AB-Bioequivalence Verified
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sep 6, 2026 • 11:30 AM — Verified by Dr. Julian Scott, PharmD #TX-74192
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Cold-Chain Dispensed & Tamper-Sealed
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sep 6, 2026 • 04:20 PM — Packaged at Austin Central Fulfillment Hub
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-emerald-200 animate-pulse">
                    ●
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Out for Delivery (Courier En Route)
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Today • 01:10 PM — Driver Marcus Torres on route to {currentOrder.recipientAddress}
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                    5
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400">Delivered & Signed</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Expected by 2:15 PM today • Front porch contactless drop-off
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column: Order Items & Past Orders (1 Col) */}
          <div className="space-y-6">
            {/* Package Contents Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Package Contents</h3>
                <span className="font-mono text-xs font-bold text-teal-800">
                  {currentOrder.orderNumber}
                </span>
              </div>

              <div className="space-y-3">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="font-bold text-slate-900">{item.medicationName}</div>
                    <div className="text-teal-800 text-[11px] font-medium mt-0.5">
                      Generic for {item.brandEquivalent}
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                      <span>Batch: {item.batchNumber}</span>
                      <span>Expires: {item.expirationDate}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="text-slate-600">Cost:</span>
                      <span className="font-bold text-slate-900">${item.priceGeneric.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price & Savings Summary */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span>${currentOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping:</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                  <span>Total Charged:</span>
                  <span className="text-emerald-400">${currentOrder.totalPaid.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-emerald-300 pt-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generic savings vs retail brand: ${currentOrder.genericDiscountSavings.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="view-hsa-statement-btn"
                onClick={() => setShowHsaModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>View Tax / HSA Receipt Statement</span>
              </button>
            </div>

            {/* Past Orders List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">All Order History</h3>
              <div className="space-y-3">
                {orders.map((ord) => {
                  const isSelected = ord.id === currentOrder.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/40 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'Out for Delivery'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {ord.orderDate} • {ord.items.length} medications
                      </p>
                      <div className="flex justify-between items-baseline text-xs mt-2 pt-1 border-t border-slate-100">
                        <span className="text-slate-600 font-semibold">${ord.totalPaid.toFixed(2)}</span>
                        <span className="text-teal-700 font-bold text-[11px]">
                          Saved ${ord.genericDiscountSavings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tax / HSA Statement & Receipt Modal */}
      {showHsaModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-teal-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Official Pharmacy HSA / FSA Statement</h3>
                  <p className="text-[11px] text-slate-500">IRS Section 213(d) Eligible Medical Expense Attestation</p>
                </div>
              </div>
              <button
                onClick={() => setShowHsaModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">GenericMed Central Pharmacy LLC</h4>
                  <p className="text-slate-500 text-[11px]">9200 Innovation Blvd, Austin, TX 78758</p>
                  <p className="text-slate-500 text-[11px]">Board License #PHY-89102 • Pharmacy NPI 1487920194</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase block w-fit ml-auto">
                    HSA Paid
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 block mt-1">
                    {currentOrder.orderNumber}
                  </span>
                  <span className="text-slate-500 text-[11px]">{currentOrder.orderDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-500 text-[11px] block">Patient / Caregiver:</span>
                  <span className="font-bold text-slate-900">{currentOrder.recipientName}</span>
                  <p className="text-slate-600 text-[11px]">{currentOrder.recipientAddress}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Payment Account:</span>
                  <span className="font-bold text-slate-900">{currentOrder.paymentMethod}</span>
                  <p className="text-emerald-700 text-[11px] font-semibold">Tax-Exempt Medical Benefit</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-2">Itemized Prescriptions Dispensed</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center bg-white text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.medicationName}</span>
                        <span className="text-[11px] text-slate-500">
                          {item.daysSupply}-day supply • Batch {item.batchNumber} • Exp {item.expirationDate}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">${item.priceGeneric.toFixed(2)}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">
                          Saved ${item.savedAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Prescription Subtotal:</span>
                  <span>${currentOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Express Cold-Chain Shipping:</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>State Prescription Tax:</span>
                  <span>$0.00 (Exempt)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                  <span>Total Deductible HSA Paid:</span>
                  <span className="text-emerald-400">${currentOrder.totalPaid.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">IRS Section 213(d) Attestation:</span>
                <p>
                  This statement certifies that the prescription items listed above were prescribed by a licensed
                  physician for Eleanor Vance or eligible dependent, and qualify as an eligible medical expense under
                  IRS Code Section 213(d). Retain this receipt for income tax or HSA/FSA administrator audit.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Statement</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadReceiptFile(currentOrder)}
                  className="flex-1 py-2.5 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-teal-700" />
                  <span>Download Statement</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowHsaModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
