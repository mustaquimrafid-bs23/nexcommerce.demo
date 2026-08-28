'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Sparkles,
  Lock,
  Check,
  Copy,
  RotateCcw,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { DOMAIN_OPTIONS, DEMO_CLIENT_INQUIRY } from './data';
import { InquiryDomain, DispatchTicket } from './types';

export function DirectDispatchPortal() {
  const [selectedDomain, setSelectedDomain] = useState<InquiryDomain>('styling');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<DispatchTicket | null>(null);
  const [copied, setCopied] = useState(false);

  const activeDomainMeta =
    DOMAIN_OPTIONS.find((d) => d.id === selectedDomain) || DOMAIN_OPTIONS[0];

  const handleDemoFill = () => {
    setClientName(DEMO_CLIENT_INQUIRY.name);
    setClientEmail(DEMO_CLIENT_INQUIRY.email);
    setSelectedDomain(DEMO_CLIENT_INQUIRY.domain);
    setOrderRef(DEMO_CLIENT_INQUIRY.orderRef);
    setMessage(DEMO_CLIENT_INQUIRY.message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate dispatch processing
    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedTicket: DispatchTicket = {
        reference: `TKT-${randomNum}-NX`,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        domain: selectedDomain,
        domainLabel: activeDomainMeta.label,
        orderRef: orderRef.trim() || undefined,
        message: message.trim(),
        createdAt: new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'received',
        sla: '< 15 minutes',
      };

      setTicket(generatedTicket);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyTicket = () => {
    if (!ticket) return;
    navigator.clipboard?.writeText(ticket.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setTicket(null);
    setClientName('');
    setClientEmail('');
    setOrderRef('');
    setMessage('');
    setSelectedDomain('styling');
  };

  return (
    <section
      id="directDispatchPortal"
      className="w-full"
    >
      <div className="flex flex-col gap-1.5 mb-6">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#3DE0FF] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#3DE0FF]" />
          Contact Support
        </span>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Send a Message
          </h2>

          {/* 1-Click Demo Fill Button */}
          {!ticket && (
            <button
              type="button"
              id="quickDemoInquiryBtn"
              onClick={handleDemoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3DE0FF]/10 hover:bg-[#3DE0FF]/20 text-[#3DE0FF] border border-[#3DE0FF]/30 transition-all hover:scale-102 cursor-pointer shadow-sm"
            >
              <Sparkles size={13} />
              <span>Fill Example</span>
            </button>
          )}
        </div>
      </div>

      {ticket ? (
        /* Generated Ticket Confirmation Box */
        <div
          id="ticketConfirmationBox"
          className="p-6 rounded-3xl bg-[#0A2A54]/95 border border-[#00E096]/40 backdrop-blur-2xl shadow-xl shadow-[#00142e]/90 animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00E096]/15 border border-[#00E096]/30 flex items-center justify-center text-[#00E096]">
              <Check size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#00E096] block">
                THANK YOU &middot; MESSAGE RECEIVED
              </span>
              <h3 className="text-lg font-semibold text-white">
                Reference: {ticket.reference}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#08254c]/70 border border-white/10 mb-4 text-xs text-white/75 space-y-2">
            <div>
              <span className="text-white/40 uppercase text-[10px] tracking-wider block">
                From:
              </span>
              <span className="text-white font-medium">
                {ticket.clientName} ({ticket.clientEmail})
              </span>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-white/40 uppercase text-[10px] tracking-wider block mb-0.5">
                Your message:
              </span>
              <p className="text-white/90 italic leading-relaxed">
                &ldquo;{ticket.message}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-[#00E096]">
              <Clock size={13} />
              <span>We usually reply within 15 minutes</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="copyTicketRefBtn"
                onClick={handleCopyTicket}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check size={13} className="text-[#00E096]" /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy Reference'}</span>
              </button>

              <button
                type="button"
                id="resetInquiryBtn"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-[#3DE0FF]/15 hover:bg-[#3DE0FF]/25 text-[#3DE0FF] font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Send Another Message</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Streamlined Contact Card */
        <div className="p-6 sm:p-7 rounded-3xl bg-[#08254c]/75 border border-white/15 backdrop-blur-2xl shadow-xl shadow-[#00142e]/80 space-y-5">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/10">
            <Link
              href="/concierge"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0A2A54]/80 hover:bg-[#0A2A54] border border-white/10 text-white text-xs font-semibold transition-all hover:border-[#3DE0FF]/30 text-center"
            >
              <Sparkles size={14} className="text-[#3DE0FF]" />
              <span>Live Stylist Chat</span>
            </Link>

            <Link
              href="/tracking"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0A2A54]/80 hover:bg-[#0A2A54] border border-white/10 text-white text-xs font-semibold transition-all hover:border-emerald-400/30 text-center"
            >
              <Clock size={14} className="text-emerald-400" />
              <span>Track an Order</span>
            </Link>
          </div>

          <form
            id="directDispatchInquiryForm"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="clientName"
                className="block text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-1"
              >
                Your Name <span className="text-[#FB7185]">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Oliver Smith"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#00142e]/80 border border-white/15 focus:border-[#3DE0FF] text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#3DE0FF] transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="clientEmail"
                className="block text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-1"
              >
                Email Address <span className="text-[#FB7185]">*</span>
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="e.g. oliver.smith@example.co.uk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#00142e]/80 border border-white/15 focus:border-[#3DE0FF] text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#3DE0FF] transition-all"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="inquiryMessage"
                className="block text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-1"
              >
                Message <span className="text-[#FB7185]">*</span>
              </label>
              <textarea
                id="inquiryMessage"
                name="inquiryMessage"
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our customer support team help you?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#00142e]/80 border border-white/15 focus:border-[#3DE0FF] text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#3DE0FF] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#3DE0FF] hover:bg-[#3DE0FF]/90 active:scale-98 text-[#01142e] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md shadow-[#3DE0FF]/25 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
