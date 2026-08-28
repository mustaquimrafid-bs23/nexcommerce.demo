'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  MoreHorizontal,
  BookOpen,
  Truck,
  Sparkles,
  Receipt,
  Headphones,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useSearchStore } from '@/store/useSearchStore';
import { AnnouncementBar } from './AnnouncementBar';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartBadgeRef = useRef<HTMLSpanElement>(null);
  const wishlistBadgeRef = useRef<HTMLSpanElement>(null);
  const openCart = useCartStore((state) => state.openCart);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.savedItems.length);
  const openSearch = useSearchStore((state) => state.openSearch);

  // Desktop Nav Glider state
  const [gliderStyle, setGliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const prevCartCount = useRef(cartItemCount);
  const prevWishlistCount = useRef(wishlistCount);

  // Elastic Badge Pop on count increase
  useEffect(() => {
    if (mounted && cartItemCount > prevCartCount.current) {
      if (cartBadgeRef.current) {
        cartBadgeRef.current.animate(
          [
            { transform: 'scale(0.8)' },
            { transform: 'scale(1.35)' },
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' },
          ],
          { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
        );
      }
    }
    prevCartCount.current = cartItemCount;
  }, [cartItemCount, mounted]);

  useEffect(() => {
    if (mounted && wishlistCount > prevWishlistCount.current) {
      if (wishlistBadgeRef.current) {
        wishlistBadgeRef.current.animate(
          [
            { transform: 'scale(0.8)' },
            { transform: 'scale(1.35)' },
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' },
          ],
          { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
        );
      }
    }
    prevWishlistCount.current = wishlistCount;
  }, [wishlistCount, mounted]);

  const handleNavHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    setGliderStyle({
      left: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
    });
  };

  const handleNavLeave = () => {
    setGliderStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Global shortcut for Ctrl+K / Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openSearch]);

  return (
    <>
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Glass Navigation Header */}
      <header
        className={`site-header sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#011c3d]/95 backdrop-blur-xl border-b border-white/10 h-[72px] shadow-2xl'
            : 'bg-[#012148]/85 backdrop-blur-lg border-b border-white/5 h-[72px]'
        }`}
        id="siteHeader"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              id="mobileMenuBtn"
              aria-label="Open mobile menu"
              aria-expanded={mobileOpen}
              aria-controls="mobileNavDrawer"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center" aria-label="nexCommerce Home">
              <img
                src="/assets/images/brand/logo_light.png"
                alt="nexCommerce — next generation e-commerce"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation Links with Animated Glider Underline */}
            <nav
              className="hidden md:flex items-center gap-6 ml-2 relative"
              id="navMenuLinks"
              aria-label="Primary Navigation"
              onMouseLeave={handleNavLeave}
            >
              <span
                className="nav-glider-pill absolute -bottom-1 h-[2px] bg-[#3DE0FF] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full pointer-events-none shadow-[0_0_8px_#3DE0FF]"
                id="navGliderPill"
                aria-hidden="true"
                style={{
                  left: `${gliderStyle.left}px`,
                  width: `${gliderStyle.width}px`,
                  opacity: gliderStyle.opacity,
                }}
              />
              <Link
                href="/category"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors py-1"
                data-nav="categories"
                onMouseEnter={handleNavHover}
              >
                Categories
              </Link>
              <Link
                href="/smart-list"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1.5 py-1"
                data-nav="smart-list"
                onMouseEnter={handleNavHover}
              >
                <span>Smart List</span>
                <span
                  className="nav-badge-pink text-[9px] px-1.5 py-0.5 rounded-full bg-[#E60C45]/20 text-[#F13365] font-bold tracking-wider border border-[#E60C45]/30"
                >
                  NEW
                </span>
              </Link>
            </nav>
          </div>

          {/* Center: Smart Search Pill with Focus Ring & Canonical IDs */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <button
              onClick={openSearch}
              className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#0A2A54]/80 hover:bg-[#0A2A54] border border-white/10 hover:border-white/25 focus-visible:ring-2 focus-visible:ring-[#3DE0FF]/50 focus-visible:border-[#3DE0FF] focus:outline-none text-xs text-white/60 hover:text-white transition-all shadow-inner cursor-pointer"
              id="searchTriggerBtn"
              aria-label="Search shop (Ctrl + K)"
            >
              <div className="flex items-center gap-2.5">
                <Search size={14} className="text-[#F13365]" />
                <span className="truncate">Search clothes, shoes, or what you need...</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-white/50 flex items-center gap-0.5">
                <kbd>Ctrl</kbd>+<kbd>K</kbd>
              </span>
            </button>
          </div>

          {/* Right: Actions & 3-Dot Dropdown */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Trigger */}
            <button
              onClick={openSearch}
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              id="mobileSearchTriggerBtn"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Saved Items */}
            <Link
              href="/wishlist"
              className="relative p-2 text-white/80 hover:text-white transition-colors"
              id="headerWishlistLink"
              aria-label="Saved Items"
              title="Saved Items"
            >
              <Heart size={20} />
              <span
                ref={wishlistBadgeRef}
                className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E60C45] text-[10px] items-center justify-center font-bold text-white shadow-sm will-change-transform ${
                  mounted && wishlistCount > 0 ? 'flex' : 'hidden'
                }`}
                id="headerWishlistCount"
              >
                {mounted ? wishlistCount : 0}
              </span>
            </Link>

            {/* User Account */}
            <Link
              href="/account"
              className="p-2 text-white/80 hover:text-white transition-colors hidden sm:flex"
              aria-label="My Account"
              title="My Account"
            >
              <User size={20} />
            </Link>

            {/* Shopping Bag */}
            <button
              onClick={openCart}
              className="relative p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              id="headerCartLink"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              <span
                ref={cartBadgeRef}
                className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E60C45] text-[10px] items-center justify-center font-bold text-white shadow-sm will-change-transform ${
                  mounted && cartItemCount > 0 ? 'flex' : 'hidden'
                }`}
                id="headerCartCount"
              >
                {mounted ? cartItemCount : 0}
              </span>
            </button>

            {/* 3-Dot Overflow Menu */}
            <div className="relative hidden md:block" id="headerMoreMenu" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  dropdownOpen
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                data-dropdown-trigger
                aria-label="More options"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <MoreHorizontal size={20} />
              </button>

              {dropdownOpen && (
                <div
                  className="nav-more-dropdown absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-[#01142e]/98 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  <Link
                    href="/guide"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <BookOpen size={14} className="text-[#3DE0FF]" />
                    <span>Shopping Guide</span>
                  </Link>

                  <Link
                    href="/tracking"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <Truck size={14} className="text-emerald-400" />
                    <span>Track Your Order</span>
                  </Link>

                  <Link
                    href="/concierge"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <Sparkles size={14} className="text-[#F13365]" />
                    <span>Personal Stylist & Outfits</span>
                  </Link>

                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <Receipt size={14} className="text-amber-400" />
                    <span>Past Orders</span>
                  </Link>

                  <div className="border-t border-white/10 my-1" />

                  <Link
                    href="/help"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <Headphones size={14} className="text-white/60" />
                    <span>Help &amp; Customer Care</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Canonical ID & lenis prevention (Outside header to escape backdrop-filter containing block) */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-[104px] bg-[#00142e]/98 backdrop-blur-2xl border-t border-white/10 p-6 flex flex-col justify-between z-50 animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto"
          id="mobileNavDrawer"
          role="dialog"
          aria-label="Navigation Menu"
          data-lenis-prevent
        >
          <div className="space-y-4">
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                href="/guide"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#3DE0FF]" />
                  <span className="font-medium">Shopping Guide</span>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </Link>

              <Link
                href="/category"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <span className="font-medium">Categories</span>
                <ChevronRight size={16} className="text-white/40" />
              </Link>

              <Link
                href="/smart-list"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Smart List</span>
                  <span className="nav-badge-pink text-[9px] px-1.5 py-0.5 rounded-full bg-[#E60C45]/20 text-[#F13365] font-bold border border-[#E60C45]/30">
                    NEW
                  </span>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-[#F13365]" />
                  <span className="font-medium">Saved Pieces</span>
                </div>
                <span className="text-xs text-white/50">{mounted ? wishlistCount : 0} items</span>
              </Link>

              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#3DE0FF]" />
                  <span className="font-medium">Account &amp; Smart Profile</span>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </Link>

              <Link
                href="/tracking"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-emerald-400" />
                  <span className="font-medium">Orders &amp; Tracking</span>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </Link>

              <Link
                href="/help"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A2A54]/50 hover:bg-[#0A2A54] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Headphones size={16} className="text-white/70" />
                  <span className="font-medium">Help &amp; Customer Care</span>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </Link>
            </nav>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="text-xs text-white/50">Atelier Services Active</div>
            <div className="text-xs text-emerald-400 font-medium">
              Complimentary express delivery on orders over € 150.00
            </div>
          </div>
        </div>
      )}
    </>
  );
}
