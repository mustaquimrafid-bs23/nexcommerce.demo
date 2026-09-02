'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Scale, ArrowLeft, ArrowRight, ExternalLink, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { TermsScrollSpy, TERMS_ARTICLES } from '@/components/terms/TermsScrollSpy';
import { useConciergeStore } from '@/store/useConciergeStore';

export default function TermsPage() {
  const { openConcierge, sendMessage } = useConciergeStore();

  const handleLegalConcierge = () => {
    openConcierge();
    sendMessage('I have an inquiry regarding consumer rights, order cancellation, or European delivery terms.');
  };

  const handleSmoothScrollMobile = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen text-white pb-24 pt-8"
      style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            <Scale size={13} />
            <span>Client Charter &middot; European Standards</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]">
            Terms &amp; <span className="italic font-normal">Conditions</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
            Clear, transparent guidelines on ordering, pricing, EU consumer rights, our 14-day return policy, and product guarantees.
          </p>

          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/60 bg-white/[0.04] px-4 py-2 rounded-full border border-white/10 font-mono">
            <span>Effective: 1 January 2026</span>
            <span>&middot;</span>
            <span>Version 4.2 (UK &amp; EU Harmonised)</span>
          </div>
        </div>

        {/* Mobile Fast-Jump Navigation Rail */}
        <div className="lg:hidden overflow-x-auto pb-2 flex items-center gap-2 border-b border-white/10">
          <span className="text-xs font-semibold text-accent-cyan uppercase tracking-wider shrink-0 mr-1">
            Jump to:
          </span>
          {TERMS_ARTICLES.map((art) => (
            <a
              key={art.id}
              href={`#${art.id}`}
              onClick={(e) => handleSmoothScrollMobile(e, art.id)}
              className="px-3 py-1.5 rounded-xl bg-surface-card border border-white/10 text-xs font-medium text-white/80 hover:text-white shrink-0 hover:bg-surface-navy whitespace-nowrap"
            >
              {art.num}. {art.title.split(' ')[0]}
            </a>
          ))}
        </div>

        {/* 2-Column Layout: ScrollSpy Sidebar + Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="hidden lg:block lg:col-span-4">
            <TermsScrollSpy />
          </div>

          <div className="lg:col-span-8 space-y-10">
            {/* Article 01 */}
            <article id="art1" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 01
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Scope of Agreement &amp; Handcrafted Quality
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  These Terms and Conditions govern all sales and orders completed through nexCommerce. By placing an order, you enter into a contractual agreement with nexCommerce, fully protected under UK and European Union consumer legislation.
                </p>
                <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="font-semibold text-accent-pink flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Our Quality Commitment</span>
                  </div>
                  <p className="text-white/60">
                    We do not sell mass-produced drop-shipped goods. Every piece is made from noble raw materials and inspected for finish and seam integrity before dispatch.
                  </p>
                </div>
              </div>
            </article>

            {/* Article 02 */}
            <article id="art2" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 02
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Ordering, Contract Formation &amp; Proof of Authenticity
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  The display of pieces on our website represents an invitation to purchase. A binding sales agreement is officially formed once your order payment is authorized and our automated dispatch confirmation email is generated.
                </p>
                <p>
                  You will receive an immediate electronic VAT invoice and live courier tracking references to follow your parcel from our central European distribution hub to your doorstep.
                </p>
              </div>
            </article>

            {/* Article 03 */}
            <article id="art3" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 03
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Pricing, VAT Transparency &amp; Delivery Terms
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  All displayed catalog prices are shown in Euros (&euro;), British Pounds (&pound;), or US Dollars ($), fully inclusive of statutory Value Added Tax (VAT). Destination-based EU tax rules are automatically applied at checkout based on your delivery address.
                </p>
                <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="font-semibold text-accent-cyan">No Hidden Fees Guarantee</div>
                  <p className="text-white/60">
                    The total amount shown at checkout is 100% final. Standard courier transit, customs clearance, and sustainable gift packaging are completely included.
                  </p>
                </div>
              </div>
            </article>

            {/* Article 04 */}
            <article id="art4" className="p-8 rounded-3xl bg-surface-card border border-accent-pink/30 space-y-4 shadow-xl relative overflow-hidden">
              <span className="font-mono text-xs text-accent-pink font-bold tracking-widest uppercase block">
                Article 04
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                14-Day Right of Withdrawal (Widerrufsbelehrung) &amp; Returns Policy
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  Clients residing in the UK and European Economic Area have the statutory right to cancel their purchase within fourteen (14) calendar days without giving any reason. The 14-day cancellation period begins on the day you, or a designated third party, receive physical delivery of the parcel.
                </p>
                <p>
                  To cancel an order or arrange a return, simply contact our <Link href="/contact" className="text-accent-cyan underline">Client Support Desk</Link> or submit a return request directly through your order tracking portal.
                </p>
                <div className="p-4 rounded-2xl bg-surface-navy/60 border border-accent-pink/20 text-xs text-white/80 space-y-1">
                  <span className="font-semibold text-accent-pink block mb-1">Refund &amp; Return Processing</span>
                  <p className="text-white/60">
                    Once we receive the returned item in its original condition with all tags attached, we will issue a full refund to your original payment method within 14 business days with zero deduction fees.
                  </p>
                </div>
              </div>
            </article>

            {/* Article 05 */}
            <article id="art5" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 05
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Authenticity Guarantees &amp; Intellectual Property
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  All designs, photography, product silhouettes, brand names, and digital interfaces published on this storefront are the intellectual property of nexCommerce.
                </p>
                <p>
                  Every leather good and timepiece includes an embedded digital authentication certificate verifying authentic European provenance and certified master artisan production.
                </p>
              </div>
            </article>

            {/* Article 06 */}
            <article id="art6" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 06
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Governing Law &amp; Online Dispute Resolution
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  These Terms and Conditions are governed by European consumer protection regulations and applicable laws. If you are a consumer residing in the European Union or United Kingdom, your statutory consumer rights remain fully protected.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-white/60">European Commission Online Dispute Resolution:</span>
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent-cyan hover:underline font-mono text-xs"
                  >
                    <span>ec.europa.eu/consumers/odr</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </article>

            {/* Client Services Advisory Desk Bridge */}
            <div className="p-8 rounded-3xl bg-surface-navy border border-accent-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-1 max-w-lg">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan block">
                  CUSTOMER CARE &middot; LEGAL ADVISORY
                </span>
                <h3 className="font-editorial text-2xl text-white font-normal">
                  Questions Regarding Returns or Invoices?
                </h3>
                <p className="text-xs text-white/60 font-light">
                  Our European client care team is available 24/7 to assist with return collections, tax invoices, and statutory rights inquiries.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLegalConcierge}
                className="px-6 py-3 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-xl shrink-0 hover:scale-105"
              >
                <span>Contact Customer Care</span>
                <Scale size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
