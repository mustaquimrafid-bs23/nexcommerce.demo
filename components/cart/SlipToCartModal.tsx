'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileText,
  Sparkles,
  Upload,
  CheckCircle,
  Loader2,
  Trash2,
  ShoppingBag,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/utils';

interface SlipToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: 'receipt' | 'capsule' | 'essentials' | 'ambiguous';
}

interface ParsedLine {
  rawLine: string;
  cleanQuery: string;
  quantity: number;
  sizeHint: string | null;
  colorHint: string | null;
}

interface MatchedItem {
  rawLine: string;
  cleanQuery: string;
  quantity: number;
  selectedSize: string;
  selectedFinish: string;
  confidence: number;
  product: Product;
  isAmbiguous: boolean;
  alternatives: Product[];
}

interface UnmatchedLine {
  rawLine: string;
  cleanQuery: string;
  quantity: number;
}

interface MatchResult {
  matched: MatchedItem[];
  unmatched: UnmatchedLine[];
  totalLines: number;
}

// Canonical sample presets matching feature/storefront-elevation
const SAMPLE_PRESETS = {
  receipt: {
    name: 'Demo Receipt Image',
    filename: 'sample_luxury_store_receipt.jpg',
    text: '1x Pure Cashmere Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Minimalist Leather Runner (EU 42)',
  },
  capsule: {
    name: 'Autumn Selection',
    text: '1x Pure Cashmere Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Minimalist Leather Runner (EU 42)',
  },
  essentials: {
    name: 'Everyday Essentials',
    text: '2x Fine-Knit Cashmere Crew (Size L)\n1x Chronograph Minimalist Watch\n1x Studio Acoustics Headphone GT',
  },
  ambiguous: {
    name: 'Multi-Match Test',
    text: '1x Cashmere\n1x Watch\n1x Silk Scarf',
  },
};

// Levenshtein distance helper
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(s1: string, s2: string): number {
  let longer = s1.toLowerCase().trim();
  let shorter = s2.toLowerCase().trim();
  if (longer.length < shorter.length) {
    const tmp = longer;
    longer = shorter;
    shorter = tmp;
  }
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - levenshtein(longer, shorter)) / longerLength;
}

const STOP_WORDS = new Set([
  'size',
  'eu',
  'uk',
  'us',
  'qty',
  'pcs',
  'color',
  'the',
  'a',
  'an',
  'in',
  'of',
  'for',
  'with',
  'and',
  'piece',
  'pieces',
]);

function parseRawText(rawText: string): ParsedLine[] {
  if (!rawText || typeof rawText !== 'string') return [];
  const lines = rawText.split(/\r?\n|;/);
  const parsed: ParsedLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Remove leading numbering like "1.", "1)", "-", "•", "*"
    line = line.replace(/^[\d]+[\.\)\-\:]\s*|^[\-\•\*\+]\s*/, '').trim();
    if (!line) continue;

    // 1. Extract quantity (e.g., "2x", "2 pcs", "qty: 2", "x2", "2 pairs")
    let quantity = 1;
    const qtyMatch =
      line.match(/\b(\d+)\s*(?:x|pcs|pieces|pairs?|items?|units?|pkg|pack)\b/i) ||
      line.match(/\b(?:qty|quantity)[\:\s]*(\d+)\b/i) ||
      line.match(/^(\d+)\s*x?\s+/i) ||
      line.match(/\s*x\s*(\d+)$/i);

    if (qtyMatch) {
      quantity = parseInt(qtyMatch[1], 10) || 1;
      line = line.replace(qtyMatch[0], ' ').trim();
    }

    // 2. Extract size hint (e.g., "Size M", "Size 48", "EU 42", "(M)", "Medium")
    let sizeHint: string | null = null;
    const sizeMatch =
      line.match(/\b(?:size|eu|uk|us)[\:\s]*([a-z0-9]+)\b/i) ||
      line.match(/\(([a-z0-9]+)\)/i) ||
      line.match(/\b([x|s|m|l|xl|xxl]{1,3})\b/i) ||
      line.match(/\b(3[6-9]|4[0-8]|5[0-4])\b/);

    if (sizeMatch) {
      sizeHint = (sizeMatch[1] || sizeMatch[0]).toUpperCase();
      line = line.replace(sizeMatch[0], ' ').trim();
    }

    // 3. Extract finish / color hint
    let colorHint: string | null = null;
    const colorMatch = line.match(
      /\b(black|charcoal|navy|obsidian|ivory|slate|grey|gray|white|sand|brown|camel)\b/i
    );
    if (colorMatch) {
      colorHint = colorMatch[1].toLowerCase();
      line = line.replace(colorMatch[0], ' ').trim();
    }

    // Clean query tokens
    const cleanQuery = line
      .replace(/[\(\)\[\]\{\}\,\.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    parsed.push({
      rawLine: lines[i].trim(),
      cleanQuery,
      quantity: Math.max(1, quantity),
      sizeHint,
      colorHint,
    });
  }

  return parsed;
}

function matchSlipToCatalog(
  parsedLines: ParsedLine[],
  catalog: Product[]
): MatchResult {
  const cat = Array.isArray(catalog) ? catalog : [];
  const matched: MatchedItem[] = [];
  const unmatched: UnmatchedLine[] = [];

  for (let i = 0; i < parsedLines.length; i++) {
    const item = parsedLines[i];
    const queryTerms = item.cleanQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

    const scored: { product: Product; score: number }[] = [];

    for (let c = 0; c < cat.length; c++) {
      const prod = cat[c];
      const prodName = (prod.name || '').toLowerCase();
      const prodCategory = (prod.category || '').toLowerCase();
      const prodKeywords = (prod.tags || []).join(' ').toLowerCase();
      const prodDesc = (prod.description || prod.reasoning || '').toLowerCase();
      const haystack = `${prodName} ${prodCategory} ${prodKeywords} ${prodDesc}`;

      // Token overlap score
      let overlap = 0;
      for (let t = 0; t < queryTerms.length; t++) {
        if (haystack.includes(queryTerms[t])) overlap += 1;
      }
      const tokenScore = queryTerms.length > 0 ? overlap / queryTerms.length : 0;

      // Direct Levenshtein similarity on product name
      const simScore = similarity(item.cleanQuery, prodName);

      // Combined confidence score
      const score = Math.max(tokenScore * 0.7 + simScore * 0.3, simScore);

      scored.push({
        product: prod,
        score,
      });
    }

    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (best && best.score >= 0.35) {
      let isAmbiguous = false;
      let alternatives: Product[] = [];

      // Check if top 2 candidates are close in score
      if (
        scored.length > 1 &&
        scored[1].score >= 0.3 &&
        best.score - scored[1].score < 0.18
      ) {
        isAmbiguous = true;
        alternatives = scored.slice(0, 3).map((s) => s.product);
      } else {
        alternatives = [best.product];
      }

      // Determine best size match
      let selectedSize = item.sizeHint || 'M';
      if (best.product.sizes && Array.isArray(best.product.sizes)) {
        const target = (item.sizeHint || '').toUpperCase();
        const avail = best.product.sizes.find(
          (s) => s.toUpperCase() === target
        );
        if (avail) {
          selectedSize = avail;
        } else if (best.product.sizes[0]) {
          selectedSize = best.product.sizes[0];
        }
      }

      matched.push({
        rawLine: item.rawLine,
        cleanQuery: item.cleanQuery,
        quantity: item.quantity,
        selectedSize,
        selectedFinish: item.colorHint || 'Standard',
        confidence: parseFloat(best.score.toFixed(2)),
        product: best.product,
        isAmbiguous,
        alternatives,
      });
    } else {
      unmatched.push({
        rawLine: item.rawLine,
        cleanQuery: item.cleanQuery,
        quantity: item.quantity,
      });
    }
  }

  return {
    matched,
    unmatched,
    totalLines: parsedLines.length,
  };
}

export function SlipToCartModal({
  isOpen,
  onClose,
  initialPreset,
}: SlipToCartModalProps) {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTextContainerOpen, setIsTextContainerOpen] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isOcrAnalyzing, setIsOcrAnalyzing] = useState(false);
  const [ocrFileName, setOcrFileName] = useState<string | null>(null);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Mount check for Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll locking
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Initial preset handler
  useEffect(() => {
    if (isOpen && initialPreset && SAMPLE_PRESETS[initialPreset]) {
      handleApplyPreset(initialPreset);
    }
  }, [isOpen, initialPreset]);

  if (!mounted || !isOpen) return null;

  const processRawInput = (text: string) => {
    const parsed = parseRawText(text);
    const result = matchSlipToCatalog(parsed, MASTER_PRODUCTS);
    setMatchResult(result);
  };

  const handleApplyPreset = (key: keyof typeof SAMPLE_PRESETS) => {
    const preset = SAMPLE_PRESETS[key];
    if (key === 'receipt') {
      handleSimulateOcr(SAMPLE_PRESETS.receipt.filename, preset.text);
    } else {
      setInputText(preset.text);
      processRawInput(preset.text);
    }
  };

  const handleSimulateOcr = (fileName: string, textToExtract: string) => {
    setIsOcrAnalyzing(true);
    setOcrFileName(fileName);
    setOcrSuccess(false);

    setTimeout(() => {
      setIsOcrAnalyzing(false);
      setOcrSuccess(true);
      setInputText(textToExtract);
      processRawInput(textToExtract);
    }, 700);
  };

  const handleFileUpload = (file: File) => {
    // Pick standard capsule text or relevant sample
    const sampleText = SAMPLE_PRESETS.capsule.text;
    handleSimulateOcr(file.name, sampleText);
  };

  const handleUpdateQty = (index: number, delta: number) => {
    if (!matchResult) return;
    const updatedMatched = [...matchResult.matched];
    const item = updatedMatched[index];
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    updatedMatched[index] = { ...item, quantity: newQty };
    setMatchResult({ ...matchResult, matched: updatedMatched });
  };

  const handleRemoveMatch = (index: number) => {
    if (!matchResult) return;
    const updatedMatched = matchResult.matched.filter((_, i) => i !== index);
    setMatchResult({ ...matchResult, matched: updatedMatched });
  };

  const handleSwapProduct = (index: number, newProductId: string) => {
    if (!matchResult) return;
    const targetProd = MASTER_PRODUCTS.find((p) => p.id === newProductId);
    if (!targetProd) return;

    const updatedMatched = [...matchResult.matched];
    updatedMatched[index] = {
      ...updatedMatched[index],
      product: targetProd,
    };
    setMatchResult({ ...matchResult, matched: updatedMatched });
  };

  const handleCommitToBag = () => {
    if (!matchResult || matchResult.matched.length === 0) return;

    matchResult.matched.forEach((m) => {
      addItem(
        m.product,
        m.selectedSize,
        m.selectedFinish,
        m.quantity
      );
    });

    const totalCount = matchResult.matched.reduce(
      (sum, m) => sum + m.quantity,
      0
    );

    setSuccessToast(
      `✨ Added ${totalCount} pieces from your shopping slip to your bag!`
    );

    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1400);
  };

  // Compute totals
  const totalItemsCount = matchResult
    ? matchResult.matched.reduce((sum, m) => sum + m.quantity, 0)
    : 0;
  const totalAmount = matchResult
    ? matchResult.matched.reduce(
        (sum, m) => sum + m.quantity * (m.product.price || 0),
        0
      )
    : 0;

  const modalContent = (
    <div
      id="slipModalBackdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Slip to Cart"
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-[rgba(3,11,23,0.82)] backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#012148] border border-[#3DE0FF] text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Sparkles className="w-4 h-4 text-[#3DE0FF]" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Main Dialog Container */}
      <div
        className="relative w-full max-w-[1080px] max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-[20px] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(61,224,255,0.1)] flex flex-col overflow-hidden text-[#F8FAFF] animate-scale-up"
        style={{
          background:
            'linear-gradient(145deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 11, 24, 0.99) 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-white/[0.07]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#3DE0FF]">
              ✨ Customer Commerce Agent · Smart Capability 4
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#F8FAFF] m-0">
              Shopping Slip to Cart
            </h2>
          </div>

          <button
            id="slipModalCloseBtn"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/[0.03] text-white/80 hover:text-white hover:bg-white/10 hover:border-white/25 hover:rotate-90 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          className="p-4 sm:p-7 md:p-8 overflow-y-auto space-y-5 sm:space-y-6 flex-1"
          data-lenis-prevent
        >
          {/* Upload Dropzone */}
          <div
            id="slipDropzone"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className={`border-2 border-dashed rounded-2xl p-5 sm:p-7 md:p-9 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer ${
              isDragOver
                ? 'border-[#3DE0FF] bg-[#3DE0FF]/[0.08] shadow-[0_0_24px_rgba(61,224,255,0.2)]'
                : 'border-[#3DE0FF]/25 hover:border-[#3DE0FF] bg-[#3DE0FF]/[0.02] hover:bg-[#3DE0FF]/[0.06]'
            }`}
          >
            {isOcrAnalyzing ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#3DE0FF]/10 text-[#3DE0FF] flex items-center justify-center animate-spin">
                  <Loader2 size={24} />
                </div>
                <div className="text-[15px] font-semibold text-white">
                  Analyzing &quot;{ocrFileName}&quot; with OCR...
                </div>
                <div className="text-xs text-white/45">
                  Extracting handwritten line items &amp; quantities
                </div>
              </>
            ) : ocrSuccess ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div className="text-[15px] font-semibold text-white">
                  Successfully Parsed &quot;{ocrFileName}&quot;
                </div>
                <div className="text-xs text-white/45">
                  Extracted {matchResult?.matched.length || 3} line items with 96% match confidence
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#3DE0FF]/10 text-[#3DE0FF] flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="text-[15px] font-semibold text-white">
                  Upload Shopping Slip or Receipt Image
                </div>
                <div className="text-xs text-white/45">
                  Drag and drop PNG, JPG, or receipt photos — Smart system will extract &amp; match items instantly
                </div>
                <div
                  className="flex items-center gap-3 mt-1 flex-wrap justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    id="slipDemoReceiptBtn"
                    onClick={() => handleApplyPreset('receipt')}
                    className="h-9 px-4.5 rounded-lg bg-gradient-to-r from-[#3DE0FF] to-[#00F5A0] hover:brightness-105 active:scale-95 text-[#000B1A] font-bold text-[11.5px] inline-flex items-center gap-1.5 shadow-[0_4px_14px_rgba(61,224,255,0.3)] hover:shadow-[0_6px_18px_rgba(61,224,255,0.45)] cursor-pointer transition-all"
                  >
                    <Sparkles size={13} />
                    <span>Demo Receipt Image</span>
                  </button>

                  <button
                    type="button"
                    id="slipBrowseFileBtn"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="h-9 px-4.5 rounded-lg bg-white/[0.08] hover:bg-white/15 border border-white/20 hover:border-[#3DE0FF] text-white hover:text-[#3DE0FF] active:scale-95 font-bold text-[11.5px] inline-flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Upload size={13} />
                    <span>Browse Image File</span>
                  </button>
                </div>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Presets & Paste Switcher Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">
                Test Presets:
              </span>
              <button
                type="button"
                data-preset="receipt"
                onClick={() => handleApplyPreset('receipt')}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-[#3DE0FF]/40 bg-[#3DE0FF]/[0.08] text-[#3DE0FF] hover:bg-[#3DE0FF]/15 cursor-pointer transition-all"
              >
                📸 Demo Receipt Image
              </button>
              <button
                type="button"
                data-preset="capsule"
                onClick={() => handleApplyPreset('capsule')}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-[#3DE0FF] hover:border-[#3DE0FF]/30 hover:bg-[#3DE0FF]/[0.08] cursor-pointer transition-all"
              >
                🍂 Autumn Selection
              </button>
              <button
                type="button"
                data-preset="essentials"
                onClick={() => handleApplyPreset('essentials')}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-[#3DE0FF] hover:border-[#3DE0FF]/30 hover:bg-[#3DE0FF]/[0.08] cursor-pointer transition-all"
              >
                ⚡ Everyday Essentials
              </button>
              <button
                type="button"
                data-preset="ambiguous"
                onClick={() => handleApplyPreset('ambiguous')}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-[#3DE0FF] hover:border-[#3DE0FF]/30 hover:bg-[#3DE0FF]/[0.08] cursor-pointer transition-all"
              >
                🔍 Multi-Match Test
              </button>
            </div>

            <button
              id="slipToggleTextBtn"
              type="button"
              onClick={() => setIsTextContainerOpen(!isTextContainerOpen)}
              className="text-[11px] font-semibold px-3.5 py-1.5 rounded-lg border border-[#3DE0FF]/30 text-[#3DE0FF] bg-white/[0.03] hover:bg-[#3DE0FF]/[0.08] cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>✏️ Paste Text List</span>
            </button>
          </div>

          {/* Collapsible Text Paste Container */}
          {isTextContainerOpen && (
            <div
              id="slipPasteContainer"
              className="flex flex-col gap-3 bg-[#031838]/40 border border-[#3DE0FF]/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#3DE0FF] uppercase tracking-[0.08em]">
                  Paste Shopping List
                </span>
                <button
                  type="button"
                  id="slipLoadSampleTextBtn"
                  onClick={() => {
                    setInputText(SAMPLE_PRESETS.capsule.text);
                  }}
                  className="text-[10.5px] px-2.5 py-1 rounded bg-white/[0.03] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white cursor-pointer transition-all"
                >
                  📋 Load Sample Text
                </button>
              </div>

              <textarea
                id="slipTextInput"
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g.&#10;2x Pure Cashmere Sweater Size M&#10;1x Structured Wool Blazer&#10;1x Minimalist Leather Runner"
                className="w-full bg-[#031838]/80 border border-white/[0.12] focus:border-[#3DE0FF] rounded-lg p-3 text-white text-[13px] placeholder-white/30 font-sans outline-none resize-y transition-colors"
              />

              <div className="flex gap-2.5">
                <button
                  type="button"
                  id="slipProcessTextBtn"
                  onClick={() => {
                    if (inputText.trim()) {
                      processRawInput(inputText);
                    } else {
                      setInputText(SAMPLE_PRESETS.capsule.text);
                      processRawInput(SAMPLE_PRESETS.capsule.text);
                    }
                  }}
                  className="h-[38px] px-5 rounded-lg bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] font-bold text-xs cursor-pointer transition-all active:scale-95 shadow-[0_0_14px_rgba(61,224,255,0.3)]"
                >
                  Process Text List →
                </button>
                <button
                  type="button"
                  id="slipClearTextBtn"
                  onClick={() => {
                    setInputText('');
                    setMatchResult(null);
                  }}
                  className="px-3.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white text-xs cursor-pointer transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Split-pane Review Container */}
          {matchResult && (
            <div
              id="slipReviewContainer"
              className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1 animate-in fade-in duration-300"
            >
              {/* Left Column: Extracted Slip Lines */}
              <div className="md:col-span-5 space-y-3">
                <div className="text-[11px] font-bold tracking-[0.14em] text-white/40 uppercase">
                  Extracted Slip Lines
                </div>
                <div
                  id="slipLinesList"
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 space-y-2 max-h-[380px] overflow-y-auto"
                >
                  {matchResult.matched.map((m, idx) => (
                    <div
                      key={`matched-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[13px] gap-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            m.isAmbiguous
                              ? 'bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]'
                              : 'bg-[#34D399] shadow-[0_0_8px_#34D399]'
                          }`}
                        />
                        <span className="truncate text-white/80">
                          {m.rawLine}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold shrink-0 ${
                          m.isAmbiguous ? 'text-[#FBBF24]' : 'text-[#34D399]'
                        }`}
                      >
                        {m.isAmbiguous ? 'Review' : 'Matched'}
                      </span>
                    </div>
                  ))}

                  {matchResult.unmatched.map((u, idx) => (
                    <div
                      key={`unmatched-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[13px] gap-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#FB7185] shadow-[0_0_8px_#FB7185] shrink-0" />
                        <span className="truncate text-white/60">
                          {u.rawLine}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#FB7185] shrink-0">
                        Not Found
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Matched Catalog Products */}
              <div className="md:col-span-7 space-y-3">
                <div className="text-[11px] font-bold tracking-[0.14em] text-white/40 uppercase">
                  Matched Catalog Products ({matchResult.matched.length})
                </div>

                <div
                  id="slipMatchesList"
                  className="space-y-3 max-h-[380px] overflow-y-auto pr-1"
                >
                  {matchResult.matched.map((m, idx) => (
                    <div
                      key={`match-card-${idx}`}
                      className="flex items-center justify-between gap-3.5 p-3.5 rounded-xl bg-white/[0.025] hover:border-[#3DE0FF]/30 border border-white/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={m.product.image}
                          alt={m.product.name}
                          className="w-16 h-16 rounded-lg object-contain p-1 border border-white/5 shrink-0"
                          style={{
                            background:
                              'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                          }}
                        />
                        <div className="min-w-0 flex flex-col gap-1">
                          <div className="text-sm font-semibold text-white truncate">
                            {m.product.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/50 flex-wrap">
                            <span>€ {(m.product.price || 0).toFixed(2)}</span>
                            <span>&middot;</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/25">
                              {Math.round(m.confidence * 100)}% Match
                            </span>
                            {m.selectedSize && (
                              <span>
                                &middot; Size:{' '}
                                <strong className="text-white">
                                  {m.selectedSize}
                                </strong>
                              </span>
                            )}
                          </div>

                          {m.isAmbiguous && m.alternatives.length > 1 && (
                            <div className="mt-1">
                              <select
                                value={m.product.id}
                                onChange={(e) =>
                                  handleSwapProduct(idx, e.target.value)
                                }
                                className="bg-[#031838]/80 text-white border border-white/15 rounded-md text-[11px] px-2 py-1 outline-none"
                              >
                                {m.alternatives.map((alt) => (
                                  <option key={alt.id} value={alt.id}>
                                    Switch to: {alt.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Stepper */}
                        <div className="inline-flex items-center border border-white/[0.12] rounded-md bg-white/[0.02]">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(idx, -1)}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white cursor-pointer text-sm"
                          >
                            -
                          </button>
                          <span
                            id={`slipQtyVal_${idx}`}
                            className="min-w-[24px] text-center text-xs font-semibold text-white tabular-nums"
                          >
                            {m.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(idx, 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white cursor-pointer text-sm"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMatch(idx)}
                          title="Remove item"
                          className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400 cursor-pointer transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          id="slipModalFooter"
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 sm:px-8 py-4 sm:py-5 border-t border-white/[0.07] bg-[rgba(3,11,23,0.4)]"
        >
          <div className="flex items-baseline justify-between sm:justify-start gap-2">
            <span className="text-xs text-white/40">Total Ready for Bag:</span>
            <span
              id="slipStatVal"
              className="font-serif text-lg sm:text-[22px] text-[#3DE0FF]"
            >
              {totalItemsCount} Items · € {totalAmount.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            id="slipConfirmBtn"
            onClick={handleCommitToBag}
            disabled={!matchResult || matchResult.matched.length === 0}
            className="min-h-[44px] sm:min-h-[48px] px-6 sm:px-7 rounded-[10px] bg-[#3DE0FF] hover:bg-[#6BE8FF] disabled:opacity-30 disabled:cursor-not-allowed text-[#000B1A] font-bold text-xs sm:text-[13px] tracking-[0.03em] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(61,224,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
          >
            {successToast ? (
              <>
                <Check size={16} />
                <span id="slipConfirmBtnText">Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span id="slipConfirmBtnText">
                  Add All Matched ({totalItemsCount}) to Bag
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
