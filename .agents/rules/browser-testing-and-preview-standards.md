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
