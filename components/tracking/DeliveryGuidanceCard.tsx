'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TrackingOrder, STATUS_TO_STAGE } from './types';

interface DeliveryGuidanceCardProps {
  order: TrackingOrder;
}

export default function DeliveryGuidanceCard({ order }: DeliveryGuidanceCardProps) {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const stageIdx = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;
  const isDelivered = order.statusKey === 'DELIVERED' || stageIdx >= 5;
  const isDelayed = order.statusKey === 'DELAYED' || order.statusKey === 'EXCEPTION';
  const isCancelled = order.statusKey === 'CANCELLED' || order.status === 'cancelled';

  // Deterministic natural British English guidance
  let headline = 'Your parcel is on the way';
  let explanation = 'Your items have left our workshop and are currently moving through the express delivery network.';

  if (isCancelled) {
    headline = 'This order has been cancelled';
    explanation = 'This order was cancelled at your request and a full refund has been issued to your original payment method.';
  } else if (isDelivered) {
    headline = 'Your parcel has arrived';
    explanation = `Your order was safely delivered today. Signed and completed at ${order.customer?.address || 'your delivery address'}.`;
  } else if (isDelayed) {
    headline = 'Your delivery is taking slightly longer than expected';
    explanation =
      order.carrierReason ||
      'Your parcel is in transit. We have updated your arrival window to keep you fully informed.';
  } else if (stageIdx === 4) {
    headline = 'Your parcel is out for delivery';
    explanation = 'Your parcel is with our courier and is expected to arrive at your door today.';
  } else if (stageIdx === 1) {
    headline = 'We are packing your order';
    explanation = 'Your items are being hand-inspected and carefully packed in presentation boxes at our workshop.';
  } else if (stageIdx === 0) {
    headline = 'Your order is confirmed';
    explanation = 'We have received your order and payment. Our team will begin packing your pieces shortly.';
  }

  const handleAsk = (q: string) => {
    if (activeQuestion === q) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(q);
    }
  };

  const getAnswer = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('when')) {
      if (isDelivered) return 'Your order has already been delivered safely to your address.';
      if (isCancelled) return 'This order is cancelled and will not be delivered.';
      return `Based on live courier updates, your parcel is expected ${order.expectedDate || 'Today by 6:00 PM'}.`;
    }
    if (lower.includes('where')) {
      if (isDelivered) return `Your parcel was delivered to: ${order.customer?.address || 'your address'}.`;
      if (stageIdx === 0 || stageIdx === 1) return 'Your order is currently at our Milan workshop for packing and quality checks.';
      return 'Your parcel is currently in transit with DHL Express Priority Courier.';
    }
    if (lower.includes('delay')) {
      if (isDelayed) {
        return order.carrierReason
          ? `The courier reported a delay due to: ${order.carrierReason}.`
          : 'Your order is taking slightly longer than expected, but is moving safely in transit.';
      }
      return 'Your parcel is currently on schedule with zero active delays recorded.';
    }
    if (lower.includes('address')) {
      if (stageIdx <= 1) {
        return 'Your order has not shipped yet, so you can still change your address. Please contact our client care team immediately.';
      }
      return 'Once an order is handed to the courier, delivery addresses cannot be changed directly online. Please reach out to customer service for courier re-routing.';
    }
    return 'For any additional enquiries, our client care team is available 24/7.';
  };

  const questions = [
    'When will it arrive?',
    'Where is it right now?',
    'Why the delay?',
    'Can I change address?',
  ];

  return (
    <div
      id="trackingServiceMsg"
      className="p-6 sm:p-7 rounded-2xl bg-[#08254c]/80 border border-accent-cyan/30 space-y-4 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-2 text-[9.5px] font-bold tracking-[0.18em] uppercase text-accent-cyan">
        <Sparkles size={13} />
        <span>DELIVERY UPDATES &amp; HELP</span>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-tight">
          {headline}
        </h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">{explanation}</p>
      </div>

      {/* Quick Questions Section */}
      <div className="pt-3 border-t border-white/10 space-y-2.5">
        <div className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-white/50">
          QUICK QUESTIONS
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q) => {
            const isSelected = activeQuestion === q;
            return (
              <button
                key={q}
                type="button"
                onClick={() => handleAsk(q)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-[0_0_12px_rgba(61,224,255,0.25)]'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white/80 hover:text-white'
                }`}
              >
                {q}
              </button>
            );
          })}
        </div>

        {/* Dynamic Answer Box */}
        {activeQuestion && (
          <div className="p-4 rounded-xl bg-accent-cyan/[0.12] border border-accent-cyan/35 text-xs sm:text-sm text-white leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="font-bold text-accent-cyan text-[11px] uppercase tracking-wider mb-1">
              Answer:
            </div>
            <div>{getAnswer(activeQuestion)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
