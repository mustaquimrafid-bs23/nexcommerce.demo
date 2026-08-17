# Browser Preview & Website Launch Rule

## Trigger
When the user says "open the website", "open site", "preview website", or asks to see/open the running storefront:

## Mandatory Execution Steps
1. **Verify / Start Local HTTP Server**:
   - Check if a background server task is running (e.g., `python -m http.server 8080`).
   - If not running, start it in background daemon mode on port 8080.
2. **Open in Browser Preview**:
   - Launch the interactive **Browser Preview** (`browser_subagent`) targeting `http://localhost:8080/index.html` (or the requested page).
   - Render and verify that the homepage displays properly and capture the initial view for the user.
