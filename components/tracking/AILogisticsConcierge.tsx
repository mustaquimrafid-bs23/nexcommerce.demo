'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Calendar, Clock, MapPin, Check, Shield, MessageSquare } from 'lucide-react';
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
      text: `Hello! I am your Live Delivery Concierge. Parcel ${order.ref || order.id} is currently ${order.statusLabel || 'In Transit'} via ${order.courier || 'DHL Express'}. How can I assist you with your delivery today?`,
    },
  ]);

  const quickPrompts = [
    { label: 'When will my courier arrive?', query: 'When will my courier arrive at my address?' },
    { label: 'Leave with a neighbour', query: 'Can the driver leave my parcel with a neighbour?' },
    { label: 'Change delivery date', query: 'Can I reschedule the delivery date or time window?' },
    { label: 'Signature required?', query: 'Is a physical signature required upon delivery?' },
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inquiry;
    if (!q.trim()) return;

    const userMsg = q;
    setInquiry('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      let reply = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('reschedule') || lower.includes('change delivery') || lower.includes('time window') || lower.includes('date')) {
        reply = `Certainly. You can select a morning (09:00–12:00) or afternoon (14:00–18:00) delivery window, or pick a different day. Opening the delivery reschedule options for you now.`;
        onOpenReschedule();
      } else if (lower.includes('when') || lower.includes('arrive') || lower.includes('eta') || lower.includes('courier arrive')) {
        reply = `Your parcel is on track for ${order.expectedDate || 'Tomorrow afternoon'}. You will receive a direct SMS update with a 1-hour delivery slot once the courier is out on the route.`;
      } else if (lower.includes('neighbour') || lower.includes('neighbor') || lower.includes('safe place') || lower.includes('porch')) {
        reply = `Understood. You can leave instructions for your courier to leave the package in a designated safe place or with an adjacent neighbour. Would you like to save this instruction now?`;
      } else if (lower.includes('signature') || lower.includes('sign')) {
        reply = `Yes, all high-value atelier pieces require a digital signature upon delivery. If you won't be home, you can designate an authorised neighbour or choose a collection point.`;
      } else {
        reply = `I have logged your request for order ${order.ref || order.id}. Our courier dispatch hub has verified your transit route.`;
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 350);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/10 space-y-4 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
            <Sparkles size={15} />
          </div>
          <div>
            <h3 className="font-editorial text-base text-white font-medium">
              Live Delivery Concierge
            </h3>
            <span className="text-[10.5px] text-accent-cyan font-mono block">
              Active Courier Support
            </span>
          </div>
        </div>
        <button
          type="button"
          id="btnOpenRescheduleSlot"
          onClick={onOpenReschedule}
          className="px-3 py-1.5 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Calendar size={12} />
          <span>Reschedule Slot</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl text-xs leading-relaxed transition-all ${
              m.sender === 'assistant'
                ? 'bg-[#00142E]/85 text-white/85 border border-white/10 mr-6'
                : 'bg-accent-cyan/15 text-white border border-accent-cyan/30 ml-6 font-medium'
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
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/15 text-white/70 hover:text-white text-[11px] transition-colors cursor-pointer border border-white/10"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-white/10"
      >
        <input
          type="text"
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          placeholder="Ask about your delivery, courier instructions, or ETA..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#00142E]/90 border border-white/15 text-white text-xs outline-none focus:border-accent-cyan transition-all"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-accent-cyan text-[#00142E] hover:bg-accent-cyan/90 transition-all cursor-pointer shadow-md font-bold"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
