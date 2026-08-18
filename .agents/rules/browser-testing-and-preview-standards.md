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
