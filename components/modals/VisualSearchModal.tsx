'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useVisualSearchStore } from '@/store/useVisualSearchStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';

export const PRESET_LOOKS = [
  {
    id: 'knitwear',
    name: 'Cashmere Sweater',
    image: '/assets/images/products/hero_sweater.png',
    queryKey: 'coat knitwear cashmere sweater',
    category: 'apparel',
  },
  {
    id: 'footwear',
    name: 'Leather Sneakers',
    image: '/assets/images/products/prod_runner.png',
    queryKey: 'shoe running sneaker footwear',
    category: 'footwear',
  },
  {
    id: 'outerwear',
    name: 'Wool Overcoat',
    image: '/assets/images/products/plp_overcoat.png',
    queryKey: 'coat jacket wool outerwear',
    category: 'outerwear',
  },
  {
    id: 'audio',
    name: 'Headphones',
    image: '/assets/images/products/prod_headphones.png',
    queryKey: 'headphone audio sound studio',
    category: 'acoustics',
  },
  {
    id: 'accessories',
    name: 'Canvas Tote',
    image: '/assets/images/products/prod_tote.png',
    queryKey: 'bag tote canvas accessories',
    category: 'accessories',
  },
];

interface VisualSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function VisualSearchModal({ isOpen: propIsOpen, onClose: propOnClose }: VisualSearchModalProps = {}) {
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storeIsOpen = useVisualSearchStore((s) => s.isOpen);
  const storeClose = useVisualSearchStore((s) => s.closeVisualSearch);
  const storeInitialPreset = useVisualSearchStore((s) => s.activePreset);
  const storeInitialImage = useVisualSearchStore((s) => s.activeImage);
  const storeInitialLabel = useVisualSearchStore((s) => s.activeLabel);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onClose = propOnClose || storeClose;

  const { addItem } = useCartStore();

  const [activeThumb, setActiveThumb] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [results, setResults] = useState<(Product & { visualScore?: number })[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state when store updates or modal opens
  useEffect(() => {
    if (!isOpen) {
      setActiveThumb(null);
      setActiveLabel(null);
      setResults([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      if (storeInitialPreset) {
        handleSearchPreset(storeInitialPreset);
      } else if (storeInitialImage) {
        setActiveThumb(storeInitialImage);
        setActiveLabel(storeInitialLabel || 'Uploaded Photo');
        _executeCatalogMatching(storeInitialLabel || 'photo');
      } else {
        setActiveThumb(null);
        setActiveLabel(null);
        setResults([]);
      }
    }
  }, [isOpen, storeInitialPreset, storeInitialImage, storeInitialLabel]);

  // Handle Escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Stop Lenis if available
    if (typeof window !== 'undefined' && (window as any)._nexLenis?.stop) {
      (window as any)._nexLenis.stop();
    }
    document.body.classList.add('nex-modal-open');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('nex-modal-open');
      if (typeof window !== 'undefined' && (window as any)._nexLenis?.start) {
        (window as any)._nexLenis.start();
      }
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const handleSearchPreset = (presetKey: string) => {
    const preset = PRESET_LOOKS.find((p) => p.id === presetKey) || PRESET_LOOKS[0];
    setActiveThumb(preset.image);
    setActiveLabel(preset.name);
    _executeCatalogMatching(preset.queryKey);
  };

  const _executeCatalogMatching = (queryKey: string) => {
    const q = queryKey.toLowerCase();
    let matches: (Product & { visualScore?: number })[] = [];

    if (q.includes('knitwear') || q.includes('sweater') || q.includes('cashmere')) {
      matches = MASTER_PRODUCTS.filter((p) => p.id === 'p1' || p.id === 'p2' || p.id === 'p3');
    } else if (q.includes('shoe') || q.includes('runner') || q.includes('footwear') || q.includes('sneaker')) {
      matches = MASTER_PRODUCTS.filter((p) => p.category === 'footwear' || p.tags?.includes('footwear') || p.id === 'p6');
    } else if (q.includes('headphone') || q.includes('audio') || q.includes('sound') || q.includes('acoustic')) {
      matches = MASTER_PRODUCTS.filter((p) => p.category === 'acoustics' || p.id === 'p4');
    } else if (q.includes('coat') || q.includes('blazer') || q.includes('outerwear')) {
      matches = MASTER_PRODUCTS.filter((p) => p.id === 'p3' || p.id === 'p2' || p.id === 'p1');
    } else {
      matches = MASTER_PRODUCTS.filter((p) => p.category === 'apparel' || p.id === 'p1' || p.id === 'p2');
    }

    // Ensure we always present 3 matching cards
    if (matches.length < 3) {
      for (const p of MASTER_PRODUCTS) {
        if (!matches.some((m) => m.id === p.id)) {
          matches.push(p);
        }
        if (matches.length >= 3) break;
      }
    }

    // Assign realistic match confidence scores
    const scoredMatches = matches.slice(0, 3).map((p, idx) => ({
      ...p,
      visualScore: idx === 0 ? 0.96 : idx === 1 ? 0.93 : 0.89,
    }));

    setResults(scoredMatches);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, '').slice(0, 20);
      setActiveThumb(dataUrl);
      setActiveLabel(cleanName);
      _executeCatalogMatching(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product, product.sizes ? product.sizes[0] : 'One Size');
    useCartStore.getState().closeCart();
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1600);
  };

  const handleResetToDropzone = () => {
    setActiveThumb(null);
    setActiveLabel(null);
    setResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return createPortal(
    <div
      className="nex-visual-modal-backdrop active"
      id="nexVisualSearchBackdrop"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="nex-visual-modal-dialog nex-visual-v2-dialog"
        id="nexVisualSearchDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nexVisualSearchTitle"
        data-lenis-prevent
      >
        <input
          type="file"
          id="nexVisualFileInput"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />

        {/* Clean Header */}
        <div className="nex-visual-modal-header">
          <div>
            <h2 className="nex-visual-title" id="nexVisualSearchTitle">
              Shop by Photo
            </h2>
            <p className="nex-visual-subtitle">
              Upload a photo to find similar clothes in our store.
            </p>
          </div>
          <button
            type="button"
            className="nex-visual-close-btn"
            id="nexVisualCloseBtn"
            aria-label="Close Visual Search (Esc)"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Active Photo Bar (Visible only when a photo is active) */}
        {activeThumb && (
          <div className="nex-visual-lens-bar" id="nexVisualLensBar">
            <div className="nex-visual-lens-chip" id="nexVisualActiveChip">
              <img id="nexVisualChipThumb" src={activeThumb} alt="Selected Photo" />
              <span id="nexVisualChipLabel">{activeLabel}</span>
            </div>

            <div className="nex-visual-lens-status" id="nexVisualLensStatus">
              Showing matches for {activeLabel}...
            </div>

            <button
              type="button"
              className="nex-visual-lens-upload-btn"
              id="nexVisualUploadTrigger"
              aria-label="Change photo"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <line x1="16" x2="22" y1="5" y2="5" />
                <line x1="19" x2="19" y1="2" y2="8" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>Change Photo</span>
            </button>
          </div>
        )}

        {/* Matching Products Results or Initial Center Dropzone */}
        <div className="nex-visual-results-grid" id="nexVisualResultsGrid">
          {!activeThumb ? (
            /* Initial Blank / Empty State (Single Upload Dropzone) */
            <div
              className={`nex-visual-initial-prompt ${isDragOver ? 'dragover' : ''}`}
              id="nexVisualDropzonePrompt"
              role="button"
              tabIndex={0}
              aria-label="Click or drop an image here to search"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
              }}
              onDrop={handleDrop}
            >
              <div className="nex-visual-prompt-icon">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3DE0FF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <line x1="16" x2="22" y1="5" y2="5" />
                  <line x1="19" x2="19" y1="2" y2="8" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <h3 className="nex-visual-prompt-title">Click or drop any photo here</h3>
              <p className="nex-visual-prompt-desc">
                Upload an outfit image to find matching pieces, or run an instant demo.
              </p>

              <div className="nex-visual-prompt-actions">
                <button
                  type="button"
                  className="nex-visual-browse-btn"
                  id="nexVisualBrowseBtn"
                  aria-label="Browse photos on your device"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                    <line x1="16" x2="22" y1="5" y2="5" />
                    <line x1="19" x2="19" y1="2" y2="8" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span>Browse Photos</span>
                </button>
                <button
                  type="button"
                  className="nex-visual-demo-btn"
                  id="nexVisualDemoBtn"
                  aria-label="Run instant demo with sample outfit photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchPreset('knitwear');
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                  <span>✨ Try Demo</span>
                </button>
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((p) => {
              const scorePct = Math.round((p.visualScore || 0.96) * 100);
              const isAdded = addedIds.has(p.id);
              return (
                <div key={p.id} className="nex-visual-result-card" data-product-id={p.id}>
                  <div className="nex-visual-card-score">{scorePct}% MATCH</div>
                  <div className="nex-visual-card-img-wrap">
                    <img src={p.image} alt={p.name} className="nex-visual-card-img" />
                  </div>
                  <div className="nex-visual-card-body">
                    <div className="nex-visual-card-title">{p.name}</div>
                    <div className="nex-visual-card-price">{formatPrice(p.price)}</div>
                  </div>
                  <button
                    type="button"
                    className="nex-visual-card-add-btn"
                    data-add-id={p.id}
                    onClick={() => handleQuickAdd(p)}
                  >
                    {isAdded ? (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#34D399"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span style={{ color: '#34D399' }}>Added</span>
                      </>
                    ) : (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span>+ Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="nex-visual-initial-prompt">
              <p className="nex-visual-prompt-desc">
                No matching items found. Try uploading a different photo.
              </p>
              <button
                type="button"
                className="nex-visual-browse-btn"
                onClick={handleResetToDropzone}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
