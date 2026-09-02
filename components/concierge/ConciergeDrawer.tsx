'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  RotateCcw,
  Check,
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

const STARTER_PROMPTS = [
  'Warm wool overcoat for cold weather',
  'Smart evening dinner outfit',
  'Leather travel bag for a weekend away',
  'Comfortable trainers and everyday basics',
];

export function ConciergeDrawer() {
  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isOpen, closeConcierge, messages, isTyping, sendMessage, clearChat } =
    useConciergeStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsVoiceEnabled(localStorage.getItem('nex_stylist_voice') === 'true');
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
      localStorage.setItem('nex_stylist_voice', String(next));
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeConcierge}
      />

      {/* Slide-out Drawer */}
      <aside
        id="conciergeDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Ask Stylist Assistant"
        className="relative w-full max-w-lg bg-[#020B18] border-l border-white/10 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface-navy/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center border border-accent-pink/40 shadow-sm shadow-accent-pink/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl text-white font-medium">
                  Personal Stylist
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                  ONLINE 24/7
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                Outfit ideas, sizing advice, and styling help
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="conciergeVoiceToggleBtn"
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-accent-pink/25 text-accent-pink border border-accent-pink/40'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Toggle Stylist Voice Audio"
              title={isVoiceEnabled ? 'Stylist Voice Active (Click to mute)' : 'Stylist Voice Muted (Click to enable)'}
            >
              {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={clearChat}
              className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={closeConcierge}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close stylist"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Starter Chips */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
              Outfit ideas to get started:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-xs px-3 py-1.5 rounded-full bg-surface-navy/70 hover:bg-surface-navy text-white/80 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* First-Frame Invariant: Featured Visual Capsule */}
          {messages.length === 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-accent-cyan font-semibold flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Featured Atelier Capsule</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono">3 Recommendations</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {MASTER_PRODUCTS.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-obsidian-950 p-1 shrink-0 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                        <div className="text-xs font-mono text-accent-cyan">{formatPrice(p.price)}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addItem(p, p.sizes ? p.sizes[0] : 'One Size')}
                      className="px-3 py-1.5 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-[10px] font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-sm"
                    >
                      Quick Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-5 pt-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-3`}
              >
                {/* Bubble Text */}
                <div
                  className={`max-w-[88%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-accent-pink text-white rounded-tr-none font-medium'
                      : 'bg-surface-navy/50 border border-white/10 text-white/90 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Outfit Bundle Card (Visual First) */}
                {msg.bundle && (
                  <div className="w-full p-4 rounded-2xl bg-obsidian-900 border border-accent-pink/30 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-accent-pink font-semibold">
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

                    {/* Bundle Items Thumbnails Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {msg.bundle.products.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-xl bg-surface-card p-2 border border-white/5 flex flex-col justify-between"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden mb-1.5 bg-surface-navy/60 p-1 flex items-center justify-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-[10px] text-white font-medium truncate">
                            {p.name}
                          </div>
                          <div className="text-[9px] text-white/50">
                            {formatPrice(p.price, p.currency)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Bundle to Bag & In-Chat Checkout CTAs */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddBundleToBag(msg.bundle!.products)}
                        className="flex-1 py-3 rounded-xl bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-pink/20 cursor-pointer"
                      >
                        <ShoppingBag size={14} />
                        <span>Add Look to Bag</span>
                      </button>
                      <Link
                        href="/checkout"
                        onClick={() => {
                          handleAddBundleToBag(msg.bundle!.products);
                          closeConcierge();
                        }}
                        className="px-4 py-3 rounded-xl bg-white hover:bg-slate-200 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Proceed to Instant Checkout"
                      >
                        <span>Checkout</span>
                        <Check size={14} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Individual Products Grid */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full grid grid-cols-2 gap-3">
                    {msg.products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-surface-navy/40 border border-white/10 flex flex-col justify-between space-y-2"
                      >
                        <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-surface-card">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-white truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-white/50">
                            {formatPrice(p.price, p.currency)}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            addItem(
                              p,
                              p.sizes ? p.sizes[0] : undefined,
                              p.colors ? p.colors[0].name : undefined
                            )
                          }
                          className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag size={12} />
                          <span>Quick Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-navy/40 border border-white/10 text-xs text-white/60 w-fit">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-bounce delay-300" />
                </div>
                <span>Finding items for you...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-obsidian-900/90 flex items-center gap-2 relative">
          {/* Animated 6-bar Listening Waveform */}
          {isListening && (
            <div
              id="conciergeListeningWave"
              className="absolute inset-x-4 top-2 bottom-2 z-10 bg-[#06152D] rounded-xl flex items-center justify-between px-4 border border-accent-pink/50 animate-in fade-in duration-200"
              aria-label="Listening to microphone"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-pink animate-ping" />
                <span className="text-xs text-white/90 font-medium">Listening to speech...</span>
              </div>
              <div className="flex items-center gap-1.5 h-6">
                <div className="voice-bar-anim w-1 bg-accent-pink rounded-full h-2 animate-pulse" />
                <div className="voice-bar-anim w-1 bg-accent-pink rounded-full h-5 animate-pulse delay-75" />
                <div className="voice-bar-anim w-1 bg-accent-pink rounded-full h-3 animate-pulse delay-150" />
                <div className="voice-bar-anim w-1 bg-accent-pink rounded-full h-6 animate-pulse delay-100" />
                <div className="voice-bar-anim w-1 bg-accent-pink rounded-full h-4 animate-pulse delay-200" />
                <div className="voice-bar-anim w-1 bg-accent-pink rounded-full h-2 animate-pulse delay-300" />
              </div>
              <button
                type="button"
                onClick={() => setIsListening(false)}
                className="text-white/60 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <input
            type="text"
            id="conciergeInput"
            placeholder="Ask about outfits, sizes, or tap mic..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-surface-navy/70 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-pink"
          />

          <button
            type="button"
            id="conciergeMicBtn"
            onClick={toggleListening}
            className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-accent-pink/30 text-accent-pink border-accent-pink/60 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/15'
            }`}
            aria-label="Tap to speak"
            title="Tap to speak with Stylist"
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-4 py-3 rounded-xl bg-accent-pink hover:bg-accent-pink/90 disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center justify-center cursor-pointer"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </aside>
    </div>
  );
}
