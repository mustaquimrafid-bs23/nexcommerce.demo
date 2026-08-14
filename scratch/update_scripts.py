import glob

files = glob.glob('*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    content = content.replace('src="js/concierge-engine.js"', 'src="js/concierge-engine.js?v=3"')
    content = content.replace('src="js/concierge-engine.js?v=2"', 'src="js/concierge-engine.js?v=3"')
    content = content.replace('src="js/concierge.js"', 'src="js/concierge.js?v=3"')
    content = content.replace('src="js/concierge.js?v=2"', 'src="js/concierge.js?v=3"')
    content = content.replace('src="js/ai-engine.js"', 'src="js/ai-engine.js?v=3"')
    content = content.replace('src="js/ai-engine.js?v=2"', 'src="js/ai-engine.js?v=3"')
    
    with open(f, 'w', encoding='utf-8') as fp:
        fp.write(content)

print(f"Updated {len(files)} files.")
