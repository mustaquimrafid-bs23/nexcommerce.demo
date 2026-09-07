'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  X,
  ArrowRight,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Pause,
  Check,
  CheckCircle2,
  Shield,
  CreditCard,
  Truck,
  MapPin,
  Lock,
} from 'lucide-react';
import { useConciergeStore, ConciergeMessage } from '@/store/useConciergeStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

export function ConciergeDrawer() {
  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingAudioMsgId, setPlayingAudioMsgId] = useState<string | null>(null);
  const [selectedBundleItems, setSelectedBundleItems] = useState<Record<string, boolean>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [bundleAdded, setBundleAdded] = useState(false);

  // Address input form state
  const [customStreet, setCustomStreet] = useState('Maximilianstraße 34');
  const [customCity, setCustomCity] = useState('Munich');
  const [customPostcode, setCustomPostcode] = useState('80539');

  // Selected payment method in in-drawer payment widget
  const [selectedPayId, setSelectedPayId] = useState('cod');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const {
    isOpen,
    closeConcierge,
    messages,
    isTyping,
    sendMessage,
    pdpContext,
    setPDPContext,
    selectedCategory,
    selectedSize,
    selectedFit,
    setSizeCategory,
    setSizeMeasurement,
    setSizeFit,
    calculateSize,
    signInWithDemo,
    orderAddress,
    setOrderAddress,
    runTextOrderDemo,
    runVoiceOrderDemo,
  } = useConciergeStore();

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsVoiceEnabled(localStorage.getItem('nex_stylist_voice_muted') !== 'true');
    }
  }, []);

  // Automatically detect PDP context from current route
  useEffect(() => {
    if (!pathname) return;
    const match = pathname.match(/\/product\/([^/?#]+)/);
    if (match) {
      const prodId = decodeURIComponent(match[1]);
      const found = MASTER_PRODUCTS.find(
        (p) => p.id === prodId || p.id === `p${prodId}` || p.id.replace('p', '') === prodId
      );
      if (found) {
        setPDPContext(found);
      }
    } else {
      setPDPContext(null);
    }
  }, [pathname, setPDPContext]);

  // Auto-close concierge drawer on route change or browser history navigation
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      closeConcierge();
    }
  }, [pathname, closeConcierge]);

  useEffect(() => {
    const handlePopState = () => {
      closeConcierge();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [closeConcierge]);

  // Scroll to bottom on new messages or typing changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Voice speech synthesis
  useEffect(() => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'assistant' && lastMsg.spokenSummary) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastMsg.spokenSummary);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      setPlayingAudioMsgId(lastMsg.id);
      utterance.onend = () => setPlayingAudioMsgId(null);
      utterance.onerror = () => setPlayingAudioMsgId(null);
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isVoiceEnabled]);

  if (!mounted || !isOpen) return null;

  // Toggle voice mute
  const toggleVoice = () => {
    const next = !isVoiceEnabled;
    setIsVoiceEnabled(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nex_stylist_voice_muted', next ? 'false' : 'true');
      if (!next && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setPlayingAudioMsgId(null);
      }
    }
  };

  // Play / Pause Spoken Voice Summary bar
  const handlePlayVoiceSummary = (msg: ConciergeMessage) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (playingAudioMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setPlayingAudioMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const summaryText = msg.spokenSummary || msg.text.replace(/\*\*/g, '').slice(0, 180);
    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    setPlayingAudioMsgId(msg.id);
    utterance.onend = () => setPlayingAudioMsgId(null);
    utterance.onerror = () => setPlayingAudioMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle listening via Web Speech Recognition
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

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setInputVal('Suggest matching pants and shoes for this blazer');
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  // Add individual product to bag with feedback
  const handleAddProductToBag = (product: Product) => {
    addItem(product, product.sizes ? product.sizes[0] : 'One Size');
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Toggle item in bundle
  const handleToggleBundleItem = (productId: string) => {
    setSelectedBundleItems((prev) => {
      const current = prev[productId] !== false; // default true
      return { ...prev, [productId]: !current };
    });
  };

  // Add checked bundle items to bag
  const handleAddSelectedBundleToBag = (products: Product[]) => {
    const toAdd = products.filter((p) => selectedBundleItems[p.id] !== false);
    toAdd.forEach((p) => {
      addItem(p, p.sizes ? p.sizes[0] : 'One Size');
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2500);
  };

  const handleChipClick = (chipText: string) => {
    if (chipText === 'Place an order (Text Demo)') {
      runTextOrderDemo();
    } else if (chipText === 'Place an order (Voice Demo)') {
      runVoiceOrderDemo();
    } else if (chipText === 'Sign in with Demo Client') {
      signInWithDemo();
    } else {
      sendMessage(chipText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  // Format bold markdown text without raw asterisks
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
              <span key={idx} className="font-bold text-white tracking-wide">
                {boldText}
              </span>
            );
          }
          const lines = part.split('\n');
          return (
            <span key={idx} className="text-white/90">
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          );
        })}
      </div>
    );
  };

  // Active suggested chips (strictly 2 options for clean, un-scrolled presentation)
  const activeChips = (
    messages.length > 0 && messages[messages.length - 1].suggestedChips
      ? messages[messages.length - 1].suggestedChips!
      : [
          'Place an order (Voice Demo)',
          'Build cart by budget',
        ]
  )
    .filter((chip) => chip !== 'Place an order (Text Demo)')
    .slice(0, 2);

  // Initial 3-product curated catalog matching feature/storefront-elevation
  const initialCurated = [
    MASTER_PRODUCTS.find((p) => p.id === 'p1') || MASTER_PRODUCTS[0], // Architectural Cashmere Sweater (€ 185)
    MASTER_PRODUCTS.find((p) => p.id === 'p2') || MASTER_PRODUCTS[1], // Structured Wool Blazer (€ 245)
    MASTER_PRODUCTS.find((p) => p.id === 'p3') || MASTER_PRODUCTS[2], // Fine-Knit Cashmere Crew (€ 160)
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
      {/* ─── Backdrop: Strict Royal Sapphire Navy (Never pure black) ─── */}
      <div
        id="nexConciergeOverlay"
        className="fixed inset-0 bg-[#01142e]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={closeConcierge}
        aria-hidden="true"
      />

      {/* ─── Slide-out Drawer: Atelier Royal Sapphire Navy Gradient (#012148 via #071e3d to #03152c) ─── */}
      <aside
        id="nexConciergeDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Ask Stylist"
        className="relative w-full max-w-[460px] bg-gradient-to-b from-[#012148] via-[#071e3d] to-[#03152c] border-l border-[#3DE0FF]/25 shadow-[-16px_0_48px_rgba(0,18,41,0.95)] flex flex-col h-full z-10 animate-in slide-in-from-right duration-300"
      >
        {/* ─── Header: 100% Parity with feature/storefront-elevation ─── */}
        <div className="concierge-header px-6 py-5 border-b border-white/[0.08] bg-[#012148]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="concierge-header-title text-xs font-bold tracking-[0.12em] text-white flex items-center gap-2 uppercase">
            <Sparkles size={16} className="text-[#F13365]" />
            <span>Ask Stylist</span>
          </div>

          <div className="concierge-header-actions flex items-center gap-2">
            <button
              type="button"
              id="conciergeVoiceToggleBtn"
              onClick={toggleVoice}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isVoiceEnabled
                  ? 'text-[#3DE0FF] bg-[#3DE0FF]/10 border-[#3DE0FF]/40 shadow-[0_0_12px_rgba(61,224,255,0.2)]'
                  : 'text-white/40 hover:text-white border-white/10 hover:border-white/20'
              }`}
              aria-label="Toggle Stylist Voice Audio"
              title={isVoiceEnabled ? 'Stylist Voice Active (Click to mute)' : 'Stylist Voice Muted (Click to enable)'}
            >
              {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              type="button"
              onClick={closeConcierge}
              className="concierge-close p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── Messages Stream ─── */}
        <div id="conciergeStream" className="concierge-stream flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin" data-lenis-prevent>
          {/* Initial Welcome & Curated 2-Column Product Grid (100% Parity with feature/storefront-elevation) */}
          {messages.length === 0 && (
            <div className="msg-concierge-wrapper space-y-4">
              <div className="text-xs font-medium text-white/90">
                Featured wardrobe pieces &amp; styling ideas:
              </div>

              <div className="concierge-product-grid grid grid-cols-2 gap-3 w-full" data-lenis-prevent>
                {initialCurated.map((p) => {
                  const isAdded = !!addedItemIds[p.id];
                  return (
                    <div
                      key={p.id}
                      className="concierge-product-card bg-[#021838]/80 border border-white/10 hover:border-[#F13365]/50 rounded-lg overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 shadow group"
                    >
                      <Link
                        href={`/product/${p.id}`}
                        onClick={closeConcierge}
                        className="concierge-card-img-link block w-full h-[150px] overflow-hidden bg-white/[0.02]"
                        title={`View details for ${p.name}`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="concierge-card-body p-3 flex flex-col gap-1 flex-1">
                        <div className="concierge-card-cat text-[9.5px] uppercase tracking-wider text-white/50 font-medium">
                          {p.category || 'Apparel'}
                        </div>
                        <Link
                          href={`/product/${p.id}`}
                          onClick={closeConcierge}
                          className="concierge-card-title text-xs font-medium text-white truncate hover:text-[#F13365] transition-colors"
                        >
                          {p.name}
                        </Link>
                        <div className="concierge-card-price text-xs font-semibold text-white tabular-nums mb-1">
                          {formatPrice(p.price)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddProductToBag(p)}
                          className={`concierge-add-btn mt-auto w-full py-2 rounded border text-[10.5px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : 'bg-white/[0.08] hover:bg-[#F13365] border-white/10 hover:border-[#F13365] text-white'
                          }`}
                        >
                          {isAdded ? 'ADDED' : 'ADD TO BAG'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-3.5 w-full`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-white/[0.08] text-white border border-white/15 rounded-br-none'
                    : 'bg-[#041a38]/90 border border-white/[0.12] text-white rounded-bl-none'
                }`}
              >
                {msg.isVoice && (
                  <div className="text-[10px] text-[#3DE0FF] font-semibold mb-1 flex items-center gap-1 uppercase tracking-wider">
                    <Mic size={11} /> Spoken query
                  </div>
                )}
                {renderFormattedText(msg.text)}
              </div>

              {/* ─── Spoken Audio Player Bar ─── */}
              {msg.sender === 'assistant' && msg.spokenSummary && (
                <div className="stylist-audio-bar w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#021838]/80 border border-[#3DE0FF]/30 backdrop-blur-md shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handlePlayVoiceSummary(msg)}
                      className="w-7 h-7 rounded-full bg-[#3DE0FF] hover:bg-[#32c5e2] text-[#001229] flex items-center justify-center transition-transform hover:scale-105 shadow cursor-pointer"
                      aria-label={playingAudioMsgId === msg.id ? 'Pause Voice Summary' : 'Play Voice Summary'}
                    >
                      {playingAudioMsgId === msg.id ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                    </button>
                    {/* Animated 8-bar Audio Equalizer */}
                    <div className="mini-waveform flex items-center gap-1 h-3.5" aria-hidden="true">
                      {[1.5, 2.5, 3.5, 2.0, 3.0, 1.5, 2.5, 1.5].map((h, bIdx) => (
                        <span
                          key={bIdx}
                          className={`w-1 rounded-full bg-[#3DE0FF] transition-all ${
                            playingAudioMsgId === msg.id ? 'animate-pulse' : ''
                          }`}
                          style={{ height: `${h * 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayVoiceSummary(msg)}
                    className="text-xs font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    {playingAudioMsgId === msg.id ? 'Speaking...' : 'Play Voice Summary'}
                  </button>
                </div>
              )}

              {/* ─── Widget: Order Flow - Auth Required ─── */}
              {msg.widgetType === 'order_auth_required' && (
                <div className="order-auth-required-box w-full p-4 rounded-xl bg-[#041a38]/90 border border-[#3DE0FF]/30 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#3DE0FF]/15 border border-[#3DE0FF]/30 flex items-center justify-center text-[#3DE0FF] shrink-0">
                      <Lock size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white">
                        Atelier Member Order Gate
                      </div>
                      <div className="text-[11.5px] text-white/70 leading-snug">
                        {msg.widgetPayload?.reason || 'Guest ordering is restricted. Sign in with your account or use the 1-Click Demo Client.'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={signInWithDemo}
                      className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#3DE0FF] to-[#0088FF] text-[#000B1A] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow transition-all hover:opacity-95 cursor-pointer"
                    >
                      <span>1-CLICK DEMO SIGN IN</span>
                      <ArrowRight size={13} />
                    </button>
                    <Link
                      href="/signin?next=checkout"
                      onClick={closeConcierge}
                      className="w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <span>MEMBER SIGN IN</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* ─── Widget: Order Flow - Step 1: Address ─── */}
              {msg.widgetType === 'order_address' && (
                <div className="order-address-box w-full p-4 rounded-xl bg-[#041a38]/90 border border-[#3DE0FF]/30 shadow-xl space-y-3.5">
                  {/* Default saved address card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => sendMessage(`Confirm address: ${orderAddress.formatted}`)}
                    className="p-3 rounded-xl bg-[#021838] border-2 border-[#3DE0FF] relative cursor-pointer hover:bg-[#021c45] transition-all shadow"
                  >
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#3DE0FF] text-[#001229] text-[9.5px] font-bold uppercase">
                      Default
                    </span>
                    <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#3DE0FF]" />
                      <span>{orderAddress.name}</span>
                    </div>
                    <div className="text-[11.5px] text-white/70 leading-relaxed">
                      {orderAddress.formatted}
                    </div>
                  </div>

                  <div className="text-[10px] text-white/40 uppercase tracking-wider text-center">
                    ── or enter a new address ──
                  </div>

                  {/* Quick Address Inputs */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customStreet}
                      onChange={(e) => setCustomStreet(e.target.value)}
                      placeholder="Street Address & Apt"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#3DE0FF]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#3DE0FF]"
                      />
                      <input
                        type="text"
                        value={customPostcode}
                        onChange={(e) => setCustomPostcode(e.target.value)}
                        placeholder="Postcode"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#3DE0FF]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderAddress({ street: customStreet, city: customCity, postcode: customPostcode });
                      sendMessage(`Confirm address: ${customStreet}, ${customPostcode} ${customCity}`);
                    }}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#3DE0FF] to-[#0088FF] text-[#000B1A] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow hover:opacity-95 transition-all cursor-pointer"
                  >
                    <span>Confirm Address</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* ─── Widget: Order Flow - Step 2: Payment Method ─── */}
              {msg.widgetType === 'order_payment' && (
                <div className="order-payment-box w-full p-4 rounded-xl bg-[#041a38]/90 border border-[#3DE0FF]/30 shadow-xl space-y-3">
                  <div className="payment-options-grid space-y-2">
                    {[
                      { id: 'cod', name: 'Cash on Delivery (Default)', details: 'Pay upon arrival / Settle online', badge: 'Recommended' },
                      { id: 'card', name: 'Credit / Debit Card', details: '•••• 4242 (Visa / MC)', badge: 'Instant' },
                      { id: 'apple_pay', name: 'Apple Pay / Google Pay', details: '1-Touch Biometric', badge: 'Instant' },
                      { id: 'klarna', name: 'Klarna Pay Later', details: 'Pay in 30 Days', badge: '0% APR' },
                    ].map((m) => {
                      const isSelected = selectedPayId === m.id;
                      return (
                        <label
                          key={m.id}
                          onClick={() => setSelectedPayId(m.id)}
                          className={`payment-option-card flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#021838] border-[#F13365] shadow-[0_0_12px_rgba(241,51,101,0.2)]'
                              : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 text-xs text-white">
                            <input
                              type="radio"
                              name="drawer_order_payment"
                              value={m.id}
                              checked={isSelected}
                              onChange={() => setSelectedPayId(m.id)}
                              className="accent-[#F13365]"
                            />
                            <div>
                              <span className="font-semibold">{m.name}</span>
                              <span className="text-[11px] text-white/50 block">{m.details}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-[#F13365]/20 text-[#F13365]' : 'bg-white/10 text-white/60'
                          }`}>
                            {m.badge}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      let methodText = 'Cash on Delivery';
                      if (selectedPayId === 'apple_pay') methodText = 'Apple Pay';
                      else if (selectedPayId === 'card') methodText = 'Credit Card';
                      else if (selectedPayId === 'klarna') methodText = 'Klarna Pay Later';
                      sendMessage(`Pay with ${methodText}`);
                    }}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#F13365] to-[#E60C45] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all cursor-pointer"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* ─── Widget: Order Flow - Step 3: Review ─── */}
              {msg.widgetType === 'order_review' && msg.widgetPayload && (
                <div className="order-summary-box w-full p-4 sm:p-5 rounded-2xl bg-[#041a38]/90 border border-[#3DE0FF]/30 shadow-xl space-y-3">
                  <div className="space-y-2 pb-3 border-b border-white/10 text-xs">
                    {(msg.widgetPayload.items || []).map((it: any, iIdx: number) => (
                      <div key={iIdx} className="flex justify-between items-center text-white">
                        <span>{it.title || it.name} {it.size ? `(${it.size})` : ''}</span>
                        <span className="font-mono tabular-nums">€ {Number(it.price || 185).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-emerald-400">
                      <span>Express Courier Dispatch</span>
                      <span className="font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-[#F13365]">
                      <span>Promo Code ({msg.widgetPayload.discountCode || 'WELCOME10'})</span>
                      <span className="font-bold font-mono tabular-nums">-€ {Number(msg.widgetPayload.discountAmount || 31).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold pt-1">
                    <span className="text-white uppercase tracking-wider">TOTAL DUE</span>
                    <span className="text-[#3DE0FF] text-base font-mono tabular-nums">
                      € {Number(msg.widgetPayload.totalDue || 279).toFixed(2)}
                    </span>
                  </div>

                  <div className="text-[11px] text-white/60 space-y-1 bg-white/[0.03] p-2.5 rounded-lg">
                    <div>📍 Shipping to {msg.widgetPayload.address || orderAddress.formatted}</div>
                    <div>💳 Paid via {msg.widgetPayload.paymentMethod || 'Cash on Delivery (Pay on Arrival)'}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => sendMessage('Authorize & place order now')}
                    className="btn-authorize-order w-full py-3 rounded-xl bg-gradient-to-r from-[#F13365] to-[#E60C45] hover:opacity-95 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Shield size={14} />
                    <span>AUTHORIZE &amp; PLACE ORDER NOW</span>
                  </button>
                </div>
              )}

              {/* ─── Widget: Order Flow - Step 4: Order Confirmed ─── */}
              {msg.widgetType === 'order_confirmed' && msg.widgetPayload && (
                <div className="order-confirmed-box w-full space-y-3">
                  {/* Banner */}
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-white">
                        Order <span className="text-[#3DE0FF] font-mono">{msg.widgetPayload.orderCode}</span> Placed!
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider mt-1.5">
                        <span>💵 Cash on Delivery (Pay on Arrival)</span>
                      </div>
                      <div className="text-xs text-white/70 mt-1.5">
                        Total Due: <strong className="text-white">€ {Number(msg.widgetPayload.totalDue || 279).toFixed(2)}</strong>. Pay cash to courier upon arrival, or switch to Apple Pay / Card online now.
                      </div>
                    </div>
                  </div>

                  {/* Logistics Telemetry Live Stepper */}
                  <div className="p-4 rounded-xl bg-[#021838]/85 border border-white/10 space-y-3">
                    <div className="text-[10.5px] font-bold text-white/60 uppercase tracking-wider">
                      Logistics Telemetry
                    </div>
                    <div className="space-y-2.5">
                      {(msg.widgetPayload.trackingSteps || [
                        { label: 'Order Received & Encrypted (COD)', time: 'Just now · Verified', done: true },
                        { label: 'Quality Inspection in Munich Hub', time: 'In Progress · Expected 23:00', active: true },
                        { label: 'Out for Express Courier Dispatch', time: 'Tomorrow, 09:30', pending: true },
                      ]).map((st: any, sIdx: number) => (
                        <div key={sIdx} className="flex items-start gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                              st.done ? 'bg-emerald-400' : st.active ? 'bg-[#3DE0FF] animate-pulse' : 'bg-white/20'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{st.label}</div>
                            <div className="text-[10.5px] text-white/50">{st.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link
                      href={`/tracking?order=${encodeURIComponent(msg.widgetPayload.orderCode)}&pay=online`}
                      onClick={closeConcierge}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#3DE0FF] to-[#0088FF] text-[#000B1A] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow transition-all hover:opacity-95"
                    >
                      <CreditCard size={14} />
                      <span>PAY ONLINE NOW (Apple Pay / Card →)</span>
                    </Link>
                    <Link
                      href={`/tracking?order=${encodeURIComponent(msg.widgetPayload.orderCode)}`}
                      onClick={closeConcierge}
                      className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all text-center"
                    >
                      <span>Track Courier &amp; View Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* ─── Widget: Multi-Piece Look Bundle ("Complete the Look") ─── */}
              {msg.widgetType === 'bundle_look' && msg.bundle && (
                <div className="concierge-look-bundle w-full p-4 sm:p-5 rounded-2xl bg-[#041a38]/90 border border-[#3DE0FF]/30 shadow-xl space-y-4">
                  <div className="bundle-header flex justify-between items-center pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F13365] uppercase tracking-wider">
                      <Sparkles size={14} className="text-[#F13365]" />
                      <span>COMPLETE THE LOOK</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      10% LOOK BUNDLE PERK
                    </span>
                  </div>

                  {/* Bundle Item Checkboxes */}
                  <div className="bundle-items space-y-2.5">
                    {msg.bundle.products.map((item) => {
                      const isChecked = selectedBundleItems[item.id] !== false;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleBundleItem(item.id)}
                          className={`bundle-item flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#021838] border-[#3DE0FF]/30 shadow-sm'
                              : 'bg-white/[0.02] border-white/5 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? 'bg-[#F13365] border-[#F13365] text-white'
                                  : 'border-white/30 text-transparent'
                              }`}
                            >
                              <Check size={13} strokeWidth={3} />
                            </div>
                            <div className="w-11 h-11 rounded-md overflow-hidden bg-white/5 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[9.5px] uppercase tracking-wider text-[#3DE0FF] font-medium">
                                {item.category || 'Apparel'}
                              </div>
                              <div className="text-xs font-semibold text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-xs font-mono text-white/80 tabular-nums">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bundle Footer & Add Button */}
                  <div className="bundle-footer pt-3 border-t border-white/10 space-y-3">
                    <div className="bundle-total-row flex items-center justify-between text-xs">
                      <span className="text-white/70">Outfit Subtotal:</span>
                      <div className="text-right">
                        <strong className="bundle-total-val text-sm font-mono font-bold text-white tabular-nums">
                          € {(() => {
                            const activeProds = msg.bundle.products.filter(
                              (p) => selectedBundleItems[p.id] !== false
                            );
                            const total = activeProds.reduce((sum, p) => sum + p.price, 0);
                            return total.toFixed(2);
                          })()}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSelectedBundleToBag(msg.bundle!.products)}
                      disabled={
                        msg.bundle.products.filter((p) => selectedBundleItems[p.id] !== false).length === 0
                      }
                      className={`bundle-add-btn w-full py-3 rounded-xl text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 ${
                        bundleAdded
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-[#F13365] to-[#E60C45] hover:opacity-95'
                      }`}
                    >
                      {bundleAdded ? (
                        <>
                          <Check size={14} />
                          <span>ADDED SELECTED ITEMS TO BAG</span>
                        </>
                      ) : (
                        <span>
                          ADD SELECTED ITEMS TO BAG (
                          {
                            msg.bundle.products.filter(
                              (p) => selectedBundleItems[p.id] !== false
                            ).length
                          }{' '}
                          ITEMS)
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Widget: Interactive Sizing & Fit Advisor ─── */}
              {msg.widgetType === 'sizing_advisor' && (
                <div className="concierge-size-advisor sizing-advisor-widget w-full p-4 sm:p-5 rounded-2xl bg-[#041a38]/90 border border-[#3DE0FF]/30 shadow-xl space-y-4">
                  <div className="size-advisor-section space-y-2">
                    <div className="size-advisor-label text-[10.5px] font-bold text-white/60 uppercase tracking-wider">
                      1. Item Category
                    </div>
                    <div className="size-pills-row flex flex-wrap gap-2">
                      {['Tops & Sweaters', 'Jackets & Tailoring', 'Shoes & Trainers'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSizeCategory(cat)}
                          className={`size-pill px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-[#F13365] border-[#F13365] text-white shadow-md'
                              : 'bg-white/[0.04] border-white/15 text-white/80 hover:border-white/30'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="size-advisor-section space-y-2">
                    <div className="size-advisor-label text-[10.5px] font-bold text-white/60 uppercase tracking-wider">
                      2. Size / Chest Measurement
                    </div>
                    <div className="size-pills-row flex flex-wrap gap-2">
                      {(selectedCategory.includes('Shoe') || selectedCategory.includes('Trainer')
                        ? ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
                        : ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")']
                      ).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSizeMeasurement(sz)}
                          className={`size-pill px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-[#F13365] border-[#F13365] text-white shadow-md'
                              : 'bg-white/[0.04] border-white/15 text-white/80 hover:border-white/30'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="size-advisor-section space-y-2">
                    <div className="size-advisor-label text-[10.5px] font-bold text-white/60 uppercase tracking-wider">
                      3. Desired Fit
                    </div>
                    <div className="size-pills-row flex flex-wrap gap-2">
                      {['True to size (Regular fit)', 'Size up (Relaxed fit for layering)'].map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => setSizeFit(fit)}
                          className={`size-pill px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            selectedFit === fit
                              ? 'bg-[#F13365] border-[#F13365] text-white shadow-md'
                              : 'bg-white/[0.04] border-white/15 text-white/80 hover:border-white/30'
                          }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated Recommendation Box */}
                  <div className="size-advisor-result p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                    {(() => {
                      const res = calculateSize();
                      return (
                        <>
                          <div className="size-result-badge flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <Check size={14} strokeWidth={3} />
                            <span>
                              Recommended Size: {res.recommendedSize} · {res.confidence}% Match
                            </span>
                          </div>
                          <div className="size-result-note text-[11px] text-white/70">{res.note}</div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ─── Widget: Order Tracking Stepper ─── */}
              {msg.widgetType === 'order_tracking' && msg.widgetPayload && (
                <div className="concierge-tracker-stepper w-full p-4 sm:p-5 rounded-2xl bg-[#041a38]/90 border border-[#3DE0FF]/30 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                      <Truck size={16} className="text-[#3DE0FF]" />
                      <span>{msg.widgetPayload.orderCode}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      In Transit
                    </span>
                  </div>

                  <div className="space-y-3">
                    {msg.widgetPayload.steps.map((st: any, idx: number) => {
                      const isComplete = idx <= (msg.widgetPayload.currentStep || 2);
                      return (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isComplete ? 'bg-emerald-400 text-[#001229]' : 'bg-white/10 text-white/40'
                            }`}
                          >
                            {isComplete ? <Check size={11} strokeWidth={3} /> : idx + 1}
                          </div>
                          <div>
                            <div className={`font-bold ${isComplete ? 'text-white' : 'text-white/50'}`}>
                              {st.label}
                            </div>
                            <div className="text-[11px] text-white/60">{st.date}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {msg.actionLink && (
                    <Link
                      href={msg.actionLink.url}
                      onClick={closeConcierge}
                      className="block text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white uppercase tracking-wider transition-all"
                    >
                      {msg.actionLink.text}
                    </Link>
                  )}
                </div>
              )}

              {/* ─── In-Stream Product Grid (When message includes products and not a specialized full-screen widget) ─── */}
              {msg.products &&
                msg.products.length > 0 &&
                !['bundle_look', 'order_review', 'order_confirmed', 'order_address', 'order_payment', 'order_auth_required'].includes(
                  msg.widgetType || ''
                ) && (
                  <div className="concierge-product-grid grid grid-cols-2 gap-3 w-full" data-lenis-prevent>
                    {msg.products.map((p) => {
                      const isAdded = !!addedItemIds[p.id];
                      return (
                        <div
                          key={p.id}
                          className="concierge-product-card bg-[#021838]/80 border border-white/10 hover:border-[#F13365]/50 rounded-lg overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 shadow group"
                        >
                          <Link
                            href={`/product/${p.id}`}
                            onClick={closeConcierge}
                            className="concierge-card-img-link block w-full h-[140px] overflow-hidden bg-white/[0.02]"
                            title={`View details for ${p.name}`}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <div className="concierge-card-body p-3 flex flex-col gap-1 flex-1">
                            <div className="concierge-card-cat text-[9.5px] uppercase tracking-wider text-white/50 font-medium">
                              {p.category || 'Apparel'}
                            </div>
                            <Link
                              href={`/product/${p.id}`}
                              onClick={closeConcierge}
                              className="concierge-card-title text-xs font-medium text-white truncate hover:text-[#F13365] transition-colors"
                            >
                              {p.name}
                            </Link>
                            <div className="concierge-card-price text-xs font-semibold text-white tabular-nums mb-1">
                              {formatPrice(p.price)}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddProductToBag(p)}
                              className={`concierge-add-btn mt-auto w-full py-2 rounded border text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                  : 'bg-white/[0.08] hover:bg-[#F13365] border-white/10 hover:border-[#F13365] text-white'
                              }`}
                            >
                              {isAdded ? 'ADDED' : 'ADD TO BAG'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#041a38]/80 border border-white/10 text-xs text-white/80 w-fit">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-bounce delay-300" />
              </div>
              <span>Stylist is curating look...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── Input Area (Suggested Chips + Pill Form) ─── */}
        <div className="concierge-input-area border-t border-white/[0.08] bg-[#012148]/95 backdrop-blur-md p-4 space-y-3 shrink-0">
          {/* Actionable Chips (strictly 2 options, balanced and un-scrolled) */}
          <div
            id="conciergeChips"
            className="concierge-chips-container grid grid-cols-2 gap-2 pb-0.5 w-full"
          >
            {activeChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                title={chip}
                className="concierge-chip px-2.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#3DE0FF]/50 text-[11px] sm:text-xs text-white/90 hover:text-white font-medium text-center truncate transition-all cursor-pointer font-sans shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            id="conciergeForm"
            onSubmit={handleSubmit}
            className="concierge-input-bar relative flex items-center bg-white/[0.05] border border-white/15 focus-within:border-[#3DE0FF]/70 rounded-full px-4 py-1.5 transition-all shadow-inner"
          >
            {/* Animated 6-bar Listening Waveform */}
            {isListening && (
              <div
                id="conciergeListeningWave"
                className="listening-waveform absolute inset-0 z-10 bg-[#012148] rounded-full flex items-center justify-between px-4 border border-[#F13365]/60 animate-in fade-in duration-200"
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
                  className="voice-cancel-btn text-white/70 hover:text-white text-xs font-semibold px-2.5 py-0.5 rounded bg-white/15 cursor-pointer"
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
              className={`p-2 transition-colors cursor-pointer flex items-center justify-center rounded-full hover:bg-white/10 ${
                isListening ? 'text-[#F13365] animate-pulse' : 'text-white/50 hover:text-white'
              }`}
              aria-label="Tap to speak"
              title="Tap to speak with Stylist"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="concierge-send-btn p-2 text-white hover:text-[#3DE0FF] disabled:text-white/20 transition-colors cursor-pointer flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Send message"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
