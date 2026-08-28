'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  ShoppingBag,
  RotateCcw,
  Package,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useConciergeStore } from '@/store/useConciergeStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';

const STARTER_PROMPTS = [
  'Warm minimalist overcoat for Paris winter',
  'Artisanal evening dinner outfit',
  'Weekend travel leather carry',
  'Studio focus & acoustic setup',
  'Complete everyday capsule wardrobe',
];

export default function ConciergePage() {
  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isTyping, sendMessage, clearChat } = useConciergeStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
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

  return (
    <div className="min-h-screen pb-24">
      {/* Header Banner */}
      <section className="bg-obsidian-950 border-b border-white/10 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white transition-colors">
              Maison
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">Private Styling Concierge</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-accent-pink/20 to-accent-cyan/20 border border-white/15 text-xs font-semibold text-white mb-2">
                <Sparkles size={12} className="text-accent-pink" />
                <span>Dedicated 24/7 Atelier Stylist</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
                Private Styling <span className="italic">Concierge Suite</span>
              </h1>
            </div>

            <button
              onClick={clearChat}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1"
            >
              <RotateCcw size={14} />
              <span>Reset Conversation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Suite */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Conversational Stream (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-[700px] rounded-3xl bg-surface-navy/35 border border-white/10 overflow-hidden shadow-2xl">
            {/* Quick Inspiration Chips */}
            <div className="p-4 bg-obsidian-950/60 border-b border-white/10 overflow-x-auto scrollbar-none flex gap-2">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-navy/60 hover:bg-surface-navy border border-white/10 text-[11px] text-white/80 hover:text-white transition-colors"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-3`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-accent-pink text-white rounded-tr-none font-medium'
                        : 'bg-surface-navy/70 border border-white/10 text-white/90 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Bundle Display */}
                  {msg.bundle && (
                    <div className="w-full p-5 rounded-2xl bg-obsidian-900 border border-accent-pink/30 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2 text-xs text-accent-pink font-semibold">
                          <Package size={16} />
                          <span>{msg.bundle.title}</span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white">
                            {formatPrice(msg.bundle.discountedPrice)}
                          </span>
                          <span className="text-xs text-white/40 line-through ml-2">
                            {formatPrice(msg.bundle.totalPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {msg.bundle.products.map((p) => (
                          <div
                            key={p.id}
                            className="rounded-xl bg-surface-card p-2 border border-white/5 space-y-1"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-[11px] text-white font-medium truncate">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-white/50">
                              {formatPrice(p.price, p.currency)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAddBundleToBag(msg.bundle!.products)}
                        className="w-full py-3.5 rounded-xl bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-pink/20"
                      >
                        <ShoppingBag size={14} />
                        <span>Add Complete Look to Bag</span>
                      </button>
                    </div>
                  )}

                  {/* Single Products */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="w-full grid grid-cols-2 gap-3">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-surface-navy/50 border border-white/10 flex flex-col justify-between space-y-2"
                        >
                          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-surface-card">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-white/50">
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
                            className="w-full py-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <ShoppingBag size={13} />
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
                  <span>Curating pieces for you...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-obsidian-900 flex gap-2">
              <input
                type="text"
                placeholder="Ask your stylist for an outfit, occasion pairing, or sizing recommendation..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-surface-navy/70 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-pink"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-5 py-3 rounded-xl bg-accent-pink hover:bg-accent-pink/90 disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Right Column: Featured Wardrobe & Lookbook (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-surface-navy/40 border border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="font-editorial text-2xl text-white font-normal">
                  Atelier Curation Rail
                </h2>
                <span className="text-xs text-accent-cyan font-medium">Seasonal Picks</span>
              </div>

              <div className="space-y-4">
                {MASTER_PRODUCTS.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-2xl bg-surface-navy/30 border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-16 rounded-xl bg-surface-card overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-editorial text-white font-medium line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-white/50">
                          {formatPrice(product.price, product.currency)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-[11px] font-semibold transition-colors flex-shrink-0"
                    >
                      Quick Add
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/5 flex items-center gap-3 text-xs text-white/70">
                <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
                <span>
                  All stylist recommendations are confidential and computed in-browser with zero third-party profiling.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
