'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Scale, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { TermsScrollSpy } from '@/components/terms/TermsScrollSpy';
import { useConciergeStore } from '@/store/useConciergeStore';

export default function TermsPage() {
  const { openConcierge } = useConciergeStore();

  const handleLegalConcierge = () => {
    openConcierge('I have an inquiry regarding European right of withdrawal or bespoke commission terms.');
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Maison</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-xs font-semibold uppercase tracking-widest text-accent-pink">
            <Scale size={13} />
            <span>Statutory Client Protections</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]">
            Maison Terms of <span className="italic font-normal">Engagement</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
            European Commercial Standards &amp; Statutory Consumer Protections &middot; Governed under European Directives &amp; German Commercial Code &middot; Valid 2026.
          </p>
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
                Scope of Agreement &amp; Artisanal Standard
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  These Terms of Engagement govern all commercial relationships between nexCommerce Atelier and our international clients. Every garment, leather accessory, and acoustic instrument offered through our platform is created in limited runs with noble natural materials.
                </p>
                <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="font-semibold text-accent-pink">Atelier Standard of Restraint</div>
                  <p className="text-white/60">
                    We do not engage in mass automated drop-shipping. Every piece undergoes triple quality verification before dispatch from our European ateliers.
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
                  The presentation of pieces on our storefront constitutes an invitation to treat. Upon submitting your order and completing the payment authorization, a binding contract of sale is formed.
                </p>
                <p>
                  Each piece is paired with a unique cryptographic order identifier and verified against atelier inventory. You receive immediate electronic receipt documentation with full dispatch tracking telemetry.
                </p>
              </div>
            </article>

            {/* Article 03 */}
            <article id="art3" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 03
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Pricing, VAT Transparency &amp; European Duties
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  All displayed prices include European statutory Value Added Tax (VAT) at the prevailing rate (19% Federal Republic of Germany). For cross-border intra-EU deliveries, Destination VAT rules are applied seamlessly at checkout.
                </p>
                <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="font-semibold text-accent-cyan">Zero Hidden Fees Guarantee</div>
                  <p className="text-white/60">
                    The final figure reflected at checkout is completely inclusive of all customs clearance, packaging, and courier insurance.
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
                European Statutory 14-Day Right of Withdrawal (Widerrufsbelehrung)
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  Clients residing within the European Economic Area possess the statutory right to withdraw from this contract within fourteen (14) calendar days without stating any reason. The withdrawal period commences on the calendar day the client or an appointed third party acquires physical possession of the goods.
                </p>
                <p>
                  To exercise your statutory right of withdrawal, you may notify us via an unequivocal statement through our <Link href="/contact" className="text-accent-cyan underline">Client Concierge Desk</Link> or submit a formal declaration to our European Returns Center.
                </p>
                <div className="p-4 rounded-2xl bg-surface-navy/60 border border-accent-pink/20 text-xs text-white/80">
                  <span className="font-semibold text-accent-pink block mb-1">Consequences of Withdrawal</span>
                  <p className="text-white/60">
                    Upon receipt of your notice, we shall reimburse all payments received from you, including initial standard delivery costs, within fourteen days using the original settlement method without fees.
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
                Intellectual Property &amp; Cryptographic Digital Passport
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  All silhouettes, acoustic geometries, typography, photographic lookbooks, and software architectures displayed on nexCommerce are the exclusive intellectual property of nexCommerce Atelier.
                </p>
                <p>
                  Each piece is paired with a tamper-proof digital passport certifying authentic origin, certified European yarn mills, and single-owner provenance.
                </p>
              </div>
            </article>

            {/* Article 06 */}
            <article id="art6" className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl">
              <span className="font-mono text-xs text-accent-cyan font-bold tracking-widest uppercase block">
                Article 06
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Applicable European Law &amp; Online Dispute Resolution
              </h2>
              <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-light space-y-3">
                <p>
                  These Terms of Engagement are governed by the laws of the Federal Republic of Germany, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). European consumer statutory protections remain unconditionally preserved.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-white/60">EU Online Dispute Resolution Platform:</span>
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

            {/* Legal Concierge Card Bridge */}
            <div className="p-8 rounded-3xl bg-surface-navy border border-accent-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-1 max-w-lg">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan block">
                  PRIVATE CLIENT LEGAL DESK
                </span>
                <h3 className="font-editorial text-2xl text-white font-normal">
                  Questions Regarding Withdrawal or Commissions?
                </h3>
                <p className="text-xs text-white/60 font-light">
                  Our European client concierge is available to assist with return collections, tax invoices, and statutory rights inquiries.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLegalConcierge}
                className="px-6 py-3 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-xl shrink-0"
              >
                <span>Contact Legal Desk</span>
                <Scale size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
