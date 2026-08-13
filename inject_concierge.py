import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ('foundation.html')]

button_html = """
        <button id="conciergeNavTrigger" class="concierge-nav-btn" aria-label="Open Style Concierge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-sparkles" style="display:inline-block; vertical-align:-0.125em;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span>CONCIERGE</span>
        </button>"""

scripts_to_inject = [
    '<script src="js/ai-engine.js"></script>',
    '<script src="js/intent-parser.js"></script>',
    '<script src="js/catalog-engine.js"></script>',
    '<script src="js/style-profile.js"></script>',
    '<script src="js/context-retention.js"></script>',
    '<script src="js/concierge-engine.js"></script>',
    '<script src="js/concierge.js"></script>'
]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject button
    if 'id="conciergeNavTrigger"' not in content:
        # Find <div class="nav-right"...>
        content = re.sub(r'(<div class="nav-right"[^>]*>)', r'\1' + button_html, content, count=1)

    # Inject scripts
    for script in scripts_to_inject:
        if script not in content and script.replace('.js"></script>', '.js?v=2"></script>') not in content:
            content = content.replace('</body>', f'  {script}\n</body>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} files.")
