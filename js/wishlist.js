/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Wardrobe Vault UI Controller (Modernist Luxury Edition)
   ═══════════════════════════════════════════════════════════════════════════ */

(function(root) {
  'use strict';

  var selectedIds = new Set();
  var cardStateMap = {}; // { id: { finish: '...', size: '...', image: '...' } }
  var activeCategoryFilter = 'all';

  var SPOTLIGHT_CAPSULES = [
    {
      key: 'all',
      eyebrow: 'PRIVATE CURATION OVERVIEW',
      title: 'Your Complete Atelier Archive',
      desc: 'Every tailored silhouette, acoustic instrument, and artisanal piece reserved across your private vault.',
      flavorTag: 'Atelier Reserved'
    },
    {
      key: 'apparel',
      eyebrow: 'MAISON APPAREL CAPSULE',
      title: 'Tailored Silhouettes, Held in Reserve',
      desc: 'Structured outerwear and considered knitwear selected for drape and seasonal versatility.',
      flavorTag: 'Atelier Ready'
    },
    {
      key: 'acoustics',
      eyebrow: 'STUDIO ACOUSTICS CAPSULE',
      title: 'Sound Engineered for the Private Ear',
      desc: 'Precision-tuned instruments with beryllium drivers and hand-finished lambskin pads.',
      flavorTag: 'Studio Grade'
    },
    {
      key: 'footwear',
      eyebrow: 'FOOTWEAR & LEATHER CAPSULE',
      title: 'Hand-Finished Leather, Considered Craft',
      desc: 'Full-grain leathers and suede finishes shaped on custom lasts for an artisanal stride.',
      flavorTag: 'Italian Craft'
    }
  ];

  function escapeStr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function resolveImg(src) {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return src.startsWith('../') ? src : '../' + src;
  }

  function renderCard(item, categoryKey) {
    var state = cardStateMap[item.id] || {
      finish: item.variants && item.variants.finishes ? item.variants.finishes[0].id : null,
      size: item.variants && item.variants.sizes ? (item.variants.sizes.find(function(s){return s.default;}) || item.variants.sizes[0]).id : null,
      image: item.image
    };
    cardStateMap[item.id] = state;

    var isSelected = selectedIds.has(item.id);
    var swatchesHtml = '';
    if (item.variants && item.variants.finishes && item.variants.finishes.length > 1) {
      swatchesHtml = '<div class="card-swatch-list" aria-label="Available Finishes">';
      item.variants.finishes.forEach(function(f) {
        var activeClass = f.id === state.finish ? ' active' : '';
        swatchesHtml += '<button type="button" class="card-swatch-disc' + activeClass + '" data-action="set-finish" data-id="' + item.id + '" data-finish="' + f.id + '" style="background: ' + f.color + '" title="' + escapeStr(f.name) + '" aria-label="' + escapeStr(f.name) + '"></button>';
      });
      swatchesHtml += '</div>';
    }

    var stockBeaconHtml = '';
    if (item.stock) {
      var dotClass = item.stockStatus === 'low-stock' ? 'low-stock' : 'in-stock';
      stockBeaconHtml = '<div class="card-stock-beacon"><span class="card-stock-dot ' + dotClass + '"></span><span>' + escapeStr(item.stock) + '</span></div>';
    }

    return `
      <div class="wishlist-card${isSelected ? ' selected' : ''}" id="wishCard_${item.id}" data-category="${categoryKey}" data-id="${item.id}">
        <div class="wishlist-card-specular" aria-hidden="true"></div>

        <!-- Top-Left Ambient Select Ring -->
        <button type="button" class="card-select-ring" data-action="toggle-select" data-id="${item.id}" aria-label="Select ${escapeStr(item.title)}">
          <i data-lucide="check" style="width: 13px; height: 13px; stroke-width: 3;"></i>
        </button>

        <!-- Top-Right Actions Cluster (Isolated side-by-side flex layout) -->
        <div class="card-top-actions">
          <button type="button" class="card-quicklook-btn" data-action="open-quicklook" data-id="${item.id}" aria-label="Quick look for ${escapeStr(item.title)}" title="Quick Look">
            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
          </button>
          <button type="button" class="wishlist-remove-btn" data-action="remove-wish" data-id="${item.id}" aria-label="Remove ${escapeStr(item.title)} from curation" title="Remove from Curation">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
          </button>
        </div>

        <div class="wishlist-card-media">
          <a href="product.html?id=${item.id}" class="wishlist-card-img-anchor" aria-label="View ${escapeStr(item.title)}">
            <img class="wishlist-card-img" id="cardImg_${item.id}" src="${resolveImg(state.image)}" alt="${escapeStr(item.title)}" loading="lazy" />
          </a>
          <div class="card-media-footer">
            ${swatchesHtml}
            ${stockBeaconHtml}
          </div>
        </div>

        <div class="wishlist-card-body">
          <span class="wishlist-card-brand">${escapeStr(item.brand || 'MAISON ATELIER')}</span>
          <a href="product.html?id=${item.id}" class="wishlist-card-title-link">
            <h2 class="wishlist-card-name">${escapeStr(item.title)}</h2>
          </a>
          <div class="wishlist-card-price-row">
            <span class="wishlist-card-price">€ ${Number(item.price).toFixed(2)}</span>
            <button type="button" class="wishlist-move-bag-btn" data-action="move-to-bag" data-id="${item.id}" aria-label="Add ${escapeStr(item.title)} to Bag">
              <i data-lucide="shopping-bag" style="width: 11px; height: 11px;"></i>
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderGrid() {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;

    var ids = Engine.getSavedWishlist();
    var catalog = Engine.getCatalog();
    var grid = document.getElementById('wishlistGrid');
    var emptyState = document.getElementById('wishlistEmptyState');
    var statsBar = document.getElementById('wishlistStatsBar');
    var spotlightBar = document.getElementById('wishlistSpotlightBar');
    var countDisplay = document.getElementById('wishlistCountDisplay');
    var valDisplay = document.getElementById('wishlistValuationDisplay');
    var heroCount = document.getElementById('vaultPieceCount');
    var heroVal = document.getElementById('vaultTotalValue');

    if (!ids || ids.length === 0) {
      if (grid) { grid.style.display = 'none'; grid.innerHTML = ''; }
      if (statsBar) statsBar.style.display = 'none';
      if (spotlightBar) spotlightBar.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (heroCount) heroCount.textContent = '0';
      if (heroVal) heroVal.textContent = '€ 0';
      if (countDisplay) countDisplay.textContent = '0 Pieces Reserved';
      if (valDisplay) valDisplay.textContent = '€ 0.00';

      selectedIds.clear();
      updateBatchDock();
      updateBadgeCounts(0);
      updateTabCountBadges();
      return;
    }

    if (grid) grid.style.display = 'grid';
    if (statsBar) statsBar.style.display = 'flex';
    if (spotlightBar) spotlightBar.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    var totalValuation = 0;
    var html = '';

    ids.forEach(function(id) {
      var item = catalog[id] || {
        id: id,
        title: 'Atelier Curated Piece',
        brand: 'MAISON ARCHIVE',
        price: 180,
        image: 'assets/images/products/plp_overcoat.png',
        stock: 'Available in Atelier',
        stockStatus: 'in-stock'
      };
      totalValuation += item.price;
      var cat = Engine.categoryKeyForTag(item.brand || '');
      html += renderCard(item, cat);
    });

    if (grid) grid.innerHTML = html;

    if (countDisplay) countDisplay.textContent = ids.length + (ids.length === 1 ? ' Piece Reserved' : ' Pieces Reserved');
    if (valDisplay) valDisplay.textContent = '€ ' + Number(totalValuation).toFixed(2);
    if (heroCount) heroCount.textContent = ids.length;
    if (heroVal) heroVal.textContent = '€ ' + Math.round(totalValuation).toLocaleString('de-DE');

    updateBadgeCounts(ids.length);
    updateTabCountBadges();
    applyGridFilter(activeCategoryFilter, false);
    updateBatchDock();

    if (window.lucide) window.lucide.createIcons();
    init3DTilt();
  }

  function updateBadgeCounts(count) {
    var badges = [document.getElementById('headerWishlistCount'), document.getElementById('mobileWishlistCount')];
    badges.forEach(function(b) {
      if (b) b.textContent = count;
    });
  }

  function updateTabCountBadges() {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var ids = Engine.getSavedWishlist();
    var stats = Engine.computeCapsuleStats(ids);

    document.querySelectorAll('.spotlight-tab-btn[data-tab-filter]').forEach(function(tab) {
      var filter = tab.getAttribute('data-tab-filter');
      var count = stats[filter] ? stats[filter].count : 0;
      var existing = tab.querySelector('.tab-count-badge');
      if (existing) existing.remove();
      var badge = document.createElement('span');
      badge.className = 'tab-count-badge';
      badge.textContent = count;
      tab.appendChild(badge);
    });
  }

  function applyGridFilter(key, animated) {
    activeCategoryFilter = key;
    var grid = document.getElementById('wishlistGrid');
    var emptyMsg = document.getElementById('wishlistFilterEmpty');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.wishlist-card'));
    var visibleCount = 0;

    cards.forEach(function(card) {
      var matches = key === 'all' || card.getAttribute('data-category') === key;
      if (matches) visibleCount++;
      card.style.display = matches ? '' : 'none';
    });

    if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'flex' : 'none';

    // Update capsule title & copy
    var capsule = SPOTLIGHT_CAPSULES.find(function(c) { return c.key === key; }) || SPOTLIGHT_CAPSULES[0];
    var titleEl = document.getElementById('wishlistSpotlightTitle');
    var descEl = document.getElementById('wishlistSpotlightDesc');
    var eyebrowEl = document.getElementById('wishlistSpotlightEyebrow');
    var tagsEl = document.getElementById('wishlistSpotlightTags');
    var Engine = window.NexWishlistEngine;
    var stats = Engine ? Engine.computeCapsuleStats(Engine.getSavedWishlist())[key] : { count: 0, value: 0 };

    if (titleEl) titleEl.textContent = capsule.title;
    if (descEl) descEl.textContent = capsule.desc;
    if (eyebrowEl) {
      var span = eyebrowEl.querySelector('span');
      if (span) span.textContent = capsule.eyebrow;
    }
    if (tagsEl && stats) {
      tagsEl.innerHTML = `
        <span class="plp-spotlight-tag">${stats.count} ${stats.count === 1 ? 'Piece' : 'Pieces'} Saved</span>
        <span class="plp-spotlight-tag tabular-nums">€ ${Number(stats.value).toFixed(2)}</span>
        <span class="plp-spotlight-tag">${capsule.flavorTag}</span>
      `;
    }
  }

  function toggleItemSelection(id) {
    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }
    var card = document.getElementById('wishCard_' + id);
    if (card) {
      card.classList.toggle('selected', selectedIds.has(id));
    }
    updateBatchDock();
  }

  function selectAll(force) {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var ids = Engine.getSavedWishlist();

    if (force === false || (force === undefined && selectedIds.size === ids.length)) {
      selectedIds.clear();
    } else {
      ids.forEach(function(id) { selectedIds.add(id); });
    }

    document.querySelectorAll('.wishlist-card').forEach(function(card) {
      var id = card.getAttribute('data-id');
      card.classList.toggle('selected', selectedIds.has(id));
    });

    updateBatchDock();
  }

  function updateBatchDock() {
    var dock = document.getElementById('wishlistBatchDock');
    if (!dock) return;

    var countEl = document.getElementById('batchSelectedCount');
    var valEl = document.getElementById('batchSelectedValue');
    var Engine = window.NexWishlistEngine;
    var catalog = Engine ? Engine.getCatalog() : {};

    var count = selectedIds.size;
    if (count === 0) {
      dock.classList.remove('active');
      return;
    }

    var sum = 0;
    selectedIds.forEach(function(id) {
      if (catalog[id]) sum += catalog[id].price;
    });

    if (countEl) countEl.textContent = count;
    if (valEl) valEl.textContent = '€ ' + Number(sum).toFixed(2);
    dock.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  function moveSelectedToBag(btn) {
    var Engine = window.NexWishlistEngine;
    if (!Engine || selectedIds.size === 0) return;

    var itemsToAdd = Array.from(selectedIds);
    var originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>ADDING ' + itemsToAdd.length + ' PIECES&hellip;</span>';
    }

    setTimeout(function() {
      if (window.nexCart) {
        itemsToAdd.forEach(function(id) {
          var state = cardStateMap[id] || {};
          var payload = Engine.createCartPayload(id, state.size, state.finish);
          if (payload) window.nexCart.addItem(payload);
        });
      }

      if (btn) {
        btn.innerHTML = '<span>&#10003; ADDED TO BAG</span>';
        btn.style.background = '#34D399';
        btn.style.color = '#000000';
      }

      setTimeout(function() {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalHtml || '<i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i><span>MOVE TO BAG</span>';
          btn.style.background = '';
          btn.style.color = '';
          if (window.lucide) window.lucide.createIcons({ nodes: [btn] });
        }
        selectedIds.clear();
        document.querySelectorAll('.wishlist-card.selected').forEach(function(c) {
          c.classList.remove('selected');
        });
        updateBatchDock();
      }, 1600);
    }, 400);
  }

  function moveAllToBag(btn) {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var ids = Engine.getSavedWishlist();
    if (!ids || ids.length === 0) return;

    var targetIds = ids.filter(function(id) {
      if (activeCategoryFilter === 'all') return true;
      var item = Engine.getProduct(id);
      return item && Engine.categoryKeyForTag(item.brand || '') === activeCategoryFilter;
    });

    if (targetIds.length === 0) return;

    var originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>ADDING ' + targetIds.length + ' PIECES&hellip;</span>';
    }

    setTimeout(function() {
      if (window.nexCart) {
        targetIds.forEach(function(id) {
          var state = cardStateMap[id] || {};
          var payload = Engine.createCartPayload(id, state.size, state.finish);
          if (payload) window.nexCart.addItem(payload);
        });
      }

      if (btn) {
        btn.innerHTML = '<span>&#10003; ALL ADDED TO BAG</span>';
        btn.style.background = '#34D399';
        btn.style.color = '#000000';
      }

      setTimeout(function() {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalHtml || '<i data-lucide="shopping-bag" style="width: 13px; height: 13px;"></i><span>MOVE ALL TO BAG</span>';
          btn.style.background = '';
          btn.style.color = '';
          if (window.lucide) window.lucide.createIcons({ nodes: [btn] });
        }
      }, 1800);
    }, 400);
  }

  function shareCuratedEdit(btn) {
    var url = window.location.href;
    var originalHtml = btn ? btn.innerHTML : '';

    function showCopied() {
      if (!btn) return;
      btn.innerHTML = '<span>&#10003; LINK COPIED</span>';
      setTimeout(function() { btn.innerHTML = originalHtml; if (window.lucide) window.lucide.createIcons({ nodes: [btn] }); }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showCopied).catch(function() {
        if (btn) btn.innerHTML = '<span>SHARE READY</span>';
      });
    } else {
      showCopied();
    }
  }

  function removeSelected() {
    var Engine = window.NexWishlistEngine;
    if (!Engine || selectedIds.size === 0) return;
    selectedIds.forEach(function(id) {
      Engine.removeFromWishlist(id);
    });
    selectedIds.clear();
    renderGrid();
  }

  function clearAllWishlist() {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    Engine.clearWishlist();
    selectedIds.clear();
    renderGrid();
  }

  function resetDefaultSeed() {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    Engine.saveWishlist(Engine.DEFAULT_SEED.slice());
    renderGrid();
  }

  function init3DTilt() {
    var grid = document.getElementById('wishlistGrid');
    if (!grid || grid._tiltInit) return;
    grid._tiltInit = true;

    grid.addEventListener('mousemove', function(e) {
      var card = e.target.closest('.wishlist-card');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotX = ((y - cy) / cy) * -4.5;
      var rotY = ((x - cx) / cx) * 4.5;

      card.style.transform = 'perspective(1000px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
      var specular = card.querySelector('.wishlist-card-specular');
      if (specular) {
        specular.style.opacity = '1';
        specular.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.08) 0%, transparent 65%)';
      }
    });

    grid.addEventListener('mouseleave', function(e) {
      var card = e.target.closest ? e.target.closest('.wishlist-card') : null;
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        var specular = card.querySelector('.wishlist-card-specular');
        if (specular) specular.style.opacity = '0';
      }
    }, true);
  }

  // Quick Look Drawer Controller
  var activeQuickLookId = null;
  var quickLookLastFocus = null;

  function openQuickLook(id) {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var item = Engine.getProduct(id);
    if (!item) return;

    activeQuickLookId = id;
    quickLookLastFocus = document.activeElement;

    var overlay = document.getElementById('quicklookOverlay');
    var drawer = document.getElementById('quicklookDrawer');
    var body = document.getElementById('quicklookBody');
    var footer = document.getElementById('quicklookFooter');
    if (!drawer || !overlay || !body) return;

    var gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
    var activeState = cardStateMap[id] || {
      finish: item.variants && item.variants.finishes ? item.variants.finishes[0].id : null,
      size: item.variants && item.variants.sizes ? (item.variants.sizes.find(function(s){return s.default;}) || item.variants.sizes[0]).id : null
    };
    cardStateMap[id] = activeState;

    var thumbsHtml = gallery.map(function(g, idx) {
      return '<button type="button" class="quicklook-thumb' + (idx === 0 ? ' active' : '') + '" data-img-idx="' + idx + '" title="View angle ' + (idx + 1) + '" aria-label="View photo ' + (idx + 1) + '"><img src="' + resolveImg(g) + '" alt="' + escapeStr(item.title) + '" /></button>';
    }).join('');

    // Finish Variants
    var finishesHtml = '';
    if (item.variants && item.variants.finishes && item.variants.finishes.length > 0) {
      finishesHtml = '<div style="margin-top: 14px;">' +
        '<div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 8px;">Selected Finish</div>' +
        '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' +
        item.variants.finishes.map(function(f) {
          var active = f.id === activeState.finish;
          return '<button type="button" class="ql-variant-finish-btn' + (active ? ' active' : '') + '" data-ql-finish="' + f.id + '" style="height: 32px; padding: 0 12px; border-radius: 9999px; background: ' + (active ? 'rgba(61,224,255,0.15)' : 'rgba(255,255,255,0.06)') + '; border: 1px solid ' + (active ? '#3DE0FF' : 'rgba(255,255,255,0.15)') + '; color: #FFFFFF; font-size: 11px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">' +
            '<span style="width: 10px; height: 10px; border-radius: 50%; background: ' + f.color + '; display: inline-block;"></span>' +
            '<span>' + escapeStr(f.name) + '</span>' +
          '</button>';
        }).join('') +
        '</div></div>';
    }

    // Size Variants
    var sizesHtml = '';
    if (item.variants && item.variants.sizes && item.variants.sizes.length > 0) {
      sizesHtml = '<div style="margin-top: 14px;">' +
        '<div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 8px;">Select Size</div>' +
        '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' +
        item.variants.sizes.map(function(s) {
          var active = s.id === activeState.size;
          return '<button type="button" class="ql-variant-size-btn' + (active ? ' active' : '') + '" data-ql-size="' + s.id + '" ' + (s.inStock ? '' : 'disabled ') + 'style="height: 34px; min-width: 44px; padding: 0 12px; border-radius: 6px; background: ' + (active ? '#3DE0FF' : (s.inStock ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)')) + '; border: 1px solid ' + (active ? '#3DE0FF' : 'rgba(255,255,255,0.15)') + '; color: ' + (active ? '#000B1A' : (s.inStock ? '#FFFFFF' : 'rgba(255,255,255,0.3)')) + '; font-size: 11px; font-weight: 700; cursor: ' + (s.inStock ? 'pointer' : 'not-allowed') + '; display: inline-flex; align-items: center; justify-content: center;">' +
            escapeStr(s.name) +
          '</button>';
        }).join('') +
        '</div></div>';
    }

    var provenanceHtml = '';
    if (item.provenance) {
      provenanceHtml = '<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">' +
        item.provenance.map(function(p) {
          return '<span style="font-size: 11px; padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85);"><strong style="color: #3DE0FF;">' + escapeStr(p.label) + ':</strong> ' + escapeStr(p.value) + '</span>';
        }).join('') + '</div>';
    }

    body.innerHTML = `
      <div class="quicklook-media-stage">
        <img id="quicklookMainImg" class="quicklook-main-img" src="${resolveImg(gallery[0])}" alt="${escapeStr(item.title)}" />
      </div>
      <div class="quicklook-filmstrip">
        ${thumbsHtml}
      </div>
      <div>
        <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #3DE0FF; display: block; margin-bottom: 4px;">${escapeStr(item.brand || 'ATELIER')}</span>
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0 0 6px;">${escapeStr(item.title)}</h2>
        <div style="font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; color: #FFFFFF; font-variant-numeric: tabular-nums;">€ ${Number(item.price).toFixed(2)}</div>
      </div>
      ${finishesHtml}
      ${sizesHtml}
      ${provenanceHtml}
    `;

    if (footer) {
      footer.innerHTML = `
        <button type="button" class="btn-primary-commerce" id="quicklookAddBtn" style="flex: 1; height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
          <span id="quicklookAddBtnText">ADD TO BAG · € ${Number(item.price).toFixed(2)}</span>
        </button>
        <a href="product.html?id=${item.id}" class="btn-secondary-action" style="height: 46px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center;" title="View Full Page">
          <i data-lucide="arrow-up-right" style="width: 16px; height: 16px;"></i>
        </a>
      `;
    }

    overlay.classList.add('active');
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    if (window.lucide) window.lucide.createIcons();

    var closeBtn = drawer.querySelector('#quicklookCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeQuickLook() {
    var overlay = document.getElementById('quicklookOverlay');
    var drawer = document.getElementById('quicklookDrawer');
    if (overlay) overlay.classList.remove('active');
    if (drawer) {
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
    activeQuickLookId = null;
    if (quickLookLastFocus && quickLookLastFocus.focus) {
      quickLookLastFocus.focus();
    }
  }

  // Central Event Delegation
  document.addEventListener('click', function(e) {
    var toggleSelectBtn = e.target.closest('[data-action="toggle-select"]');
    if (toggleSelectBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleItemSelection(toggleSelectBtn.getAttribute('data-id'));
      return;
    }

    var openQlBtn = e.target.closest('[data-action="open-quicklook"]');
    if (openQlBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickLook(openQlBtn.getAttribute('data-id'));
      return;
    }

    var removeBtn = e.target.closest('[data-action="remove-wish"]');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      var id = removeBtn.getAttribute('data-id');
      if (window.NexWishlistEngine) {
        window.NexWishlistEngine.removeFromWishlist(id);
        selectedIds.delete(id);
        renderGrid();
      }
      return;
    }

    var moveBtn = e.target.closest('[data-action="move-to-bag"]');
    if (moveBtn) {
      e.preventDefault();
      e.stopPropagation();
      var itemId = moveBtn.getAttribute('data-id');
      var Engine = window.NexWishlistEngine;
      if (Engine && window.nexCart) {
        var state = cardStateMap[itemId] || {};
        var payload = Engine.createCartPayload(itemId, state.size, state.finish);
        if (payload) window.nexCart.addItem(payload);
        moveBtn.innerHTML = '<span>&#10003; ADDED</span>';
        moveBtn.style.background = '#34D399';
        moveBtn.style.color = '#000000';
        setTimeout(function() {
          moveBtn.innerHTML = '<i data-lucide="shopping-bag" style="width: 11px; height: 11px;"></i> <span>ADD</span>';
          moveBtn.style.background = '';
          moveBtn.style.color = '';
          if (window.lucide) window.lucide.createIcons({ nodes: [moveBtn] });
        }, 1500);
      }
      return;
    }

    var tabBtn = e.target.closest('.spotlight-tab-btn[data-tab-filter]');
    if (tabBtn) {
      e.preventDefault();
      var filterKey = tabBtn.getAttribute('data-tab-filter');
      document.querySelectorAll('.spotlight-tab-btn').forEach(function(b) {
        var active = b === tabBtn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      applyGridFilter(filterKey, true);
      return;
    }

    var swatchBtn = e.target.closest('[data-action="set-finish"]');
    if (swatchBtn) {
      e.preventDefault();
      e.stopPropagation();
      var pId = swatchBtn.getAttribute('data-id');
      var finishId = swatchBtn.getAttribute('data-finish');
      if (!cardStateMap[pId]) cardStateMap[pId] = {};
      cardStateMap[pId].finish = finishId;
      var card = document.getElementById('wishCard_' + pId);
      if (card) {
        card.querySelectorAll('.card-swatch-disc').forEach(function(s) {
          s.classList.toggle('active', s.getAttribute('data-finish') === finishId);
        });
      }
      return;
    }

    // Quick Look Thumb Switcher
    var qlThumb = e.target.closest('.quicklook-thumb');
    if (qlThumb && activeQuickLookId) {
      var idx = parseInt(qlThumb.getAttribute('data-img-idx'), 10);
      var item = window.NexWishlistEngine.getProduct(activeQuickLookId);
      if (item && item.gallery && item.gallery[idx]) {
        var mainImg = document.getElementById('quicklookMainImg');
        if (mainImg) mainImg.src = resolveImg(item.gallery[idx]);
        document.querySelectorAll('.quicklook-thumb').forEach(function(t) { t.classList.remove('active'); });
        qlThumb.classList.add('active');
      }
      return;
    }

    // Quick Look Finish Switcher
    var qlFinishBtn = e.target.closest('[data-ql-finish]');
    if (qlFinishBtn && activeQuickLookId) {
      var finId = qlFinishBtn.getAttribute('data-ql-finish');
      if (!cardStateMap[activeQuickLookId]) cardStateMap[activeQuickLookId] = {};
      cardStateMap[activeQuickLookId].finish = finId;
      document.querySelectorAll('[data-ql-finish]').forEach(function(btn) {
        var active = btn.getAttribute('data-ql-finish') === finId;
        btn.classList.toggle('active', active);
        btn.style.borderColor = active ? '#3DE0FF' : 'rgba(255,255,255,0.15)';
        btn.style.background = active ? 'rgba(61,224,255,0.15)' : 'rgba(255,255,255,0.06)';
      });
      return;
    }

    // Quick Look Size Switcher
    var qlSizeBtn = e.target.closest('[data-ql-size]');
    if (qlSizeBtn && activeQuickLookId && !qlSizeBtn.disabled) {
      var szId = qlSizeBtn.getAttribute('data-ql-size');
      if (!cardStateMap[activeQuickLookId]) cardStateMap[activeQuickLookId] = {};
      cardStateMap[activeQuickLookId].size = szId;
      document.querySelectorAll('[data-ql-size]').forEach(function(btn) {
        var active = btn.getAttribute('data-ql-size') === szId;
        btn.classList.toggle('active', active);
        btn.style.borderColor = active ? '#3DE0FF' : 'rgba(255,255,255,0.15)';
        btn.style.background = active ? '#3DE0FF' : 'rgba(255,255,255,0.06)';
        btn.style.color = active ? '#000B1A' : '#FFFFFF';
      });
      return;
    }

    var qlAddBtn = e.target.closest('#quicklookAddBtn');
    if (qlAddBtn && activeQuickLookId) {
      var prod = window.NexWishlistEngine.getProduct(activeQuickLookId);
      if (prod && window.nexCart) {
        var st = cardStateMap[activeQuickLookId] || {};
        var pl = window.NexWishlistEngine.createCartPayload(activeQuickLookId, st.size, st.finish);
        if (pl) window.nexCart.addItem(pl);
        var txt = document.getElementById('quicklookAddBtnText');
        if (txt) txt.textContent = '✓ ADDED TO BAG';
        qlAddBtn.style.background = '#34D399';
        qlAddBtn.style.color = '#000000';
        setTimeout(function() {
          closeQuickLook();
        }, 800);
      }
      return;
    }

    var qlCloseBtn = e.target.closest('#quicklookCloseBtn, #quicklookOverlay');
    if (qlCloseBtn) {
      e.preventDefault();
      closeQuickLook();
      return;
    }

    var selectAllBtn = e.target.closest('[data-action="select-all"]');
    if (selectAllBtn) {
      e.preventDefault();
      selectAll();
      return;
    }

    var clearAllBtn = e.target.closest('[data-action="clear-all"]');
    if (clearAllBtn) {
      e.preventDefault();
      clearAllWishlist();
      return;
    }

    var resetBtn = e.target.closest('[data-action="reset-defaults"]');
    if (resetBtn) {
      e.preventDefault();
      resetDefaultSeed();
      return;
    }

    var moveAllBtn = e.target.closest('[data-action="move-all"]');
    if (moveAllBtn) {
      e.preventDefault();
      moveAllToBag(moveAllBtn);
      return;
    }

    var shareBtn = e.target.closest('[data-action="share"]');
    if (shareBtn) {
      e.preventDefault();
      shareCuratedEdit(shareBtn);
      return;
    }

    var batchPrimaryBtn = e.target.closest('#batchMoveToBagBtn');
    if (batchPrimaryBtn) {
      e.preventDefault();
      moveSelectedToBag(batchPrimaryBtn);
      return;
    }

    var batchClearBtn = e.target.closest('#batchClearBtn');
    if (batchClearBtn) {
      e.preventDefault();
      selectedIds.clear();
      document.querySelectorAll('.wishlist-card.selected').forEach(function(c) {
        c.classList.remove('selected');
      });
      updateBatchDock();
      return;
    }

    var batchRemoveBtn = e.target.closest('#batchRemoveBtn');
    if (batchRemoveBtn) {
      e.preventDefault();
      removeSelected();
      return;
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeQuickLookId) {
      closeQuickLook();
    }
  });

  // Storage listener for cross-tab sync
  window.addEventListener('storage', function(e) {
    if (e.key === 'nex_curated_wishlist_ids') {
      renderGrid();
    }
  });

  root.NexWishlistUI = {
    renderGrid: renderGrid,
    toggleItemSelection: toggleItemSelection,
    selectAll: selectAll,
    clearAllWishlist: clearAllWishlist,
    openQuickLook: openQuickLook,
    closeQuickLook: closeQuickLook,
    moveSelectedToBag: moveSelectedToBag
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGrid);
  } else {
    renderGrid();
  }

})(typeof window !== 'undefined' ? window : this);
