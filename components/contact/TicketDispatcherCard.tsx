'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Check, Copy, RefreshCw, ShieldCheck } from 'lucide-react';

export function TicketDispatcherCard() {
  const [domain, setDomain] = useState<'styling' | 'logistics' | 'alterations' | 'provenance' | 'membership'>('styling');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketRef, setTicketRef] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleQuickDemo = () => {
    setName('Eleanor Vance');
    setEmail('eleanor@vance-atelier.com');
    setOrderRef('ORD-9428-NX');
    setMessage('Requesting a private bespoke tailoring consultation for an upcoming evening gala. Looking for double-faced cashmere and silk silhouette styling.');
    setDomain('alterations');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `TKT-${Math.floor(1000 + Math.random() * 9000)}-NX`;
      setTicketRef(generatedRef);
      setIsSubmitting(false);
    }, 450);
  };

  const handleCopy = () => {
    if (ticketRef && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ticketRef);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setTicketRef(null);
    setName('');
    setEmail('');
    setOrderRef('');
    setMessage('');
  };

  return (
    <div id="ticketDispatcher" className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/15 shadow-2xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            Direct Dispatch
          </span>
          <h3 className="font-editorial text-2xl text-white font-normal">
            Client Concierge Enquiry Dispatcher
          </h3>
        </div>

        <button
          id="quickDemoInquiryBtn"
          type="button"
          onClick={handleQuickDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-[11px] font-semibold text-accent-cyan transition-colors cursor-pointer w-fit shadow-sm"
        >
          <Sparkles size={12} />
          <span>1-Click Demo Enquiry</span>
        </button>
      </div>

      {ticketRef ? (
        /* Confirmation Box */
        <div id="ticketConfirmationBox" className="p-6 rounded-2xl bg-[#00142E]/90 border border-accent-cyan/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
              Ticket Dispatched Successfully
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="text-xs text-white/60">Ticket Reference Token:</div>
            <div className="font-mono text-3xl font-bold text-white tracking-wider flex items-center gap-3">
              <span id="ticketRefDisplay">{ticketRef}</span>
              <button
                id="copyTicketRefBtn"
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-sans text-white/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check size={13} className="text-accent-cyan" /> : <Copy size={13} />}
                <span id="copyRefText">{isCopied ? 'Copied!' : 'Copy Ref'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-white/75 font-normal leading-relaxed">
            Thank you, <strong className="text-white font-semibold">{name}</strong>. A dedicated client advisor has been assigned to your ticket. A confirmation has been transmitted to <span className="font-mono text-white/90 font-medium">{email}</span>.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              id="resetInquiryBtn"
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Submit Another Enquiry</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Domain Pills */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
              Enquiry Domain
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'styling', label: 'Styling & Wardrobe' },
                { id: 'logistics', label: 'Order Logistics' },
                { id: 'alterations', label: 'Bespoke Tailoring' },
                { id: 'provenance', label: 'Materials & Provenance' },
                { id: 'membership', label: 'Private Client Membership' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  data-domain={d.id}
                  onClick={() => setDomain(d.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    domain === d.id
                      ? 'bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-sm'
                      : 'bg-[#00142E]/70 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
                Client Name
              </label>
              <input
                id="clientName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full px-4 py-3 rounded-2xl bg-[#00142E]/90 border border-white/15 focus:border-accent-cyan/60 text-white text-xs sm:text-sm outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
                Email Address
              </label>
              <input
                id="clientEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@vance-atelier.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#00142E]/90 border border-white/15 focus:border-accent-cyan/60 text-white text-xs sm:text-sm outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
              Order Reference (Optional)
            </label>
            <input
              id="orderRef"
              type="text"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="ORD-9428-NX"
              className="w-full px-4 py-3 rounded-2xl bg-[#00142E]/90 border border-white/15 focus:border-accent-cyan/60 text-white text-xs sm:text-sm outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
              Enquiry Details &amp; Preferred Timeframe
            </label>
            <textarea
              id="inquiryMessage"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your bespoke requirement, fit preferences, or logistics request..."
              className="w-full px-4 py-3 rounded-2xl bg-[#00142E]/90 border border-white/15 focus:border-accent-cyan/60 text-white text-xs sm:text-sm outline-none transition-all resize-none"
              required
            />
          </div>

          <button
            id="dispatchInquiryBtn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-accent-pink hover:bg-accent-pink/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-accent-pink/25"
          >
            {isSubmitting ? (
              <span>Dispatching Encrypted Ticket...</span>
            ) : (
              <>
                <Send size={14} />
                <span>Dispatch Enquiry to Concierge</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
