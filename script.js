/* ==========================================================================
   Global site script (cleaned)
   - Mobile nav toggle (works via onclick="toggleMobileNav(event)")
   - Scroll-to-top helper (onclick="scrollToTop(event)")
   - Hero slider (auto + dots + swipe) when .hero exists
   - Room card sliders (auto + dots + swipe) when .room-card exists
   - Room overlay (modal) when #roomOverlay exists
   - Anchor scrolling helpers (#home, #chambres, #contact)
   - Scroll reveal (IntersectionObserver)
   - Nav letter wave wrapper (wrapNavLetters) for lang.js compatibility
   - Social icon links normalisation (Instagram/Facebook)
   ========================================================================== */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Tiny helpers
  // ---------------------------------------------------------------------------

  /** @param {string} sel */
  const qs = (sel) => document.querySelector(sel);
  /** @param {string} sel */
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  /** @param {EventTarget|null} el @param {string} type @param {Function} handler @param {any} options */
  const on = (el, type, handler, options) => {
    if (!el || !el.addEventListener) return;
    el.addEventListener(type, handler, options);
  };

  const isHomePath = () => {
    const path = window.location.pathname || '';
    const looksLikeHome = /(?:\/|index\.html)$/.test(path);
    // Exclude other known pages that might still match the regex depending on routing.
    const excluded = /(reserve|gallery|galerie|autour|mentions|confidentialite|cookies|cgv)/i.test(path);
    return looksLikeHome && !excluded;
  };

  const getFixedTopOffset = () => {
    const header = qs('.site-header');
    const badge = qs('.site-title-badge');
    return (header ? header.offsetHeight : 0) + (badge ? badge.offsetHeight : 0);
  };

  // ---------------------------------------------------------------------------
  // Swipe utility (exported globally for other scripts)
  // ---------------------------------------------------------------------------
  /**
   * Attach swipe handling to a slider container.
   *
   * Signature kept compatible with the previous version:
   *   attachSwipe(container, imgList, getIndex, setIndex [, options])
   *
   * imgList can be:
   * - a NodeList/Array of elements
   * - OR a function returning a fresh NodeList/Array (useful when slides are rebuilt)
   *
   * options:
   * - onStart(): called on touchstart
   * - onEnd(): called at the end of touchend processing
   */
  function attachSwipe(container, imgList, getIndex, setIndex, options = {}) {
    if (!container) return;
    const opts = options || {};

    const resolveImgs = () => {
      const list = (typeof imgList === 'function') ? imgList() : imgList;
      return Array.from(list || []);
    };

    let startX = null;
    let isDragging = false;
    let containerWidth = 0;
    let currentIndex = 0;

    // Velocity tracking
    let startTime = 0;
    let lastX = 0;
    let lastTime = 0;

    on(container, 'touchstart', (e) => {
      const imgs = resolveImgs();
      if (imgs.length < 2) return;

      startX = e.touches[0].clientX;
      isDragging = true;
      containerWidth = container.offsetWidth || 1;
      currentIndex = Number(getIndex()) || 0;

      startTime = Date.now();
      lastX = startX;
      lastTime = startTime;

      // Disable transitions during drag
      imgs.forEach((img) => {
        img.style.transition = 'none';
      });

      if (typeof opts.onStart === 'function') opts.onStart();
    }, { passive: true });

    on(container, 'touchmove', (e) => {
      if (!isDragging || startX === null) return;

      const imgs = resolveImgs();
      if (imgs.length < 2) return;

      const diff = e.touches[0].clientX - startX;
      const currentImg = imgs[currentIndex];
      if (!currentImg) return;

      currentImg.style.transform = `translateX(${diff}px)`;

      lastX = e.touches[0].clientX;
      lastTime = Date.now();

      // Move neighbour alongside
      if (diff < 0) {
        const neighbourIdx = (currentIndex + 1) % imgs.length;
        const neighbourImg = imgs[neighbourIdx];
        if (neighbourImg) {
          neighbourImg.style.opacity = '1';
          neighbourImg.style.transform = `translateX(${containerWidth + diff}px)`;
        }
      } else if (diff > 0) {
        const neighbourIdx = (currentIndex - 1 + imgs.length) % imgs.length;
        const neighbourImg = imgs[neighbourIdx];
        if (neighbourImg) {
          neighbourImg.style.opacity = '1';
          neighbourImg.style.transform = `translateX(${-containerWidth + diff}px)`;
        }
      }
    }, { passive: true });

    on(container, 'touchend', (e) => {
      if (!isDragging || startX === null) return;

      const imgs = resolveImgs();
      if (imgs.length < 2) {
        startX = null;
        isDragging = false;
        if (typeof opts.onEnd === 'function') opts.onEnd();
        return;
      }

      const diff = e.changedTouches[0].clientX - startX;

      // Restore transitions (we will set precise ones on the 2 relevant slides)
      imgs.forEach((img) => {
        img.style.transition = '';
      });

      const elapsed = (lastTime - startTime) || 1;
      const velocity = diff / elapsed;

      const threshold = containerWidth * 0.2;        // distance threshold (20%)
      const velocityThreshold = 0.5;                // px/ms

      const shouldAdvance = (Math.abs(diff) > threshold) || (Math.abs(velocity) > velocityThreshold);

      if (shouldAdvance) {
        const direction = diff < 0 ? +1 : -1;
        const newIndex = (currentIndex + direction + imgs.length) % imgs.length;

        const currentImg = imgs[currentIndex];
        const nextImg = imgs[newIndex];
        if (!currentImg || !nextImg) {
          // Fallback reset
          imgs.forEach((img) => {
            img.style.transform = '';
            img.style.opacity = '';
            img.style.transition = '';
          });
          startX = null;
          isDragging = false;
          if (typeof opts.onEnd === 'function') opts.onEnd();
          return;
        }

        nextImg.style.opacity = '1';

        const finalCurrent = direction > 0 ? -containerWidth : containerWidth;

        currentImg.style.transition = 'transform 0.35s ease-out';
        nextImg.style.transition = 'transform 0.35s ease-out';

        currentImg.style.transform = `translateX(${finalCurrent}px)`;
        nextImg.style.transform = 'translateX(0)';

        nextImg.addEventListener('transitionend', () => {
          // Cleanup inline drag styles
          imgs.forEach((img) => {
            img.style.transition = '';
            img.style.transform = '';
            img.style.opacity = '';
          });

          // Update index without triggering a second animation
          setIndex(newIndex, direction);

          if (typeof opts.onEnd === 'function') opts.onEnd();
        }, { once: true });
      } else {
        // Revert (no bounce)
        imgs.forEach((img) => {
          img.style.transition = 'none';
          img.style.transform = '';
          img.style.opacity = '';
        });
        // Force reflow so "transition: none" takes effect
        void container.offsetWidth;
        imgs.forEach((img) => {
          img.style.transition = '';
        });

        if (typeof opts.onEnd === 'function') opts.onEnd();
      }

      startX = null;
      isDragging = false;
    });
  }

  // Export for reuse (gallery.js, around overlay, etc.)
  window.attachSwipe = attachSwipe;

  // ---------------------------------------------------------------------------
  // Mobile navigation (exported globally for inline onclick)
  // ---------------------------------------------------------------------------
  let mobileNavOutsideClickHandler = null;

  const closeMobileNav = (mobileNavEl) => {
    if (!mobileNavEl) return;
    mobileNavEl.classList.remove('open');

    if (mobileNavOutsideClickHandler) {
      document.removeEventListener('click', mobileNavOutsideClickHandler);
      mobileNavOutsideClickHandler = null;
    }
  };

  window.toggleMobileNav = function toggleMobileNav(ev) {
    if (ev) ev.stopPropagation();

    const mobileNavEl = qs('.mobile-nav');
    if (!mobileNavEl) return;

    const willOpen = !mobileNavEl.classList.contains('open');

    if (willOpen) {
      mobileNavEl.classList.add('open');

      // Install a single outside-click handler while open
      if (!mobileNavOutsideClickHandler) {
        mobileNavOutsideClickHandler = (e) => {
          const clickInside = mobileNavEl.contains(e.target);
          const clickOnButton = !!e.target.closest('.hamburger');
          if (!clickInside && !clickOnButton) closeMobileNav(mobileNavEl);
        };
        document.addEventListener('click', mobileNavOutsideClickHandler);
      }
    } else {
      closeMobileNav(mobileNavEl);
    }
  };

  // ---------------------------------------------------------------------------
  // Scroll-to-top helper (exported globally for inline onclick)
  // ---------------------------------------------------------------------------
  window.scrollToTop = function scrollToTop(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (isHomePath()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = 'index.html#home';
    }
  };

  // ---------------------------------------------------------------------------
  // Nav letter wave wrapper (exported for lang.js)
  // ---------------------------------------------------------------------------
  window.wrapNavLetters = function wrapNavLetters() {
    const targets = qsa('.nav-left a, .nav-right a, .room-reserve-btn, .price-tag');

    targets.forEach((el) => {
      const text = (el.textContent || '').trim();
      if (!text) return;

      // Replace content with per-letter spans (keep whitespace as text nodes)
      el.innerHTML = '';
      Array.from(text).forEach((char, idx) => {
        if (/\s/.test(char)) {
          el.appendChild(document.createTextNode(char));
          return;
        }
        const span = document.createElement('span');
        span.className = 'nav-letter';
        span.textContent = char;
        span.style.setProperty('--delay', `${idx * 50}ms`);
        el.appendChild(span);
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Anchor scrolling
  // ---------------------------------------------------------------------------
  const scrollToChambres = (behavior = 'smooth') => {
    const anchor = document.getElementById('chambres');
    if (!anchor) return false;

    const headingEl =
      qs('#chambres + h2') ||
      anchor.nextElementSibling ||
      anchor;

    const extraMargin = 20;
    const y = headingEl.getBoundingClientRect().top + window.pageYOffset - getFixedTopOffset() - extraMargin;
    window.scrollTo({ top: Math.max(0, y), behavior });
    return true;
  };

  const scrollToContactBottom = (behavior = 'smooth') => {
    const contactTarget = document.getElementById('contact');
    if (!contactTarget) return false;

    contactTarget.scrollIntoView({ behavior });
    // Ensure we end at the very bottom (footer contact details)
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior }), 500);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior }), 1000);
    return true;
  };

  const initInitialHashScroll = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.substring(1);
    if (!id) return;

    // Small delay to let layout settle (images/fonts/etc.)
    setTimeout(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (id === 'chambres') {
        // Run twice to compensate late layout shifts
        scrollToChambres('smooth');
        setTimeout(() => scrollToChambres('smooth'), 200);
        return;
      }

      if (id === 'contact') {
        scrollToContactBottom('smooth');
        return;
      }

      // Default: scroll to element (no forced bottom scroll)
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const initNavAnchorHandlers = () => {
    // Only intercept in-page "#chambres" link (index page)
    const chambresLink = qs('a[href="#chambres"]');
    on(chambresLink, 'click', (event) => {
      event.preventDefault();
      scrollToChambres('smooth');
      setTimeout(() => scrollToChambres('smooth'), 200);
    });

    // Ensure contact anchors reach the footer on the first click
    qsa('a[href="#contact"]').forEach((link) => {
      on(link, 'click', (event) => {
        event.preventDefault();
        scrollToContactBottom('smooth');
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Hero slider
  // ---------------------------------------------------------------------------
  const initHeroSlider = () => {
    const hero = qs('.hero');
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll('img'));
    if (slides.length === 0) return;

    const dots = Array.from(hero.querySelectorAll('.dots button'));

    let current = 0;
    let intervalId = null;
    let animating = false;

    const updateActive = (index) => {
      slides.forEach((img, i) => img.classList.toggle('active', i === index));
      if (dots.length) dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      current = index;
    };

    const animateTo = (newIndex, direction) => {
      if (animating) return;
      if (newIndex === current) return;

      const currentImg = slides[current];
      const nextImg = slides[newIndex];
      if (!currentImg || !nextImg) return;

      animating = true;

      // Cleanup previous classes
      [currentImg, nextImg].forEach((img) => {
        img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
      });

      if (direction > 0) {
        currentImg.classList.add('slide-out-left');
        nextImg.classList.add('slide-in-right');
      } else {
        currentImg.classList.add('slide-out-right');
        nextImg.classList.add('slide-in-left');
      }

      setTimeout(() => {
        updateActive(newIndex);

        currentImg.classList.remove('slide-out-left', 'slide-out-right');
        nextImg.classList.remove('slide-in-left', 'slide-in-right');

        animating = false;
      }, 500);
    };

    const startAuto = () => {
      if (slides.length < 2) return;
      if (intervalId) return;
      intervalId = setInterval(() => {
        const next = (current + 1) % slides.length;
        animateTo(next, +1);
      }, 5000);
    };

    const stopAuto = () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    // Lazy-loading: keep first slide eager, others lazy
    slides.forEach((img, i) => {
      if (i > 0) img.setAttribute('loading', 'lazy');
    });

    // Dots navigation
    dots.forEach((dot, i) => {
      on(dot, 'click', () => {
        const dir = i > current ? 1 : -1;
        animateTo(i, dir);
      });
    });

    // Hover pause (desktop)
    on(hero, 'mouseenter', stopAuto);
    on(hero, 'mouseleave', startAuto);

    // Swipe support (touch)
    attachSwipe(
      hero,
      slides,
      () => current,
      (newIndex) => updateActive(newIndex),
      { onStart: stopAuto, onEnd: startAuto }
    );

    // Init state + auto
    updateActive(0);
    startAuto();
  };

  // ---------------------------------------------------------------------------
  // Room card sliders
  // ---------------------------------------------------------------------------
  const initRoomCardSliders = () => {
    const roomCards = qsa('.room-card');
    if (!roomCards.length) return;

    // Mark room images as lazy (safe on all pages)
    qsa('.room-slider img').forEach((img) => img.setAttribute('loading', 'lazy'));

    roomCards.forEach((card) => {
      const imgContainer = card.querySelector('.room-image');
      const images = Array.from(card.querySelectorAll('.room-slider img'));
      const navDots = Array.from(card.querySelectorAll('.room-dots button'));

      if (!imgContainer || images.length === 0) return;

      let index = 0;
      let intervalId = null;
      let animating = false;

      const updateActive = (i) => {
        images.forEach((img, idx) => img.classList.toggle('active', idx === i));
        if (navDots.length) navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
        index = i;
      };

      const animateTo = (newIndex, direction) => {
        if (animating) return;
        if (newIndex === index) return;

        const currentImg = images[index];
        const nextImg = images[newIndex];
        if (!currentImg || !nextImg) return;

        animating = true;

        const outClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
        const inClass = direction > 0 ? 'slide-in-right' : 'slide-in-left';

        // Remove previous animation classes
        images.forEach((img) => img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right'));

        // z-index helps ensure incoming image is on top
        currentImg.style.zIndex = '1';
        nextImg.style.zIndex = '2';

        currentImg.classList.add(outClass);
        nextImg.classList.add(inClass);

        // Update dots immediately (if any)
        if (navDots.length) {
          navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === newIndex));
        }

        setTimeout(() => {
          images.forEach((img, idx) => {
            img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
            img.style.zIndex = '';
            img.classList.toggle('active', idx === newIndex);
          });
          index = newIndex;
          animating = false;
        }, 500);
      };

      const startAuto = () => {
        if (images.length < 2) return;
        if (intervalId) return;
        intervalId = setInterval(() => {
          const next = (index + 1) % images.length;
          animateTo(next, +1);
        }, 5000);
      };

      const stopAuto = () => {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
      };

      // Dots: single handler (no duplicates)
      navDots.forEach((dot, i) => {
        on(dot, 'click', (ev) => {
          ev.stopPropagation();
          stopAuto();
          const dir = i > index ? 1 : -1;
          animateTo(i, dir);
          startAuto();
        });
      });

      // Pause on hover (desktop)
      on(imgContainer, 'mouseenter', stopAuto);
      on(imgContainer, 'mouseleave', startAuto);

      // Swipe support (touch)
      attachSwipe(
        imgContainer,
        images,
        () => index,
        (newIndex) => updateActive(newIndex),
        { onStart: stopAuto, onEnd: startAuto }
      );

      updateActive(0);
      startAuto();
    });
  };

  // ---------------------------------------------------------------------------
  // Room overlay (modal)
  // ---------------------------------------------------------------------------
  const initRoomOverlay = () => {
    const overlay = document.getElementById('roomOverlay');
    if (!overlay) return;

    const overlaySlider = overlay.querySelector('#overlaySlider') || document.getElementById('overlaySlider');
    const overlayTitle = overlay.querySelector('#overlayTitle') || document.getElementById('overlayTitle');
    const overlayText = overlay.querySelector('#overlayText') || document.getElementById('overlayText');
    const overlayDots = overlay.querySelector('#overlayDots') || document.getElementById('overlayDots');

    if (!overlaySlider || !overlayTitle || !overlayDots) return;

    const closeBtn = overlay.querySelector('.overlay-close');
    const prevBtn = overlay.querySelector('.overlay-prev');
    const nextBtn = overlay.querySelector('.overlay-next');

    let images = [];
    let current = 0;

    const getOverlayImgs = () => overlaySlider.querySelectorAll('img');

    const updateActive = (i) => {
      const imgs = Array.from(getOverlayImgs());
      imgs.forEach((img, idx) => img.classList.toggle('active', idx === i));

      const dots = Array.from(overlayDots.querySelectorAll('button'));
      dots.forEach((btn, idx) => btn.classList.toggle('active', idx === i));

      current = i;
    };

    const animateTo = (newIndex, direction) => {
      const imgs = Array.from(getOverlayImgs());
      if (!imgs.length) return;
      if (newIndex === current) return;

      const currentImg = imgs[current];
      const nextImg = imgs[newIndex];
      if (!currentImg || !nextImg) return;

      [currentImg, nextImg].forEach((img) => {
        img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
      });

      const outClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
      const inClass  = direction > 0 ? 'slide-in-right' : 'slide-in-left';

      currentImg.classList.add(outClass);
      nextImg.classList.add(inClass);

      // Dots immediately
      const dots = Array.from(overlayDots.querySelectorAll('button'));
      if (dots.length) {
        dots.forEach((btn, idx) => btn.classList.toggle('active', idx === newIndex));
      }

      setTimeout(() => {
        imgs.forEach((img, idx) => {
          img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
          img.classList.toggle('active', idx === newIndex);
        });
        current = newIndex;
      }, 500);
    };

    const open = (card) => {
      // Build image list from the card
      images = Array.from(card.querySelectorAll('.room-slider img')).map((img) => ({
        src: img.src,
        alt: img.alt || ''
      }));

      // Render slides
      overlaySlider.innerHTML = '';
      images.forEach((data, idx) => {
        const el = document.createElement('img');
        el.src = data.src;
        el.alt = data.alt;
        if (idx === 0) el.classList.add('active');
        overlaySlider.appendChild(el);
      });

      // Title
      const titleEl = card.querySelector('h3');
      overlayTitle.textContent = titleEl ? titleEl.textContent.trim() : '';

      // Optional text (kept for compatibility)
      if (overlayText) overlayText.textContent = '';

      // Dots
      overlayDots.innerHTML = '';
      images.forEach((_, idx) => {
        const btn = document.createElement('button');
        if (idx === 0) btn.classList.add('active');
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const dir = idx > current ? 1 : -1;
          animateTo(idx, dir);
        });
        overlayDots.appendChild(btn);
      });

      // Full-photo mode toggle when clicking the image (optional UX)
      Array.from(getOverlayImgs()).forEach((imgEl) => {
        imgEl.addEventListener('click', (ev) => {
          ev.stopPropagation();
          overlay.classList.toggle('full-photo-mode');
        });
      });

      current = 0;

      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');

      // Helpful class for styling when only 1 image
      overlay.classList.toggle('single-image', images.length <= 1);

      // Ensure first state is correct
      updateActive(0);
    };

    const close = () => {
      overlay.classList.remove('show');
      overlay.classList.remove('full-photo-mode');
      overlay.setAttribute('aria-hidden', 'true');
    };

    // Close interactions
    on(closeBtn, 'click', (ev) => {
      if (ev) ev.stopPropagation();
      close();
    });

    on(overlay, 'click', (ev) => {
      if (ev.target === overlay) close();
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) close();
    });

    // Arrows (if present in markup)
    on(prevBtn, 'click', (ev) => {
      ev.stopPropagation();
      if (images.length < 2) return;
      const prevIndex = (current - 1 + images.length) % images.length;
      animateTo(prevIndex, -1);
    });

    on(nextBtn, 'click', (ev) => {
      ev.stopPropagation();
      if (images.length < 2) return;
      const nextIndex = (current + 1) % images.length;
      animateTo(nextIndex, +1);
    });

    // Swipe on overlay slider (use a getter because slides are rebuilt on open)
    attachSwipe(
      overlaySlider,
      () => overlaySlider.querySelectorAll('img'),
      () => current,
      (newIndex) => updateActive(newIndex)
    );

    // Wire room cards to open overlay (only if overlay exists)
    qsa('.room-card').forEach((card) => {
      on(card, 'click', (event) => {
        // Do not open overlay when clicking on CTA buttons or dots
        if (event.target.closest('.room-reserve-btn')) return;
        if (event.target.closest('.details-btn')) return;
        if (event.target.closest('.room-dots')) return;

        // Only open when clicking an actual image
        const clickedImg = event.target.closest('.room-image img');
        if (!clickedImg) return;

        open(card);
      });

      // Optional details button support
      const detailsBtn = card.querySelector('.details-btn');
      on(detailsBtn, 'click', (ev) => {
        ev.stopPropagation();
        open(card);
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Scroll reveal (IntersectionObserver)
  // ---------------------------------------------------------------------------
  const initScrollReveal = () => {
    const animatedItems = qsa('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right');
    if (!animatedItems.length) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: [0, 0.3] });

    animatedItems.forEach((item) => observer.observe(item));
  };

  // ---------------------------------------------------------------------------
  // Social links normalisation
  // ---------------------------------------------------------------------------
  const initSocialLinks = () => {
    qsa('a[aria-label="Instagram"]').forEach((a) => {
      a.setAttribute('href', 'https://www.instagram.com/maisonbrevan/');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
    qsa('a[aria-label="Facebook"]').forEach((a) => {
      a.setAttribute('href', 'https://www.facebook.com/profile.php?id=61585826054527');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  };

  // ---------------------------------------------------------------------------
  // Lazy-load images where it makes sense (safe no-op on pages without them)
  // ---------------------------------------------------------------------------
  const initLazyLoading = () => {
    // Room and gallery images are always safe to lazy-load
    qsa('.room-slider img, .gallery-item img').forEach((img) => img.setAttribute('loading', 'lazy'));
  };

  // ---------------------------------------------------------------------------
  // Mobile nav setup: close on link click + Esc
  // ---------------------------------------------------------------------------
  const initMobileNav = () => {
    const mobileNavEl = qs('.mobile-nav');
    if (!mobileNavEl) return;

    // Close menu when any link inside is clicked (event delegation, avoids duplicates)
    on(mobileNavEl, 'click', (e) => {
      const link = e.target.closest('a');
      if (link) closeMobileNav(mobileNavEl);
    });

    // Close menu with Escape
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && mobileNavEl.classList.contains('open')) {
        closeMobileNav(mobileNavEl);
      }
    });
  };

  // ---------------------------------------------------------------------------
  // DOM ready: initialise features when relevant elements exist
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initInitialHashScroll();
    initNavAnchorHandlers();

    initLazyLoading();
    initHeroSlider();
    initRoomCardSliders();
    initRoomOverlay();

    initScrollReveal();

    // Wrap letters once on load (and again after language change buttons)
    window.wrapNavLetters();
    qsa('#lang-menu button[data-lang]').forEach((btn) => {
      on(btn, 'click', () => setTimeout(() => window.wrapNavLetters(), 0));
    });

    initSocialLinks();
  });
})();
