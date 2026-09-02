# Browser Preview & Testing Standards

## Primary Tool: Playwright MCP
Always prioritize using **Playwright MCP** tools (`call_mcp_tool` with `ServerName: "playwright"`) for all browser navigation, visual previews, DOM inspection, and screenshot verification.

### Key Tools & Workflows:
1. **Navigation**: `browser_navigate` with active dev server URLs (e.g., `http://localhost:3000/...`).
2. **Screenshots & Visual Verification**: `browser_take_screenshot` (with `scale: "css"` or `scale: "device"`, and `fullPage: true/false`).
3. **DOM & Actionability Inspection**: `browser_snapshot` and `browser_find` for DOM structure verification.
4. **Interactions**: `browser_click`, `browser_hover`, `browser_type`, `browser_fill_form` for interactive testing.

### Operational Guardrails:
- Serve preview files via the active local server (`http://localhost:3000/`) rather than `file:///` URLs when using browser automation tools.
- Capture screenshots after critical UI and motion milestones to visually verify layouts and responsiveness.

---

## 4. Visual Preview & Standalone Mockup Background Fidelity
When creating standalone visual preview files or mockups (`preview-*.html` or brainstorming artifacts):
1. **Link Global Design System**: Always include `<link rel="stylesheet" href="css/design-system.css">` rather than defining ad-hoc inline design tokens or color variables.
2. **Exact Background Foundation**: Always set `body { background: var(--bg-main, #012148); }` to match the storefront's exact page background and lighting. Never invent arbitrary background hex colors (e.g., `#070D18`).

---

## 5. Antigravity Agent Artifact Verification Invariant
Before submitting any frontend Artifact or UI task as complete:
1. **Launch/Connect Localhost Server**: Ensure a local server is running (e.g., port 8080 or 3000).
2. **Browser Subagent / DevTools Inspection**: Use the built-in Browser Subagent (`chrome-devtools` or `playwright`) to load the page.
3. **Screenshot Audit**: Capture a viewport screenshot and inspect for overlapping text layouts, unexpected layout shifts, or responsive design breaks.

---

## 6. Interactive Action Cluster & Overlay Non-Overlap Invariant
When cards, overlays, or floating docks contain 2+ adjacent action buttons or interactive controls:
1. **Trigger Active/Hover State**: Trigger the container's `:hover` / active state during browser subagent inspection.
2. **Assert Distinct Bounding Boxes**: Verify that button bounding boxes do not intersect (`rectA.right <= rectB.left - gap`), maintaining $\ge 6\text{–}8\text{px}$ clear separation.
3. **Hit Target Independence**: Verify that each action button in the cluster can be clicked independently without triggering accidental sibling actions or mis-clicks.

---

## 7. Local Test Server URL Query Handling Invariant
When creating ad-hoc Node.js HTTP servers to serve static workspace files for Playwright / browser testing, ALWAYS parse and strip URL query strings (`req.url.split('?')[0]` or `url.parse(req.url).pathname`) before resolving file paths with `fs.readFile`. This guarantees that cache-busted or parameterized static assets (`design-system.css?v=40`, `cart.js?v=6`, `products/p1.png?v=2`) resolve cleanly with HTTP 200 rather than throwing false 404 Not Found errors.

---

## 8. Structural DOM Order & Reference Alignment Invariant
When converting, migrating, or verifying visual parity between a reference prototype (e.g. `http://localhost:8080`) and a production framework (e.g. Next.js `http://localhost:3000`):

1. **Strict Flex/Grid Sibling Order Verification**:
   - Automated tests and browser inspection scripts MUST NOT merely assert element existence (`id="..."`).
   - For global chrome (Header, Announcement Bar, Footer, Toolbars, Action Bars), tests must verify that interactive child elements appear in the exact semantic sibling sequence as the reference (e.g., `[Left: Brand/Nav] -> [Center: Search] -> [Right: Location/Tools/Cart]`).
   - Sibling order must be verified using DOM hierarchy (`element.parentElement.className`, `Array.from(parent.children).indexOf(...)`) or relative bounding box coordinates ($X_{left} < X_{center} < X_{right}$).

2. **Reference DOM & Layout Coordinate Sweep**:
   - Before declaring parity complete on any page or shared component, execute an automated Playwright inspection script querying both running endpoints to assert:
     - Equivalent child count and order within major layout slots.
     - Centering symmetry of primary focal elements (e.g., Search Bar is centered within $\pm 20\text{px}$ of viewport midpoint).
     - Identical placeholder copy, badge labels, and icon pairings.

3. **Zero Orphaned Action Pills**:
   - Utility or location pills (e.g. Delivery Gate, Currency, Store Locator) must never be inserted into primary navigation gaps between the brand nav and search bars. They must belong strictly to their designated action container (`nav-right-actions`).

---

## 9. Source-Template Fidelity & Mandatory Overlay Triggering
When converting prototype components (`js/*.js`, `pages/*.html`) into Next.js/React:

1. **Direct Template Translation (Zero Hallucination)**:
   - Always open the prototype's JavaScript/HTML file (e.g. `js/concierge.js`, `js/cart.js`, `index.html`) and inspect the exact template markup.
   - Do NOT improvise, "elevate", or invent new headers, avatars, status badges, or button layouts unless explicitly requested. Every title, tag, placeholder, and button text must match the prototype template verbatim.

2. **Mandatory Interactive Overlay Triggering in Visual Audits**:
   - Capturing only the idle state of a page is strictly insufficient.
   - For every drawer, slide-out, modal, and floating assistant, Playwright MUST programmatically click the trigger button (e.g. `#nexConciergeFloatingPill`, `#searchTriggerBtn`, Quick Look triggers), take a screenshot of the OPEN state, and compare it directly to the prototype's open state.

3. **Composite Component Assertions in Automated Tests**:
   - Tests for interactive features inside modals or drawers must assert the host container's header title, layout grid, and primary action copy in addition to individual feature button IDs.



