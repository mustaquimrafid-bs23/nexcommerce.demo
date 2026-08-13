import os, re

PROTECTED = {'account.html', 'profile.html', 'tracking.html'}

HTML_FILES = [f for f in os.listdir('.') if f.endswith('.html')
              and f not in ('foundation.html',)]

AUTH_SCRIPT = '<script src="js/auth.js"></script>'
AUTH_GUARD  = 'NexAuth.requireAuth();'

for fname in HTML_FILES:
    with open(fname, 'r', encoding='utf-8') as fh:
        content = fh.read()

    changed = False

    # 1. Inject auth.js before </body> if not already present
    if AUTH_SCRIPT not in content:
        content = content.replace('</body>', f'  {AUTH_SCRIPT}\n</body>', 1)
        changed = True

    # 2. Replace account.html nav links with data-auth-account
    def replace_account_link(m):
        original = m.group(0)
        if 'data-auth-account' in original:
            return original
        updated = original.replace('<a ', '<a data-auth-account ', 1)
        return updated

    content, n = re.subn(
        r'<a\s[^>]*href="account\.html"[^>]*>[Aa][Cc][Cc][Oo][Uu][Nn][Tt]</a>',
        replace_account_link,
        content
    )
    if n:
        changed = True

    # 3. Inject guard on protected pages
    if fname in PROTECTED and AUTH_GUARD not in content:
        content = content.replace(
            AUTH_SCRIPT,
            AUTH_SCRIPT + f'\n  <script>{AUTH_GUARD}</script>'
        )
        changed = True

    if changed:
        with open(fname, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'[updated] {fname}')
    else:
        print(f'[skip]    {fname}')

print('\nDone.')
