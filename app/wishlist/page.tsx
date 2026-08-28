'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Share2,
  CheckSquare,
  Eye,
  X,
  Check,
  Heart,
  ArrowRight,
  Filter,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';

/* ── Category filter tabs ── */
const CAPSULE_TABS = [
  {
    key: 'all',
    label: 'All Saved',
    eyebrow: 'YOUR WISHLIST',
    title: 'Everything You\'ve Saved',
    desc: 'All the items you\'ve saved — clothing, headphones, footwear and more.',
    flavorTag: 'All Items',
  },
  {
    key: 'apparel',
    label: 'Clothing',
    eyebrow: 'SAVED CLOTHING',
    title: 'Saved Clothing',
    desc: 'Jackets, coats, knitwear and other clothing you\'ve saved.',
    flavorTag: 'Clothing',
  },
  {
    key: 'acoustics',
    label: 'Headphones',
    eyebrow: 'SAVED AUDIO',
    title: 'Saved Headphones & Audio',
    desc: 'Headphones and audio gear you\'ve saved.',
    flavorTag: 'Audio',
  },
  {
    key: 'footwear',
    label: 'Footwear',
    eyebrow: 'SAVED FOOTWEAR',
    title: 'Saved Shoes & Boots',
    desc: 'Shoes, boots and other footwear you\'ve saved.',
    flavorTag: 'Footwear',
  },
];

function toCapsuleKey(category: string): string {
  const c = (category || '').toLowerCase();
  if (c === 'acoustics' || c === 'audio') return 'acoustics';
  if (c === 'footwear' || c === 'shoes' || c === 'boots') return 'footwear';
  return 'apparel';
}

/* ─────────────────────────────────────── */
/* WishlistCard                           */
/* ─────────────────────────────────────── */
interface WishlistCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenQuickLook: (product: Product) => void;
  onAddToBag: (product: Product) => void;
}

function WishlistCard({ product, isSelected, onToggleSelect, onRemove, onOpenQuickLook, onAddToBag }: WishlistCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const tiltRef = useRef({ curX: 0, curY: 0, tgtX: 0, tgtY: 0 });
  const [addedToBag, setAddedToBag] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      const t = tiltRef.current;
      t.curX = lerp(t.curX, t.tgtX, 0.12);
      t.curY = lerp(t.curY, t.tgtY, 0.12);
      card!.style.transform = `perspective(1000px) rotateX(${t.curX.toFixed(2)}deg) rotateY(${t.curY.toFixed(2)}deg)`;
      if (Math.abs(t.curX - t.tgtX) > 0.05 || Math.abs(t.curY - t.tgtY) > 0.05) {
        rafRef.current = requestAnimationFrame(applyTilt);
      } else { rafRef.current = null; }
    }

    function springBack() {
      const t = tiltRef.current;
      t.curX = lerp(t.curX, 0, 0.18);
      t.curY = lerp(t.curY, 0, 0.18);
      card!.style.transform = `perspective(1000px) rotateX(${t.curX.toFixed(2)}deg) rotateY(${t.curY.toFixed(2)}deg)`;
      if (Math.abs(t.curX) > 0.05 || Math.abs(t.curY) > 0.05) {
        rafRef.current = requestAnimationFrame(springBack);
      } else { card!.style.transform = ''; rafRef.current = null; }
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = card!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      tiltRef.current.tgtX = ((y - r.height / 2) / (r.height / 2)) * -4.5;
      tiltRef.current.tgtY = ((x - r.width / 2) / (r.width / 2)) * 4.5;
      if (specularRef.current) {
        specularRef.current.style.opacity = '1';
        specularRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 65%)`;
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(applyTilt);
    };

    const onMouseLeave = () => {
      tiltRef.current.tgtX = 0; tiltRef.current.tgtY = 0;
      if (specularRef.current) specularRef.current.style.opacity = '0';
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(springBack);
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    onAddToBag(product);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 1500);
  };

  const colors = product.colors || [];
  const inStock = product.inStock !== false;

  return (
    <div
      ref={cardRef}
      id={`wishCard_${product.id}`}
      className={`wishlist-card${isSelected ? ' selected' : ''}`}
      style={{
        borderRadius: 14, overflow: 'hidden',
        background: 'rgba(8,14,30,0.85)',
        border: `1px solid ${isSelected ? '#3DE0FF' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', flexDirection: 'column',
        position: 'relative', transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 0 24px rgba(61,224,255,0.25), 0 20px 50px rgba(0,0,0,0.6)' : undefined,
      }}
    >
      <div ref={specularRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s', borderRadius: 14 }} />

      {/* Select Ring */}
      <button type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect(product.id); }}
        role="checkbox" aria-checked={isSelected}
        aria-label={`Select ${product.name}`}
        style={{
          position: 'absolute', top: 12, left: 12,
          width: 26, height: 26, borderRadius: '50%',
          background: isSelected ? '#3DE0FF' : 'rgba(0,0,0,0.55)',
          border: `1.5px solid ${isSelected ? '#3DE0FF' : 'rgba(255,255,255,0.3)'}`,
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 4,
          color: isSelected ? '#000B1A' : 'transparent',
          transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      ><Check size={13} strokeWidth={3} /></button>

      {/* Quick-Look + Remove cluster */}
      <div className="card-top-actions" style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
        <button type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenQuickLook(product); }}
          className="card-action-btn card-quicklook-btn"
          aria-label={`Quick look for ${product.name}`} title="Quick Look"
          style={{ position: 'relative', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0, flexShrink: 0 }}
        ><Eye size={14} /></button>
        <button type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(product.id); }}
          className="card-action-btn wishlist-remove-btn"
          aria-label={`Remove ${product.name}`} title="Remove"
          style={{ position: 'relative', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0, flexShrink: 0 }}
        ><X size={14} /></button>
      </div>

      {/* Media */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', overflow: 'hidden', background: 'radial-gradient(circle at 50% 45%, #0D1933 0%, #020612 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
        <Link href={`/product/${product.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <img src={product.image} alt={product.name} loading="lazy" className="wishlist-card-img"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)', display: 'block', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
        </Link>
        <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
          {colors.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {colors.slice(0, 5).map((c) => (
                <span key={c.name} title={c.name} style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', display: 'inline-block' }} />
              ))}
            </div>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', padding: '3px 7px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,0.8)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: inStock ? '#34D399' : '#FBBF24', boxShadow: `0 0 6px ${inStock ? '#34D399' : '#FBBF24'}`, display: 'inline-block' }} />
            <span>{inStock ? 'Available' : 'Low Stock'}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px 16px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          {product.brand || 'Brand'}
        </span>
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.25, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>€ {product.price.toFixed(2)}</span>
          <button type="button" onClick={handleAddToBag}
            style={{ height: 30, padding: '0 12px', background: addedToBag ? '#34D399' : 'rgba(61,224,255,0.1)', border: `1px solid ${addedToBag ? '#34D399' : 'rgba(61,224,255,0.3)'}`, borderRadius: 6, color: addedToBag ? '#000000' : '#3DE0FF', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.18s', display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 44, minHeight: 32 }}
          ><ShoppingBag size={11} /><span>{addedToBag ? '✓' : 'ADD'}</span></button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── */
/* QuickLookDrawer                        */
/* ─────────────────────────────────────── */
function QuickLookDrawer({ product, onClose, onAddToBag }: { product: Product | null; onClose: () => void; onAddToBag: (p: Product, size?: string, color?: string) => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [selSize, setSelSize] = useState<string | undefined>();
  const [selColor, setSelColor] = useState<string | undefined>();
  const isOpen = !!product;

  useEffect(() => {
    setActiveImg(0);
    setAdded(false);
    setSelSize(product?.sizes?.[0]);
    setSelColor(product?.colors?.[0]?.name);
  }, [product]);

  useEffect(() => {
    const hk = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', hk);
      document.body.style.overflow = 'hidden';
      // @ts-ignore
      if (typeof window !== 'undefined' && window._nexLenis?.stop) window._nexLenis.stop();
    }
    return () => {
      document.removeEventListener('keydown', hk);
      document.body.style.overflow = '';
      // @ts-ignore
      if (typeof window !== 'undefined' && window._nexLenis?.start) window._nexLenis.start();
    };
  }, [isOpen, onClose]);

  if (!product) return null;
  const gallery = product.gallery?.length ? product.gallery : [product.image];

  return (
    <>
      <div onClick={onClose} aria-hidden="true" data-lenis-prevent style={{ position: 'fixed', inset: 0, background: 'rgba(0,4,12,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 200, opacity: 1, transition: 'opacity 0.3s' }} />
      <aside role="dialog" aria-modal="true" aria-label="Quick Look" data-lenis-prevent
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, maxWidth: '100vw', background: '#080E1E', borderLeft: '1px solid rgba(255,255,255,0.12)', zIndex: 201, transform: 'translateX(0)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '-20px 0 60px rgba(0,0,0,0.8)' }}
      >
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3DE0FF' }}>QUICK VIEW</span>
          <button onClick={onClose} aria-label="Close dialog" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        </div>

        <div data-lenis-prevent style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ width: '100%', height: 280, borderRadius: 14, overflow: 'hidden', background: 'radial-gradient(circle at 50% 45%, #0F1D38 0%, #030713 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, flexShrink: 0 }}>
            <img src={gallery[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', maxHeight: 248, objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.65))', display: 'block', transition: 'all 0.3s' }} />
          </div>

          {gallery.length > 1 && (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: 60, height: 60, borderRadius: 10, background: '#040916', border: `1.5px solid ${i === activeImg ? '#3DE0FF' : 'rgba(255,255,255,0.12)'}`, cursor: 'pointer', opacity: i === activeImg ? 1 : 0.65, flexShrink: 0, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: i === activeImg ? 'translateY(-2px)' : 'none', boxShadow: i === activeImg ? '0 0 12px rgba(61,224,255,0.4)' : 'none', transition: 'all 0.2s' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}

          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3DE0FF', display: 'block', marginBottom: 4 }}>{product.brand || 'Brand'}</span>
            <h2 style={{ fontFamily: 'Manrope', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{product.name}</h2>
            <div style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>€ {product.price.toFixed(2)}</div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Select Size</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelSize(s)} style={{ height: 34, minWidth: 44, padding: '0 12px', borderRadius: 6, background: s === selSize ? '#3DE0FF' : 'rgba(255,255,255,0.06)', border: `1px solid ${s === selSize ? '#3DE0FF' : 'rgba(255,255,255,0.15)'}`, color: s === selSize ? '#000B1A' : '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Colour</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.colors.map((c) => {
                  const isCurColor = c.name === selColor;
                  return (
                    <button key={c.name} onClick={() => setSelColor(c.name)} style={{ height: 32, padding: '0 12px', borderRadius: 9999, background: isCurColor ? 'rgba(61,224,255,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isCurColor ? '#3DE0FF' : 'rgba(255,255,255,0.15)'}`, color: isCurColor ? '#3DE0FF' : '#fff', fontSize: 11, fontWeight: isCurColor ? 700 : 500, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.15s' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.hex, display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)' }} />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { onAddToBag(product, selSize, selColor); setAdded(true); setTimeout(onClose, 800); }}
            style={{ flex: 1, height: 46, borderRadius: 9999, background: added ? '#34D399' : 'linear-gradient(135deg,#3DE0FF 0%,#38BDF8 100%)', border: 'none', color: added ? '#000' : '#000B1A', fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
            <ShoppingBag size={14} />
            <span>{added ? '✓ ADDED TO BAG' : `ADD TO BAG · € ${product.price.toFixed(2)}`}</span>
          </button>
          <Link href={`/product/${product.id}`} style={{ height: 46, padding: '0 16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }} title="View Full Page">
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────────────── */
/* Main Page                             */
/* ─────────────────────────────────────── */
export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [quickLookProduct, setQuickLookProduct] = useState<Product | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const { savedItems, toggleWishlist, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => { setMounted(true); }, []);

  const totalValue = savedItems.reduce((s, i) => s + i.price, 0);
  const activeCapsule = CAPSULE_TABS.find((c) => c.key === activeFilter) || CAPSULE_TABS[0];
  const filteredItems = activeFilter === 'all' ? savedItems : savedItems.filter((i) => toCapsuleKey(i.category) === activeFilter);
  const capsuleCounts: Record<string, number> = {};
  CAPSULE_TABS.forEach((t) => {
    capsuleCounts[t.key] = t.key === 'all' ? savedItems.length : savedItems.filter((i) => toCapsuleKey(i.category) === t.key).length;
  });
  const capsuleValue = filteredItems.reduce((s, i) => s + i.price, 0);
  const selectedCount = selectedIds.size;
  const selectedValue = Array.from(selectedIds).reduce((s, id) => s + (savedItems.find((i) => i.id === id)?.price || 0), 0);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds((p) => p.size === savedItems.length ? new Set() : new Set(savedItems.map((i) => i.id)));
  }, [savedItems]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleAddToBag = useCallback((product: Product, size?: string, color?: string) => {
    addItem(product, size || product.sizes?.[0], color || product.colors?.[0]?.name);
  }, [addItem]);

  const handleRemove = useCallback((id: string) => {
    const p = savedItems.find((i) => i.id === id);
    if (p) toggleWishlist(p);
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }, [savedItems, toggleWishlist]);

  const handleMoveAllToBag = useCallback(() => {
    filteredItems.forEach((p) => addItem(p, p.sizes?.[0], p.colors?.[0]?.name));
  }, [filteredItems, addItem]);

  const handleMoveSelectedToBag = useCallback(() => {
    selectedIds.forEach((id) => { const p = savedItems.find((i) => i.id === id); if (p) addItem(p, p.sizes?.[0], p.colors?.[0]?.name); });
    clearSelection();
  }, [selectedIds, savedItems, addItem, clearSelection]);

  const handleRemoveSelected = useCallback(() => {
    selectedIds.forEach((id) => { const p = savedItems.find((i) => i.id === id); if (p) toggleWishlist(p); });
    clearSelection();
  }, [selectedIds, savedItems, toggleWishlist, clearSelection]);

  const handleShare = useCallback(async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
    setShareToast(true);
    setTimeout(() => setShareToast(false), 1800);
  }, []);

  if (!mounted) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #3DE0FF', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <>
      <style>{`
        .wishlist-card:hover .wishlist-card-img { transform: scale(1.06); }
        .card-action-btn { opacity: 0; transform: scale(0.85); transition: background-color 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.2s cubic-bezier(0.16,1,0.3,1), color 0.2s cubic-bezier(0.16,1,0.3,1), transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s cubic-bezier(0.16,1,0.3,1), opacity 0.2s cubic-bezier(0.16,1,0.3,1); }
        .wishlist-card:hover .card-action-btn { opacity: 1; transform: scale(1); }
        @media (max-width: 768px) { .card-action-btn { opacity: 1; transform: scale(1); } }
        .card-quicklook-btn:hover { background: rgba(61,224,255,0.25) !important; border-color: #3DE0FF !important; color: #3DE0FF !important; transform: scale(1.08) !important; }
        .wishlist-remove-btn:hover { background: rgba(251,113,133,0.25) !important; border-color: #FB7185 !important; color: #FB7185 !important; transform: scale(1.08) !important; }
        .wishlist-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; align-items: stretch; margin-bottom: 60px; }
        @media (max-width: 1200px) { .wishlist-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media (max-width: 900px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
        @media (max-width: 560px) { .wishlist-grid { grid-template-columns: 1fr; gap: 14px; } }
        .plp-spotlight-bar { background: rgba(8,14,30,0.6); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px 28px; margin-bottom: 24px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); animation: spotlightFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes spotlightFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .spotlight-body-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .plp-spotlight-title { font-family: Manrope, sans-serif; font-size: clamp(18px,2vw,24px); font-weight: 700; color: #FFF; margin: 0 0 4px; }
        .plp-spotlight-desc { font-family: Inter, sans-serif; font-size: 13px; color: rgba(255,255,255,0.55); margin: 0; }
        .plp-spotlight-tags { display: flex; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
        .plp-spotlight-tag { font-family: Inter; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; background: rgba(61,224,255,0.1); border: 1px solid rgba(61,224,255,0.25); color: #3DE0FF; white-space: nowrap; }
        .spotlight-tab-btn { position: relative; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 9999px; font-family: Inter; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); transition: all 0.2s cubic-bezier(0.16,1,0.3,1); white-space: nowrap; }
        .spotlight-tab-btn.active { background: rgba(61,224,255,0.12); border-color: rgba(61,224,255,0.4); color: #3DE0FF; }
        .spotlight-tab-btn:hover:not(.active) { background: rgba(255,255,255,0.08); color: #FFF; }
        .tab-count-badge { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: rgba(61,224,255,0.15); color: #3DE0FF; font-size: 9px; font-weight: 700; }
        .spotlight-tab-btn.active .tab-count-badge { background: #3DE0FF; color: #000B1A; }
        .btn-secondary-action { height: 42px; padding: 0 16px; display: inline-flex; align-items: center; gap: 6px; border-radius: 9999px; font-family: Inter; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: rgba(255,255,255,0.75); cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .btn-secondary-action:hover { background: rgba(255,255,255,0.12); color: #FFF; }
        .btn-primary-commerce { height: 42px; padding: 0 20px; display: inline-flex; align-items: center; gap: 6px; border-radius: 9999px; font-family: Inter; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: #FFF; border: none; color: #030814; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .btn-primary-commerce:hover { background: #3DE0FF; transform: scale(1.02); }
        .wishlist-batch-dock { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(120px); z-index: 100; background: rgba(8,14,30,0.94); border: 1px solid rgba(255,255,255,0.14); border-radius: 9999px; padding: 8px 12px 8px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.7),0 0 30px rgba(61,224,255,0.15); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease; opacity: 0; pointer-events: none; max-width: 92vw; }
        .wishlist-batch-dock.active { transform: translateX(-50%) translateY(0); opacity: 1; pointer-events: auto; }
        @media (max-width: 640px) { .wishlist-batch-dock { bottom: 0; left: 0; right: 0; transform: translateY(100%); border-radius: 16px 16px 0 0; width: 100%; max-width: 100%; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); justify-content: space-between; } .wishlist-batch-dock.active { transform: translateY(0); } }
        .batch-dock-stat { font-family: Manrope; font-size: 13px; font-weight: 700; color: #FFF; white-space: nowrap; }
        .batch-dock-btn-primary { height: 38px; padding: 0 18px; border-radius: 9999px; background: #FFF; border: none; color: #030814; font-family: Inter; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.18s; white-space: nowrap; }
        .batch-dock-btn-primary:hover { background: #3DE0FF; transform: scale(1.02); }
        .batch-dock-btn-remove { height: 38px; padding: 0 14px; border-radius: 9999px; background: rgba(251,113,133,0.12); border: 1px solid rgba(251,113,133,0.35); color: #FB7185; font-family: Inter; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.18s; white-space: nowrap; }
        .batch-dock-btn-remove:hover { background: #FB7185; color: #000; }
        .batch-dock-icon-btn { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.75); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; }
        .batch-dock-icon-btn:hover { background: rgba(255,255,255,0.15); color: #FFF; }
        .vault-hero-strip { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding: 48px 0 32px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 32px; flex-wrap: wrap; }
        .vault-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; box-shadow: 0 0 8px #34D399; animation: live-pulse 2s ease-in-out infinite; }
        @keyframes live-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .profile-concierge-card { display: flex; align-items: center; justify-content: space-between; gap: 20px; background: rgba(8,14,30,0.7); border: 1px solid rgba(61,224,255,0.15); border-radius: 16px; padding: 24px 28px; margin-top: 40px; margin-bottom: 60px; flex-wrap: wrap; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .wishlist-empty-state { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .wishlist-filter-empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 32px; font-family: Inter; font-size: 13px; color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; margin-bottom: 40px; }
        .share-toast { position: fixed; top: 80px; right: 24px; z-index: 300; background: rgba(8,14,30,0.95); border: 1px solid rgba(61,224,255,0.3); border-radius: 12px; padding: 12px 20px; font-family: Inter; font-size: 13px; font-weight: 600; color: #3DE0FF; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: toastSlideIn 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ minHeight: '100vh', paddingBottom: 96 }}>

        {/* Vault Hero Strip */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="vault-hero-strip">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3DE0FF', marginBottom: 10 }}>
                <div className="vault-live-dot" />
                <span>YOUR WISHLIST</span>
              </div>
              <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(34px, 4vw, 56px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0 }}>
                Your <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#3DE0FF', fontWeight: 400 }}>Saved</em> Items
              </h1>
            </div>
            {savedItems.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <span style={{ fontFamily: 'Manrope', fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{savedItems.length}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Items Saved</span>
                </div>
                <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <span style={{ fontFamily: 'Manrope', fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>€ {Math.round(totalValue).toLocaleString('de-DE')}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Total Value</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main */}
        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

          {savedItems.length > 0 && (
            <>
              {/* Spotlight Bar */}
              <div className="plp-spotlight-bar">
                <div className="spotlight-body-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3DE0FF', marginBottom: 4 }}>{activeCapsule.eyebrow}</div>
                    <h2 className="plp-spotlight-title">{activeCapsule.title}</h2>
                    <p className="plp-spotlight-desc">{activeCapsule.desc}</p>
                  </div>
                  <div className="plp-spotlight-tags">
                    <span className="plp-spotlight-tag">{filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Saved</span>
                    <span className="plp-spotlight-tag" style={{ fontVariantNumeric: 'tabular-nums' }}>€ {capsuleValue.toFixed(2)}</span>
                    <span className="plp-spotlight-tag">{activeCapsule.flavorTag}</span>
                  </div>
                </div>
              </div>

              {/* Stats & Action Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>SAVED ITEMS</span>
                    <div style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: '#fff' }}>{savedItems.length} {savedItems.length === 1 ? 'Item' : 'Items'}</div>
                  </div>
                  <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>ESTIMATED VALUE</span>
                    <div style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>€ {totalValue.toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="button" className="btn-secondary-action" onClick={selectAll} title="Select / Deselect All"><CheckSquare size={13} /><span>SELECT ALL</span></button>
                  <button type="button" className="btn-secondary-action" onClick={handleShare}><Share2 size={13} /><span>{shareToast ? '✓ COPIED' : 'SHARE LIST'}</span></button>
                  <button type="button" className="btn-secondary-action" onClick={clearWishlist} style={{ color: '#FB7185', borderColor: 'rgba(251,113,133,0.35)' }}><Trash2 size={13} /><span>CLEAR ALL</span></button>
                  <button type="button" className="btn-primary-commerce" onClick={handleMoveAllToBag}><ShoppingBag size={13} /><span>MOVE ALL TO BAG</span></button>
                </div>
              </div>

              {/* Capsule Filter Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 28 }}>
                {CAPSULE_TABS.map((tab) => (
                  <button key={tab.key} type="button"
                    className={`spotlight-tab-btn${activeFilter === tab.key ? ' active' : ''}`}
                    aria-selected={activeFilter === tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                  >
                    {tab.label}
                    <span className="tab-count-badge">{capsuleCounts[tab.key] || 0}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Grid / Empty States */}
          {savedItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#3DE0FF' }}>
                <Heart size={28} />
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#fff', fontWeight: 400, margin: 0 }}>Your wishlist is empty.</h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: 0 }}>Browse our collections and save items you like.</p>
              <Link href="/category" style={{ height: 46, padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 9999, background: '#fff', color: '#030814', fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                <span>EXPLORE COLLECTIONS</span><ArrowRight size={14} />
              </Link>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="wishlist-filter-empty"><Filter size={15} /><span>No saved items in this category yet.</span></div>
          ) : (
            <div className="wishlist-grid">
              {filteredItems.map((product) => (
                <WishlistCard
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.has(product.id)}
                  onToggleSelect={toggleSelect}
                  onRemove={handleRemove}
                  onOpenQuickLook={setQuickLookProduct}
                  onAddToBag={handleAddToBag}
                />
              ))}
            </div>
          )}

          {/* Concierge Bridge */}
          {savedItems.length > 0 && (
            <div className="profile-concierge-card">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3DE0FF', marginBottom: 4 }}>OUTFIT IDEAS</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#fff', marginBottom: 6 }}>Get Outfit Ideas</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 520 }}>Get outfit suggestions based on the items you've saved.</p>
              </div>
              <Link href="/concierge" style={{ whiteSpace: 'nowrap', height: 44, display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, padding: '0 20px', background: 'linear-gradient(135deg, #3DE0FF 0%, #38BDF8 60%, #FB7185 100%)', color: '#000B1A', fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                <span>GET OUTFIT IDEAS</span><Sparkles size={14} />
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Floating Overlays via Portal */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <>
          {/* Floating Batch Dock */}
          <aside className={`wishlist-batch-dock${selectedCount > 0 ? ' active' : ''}`} role="region" aria-label="Batch Actions">
            <div className="batch-dock-stat">
              <span style={{ color: '#3DE0FF', marginRight: 4 }}>{selectedCount}</span>
              Selected · <span style={{ fontVariantNumeric: 'tabular-nums' }}>€ {selectedValue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" className="batch-dock-btn-primary" onClick={handleMoveSelectedToBag}><ShoppingBag size={13} /><span>MOVE TO BAG</span></button>
              <button type="button" className="batch-dock-btn-remove" onClick={handleRemoveSelected}><Trash2 size={13} /><span>REMOVE</span></button>
              <button type="button" className="batch-dock-icon-btn" onClick={clearSelection} title="Deselect All"><X size={14} /></button>
            </div>
          </aside>

          {/* Quick Look Drawer */}
          <QuickLookDrawer product={quickLookProduct} onClose={() => setQuickLookProduct(null)} onAddToBag={handleAddToBag} />

          {/* Share Toast */}
          {shareToast && <div className="share-toast">✓ Link Copied to Clipboard</div>}
        </>,
        document.body
      )}
    </>
  );
}
