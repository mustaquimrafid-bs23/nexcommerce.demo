# Antigravity Frontend Execution Rules

## 1. Design & Typography Constraints
- **Typography Standard (European Luxury)**:
  - **Headings & Display**: 'Neue Haas Grotesk', 'Helvetica Now', 'Manrope', or premium grotesk.
  - **UI & Body**: 'Inter' (Navigation, Buttons, Product Info, Prices, Filters, Forms, Checkout, Accounts).
  - **Editorial Accent**: 'Instrument Serif' (strictly limited to hero accent words & selected editorial campaigns).
  - **Strict Anti-AI Font Guardrail**: NO Orbitron, Audiowide, Exo 2, Rajdhani, gaming fonts, or excessive monospace.
  - **European Language Support**: Fonts must verify Latin Extended coverage (É, È, Ê, Ç, Ñ, Ö, Ü, Å, Ø, Æ, ß, Š, Ž, Ł, Č).
- **Dynamic Spacing**: Maintain strict layout spacing using Tailwind padding/margins with fluid clamp sizing (e.g., `clamp(1rem, 2vw, 2.5rem)`) for dynamic viewports instead of fixed pixel widths.
- **Aesthetic Guardrails (No AI Slop)**:
  - No generic purple-to-blue neon gradients.
  - No basic card grids without context.
  - No centered hero sections unless explicitly requested.

## 2. Framework & Component Execution
- **Modern Primitives**: Leverage modern UI primitives (e.g., Tailwind v4 or components utilizing true CSS variables and modern CSS features).
- **Structural Modularity**: Maintain strict structural code modularity. Separate presentation components from state/data fetching functions.

## 3. Antigravity Agent Verification
- **Mandatory Browser Verification**: Before submitting an Artifact as complete, you MUST use the built-in Browser Subagent (`chrome-devtools` / `playwright`) to launch or connect to a localhost server.
- **Visual Auditing**: Capture screenshots across Desktop (`1280px`/`1440px`), Tablet (`768px`), and Mobile (`375px`) viewports, verifying zero overlapping text, zero horizontal scrollbars, and zero cropped silhouettes.
- **Multi-Dimension Cross-Page Sweep**: Full-site audits and release sign-offs must NEVER rely on single-dimension spot checks. Every audit MUST sweep all 7 dimensions (Content & Copy, Visual/Layout, Interactions, Cross-Page Consistency, E2E User Flows, Edge Cases, Accessibility) across all pages simultaneously per `sqa-engineering-standards.md` §13.

## 4. Canvas & Layout Scoping Invariants
- **Global Canvas Palette Continuity**: Do NOT introduce isolated body background overrides. Maintain continuous brand canvas gradients across all routes.
- **Single Root Fixed Canvas Pattern (Zero Opaque Page Overrides)**:
  - The canonical **Sapphire Radial Canvas** (`#032B5E` at 50% 0% radiating to `#01132B` and `#001838`) MUST be declared strictly once at the root level on `<body>` in `app/layout.tsx` and `app/globals.css` with `background-attachment: fixed`.
  - Individual page route wrappers (`app/**/page.tsx`) must NEVER declare opaque background utility classes (`bg-obsidian-900`, `bg-obsidian-950`, `bg-obsidian-deep`, `bg-[#012148]`, `bg-gradient-to-b...`). All page containers must declare `bg-transparent`.
  - Subordinate banners and section wrappers must use translucent glass (`bg-white/[0.02] backdrop-blur-md` or `bg-[#0A2A54]/20`) rather than solid opaque fills that mask the root sapphire lighting.
- **Canonical Sapphire Radial Canvas Standard**:
  - The canonical background for ALL storefront routes (Next.js and static HTML) is the **Sapphire Radial Gradient**:
    ```css
    bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF]
    ```
  - Never use flat `#01132B` or `#000000` on primary pages. The top-center `#032B5E` radial aura radiates light down through the upper fold, preventing the page from feeling flat, dull, or suffocatingly dark.
- **Flagship Benchmark Inspection Before Invention**:
  - When addressing feedback regarding visual tone, darkness, or contrast, NEVER invent ad-hoc color schemes or change palettes.
  - Always inspect the codebase's flagship benchmark routes first—specifically **`/checkout`** and **`/confirmation`**—extract their exact background gradients, glassmorphism tokens, and border formulas, and align the target page to match.
- **Sibling Route Context Check Before Reskinning**: Never redesign, re-theme, or alter the color temperature of an individual route in isolation. Always inspect sibling and parent routes (e.g., `/orders`, `/confirmation`, `/cart`, `/category`) first to verify site-wide visual coherence.
- **"Too Dark" / Contrast Feedback Disambiguation**: When a user reports that a dark-mode page is "too dark", NEVER convert that single page into a light-mode island against a dark global header. In luxury dark-mode architectures, "too dark" means:
  1. The page is missing the canonical top-down sapphire radial canvas (`#032B5E` at `50% 0%`).
  2. Container cards are muddy/flat (`to-[#041430]`) rather than crisp glass (`bg-[#0A2A54]/30 border-white/10 backdrop-blur-md`).
  3. Typography and numerical metrics lack luminous accent highlights (`text-accent-cyan`, high-contrast white).
- **Container-Scoped Component Cards**: Do not place dark component background fills on full-width section wrappers. Wrap cards in `.container` to prevent horizontal edge-to-edge color bands.
- **Complete Viewport Vertical Inspection**: Always audit every subordinate section (filters, chips, search refinement bars) from header to footer before submitting work.
- **🛡️ MANDATORY SITE-WIDE ATELIER ROYAL SAPPHIRE NAVY INVARIANT (ZERO PITCH-BLACK)**:
  - **Strict Pitch-Black Ban**: Pitch-black or muddy grey-black backgrounds (`#000000`, `#070B14`, `#02070f`, `#021127`, `bg-black/*`) are STRICTLY FORBIDDEN across all website surfaces, pages, cards, drawers, dialogs, and overlays.
  - **Visible Blue Invariant**: All containers, modals, drawers, and overlays must be visibly, unmistakably **Royal Sapphire Navy** (`#0e3266` to `#071d3f`), matching the signature search modal.
  - **Canonical Palette Matrix**:
    | Surface Element | Exact Tailwind / Hex Formula |
    | :--- | :--- |
    | **Root Body Canvas** | `bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)]` |
    | **Drawer / Modal Panel** | `bg-gradient-to-b from-[#0e3266]/98 via-[#0a2652]/98 to-[#071d3f]/98 border border-[#3DE0FF]/30 backdrop-blur-2xl shadow-[-24px_0_70px_rgba(2,19,45,0.85)]` |
    | **Overlay Backdrop** | `bg-[#02132d]/75 backdrop-blur-md` (NEVER `bg-black/*`) |
    | **Modal / Drawer Header**| `bg-[#0c2f60]/90 border-b border-white/15` with close button `bg-[#143d78]` |
    | **Media Stage / Photo Card** | `bg-gradient-to-b from-[#113972]/85 via-[#0c2d5c]/95 to-[#071f44] border border-[#3DE0FF]/25` |
    | **Inner Spec / Content Cards** | `bg-[#082248]/85 border border-[#1a4785] divide-y divide-[#173e75]/60` |
    | **Icon Chips & Accents** | `bg-[#133d78] text-accent-cyan border border-[#3DE0FF]/30` |
    | **Sticky Action Dock** | `bg-[#071d3f]/98 border-t border-[#1a4785]` |
    | **Control Pills / Steppers** | `bg-[#0c2f60] border border-white/20 text-white` |
  - **Reference Prototype Token Translation Invariant**:
    - When porting, elevating, or matching UI features against a reference prototype branch (e.g., `feature/storefront-elevation` or static mockups), NEVER blindly copy legacy near-black or muddy grey color values (`rgba(4, 7, 16, *)`, `rgba(13, 19, 36, *)`, `#040710`, `#070B14`).
    - While layout geometry, typography, micro-interactions, and copy must achieve 100% parity, all container backgrounds, modal dialogs, and overlay backdrops MUST be strictly translated into the canonical **Atelier Royal Sapphire Navy Matrix** (`rgba(2, 19, 45, 0.75)` backdrop, `rgba(14, 50, 102, 0.98)` dialog gradient, `rgba(17, 57, 114, 0.85)` cards).

## 5. Authentication & Entry Portal UX Standard (`signin.html` / `signup.html`)
- **Pure Editorial Photography (No Widget Clutter)**:
  - The visual hero/lifestyle panel on authentication pages must remain **100% serene and open**.
  - NEVER inject Look Switcher tabs, continuous progress timer bars, or floating shoppable product pills into login/signup visual panels.
  - Allow the human lifestyle imagery to breathe using full-bleed framing, natural daylight, soft gradient scrims, and subtle GPU Ken Burns motion (`scale(1)` → `scale(1.05)`).
- **Frictionless Auth Micro-interactions**:
  - Keep interactive micro-motion strictly focused on form usability:
    - **1-Click Demo Client Pill**: Instant credential population with cyan pulse feedback.
    - **Password Visibility Peek**: Smooth toggle between obscured and plain-text.
    - **Delicate Focus States**: Translucent 1px borders (`rgba(255, 255, 255, 0.08)` to `rgba(61, 224, 255, 0.5)`) with soft ambient shadows—strictly NO heavy/bold borders.
    - **Hardware Route Transitions**: Seamless GPU curtain cross-dissolve (`#pageTransitionOverlay`) on submission and navigation.

## 6. Visual-First Layout Guardrails ("Show, Don't Tell")
- **High Visual Ratio (70/30 Rule)**: Prioritize high-resolution lifestyle/product photography, interactive 3D/hotspot layers, animated SVG route canvases, and graphic micro-UIs over text blocks (minimum 70% visual area, ≤30% text).
- **Microcopy Discipline**: Enforce strict copy limits (headlines ≤ 4–6 words, descriptions ≤ 1–2 short sentences / 25 words). Product cards strictly Brand + Title + Price.
- **Diagrammatic & Iconographic Representation**: Convert features, specs, order tracking, guarantees, and workflows into visual pills, icon pedestals, animated SVG transit maps, and telemetry matrices.
- **Ultra-Modern & Premium Luxury Visuals**: Obsidian canvas palette (`#031838` to `#000B1A`), frosted glassmorphic containers (`rgba(11, 20, 36, 0.72)`), 1px specular inner highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.08)`), and Lucide stroke icons on dedicated 44×44px pedestals.
- **Zero Text Walls**: Never render text blocks longer than 3 lines on customer storefront routes without visual anchoring.

## 7. Mandatory Modernist Implementation Workflow (9 Steps)
> Master Reference: `.agents/rules/modernist-design-system-standards.md` (§46)
- **Step 1 — Understand**: Clarify functional requirements, existing brand constraints, and affected components.
- **Step 2 — Inspect**: Check existing architecture, tokens, styles, and reusable components before writing code.
- **Step 3 — Plan**: Determine 12-column grid, hierarchy, typography scale, spacing, imagery composition, and responsive behavior.
- **Step 4 — Implement**: Code using existing architecture and reusable components without duplication.
- **Step 5 — Browser Validation**: Launch or connect via Browser Subagent (`playwright` / `chrome-devtools`) to inspect real rendered output.
- **Step 6 — Visual QA**: Audit layout alignment, typography scale/line-height, color restraint, button/border states, image framing/composition (no blind `object-fit: cover`), and mobile responsiveness.
- **Step 7 — Refinement**: Fix visual issues based on actual browser feedback (never change CSS values blindly).
- **Step 8 — Regression Check**: Confirm existing routes, APIs, cart, forms, and accessibility remain unbroken.
- **Step 9 — Final Review**: Verify adherence to Modernist Swiss design standards before completing turn.

## 8. Mandatory nexCommerce Brand Identity Continuity
- **Always Uphold Brand Signature**: All pages (Home, Category, PDP, Cart, Tracking, Profile, Auth) must maintain continuous adherence to the nexCommerce brand guidelines.
- **Signature Gradient Preservation**: Incorporate the signature Electric Cyan $\rightarrow$ Sky $\rightarrow$ Rose gradient (`linear-gradient(90deg, #3DE0FF 0%, #38BDF8 50%, #FB7185 100%)`) on curated spotlight timers, hero micro-badges, and live telemetry tracks.
- **Harmony of Modernism & Brand Soul**: Modernist design provides the structural cleanliness, typography restraint, and hairline precision; nexCommerce brand accents provide the vital, luminous identity. Never reduce UI to lifeless greyscale.

## 9. Plain Human Language & Anti-Jargon Guardrails
- **Zero Pseudo-Technical Pretension**: Never introduce confusing AI jargon (*"synthesize"*, *"cadence"*, *"replenishment"*, *"tonal DNA"*, *"telemetry"*, *"omnibar"*, *"silhouette constraints"*) into customer-facing UI.
- **Natural Luxury Standard**: Use clear, conversational retail terms (*"Curate"*, *"Reorder Schedule"*, *"Color Palette"*, *"Add All to Bag"*, *"Clothing"*, *"Audio"*, *"Watches"*, *"Out of Stock"*, *"Chat with Stylist"*).
- **Usability First**: If a term requires explanation or slows customer comprehension, replace it immediately with plain, clear English.

## 10. Viewport-Constrained Flex Containers & Mobile Action Invariants
- **Flex Child Anti-Shrink Isolation**: Whenever a vertical container has `max-height: calc(100vh - ...)` or `overflow-y: auto`, protect vital sub-panels and lists from flexbox compression by declaring `flex-shrink: 0` and minimum heights (`min-height: 140px`).
- **Multi-Part CTA Button Layouts**: Never allow compound buttons (Icon + Text + Price Pill) to rely on implicit flex-centering without `justify-content: space-between` and `white-space: nowrap`. Mobile styles ($\le 375\text{px}$) must scale typography down to prevent multi-line breaks and pill distortion.
- **Smooth Scroll Engine Coordination**: Always delegate programmatic in-page jumps or ribbon clicks through the active smooth scroll engine (`window._nexLenis.scrollTo(...)`) with explicit offsets, falling back to `scrollIntoView` only when the smooth scroll engine is absent.

## 11. Visual Asset Replacement & Browser Cache Invalidation Invariant
- **Dedicated Asset Naming**: When updating or replacing an existing lifestyle or product image asset, always create or reference a distinct, semantic filename rather than overwriting in place with stale cache implications.
- **Explicit Version Query Parameters**: Unconditionally append cache-busting query parameters (e.g., `src="../assets/images/lifestyle/banner.jpg?v=2"`) to both HTML markup and dynamic JavaScript path maps (`bannerMap`).
- **Synchronized Bundle Cache Busting**: When updating page-level scripts or stylesheets that reference updated assets, bump the corresponding `?v=N` query strings on `<link rel="stylesheet">` and `<script>` tags across affected storefront pages.

## 12. Pure Editorial Hero Banner Standard
- **Full-Width Photography Priority**: Category, brand, and campaign hero banners must prioritize edge-to-edge, uninterrupted visual storytelling without forcing split 2-column cards, rotating capsule tabs, or shoppable overlay widgets unless explicitly requested.
- **Responsive Wide Framing**: Use a dedicated responsive container (`.plp-pure-banner-frame` / `.plp-pure-banner-img`) with wide panoramic aspect ratios (`21:7` on desktop, `16:7` on tablet, `16:9` on mobile), `object-fit: cover`, centered focal alignment, and subtle glassmorphic borders (`rgba(255, 255, 255, 0.08)`).

## 13. Universal 3-Option UI Generation & User Choice Invariant
- **Mandatory 3-Option Exploration for All UI Work**: Whenever creating any new UI (page, component, section, card, modal, drawer, or widget) or modifying/redesigning an existing UI, ALWAYS generate and present 3 distinct UI design variations with different aesthetic directions, layouts, or visual treatments rather than imposing a single design.
- **Design System & Canvas Palette Boundary**: All 3 generated design variations MUST stay strictly within the active design system and global canvas palette (e.g. Obsidian Sapphire `#01132B` / `#0A2A54`). NEVER present an out-of-system light-mode option for a single subpage in a dark-mode application unless the user explicitly requested a site-wide light mode toggle.
- **Visual Evidence & Structural Presentation**: Provide concrete visual previews or structural mockups for all 3 options (e.g. via image generation, Stitch MCP screen variants, or live interactive prototype mockups) detailing typography, composition, color treatment, and visual hierarchy.
- **Interactive User Selection Before Implementation**: Explicitly prompt the user with structured choices (or `ask_question`) to choose their preferred design direction (or combine specific elements) and await confirmation before modifying or writing production code.

## 14. Panoramic Banner Full-Model Framing & Extreme Zoom-Out Invariant
- **100% Full-Model Head-to-Toe Visibility**: Banners with human models must NEVER crop out heads, hair, feet, boots, shoes, trousers, or essential silhouette details. The full figure must be completely visible from head to toe.
- **Extreme Zoom-Out / Wide-Angle Long Shot**: For wide panoramic containers (`16:6.5`, `16:7`, `21:9`), visual prompts must specify an extreme wide-angle long shot with the camera pulled far back into the distance. Models must occupy the center 25–40% vertical band with generous dark headroom ($\ge 35\%$) and floor space ($\ge 25\%$) to prevent clipping.
- **Dark Theme Background Harmony**: In dark-mode storefronts (`#030814` / `#000B1A`), banners must use deep dark palettes (obsidian concrete, dark smoked oak, midnight twilight) that seamlessly integrate with the surrounding dark canvas.
- **Responsive CSS Framing**: Set responsive aspect ratios (`16 / 6.5` desktop down to `16 / 9` mobile) with calibrated `object-position` or `object-fit: contain` on seamless dark backgrounds.

## 15. Visual Search, File Upload & Interactive Dropzone Standards
- **Clean Unprompted Initial State (No Fake Preloaded Defaults)**:
  - File upload, visual vector search, and AI discovery modals must open in a **clean, unprompted initial state**.
  - NEVER pre-populate arbitrary sample images or fake product matches by default on modal open unless explicitly passed a deep-link URL parameter. The initial screen must invite user interaction.
- **Single Unified Upload Zone (Zero Redundancy Invariant)**:
  - The initial view must present **only ONE clear upload target** (the primary center dropzone).
  - NEVER render redundant upload inputs or dual upload buttons (e.g. a top search bar upload button AND a center dropzone upload button simultaneously) on the same screen.
- **Interactive & Accessible Dropzone Standard**:
  - Any upload dropzone or placeholder frame MUST be **fully interactive**:
    - 1-click anywhere inside the container triggers the native file picker (`fileInput.click()`).
    - Drag-and-drop (`dragenter`, `dragover`, `dragleave`, `drop`) on the entire surface with real-time visual feedback (`.dragover` glow / border pulse).
    - Full keyboard accessibility (`role="button"`, `tabindex="0"`, `keydown` on `Enter` / `Space`).
- **Instant 1-Click Demo Action (`✨ Try Demo`)**:
  - Always provide a dedicated, prominent **`✨ Try Demo`** button alongside `Browse Photos` inside file upload / AI feature components.
  - Allows stakeholders, shoppers, or automated test harnesses without a local image file to immediately test the end-to-end matching pipeline in 1 click using a curated sample asset.
- **Clean 2-Phase State Transition Architecture**:
  - **Phase 1 (Initial / Empty)**: Single central dropzone + `Browse Photos` and `✨ Try Demo` action pair. Top search/chip bars remain hidden.
  - **Phase 2 (Active / Searched)**: Center dropzone transforms into the matching product grid; top active photo bar appears showing the uploaded image thumbnail, match count, and a simple `Change Photo` action.
- **Minimalist Jargon-Free UX**:
  - Keep the interface free of extraneous capsule tags or confusing technical terms (*"Neural Vector Scan"*, *"1536-dim embeddings"*, *"Silhouette constraints"*). Keep the focus squarely on the photo and the matching products with 1-click **Add to Bag**.

## 16. Modal Product Card Scaling & Viewport Height Resilience
- **Modal Product Card Height Capping**:
  Inside overlay modals (`#aiSearchModal`, `#aiTourModal`), avoid unbounded `aspect-[1/1.05]` or tall card wrappers that push prices and CTAs below the fold. Always cap image containers at `h-36 sm:h-40 md:h-44` with `object-fit: contain` inside radial studio wrappers so that all card details (brand, title, swatches, price, reasoning links, and Quick Add buttons) remain 100% visible on displays scaled at 125%–150% (550px–650px effective viewport height).
- **Natural Language Tokenization & Stopword Cleansing Invariant**:
  When conversational natural language queries (e.g. `"Warm coat for a cold weekend in Edinburgh"`) are forwarded to catalog discovery (`/discovery?q=...`), always sanitize connecting words via a dedicated stopword filter (`new Set(['for', 'a', 'an', 'in', 'and', 'the', 'with', 'under', 'to', 'of', 'on', 'at', 'is', 'by', 'or', 'from'])`). Never allow prepositions or connecting words to be rendered as standalone filter chips (`Understood Context: For ✕`).





