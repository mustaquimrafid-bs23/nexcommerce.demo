'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  ShoppingBag,
  RotateCcw,
  Check,
  Package,
  ChevronRight,
  ShieldCheck,
  Mic,
  ArrowUp,
  MessageSquare,
  Truck,
  RotateCcw as ReturnIcon,
  CheckCircle2,
} from 'lucide-react';
import { useConciergeStore } from '@/store/useConciergeStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

const SCENARIO_PROMPT_CHIPS = [
  { label: '✦ 3-Day Winter Alpine Trip', prompt: 'Style a 3-day winter trip in St. Moritz' },
  { label: '✦ Knitwear & Sweaters', prompt: 'Show me tailored knitwear and blazers' },
  { label: '✦ Fit & Sizing Advice', prompt: 'What size should I get for cashmere sweaters?' },
  { label: '✦ Delivery Timelines', prompt: 'How fast is express delivery across the UK and Europe?' },
  { label: '✦ Track Order NX-8921-X', prompt: 'Track order NX-8921-X' },
];

export default function ConciergePage() {
  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [mobileTab, setMobileTab] = useState<'chat' | 'look'>('chat');
  const [voiceActive, setVoiceActive] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [bundleAdded, setBundleAdded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    currentLookTitle,
    currentLookProducts,
    harmonyScore,
    selectedCategory,
    selectedSize,
    selectedFit,
    setSizeCategory,
    setSizeMeasurement,
    setSizeFit,
    calculateSize,
  } = useConciergeStore();

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Dynamic subtotal calculation for the Look Canvas
  const lookSubtotal = useMemo(() => {
    return currentLookProducts.reduce((acc, p) => acc + (p.price || 0), 0);
  }, [currentLookProducts]);

  // Sizing calculated result
  const sizeResult = useMemo(() => {
    return calculateSize();
  }, [selectedCategory, selectedSize, selectedFit, calculateSize]);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const handleVoiceToggle = () => {
    if (!voiceActive) {
      setVoiceActive(true);
      setTimeout(() => {
        setVoiceActive(false);
        sendMessage('Show me cashmere knitwear for a winter evening');
      }, 2400);
    } else {
      setVoiceActive(false);
    }
  };

  const handleSingleQuickAdd = (product: Product) => {
    addItem(
      product,
      product.sizes ? product.sizes[0] : undefined,
      product.colors ? product.colors[0].name : undefined
    );
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleAddAllLookToBag = () => {
    if (!currentLookProducts.length) return;
    currentLookProducts.forEach((p) => {
      addItem(
        p,
        p.sizes ? p.sizes[0] : undefined,
        p.colors ? p.colors[0].name : undefined
      );
    });
    setBundleAdded(true);
    setTimeout(() => {
      setBundleAdded(false);
    }, 2200);
  };

  // Time-aware greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-20 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* STUDIO TOP BAR: AGENT PROFILE, MOBILE TABS & RESET */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-surface-navy/30 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-pink/30 to-accent-cyan/30 border border-accent-cyan/40 flex items-center justify-center shadow-[0_0_15px_rgba(61,224,255,0.25)] flex-shrink-0">
              <Sparkles size={18} className="text-accent-cyan" />
            </div>
            <div>
              <div className="font-editorial text-lg text-white font-medium flex items-center gap-2">
                Smart Style Concierge
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse flex-shrink-0" />
                <span>Active · Personal Stylist</span>
              </div>
            </div>
          </div>

          {/* MOBILE VIEWPORT SWITCHER TABS (max-width: 900px) */}
          <div className="flex lg:hidden items-center gap-1.5 bg-obsidian-900/80 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setMobileTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileTab === 'chat'
                  ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 shadow-[0_0_10px_rgba(61,224,255,0.2)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageSquare size={13} />
              <span>Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('look')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileTab === 'look'
                  ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 shadow-[0_0_10px_rgba(61,224,255,0.2)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>Look ({currentLookProducts.length})</span>
            </button>
          </div>

          {/* RESET SESSION BUTTON */}
          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-semibold text-white/70 hover:text-white transition-all cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* 2-COLUMN SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT PANE: CONVERSATIONAL DIALOGUE (7 cols) */}
          <div
            className={`lg:col-span-7 flex flex-col h-[580px] sm:h-[650px] lg:h-[700px] rounded-3xl bg-surface-navy/35 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl transition-all ${
              mobileTab === 'look' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* MESSAGES STREAM */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 dialogue-messages-stream">
              
              {/* INITIAL WELCOME HERO */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-accent-cyan/10 via-white/[0.03] to-transparent border border-accent-cyan/25 flex items-center gap-3 animate-fade-in-up">
                <Sparkles size={18} className="text-accent-cyan flex-shrink-0" />
                <span className="text-xs sm:text-[13.5px] font-medium text-white">
                  {getGreeting()} — What are you looking to discover or style today?
                </span>
              </div>

              {/* MESSAGE BUBBLES */}
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${
                      isUser ? 'items-end' : 'items-start'
                    } space-y-2 animate-fade-in-up`}
                  >
                    {/* BUBBLE BODY */}
                    <div
                      className={`text-xs sm:text-[13.5px] leading-relaxed p-4 rounded-2xl ${
                        isUser
                          ? 'bg-accent-cyan text-obsidian-950 font-semibold rounded-tr-none shadow-[0_4px_14px_rgba(61,224,255,0.25)] max-w-[85%]'
                          : 'bg-white/[0.04] border border-white/[0.08] text-white/95 rounded-tl-none w-full max-w-[95%] space-y-3'
                      }`}
                    >
                      {/* Formatted Text */}
                      <div className="space-y-2">
                        {msg.text.split('\n\n').map((para, pIdx) => {
                          // Format bold markers **text**
                          const parts = para.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={pIdx} className="leading-relaxed">
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong
                                      key={partIdx}
                                      className={isUser ? 'font-bold' : 'text-accent-cyan font-semibold'}
                                    >
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                if (part.startsWith('`') && part.endsWith('`')) {
                                  return (
                                    <code
                                      key={partIdx}
                                      className="px-1.5 py-0.5 rounded bg-white/10 text-accent-cyan text-xs font-mono"
                                    >
                                      {part.slice(1, -1)}
                                    </code>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* EMBEDDED SIZE & FIT ADVISOR WIDGET */}
                      {msg.widgetType === 'sizing_advisor' && (
                        <div className="mt-4 p-4 rounded-2xl bg-obsidian-950/90 border border-accent-cyan/25 space-y-4">
                          {/* 1. Garment Category Selector */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                              1. Garment Category
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {['Tops & Sweaters', 'Jackets & Tailoring', 'Shoes & Trainers'].map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setSizeCategory(cat)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                    selectedCategory === cat
                                      ? 'bg-accent-cyan text-obsidian-950 border-accent-cyan font-semibold shadow-[0_0_10px_rgba(61,224,255,0.3)]'
                                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Measurement / Body Size */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                              2. Measurement / Typical Size
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedCategory.includes('Shoe') || selectedCategory.includes('Trainer')
                                ? ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
                                : ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")']
                              ).map((sizeOption) => (
                                <button
                                  key={sizeOption}
                                  type="button"
                                  onClick={() => setSizeMeasurement(sizeOption)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                    selectedSize === sizeOption
                                      ? 'bg-accent-cyan text-obsidian-950 border-accent-cyan font-semibold shadow-[0_0_10px_rgba(61,224,255,0.3)]'
                                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                                  }`}
                                >
                                  {sizeOption}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 3. Desired Silhouette Fit */}
                          {!selectedCategory.includes('Shoe') && !selectedCategory.includes('Trainer') && (
                            <div className="space-y-1.5">
                              <div className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                                3. Desired Silhouette Fit
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  'True to size (Clean silhouette)',
                                  'Size up (Relaxed drape)',
                                ].map((fitOption) => (
                                  <button
                                    key={fitOption}
                                    type="button"
                                    onClick={() => setSizeFit(fitOption)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                      selectedFit === fitOption
                                        ? 'bg-accent-cyan text-obsidian-950 border-accent-cyan font-semibold shadow-[0_0_10px_rgba(61,224,255,0.3)]'
                                        : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                                    }`}
                                  >
                                    {fitOption}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Recommendation Result Card */}
                          <div className="p-3.5 rounded-xl bg-surface-navy/70 border border-emerald-400/30 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                              <CheckCircle2 size={16} />
                              <span>
                                Recommended Size: {sizeResult.recommendedSize} · {sizeResult.confidence}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-white/70 leading-relaxed">
                              {sizeResult.note}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* EMBEDDED LIVE ORDER TRACKING STEPPER WIDGET */}
                      {msg.widgetType === 'order_tracking' && msg.widgetPayload && (
                        <div className="mt-4 p-4 rounded-2xl bg-obsidian-950/90 border border-accent-cyan/25 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                                Order Reference
                              </div>
                              <div className="text-xs font-bold text-white">
                                {msg.widgetPayload.orderCode}
                              </div>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-[11px] font-semibold text-accent-cyan">
                              <Truck size={12} />
                              <span>{msg.widgetPayload.carrier}</span>
                            </div>
                          </div>

                          <div className="text-xs text-white/80">
                            Estimated Delivery: <strong className="text-white">{msg.widgetPayload.estimatedDelivery}</strong>
                          </div>

                          {/* 4-Stage Stepper Nodes */}
                          <div className="space-y-3 pt-1">
                            {msg.widgetPayload.steps.map((st: any, sIdx: number) => {
                              const isDone = sIdx < msg.widgetPayload.currentStep;
                              const isCurrent = sIdx === msg.widgetPayload.currentStep - 1;
                              return (
                                <div key={sIdx} className="flex items-start gap-3 relative">
                                  {/* Milestone Node */}
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 z-10 ${
                                      isDone
                                        ? 'bg-emerald-400 text-obsidian-950'
                                        : isCurrent
                                        ? 'bg-accent-cyan text-obsidian-950 shadow-[0_0_10px_rgba(61,224,255,0.4)]'
                                        : 'bg-white/10 text-white/40'
                                    }`}
                                  >
                                    {isDone ? '✓' : sIdx + 1}
                                  </div>
                                  <div className="flex-1 text-xs">
                                    <div className={`font-semibold ${isCurrent ? 'text-accent-cyan' : isDone ? 'text-white' : 'text-white/40'}`}>
                                      {st.label}
                                    </div>
                                    <div className="text-[10px] text-white/50">{st.date}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ACTION LINK */}
                      {msg.actionLink && (
                        <div className="pt-2">
                          <Link
                            href={msg.actionLink.url}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan font-bold text-xs uppercase tracking-wider transition-all"
                          >
                            <span>{msg.actionLink.text}</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 w-fit animate-fade-in-up">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-typing-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-typing-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-typing-3" />
                  </div>
                  <span>Selecting recommended pieces for you...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SCENARIO CHIPS ROW */}
            <div className="px-4 py-2.5 bg-black/25 border-t border-white/[0.06] overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
              {SCENARIO_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(chip.prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-accent-cyan/40 text-[11.5px] font-medium text-white/80 hover:text-accent-cyan transition-all cursor-pointer shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* INPUT DOCK */}
            <div className="p-3.5 sm:p-4 bg-obsidian-950/95 border-t border-white/10 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.14] rounded-xl px-3 py-1.5 focus-within:border-accent-cyan/50 focus-within:shadow-[0_0_14px_rgba(61,224,255,0.15)] transition-all">
                  
                  {/* Voice Mic Toggle */}
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center ${
                      voiceActive
                        ? 'text-rose-400 bg-rose-500/20'
                        : 'text-white/50 hover:text-accent-cyan hover:bg-white/5'
                    }`}
                    title={voiceActive ? 'Listening...' : 'Click for Voice Input'}
                  >
                    {voiceActive ? (
                      <div className="flex items-center gap-0.5 h-4">
                        <span className="w-0.5 h-3 bg-rose-400 animate-wave-bar" />
                        <span className="w-0.5 h-4 bg-rose-400 animate-wave-bar" style={{ animationDelay: '0.15s' }} />
                        <span className="w-0.5 h-2.5 bg-rose-400 animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                        <span className="w-0.5 h-3.5 bg-rose-400 animate-wave-bar" style={{ animationDelay: '0.45s' }} />
                      </div>
                    ) : (
                      <Mic size={17} />
                    )}
                  </button>

                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask your stylist for an outfit, fabric advice, or fit guidance..."
                    className="flex-1 bg-transparent text-xs sm:text-[13.5px] text-white placeholder-white/40 focus:outline-none py-2"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputVal.trim()}
                    className="w-9 h-9 rounded-lg bg-accent-cyan hover:opacity-90 disabled:opacity-30 text-obsidian-950 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Send message"
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT PANE: REACTIVE WARDROBE LOOK CANVAS (5 cols) */}
          <div
            className={`lg:col-span-5 flex flex-col h-[580px] sm:h-[650px] lg:h-[700px] rounded-3xl bg-surface-navy/35 border border-white/10 backdrop-blur-xl p-4 sm:p-6 shadow-2xl transition-all ${
              mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* CANVAS HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                  YOUR OUTFIT
                </span>
                <h2 className="font-editorial text-2xl text-white font-normal mt-0.5">
                  {currentLookTitle}
                </h2>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-semibold text-emerald-400">
                  {harmonyScore}
                </span>
              </div>
            </div>

            {/* PRODUCT CARDS LIST */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
              {currentLookProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3 text-white/40">
                  <Sparkles size={36} className="text-white/20" />
                  <p className="text-xs">
                    Start chatting or click a styling prompt to discover recommended pieces.
                  </p>
                </div>
              ) : (
                currentLookProducts.map((product) => {
                  const isAdded = !!addedItemIds[product.id];
                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-4 group"
                    >
                      {/* Left: Product Image & Details */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-16 h-20 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent p-1.5 flex items-center justify-center flex-shrink-0 border border-white/5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-accent-cyan">
                            {product.category || 'Atelier'}
                          </span>
                          <h3 className="text-xs sm:text-[13px] font-editorial text-white font-medium truncate block">
                            {product.name}
                          </h3>
                          <div className="text-xs font-bold text-white/90">
                            {formatPrice(product.price, product.currency)}
                          </div>
                        </div>
                      </div>

                      {/* Right: 1-Click Quick Add Button */}
                      <button
                        type="button"
                        onClick={() => handleSingleQuickAdd(product)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-400 text-obsidian-950 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                            : 'bg-accent-cyan/10 hover:bg-accent-cyan text-accent-cyan hover:text-obsidian-950 border border-accent-cyan/30'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={13} />
                            <span>Added ✓</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} />
                            <span>Quick Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* STUDIO BUNDLE BAR AT BOTTOM */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                  FULL OUTFIT
                </span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {formatPrice(lookSubtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddAllLookToBag}
                disabled={currentLookProducts.length === 0}
                className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  bundleAdded
                    ? 'bg-emerald-400 text-obsidian-950 shadow-emerald-400/25'
                    : 'bg-accent-cyan hover:opacity-90 text-obsidian-950 shadow-accent-cyan/25'
                }`}
              >
                {bundleAdded ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add All to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
