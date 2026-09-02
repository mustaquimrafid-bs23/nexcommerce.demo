'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Calendar, Clock, MapPin, Check, Shield } from 'lucide-react';
import { TrackingOrder } from './types';

interface AILogisticsConciergeProps {
  order: TrackingOrder;
  onOpenReschedule: () => void;
}

export function AILogisticsConcierge({ order, onOpenReschedule }: AILogisticsConciergeProps) {
  const [inquiry, setInquiry] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: `Hello! I'm your AI Logistics Concierge. Parcel ${order.trackingNumber || order.id} is currently ${order.statusLabel || 'In Transit'} via ${order.courier || 'DHL Express'}. How can I assist you with this delivery?`,
    },
  ]);

  const quickPrompts = [
    { label: 'When will it arrive?', query: 'When will the courier arrive at my door?' },
    { label: 'Reschedule delivery', query: 'Can I reschedule the delivery time window?' },
    { label: 'Leave with neighbor', query: 'Can the driver leave my parcel with a neighbor?' },
    { label: 'Customs & VAT clearance', query: 'Is all customs and statutory VAT already cleared?' },
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inquiry;
    if (!q.trim()) return;

    const userMsg = q;
    setInquiry('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    // Smart logic responses
    setTimeout(() => {
      let reply = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('reschedule') || lower.includes('time window')) {
        reply = `Certainly. You can choose a morning (09:00–12:00) or afternoon (14:00–18:00) window. Opening the reschedule calibrator for you now.`;
        onOpenReschedule();
      } else if (lower.includes('when') || lower.includes('arrive') || lower.includes('eta')) {
        reply = `Based on live telematics, your courier is on schedule for ${order.estimatedDelivery || 'Tomorrow afternoon'}. Final doorstep window will be communicated via SMS 60 minutes prior.`;
      } else if (lower.includes('neighbor') || lower.includes('safe place')) {
        reply = `Understood. Signature requirement has been adjusted: you may authorize contactless handoff or designate an adjacent residential neighbor.`;
      } else if (lower.includes('customs') || lower.includes('vat')) {
        reply = `Yes. All EU customs duties and statutory 19% VAT were settled at checkout. Zero destination fees or surcharges required.`;
      } else {
        reply = `I have logged your request for parcel ${order.id}. Our continental dispatch hub in Frankfurt has verified driver routing.`;
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 450);
  };

  return (
    <div className="p-6 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-cyan" />
          <h3 className="font-editorial text-lg text-white font-normal">
            AI Logistics Concierge
          </h3>
        </div>
        <button
          type="button"
          onClick={onOpenReschedule}
          className="px-3 py-1.5 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Calendar size={12} />
          <span>Reschedule Slot</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'assistant'
                ? 'bg-obsidian-950/80 text-white/80 border border-white/10'
                : 'bg-accent-cyan/15 text-white border border-accent-cyan/30 ml-8'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p.query)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white text-[11px] transition-colors cursor-pointer border border-white/5"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <input
          type="text"
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your delivery, driver instructions, or courier..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-obsidian-950/80 border border-white/15 text-white text-xs outline-none focus:border-accent-cyan"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-accent-cyan text-obsidian-950 hover:bg-accent-cyan/90 transition-all cursor-pointer shadow-md"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
