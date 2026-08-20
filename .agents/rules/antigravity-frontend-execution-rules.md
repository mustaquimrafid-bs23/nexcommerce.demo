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
- **Visual Auditing**: Capture a screenshot of the viewport and verify there are no overlapping text layouts, layout shifts, or responsive design breaks across breakpoints.

## 4. Canvas & Layout Scoping Invariants
- **Global Canvas Palette Continuity**: Do NOT introduce isolated body background overrides. Maintain continuous brand canvas gradients across all routes.
- **Container-Scoped Component Cards**: Do not place dark component background fills on full-width section wrappers. Wrap cards in `.container` to prevent horizontal edge-to-edge color bands.
- **Complete Viewport Vertical Inspection**: Always audit every subordinate section (filters, chips, search refinement bars) from header to footer before submitting work.

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
- **High Visual Ratio**: Prioritize high-resolution lifestyle/product photography, interactive 3D/hotspot layers, and graphic micro-UIs over text blocks (minimum 70% visual area).
- **Microcopy Discipline**: Enforce strict copy limits (headlines ≤ 6 words, descriptions ≤ 2 sentences / 25 words).
- **Diagrammatic & Iconographic Representation**: Convert features, specs, guarantees, and workflows into visual pills, icon pedestals, and progress diagrams.
- **Zero Text Walls**: Never render text blocks longer than 3 lines on customer storefront routes without visual anchoring.



