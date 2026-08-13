import os
import glob
import re

MINI_CART_HTML = """
<!-- ==========================================================================
     MINI CART (SIDE DRAWER)
     ========================================================================== -->
<div id="nexMiniCartOverlay" class="minicart-overlay" aria-hidden="true"></div>
<aside id="nexMiniCartDrawer" class="minicart-drawer" aria-hidden="true" role="dialog" aria-label="Shopping Bag">
  <div class="minicart-header">
    <div class="minicart-title">Shopping Bag</div>
    <button id="minicartCloseBtn" class="minicart-close" aria-label="Close Bag">&times;</button>
  </div>
  <div id="minicartBody" class="minicart-body">
    <!-- Populated by cart.js -->
  </div>
  <div id="minicartFooter" class="minicart-footer" style="display: none;">
    <div class="minicart-subtotal">
      <span>Subtotal</span>
      <span id="minicartSubtotalValue">BDT 0</span>
    </div>
    <a href="cart.html" class="btn-primary-commerce minicart-checkout-btn">VIEW BAG &amp; CHECKOUT</a>
  </div>
</aside>
"""

def inject_minicart():
    html_files = glob.glob("*.html")
    
    for filepath in html_files:
        # Skip checkout, they shouldn't be distracted
        if "checkout.html" in filepath:
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'id="nexMiniCartDrawer"' in content:
            print(f"Skipping {filepath} (Mini Cart already injected)")
            continue
            
        # Replace </body> with minicart + </body>
        new_content = re.sub(
            r'</body>',
            lambda m: f"{MINI_CART_HTML}\n</body>",
            content,
            flags=re.IGNORECASE
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected Mini Cart into {filepath}")

if __name__ == "__main__":
    inject_minicart()
