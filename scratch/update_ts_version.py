import glob

files = glob.glob('*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    content = content.replace('src="js/theme-switcher.js"', 'src="js/theme-switcher.js?v=3"')
    content = content.replace('src="js/theme-switcher.js?v=2"', 'src="js/theme-switcher.js?v=3"')
    
    with open(f, 'w', encoding='utf-8') as fp:
        fp.write(content)

print(f"Updated theme-switcher in {len(files)} files.")
