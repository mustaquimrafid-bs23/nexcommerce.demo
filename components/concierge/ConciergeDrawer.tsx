'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  ArrowRight,
  ShoppingBag,
  Package,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from 'lucide-react';
import { useConciergeStore } from '@/store/useConciergeStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

const SUGGESTED_CHIPS = [
  'Place an order (Voice Demo)',
  'Place an order (Text Demo)',
  'Build cart by budget',
  'Compare top pieces',
  'Upload shopping slip',
];

export function ConciergeDrawer() {
  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isOpen, closeConcierge, messages, isTyping, sendMessage } =
    useConciergeStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsVoiceEnabled(localStorage.getItem('nex_stylist_voice_muted') !== 'true');
    }
  }, []);

  // Speak assistant messages when voice is enabled
  useEffect(() => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'assistant' && lastMsg.text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastMsg.text.slice(0, 200));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isVoiceEnabled]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!mounted || !isOpen) return null;

  // DLP Card Guard: Mask any accidental credit card numbers entered in chat
  const sanitizeDLP = (text: string) => {
    return text.replace(/\b(?:\d[ -]*?){13,19}\b/g, '[REDACTED PAYMENT DATA]');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const sanitized = sanitizeDLP(inputVal);
    sendMessage(sanitized);
    setInputVal('');
  };

  const handleAddBundleToBag = (products: Product[]) => {
    products.forEach((p) => {
      addItem(
        p,
        p.sizes ? p.sizes[0] : undefined,
        p.colors ? p.colors[0].name : undefined
      );
    });
  };

  const toggleVoice = () => {
    const next = !isVoiceEnabled;
    setIsVoiceEnabled(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nex_stylist_voice_muted', next ? 'false' : 'true');
      if (!next && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    if (typeof window === 'undefined') return;
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        setIsListening(true);

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setInputVal(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setInputVal('Looking for warm wool overcoat');
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={closeConcierge}
      />

      {/* Slide-out Drawer */}
      <aside
        id="conciergeDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Ask Stylist"
        className="relative w-full max-w-[460px] bg-[#0A0A0A] border-l border-white/[0.08] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Header (1:1 with feature/storefront-elevation prototype) */}
        <div className="concierge-header px-6 py-5 border-b border-white/[0.06] bg-[#0A0A0A] flex items-center justify-between shrink-0">
          <div className="concierge-header-title text-xs font-semibold tracking-[0.12em] text-white flex items-center gap-2 uppercase font-sans">
            <Sparkles size={16} className="text-[#F13365]" />
            <span>Ask Stylist</span>
          </div>

          <div className="concierge-header-actions flex items-center gap-2">
            <button
              type="button"
              id="conciergeVoiceToggleBtn"
              onClick={toggleVoice}
              className={`p-2 rounded transition-colors cursor-pointer ${
                isVoiceEnabled
                  ? 'text-[#F13365]'
                  : 'text-white/40 hover:text-white'
              }`}
              aria-label="Toggle Stylist Voice Audio"
              title={isVoiceEnabled ? 'Stylist Voice Active (Click to mute)' : 'Stylist Voice Muted (Click to enable)'}
            >
              {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              type="button"
              onClick={closeConcierge}
              className="concierge-close p-1.5 text-white/50 hover:text-white rounded transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div id="conciergeStream" className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
          {/* Initial Welcome & First-Frame 2-Column Product Grid */}
          {messages.length === 0 && (
            <div className="msg-concierge-wrapper space-y-4">
              <div className="text-sm text-white/95 leading-relaxed font-sans">
                Featured wardrobe pieces &amp; styling ideas:
              </div>

              <div className="concierge-product-grid grid grid-cols-2 gap-3 w-full" data-lenis-prevent>
                {MASTER_PRODUCTS.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="concierge-product-card bg-white/[0.03] border border-white/[0.08] hover:border-[#F13365]/40 rounded-lg overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 group"
                  >
                    <Link
                      href={`/product/${p.id}`}
                      className="block w-full h-[150px] overflow-hidden bg-white/[0.02]"
                      title={`View details for ${p.name}`}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <div className="text-[9.5px] uppercase tracking-wider text-white/50 font-medium font-sans">
                        {p.category || 'Apparel'}
                      </div>
                      <Link
                        href={`/product/${p.id}`}
                        className="text-xs font-semibold text-white truncate hover:text-[#3DE0FF] transition-colors"
                      >
                        {p.name}
                      </Link>
                      <div className="text-xs font-mono text-white/90 tabular-nums">
                        {formatPrice(p.price)}
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(p, p.sizes ? p.sizes[0] : 'One Size')}
                        className="concierge-add-btn mt-2 w-full py-1.5 rounded-md border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Chat Stream */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-3`}
            >
              {/* Bubble Text */}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-white/[0.08] text-white border border-white/10 rounded-br-none'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/95 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
              </div>

              {/* Outfit Bundle Card */}
              {msg.bundle && (
                <div className="w-full p-4 rounded-xl bg-white/[0.03] border border-[#F13365]/30 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-[#F13365] font-semibold">
                      <Package size={15} />
                      <span>{msg.bundle.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-white">
                        {formatPrice(msg.bundle.discountedPrice)}
                      </span>
                      <span className="text-[10px] text-white/40 line-through ml-1.5">
                        {formatPrice(msg.bundle.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {msg.bundle.products.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-lg bg-black/40 p-2 border border-white/5 flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded overflow-hidden mb-1">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-[10px] text-white/80 truncate font-medium">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#3DE0FF]">
                          {formatPrice(p.price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddBundleToBag(msg.bundle!.products)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#F13365] to-[#E60C45] hover:opacity-95 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Add Entire Look to Bag</span>
                  </button>
                </div>
              )}

              {/* In-Chat Products Grid */}
              {msg.products && msg.products.length > 0 && !msg.bundle && (
                <div className="concierge-product-grid grid grid-cols-2 gap-3 w-full" data-lenis-prevent>
                  {msg.products.map((p) => (
                    <div
                      key={p.id}
                      className="concierge-product-card bg-white/[0.03] border border-white/[0.08] hover:border-[#F13365]/40 rounded-lg overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 group"
                    >
                      <Link
                        href={`/product/${p.id}`}
                        className="block w-full h-[140px] overflow-hidden bg-white/[0.02]"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <div className="text-[9.5px] uppercase tracking-wider text-white/50 font-medium font-sans">
                          {p.category || 'Apparel'}
                        </div>
                        <Link
                          href={`/product/${p.id}`}
                          className="text-xs font-semibold text-white truncate hover:text-[#3DE0FF] transition-colors"
                        >
                          {p.name}
                        </Link>
                        <div className="text-xs font-mono text-white/90 tabular-nums">
                          {formatPrice(p.price, p.currency)}
                        </div>
                        <button
                          type="button"
                          onClick={() => addItem(p, p.sizes ? p.sizes[0] : 'One Size')}
                          className="concierge-add-btn mt-2 w-full py-1.5 rounded-md border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                        >
                          ADD TO BAG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/60 w-fit">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-bounce delay-300" />
              </div>
              <span>Stylist is curating...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Bottom Chips + Pill Form) */}
        <div className="concierge-input-area border-t border-white/[0.08] bg-[#0A0A0A] p-4 space-y-3 shrink-0">
          {/* Actionable Chips (Positioned right above input bar) */}
          <div id="conciergeChips" className="concierge-chips-container flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => sendMessage(chip)}
                className="concierge-chip px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 text-xs text-white/70 hover:text-white whitespace-nowrap transition-all cursor-pointer shrink-0 font-sans"
              >
                {chip}
              </button>
            ))}
          </div>

          <form id="conciergeForm" onSubmit={handleSubmit} className="concierge-input-bar relative flex items-center bg-white/[0.035] border border-white/10 focus-within:border-[#F13365]/50 rounded-full px-4 py-1 transition-all">
            {/* Animated 6-bar Listening Waveform */}
            {isListening && (
              <div
                id="conciergeListeningWave"
                className="listening-waveform absolute inset-0 z-10 bg-[#0A0A0A] rounded-full flex items-center justify-between px-4 border border-[#F13365]/50 animate-in fade-in duration-200"
                aria-label="Listening to microphone"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F13365] animate-ping" />
                  <span className="text-xs text-white/90 font-medium">Listening to speech...</span>
                </div>
                <div className="flex items-center gap-1.5 h-5">
                  <div className="voice-bar-anim w-1 bg-[#F13365] rounded-full h-2 animate-pulse" />
                  <div className="voice-bar-anim w-1 bg-[#F13365] rounded-full h-5 animate-pulse delay-75" />
                  <div className="voice-bar-anim w-1 bg-[#F13365] rounded-full h-3 animate-pulse delay-150" />
                  <div className="voice-bar-anim w-1 bg-[#F13365] rounded-full h-5 animate-pulse delay-100" />
                  <div className="voice-bar-anim w-1 bg-[#F13365] rounded-full h-4 animate-pulse delay-200" />
                  <div className="voice-bar-anim w-1 bg-[#F13365] rounded-full h-2 animate-pulse delay-300" />
                </div>
                <button
                  type="button"
                  id="conciergeVoiceCancelBtn"
                  onClick={() => setIsListening(false)}
                  className="voice-cancel-btn text-white/60 hover:text-white text-xs font-semibold px-2 py-0.5 rounded bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <input
              type="text"
              id="conciergeInput"
              name="concierge_query"
              placeholder="Ask about style, size, or tap mic..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none py-2 font-sans"
              autoComplete="off"
            />

            <button
              type="button"
              id="conciergeMicBtn"
              onClick={toggleListening}
              className={`p-2 transition-colors cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'text-[#F13365] animate-pulse'
                  : 'text-white/40 hover:text-white'
              }`}
              aria-label="Tap to speak"
              title="Tap to speak with Stylist"
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="concierge-send-btn p-2 text-white hover:text-[#F13365] disabled:text-white/20 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Send message"
            >
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
