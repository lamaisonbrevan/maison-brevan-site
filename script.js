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

  // Viewport height helper (iOS Safari 100vh fix)
  const setVhVar = () => {
    const h = window.innerHeight || document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--vh', `${h * 0.01}px`);
  };

  // Set immediately
  setVhVar();

  // Update on viewport changes (iOS address bar / orientation)
  window.addEventListener('resize', setVhVar, { passive: true });
  window.addEventListener('orientationchange', () => {
    setVhVar();
    setTimeout(setVhVar, 150);
    setTimeout(setVhVar, 500);
  }, { passive: true });
  window.addEventListener('pageshow', () => {
    setVhVar();
    setTimeout(setVhVar, 50);
  });


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
  // Environment helpers (used to switch to native, ultra-smooth carousels on mobile)
  // ---------------------------------------------------------------------------
  const isCoarsePointer = () => {
    try {
      return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    } catch (_) {
      // ignore
    }
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  };

  const isSmallScreen = () => {
    try {
      return !!(window.matchMedia && window.matchMedia('(max-width: 900px)').matches);
    } catch (_) {
      // ignore
    }
    return (window.innerWidth || 0) <= 900;
  };

  const useNativeCarousels = () => isCoarsePointer() && isSmallScreen();


  // ---------------------------------------------------------------------------
  // Carousel image warmup + infinite loop (native scroll-snap mode)
  //
  // Why:
  // - On iOS/Safari, images marked as loading="lazy" inside a horizontal
  //   scroll container often load only when the user starts swiping.
  //   That causes a janky *first* swipe, then becomes smooth once images are in cache.
  // - Also, native scroll-snap carousels do not loop by default.
  //
  // What we do:
  // - Warm up (preload + decode) the carousel images shortly before the user interacts.
  // - Add an optional "infinite" loop by jumping from last->first (and first->last)
  //   when the user swipes past the edge.
  // ---------------------------------------------------------------------------

  const _preloadedSrc = new Set();

  /** @param {string} src */
  const preloadSrc = (src) => {
    if (!src || _preloadedSrc.has(src)) return;
    _preloadedSrc.add(src);
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  };

  /**
   * Ensure carousel images are fetched and decoded ahead of the first swipe.
   *
   * @param {Element|null} keyEl Used as a cache key (warmup happens once per key unless force=true)
   * @param {Iterable<HTMLImageElement>|Array<HTMLImageElement>} imgs
   * @param {{ force?: boolean }} opts
   */
  const warmUpCarouselImages = (keyEl, imgs, opts = {}) => {
    const force = !!(opts && opts.force);

    if (!force) {
      // Cache per-element so we do the network work only once per carousel.
      if (!warmUpCarouselImages._done) warmUpCarouselImages._done = new WeakSet();
      const done = warmUpCarouselImages._done;
      if (keyEl && done.has(keyEl)) return;
      if (keyEl) done.add(keyEl);
    }

    const list = Array.from(imgs || []).filter(Boolean);
    if (!list.length) return;

    list.forEach((imgEl, i) => {
      // Decode asynchronously to reduce main-thread stalls.
      try {
        imgEl.decoding = 'async';
      } catch (_) {
        // ignore
      }

      // Force eager loading so offscreen horizontal slides fetch before swiping.
      try {
        imgEl.loading = 'eager';
      } catch (_) {
        imgEl.setAttribute('loading', 'eager');
      }

      // Hint: prioritize the first slide.
      if (i == 0) {
        try {
          if ('fetchPriority' in imgEl) imgEl.fetchPriority = 'high';
        } catch (_) {
          // ignore
        }
      }

      const src = imgEl.currentSrc || imgEl.src;
      preloadSrc(src);

      // Decode in background to avoid decode jank on the first swipe.
      const decode = () => {
        if (typeof imgEl.decode === 'function') {
          imgEl.decode().catch(() => {});
        }
      };

      if (imgEl.complete) decode();
      else imgEl.addEventListener('load', decode, { once: true });
    });
  };

  /**
   * Add an "infinite loop" for native scroll-snap carousels.
   * When the swipe starts on the last slide and the user swipes forward again,
   * jump to the first slide (and vice-versa).
   *
   * @param {Element|null} el
   * @param {() => number} getIndex
   * @param {() => number} getCount
   * @param {(idx: number) => void} jumpTo
   */

  const installInfiniteLoopSwipe = (el, getIndex, getCount, jumpTo) => {
    if (!el) return;

    // Install only once per element.
    if (!installInfiniteLoopSwipe._done) installInfiniteLoopSwipe._done = new WeakSet();
    const done = installInfiniteLoopSwipe._done;
    if (done.has(el)) return;
    done.add(el);

    let startX = 0;
    let startY = 0;
    let startIndex = 0;
    let startTime = 0;
    let tracking = false;

    on(el, 'touchstart', (ev) => {
      const t = ev.touches && ev.touches[0];
      if (!t) return;
      tracking = true;
      startX = t.clientX;
      startY = t.clientY;
      startIndex = Number(getIndex()) || 0;
      startTime = Date.now();
    }, { passive: true });

    const end = (ev) => {
      if (!tracking) return;
      tracking = false;

      const t = (ev.changedTouches && ev.changedTouches[0]) || null;
      if (!t) return;

      const count = Number(getCount()) || 0;
      if (count < 2) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Horizontal intent only.
      if (absX < absY) return;

      const width = el.clientWidth || 1;
      const elapsed = Math.max(1, Date.now() - startTime);
      const velocity = dx / elapsed; // px/ms

      // Distance OR velocity (fast flick) should trigger the loop.
      const distanceThreshold = Math.max(36, width * 0.16);
      const velocityThreshold = 0.45;

      if (absX < distanceThreshold && Math.abs(velocity) < velocityThreshold) return;

      // If the swipe started on an edge slide, loop.
      if (startIndex === count - 1 && dx < 0) {
        jumpTo(0);
      } else if (startIndex === 0 && dx > 0) {
        jumpTo(count - 1);
      }
    };

    on(el, 'touchend', end, { passive: true });
    on(el, 'touchcancel', () => { tracking = false; }, { passive: true });
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
   * - onStart(): called when a *horizontal* swipe is detected (useful to pause autoplay)
   * - onEnd(): called at the end of swipe processing
   */
  function attachSwipe(container, imgList, getIndex, setIndex, options = {}) {
    if (!container) return;
    const opts = options || {};

    const resolveImgs = () => {
      const list = (typeof imgList === 'function') ? imgList() : imgList;
      return Array.from(list || []);
    };

    let startX = null;
    let startY = null;
    let isTracking = false;
    let axisLocked = false;
    let isHorizontal = false;

    let containerWidth = 0;
    let currentIndex = 0;

    // Velocity tracking
    let startTime = 0;
    let lastTime = 0;
    let lastX = 0;

    // rAF batching (reduces jank on low-end mobiles)
    let rafId = 0;
    let pendingDx = 0;

    // Autoplay pause/resume (optional)
    let didPauseAuto = false;
    const pauseAuto = () => {
      if (didPauseAuto) return;
      didPauseAuto = true;
      if (typeof opts.onStart === 'function') opts.onStart();
    };

    const resumeAuto = () => {
      if (!didPauseAuto) return;
      didPauseAuto = false;
      if (typeof opts.onEnd === 'function') opts.onEnd();
    };

    const resetInlineStyles = (imgs) => {
      imgs.forEach((img) => {
        img.style.transition = '';
        img.style.transform = '';
        img.style.opacity = '';
      });
    };

    const forceNoTransition = (imgs) => {
      imgs.forEach((img) => {
        img.style.transition = 'none';
      });
    };

    const restoreTransition = (imgs) => {
      // Remove inline override (re-enable CSS transitions)
      imgs.forEach((img) => {
        img.style.transition = '';
      });
    };

    const finish = () => {
      startX = null;
      startY = null;
      isTracking = false;
      axisLocked = false;
      isHorizontal = false;
      containerWidth = 0;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const applyDx = (dx) => {
      const imgs = resolveImgs();
      if (imgs.length < 2) return;

      const currentImg = imgs[currentIndex];
      if (!currentImg) return;

      // Drag current image
      currentImg.style.transform = `translate3d(${dx}px, 0, 0)`;

      // Drag neighbour alongside (gives a "native" feel)
      if (dx < 0) {
        const neighbourIdx = (currentIndex + 1) % imgs.length;
        const neighbourImg = imgs[neighbourIdx];
        if (neighbourImg) {
          neighbourImg.style.opacity = '1';
          neighbourImg.style.transform = `translate3d(${containerWidth + dx}px, 0, 0)`;
        }
      } else if (dx > 0) {
        const neighbourIdx = (currentIndex - 1 + imgs.length) % imgs.length;
        const neighbourImg = imgs[neighbourIdx];
        if (neighbourImg) {
          neighbourImg.style.opacity = '1';
          neighbourImg.style.transform = `translate3d(${-containerWidth + dx}px, 0, 0)`;
        }
      }
    };

    const scheduleApply = (dx) => {
      pendingDx = dx;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        applyDx(pendingDx);
      });
    };

    const animateToIndex = (imgs, newIndex, direction) => {
      const currentImg = imgs[currentIndex];
      const nextImg = imgs[newIndex];
      if (!currentImg || !nextImg) {
        resetInlineStyles(imgs);
        resumeAuto();
        finish();
        return;
      }

      // Ensure the next image is visible during the transition
      nextImg.style.opacity = '1';

      // iOS-like easing
      const easing = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
      const duration = 280;

      currentImg.style.transition = `transform ${duration}ms ${easing}`;
      nextImg.style.transition = `transform ${duration}ms ${easing}`;

      const finalCurrent = direction > 0 ? -containerWidth : containerWidth;

      // Snap to final positions
      currentImg.style.transform = `translate3d(${finalCurrent}px, 0, 0)`;
      nextImg.style.transform = 'translate3d(0, 0, 0)';

      nextImg.addEventListener('transitionend', () => {
        // IMPORTANT:
        // Disable transitions while we toggle the "active" classes.
        // Otherwise, the base "opacity" transitions can cause a visible fade/flicker
        // right after the swipe.
        forceNoTransition(imgs);

        // Update index + dots while transitions are disabled
        setIndex(newIndex, direction);

        // Clean inline styles
        resetInlineStyles(imgs);

        // Force reflow so the browser applies "transition: none" before removing it
        void container.offsetWidth;
        restoreTransition(imgs);

        resumeAuto();
        finish();
      }, { once: true });
    };

    const animateBack = (imgs, dx) => {
      const currentImg = imgs[currentIndex];
      if (!currentImg) {
        resetInlineStyles(imgs);
        resumeAuto();
        finish();
        return;
      }

      // Determine neighbour based on drag direction so it slides back too
      let neighbourImg = null;
      let neighbourTarget = null;

      if (dx < 0) {
        const neighbourIdx = (currentIndex + 1) % imgs.length;
        neighbourImg = imgs[neighbourIdx];
        neighbourTarget = containerWidth;
      } else if (dx > 0) {
        const neighbourIdx = (currentIndex - 1 + imgs.length) % imgs.length;
        neighbourImg = imgs[neighbourIdx];
        neighbourTarget = -containerWidth;
      }

      const easing = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
      const duration = 200;

      currentImg.style.transition = `transform ${duration}ms ${easing}`;
      currentImg.style.transform = 'translate3d(0, 0, 0)';

      if (neighbourImg) {
        neighbourImg.style.opacity = '1';
        neighbourImg.style.transition = `transform ${duration}ms ${easing}`;
        neighbourImg.style.transform = `translate3d(${neighbourTarget}px, 0, 0)`;
      }

      currentImg.addEventListener('transitionend', () => {
        // Clean up without additional fades
        forceNoTransition(imgs);
        resetInlineStyles(imgs);
        void container.offsetWidth;
        restoreTransition(imgs);

        resumeAuto();
        finish();
      }, { once: true });
    };

    on(container, 'touchstart', (e) => {
      const imgs = resolveImgs();
      if (imgs.length < 2) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      isTracking = true;
      axisLocked = false;
      isHorizontal = false;

      containerWidth = container.offsetWidth || 1;
      currentIndex = Number(getIndex()) || 0;

      startTime = Date.now();
      lastTime = startTime;
      lastX = startX;

      // Pause autoplay as soon as the user touches the carousel
      pauseAuto();

      // Disable transitions during drag (we'll re-enable on end)
      forceNoTransition(imgs);
    }, { passive: true });

    on(container, 'touchmove', (e) => {
      if (!isTracking || startX === null || startY === null) return;

      const imgs = resolveImgs();
      if (imgs.length < 2) return;

      const t = e.touches[0];
      const diffX = t.clientX - startX;
      const diffY = t.clientY - startY;

      // Decide once whether the gesture is horizontal or vertical.
      if (!axisLocked) {
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        const axisThreshold = 6; // px

        if (absX < axisThreshold && absY < axisThreshold) return;

        axisLocked = true;
        isHorizontal = absX > absY;

        if (!isHorizontal) {
          // Vertical scroll: restore transitions and resume autoplay.
          restoreTransition(imgs);
          resumeAuto();
          finish();
          return;
        }
      }

      if (!isHorizontal) return;

      // Prevent vertical scrolling while swiping horizontally.
      if (e.cancelable) e.preventDefault();

      scheduleApply(diffX);

      lastX = t.clientX;
      lastTime = Date.now();
    }, { passive: false });

    on(container, 'touchend', (e) => {
      if (!isTracking || startX === null || startY === null) return;

      const imgs = resolveImgs();
      if (imgs.length < 2) {
        restoreTransition(imgs);
        resumeAuto();
        finish();
        return;
      }

      // Tap (no axis lock) or vertical gesture: nothing to do
      if (!axisLocked || !isHorizontal) {
        restoreTransition(imgs);
        resumeAuto();
        finish();
        return;
      }

      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : lastX;
      const diff = endX - startX;

      const elapsed = (lastTime - startTime) || 1;
      const velocity = diff / elapsed;

      const threshold = containerWidth * 0.2;  // 20%
      const velocityThreshold = 0.5;          // px/ms

      const shouldAdvance = (Math.abs(diff) > threshold) || (Math.abs(velocity) > velocityThreshold);

      if (shouldAdvance) {
        const direction = diff < 0 ? +1 : -1;
        const newIndex = (currentIndex + direction + imgs.length) % imgs.length;

        // Re-enable transitions (we'll set specific ones for the 2 slides)
        restoreTransition(imgs);
        animateToIndex(imgs, newIndex, direction);
      } else {
        // Smooth snap-back
        restoreTransition(imgs);
        animateBack(imgs, diff);
      }
    }, { passive: true });

    on(container, 'touchcancel', () => {
      const imgs = resolveImgs();
      resetInlineStyles(imgs);
      restoreTransition(imgs);
      resumeAuto();
      finish();
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
      window.location.href = 'index.html';
    }
  };

  // ---------------------------------------------------------------------------
  // Nav letter wave wrapper (exported for lang.js)
  // ---------------------------------------------------------------------------
  window.wrapNavLetters = function wrapNavLetters() {
    // NOTE:
    // Do NOT apply the per-letter wrapping effect to price tags.
    // Wrapping each character in <span> elements allows line-breaks
    // *between* letters (e.g. "nui" + "t"), which breaks readability
    // on mobile and was the root cause of the reported issue.
    const targets = qsa('.nav-left a, .nav-right a, .room-reserve-btn');

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
        // Use an instant scroll here; smooth scrolling on initial load can trigger
        // iOS Safari viewport/address-bar adjustments and lead to inconsistent hero sizing.
        window.scrollTo({ top: 0, behavior: 'auto' });
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

    const native = useNativeCarousels();

    const safeScrollTo = (el, left, behavior) => {
      if (!el) return;
      try {
        el.scrollTo({ left, behavior });
      } catch (_) {
        el.scrollLeft = left;
      }
    };


    // Preload room carousel images *before* the first swipe (native mobile mode)
    // so the first swipe is as fluid as the following ones.
    let roomPreloadObserver = null;
    if (native && 'IntersectionObserver' in window) {
      roomPreloadObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const cardEl = entry.target;
            const sliderEl = cardEl.querySelector('.room-slider');
            if (sliderEl) {
              warmUpCarouselImages(sliderEl, sliderEl.querySelectorAll('img'));
            }
            roomPreloadObserver.unobserve(cardEl);
          });
        },
        {
          // Start preloading well before the section reaches the viewport.
          // This gives iOS enough time to fetch+decode the next slides.
          rootMargin: '1400px 0px',
          threshold: 0.01
        }
      );
    }

    // Touch drag flag to avoid opening the overlay when the user swipes
    const installDragFlag = (el) => {
      if (!el) return;
      let startX = 0;
      let startY = 0;
      let dragging = false;

      on(el, 'touchstart', (ev) => {
        const t = ev.touches && ev.touches[0];
        if (!t) return;
        startX = t.clientX;
        startY = t.clientY;
        dragging = false;
        el.dataset.dragging = '0';
      }, { passive: true });

      on(el, 'touchmove', (ev) => {
        const t = ev.touches && ev.touches[0];
        if (!t) return;
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);
        if (dx > 8 && dx > dy) {
          dragging = true;
          el.dataset.dragging = '1';
        }
      }, { passive: true });

      const end = () => {
        if (dragging) {
          // Keep the flag alive for the synthetic click event that follows a swipe
          setTimeout(() => { el.dataset.dragging = '0'; }, 250);
        } else {
          el.dataset.dragging = '0';
        }
      };

      on(el, 'touchend', end, { passive: true });
      on(el, 'touchcancel', end, { passive: true });
    };

    roomCards.forEach((card) => {
      const imgContainer = card.querySelector('.room-image');
      const slider = card.querySelector('.room-slider');
      const images = slider ? Array.from(slider.querySelectorAll('img')) : [];
      const navDots = Array.from(card.querySelectorAll('.room-dots button'));

      if (!imgContainer || !slider || images.length === 0) return;

      // ------------------------------------------------------------------
      // Native (Instagram-like) mode on touch mobiles: use scroll-snap + scrollLeft
      // ------------------------------------------------------------------
      if (native) {
        let index = 0;

        const setActiveDot = (i) => {
          if (navDots.length) navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
          index = i;
        };

        const scrollToIndex = (i, behavior = 'smooth') => {
          const w = slider.clientWidth || imgContainer.offsetWidth || 1;
          safeScrollTo(slider, i * w, behavior);
          setActiveDot(i);
        };

        // rAF-throttled scroll handler (keeps dots synced while swiping)
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            const w = slider.clientWidth || imgContainer.offsetWidth || 1;
            const newIndex = Math.round(slider.scrollLeft / w);
            if (newIndex !== index) setActiveDot(newIndex);
          });
        };

        on(slider, 'scroll', onScroll, { passive: true });

        navDots.forEach((dot, i) => {
          on(dot, 'click', (ev) => {
            ev.stopPropagation();
            scrollToIndex(i, 'smooth');
          });
        });

        installDragFlag(slider);

        // Warm up images when the carousel is close to the viewport.
        if (roomPreloadObserver) roomPreloadObserver.observe(card);

        // Fallback: warm up on first touch (in case IntersectionObserver is unavailable).
        on(slider, 'touchstart', () => warmUpCarouselImages(slider, images), { passive: true });

        // Infinite loop: when swiping past the last slide, jump back to the first (and vice-versa).
        installInfiniteLoopSwipe(
          slider,
          () => index,
          () => images.length,
          (idx) => scrollToIndex(idx, 'auto')
        );

        // Start on the first slide without animation
        scrollToIndex(0, 'auto');
        setActiveDot(0);
        return;
      }

      // ------------------------------------------------------------------
      // Desktop / non-touch mode: keep the original autoplay + swipe logic
      // ------------------------------------------------------------------

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

    const native = useNativeCarousels();

    const safeScrollTo = (el, left, behavior) => {
      if (!el) return;
      try {
        el.scrollTo({ left, behavior });
      } catch (_) {
        el.scrollLeft = left;
      }
    };

    // Prevent accidental "tap" actions right after a swipe
    const installDragFlag = (el) => {
      if (!el) return;
      let startX = 0;
      let startY = 0;
      let dragging = false;

      on(el, 'touchstart', (ev) => {
        const t = ev.touches && ev.touches[0];
        if (!t) return;
        startX = t.clientX;
        startY = t.clientY;
        dragging = false;
        el.dataset.dragging = '0';
      }, { passive: true });

      on(el, 'touchmove', (ev) => {
        const t = ev.touches && ev.touches[0];
        if (!t) return;
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);
        if (dx > 8 && dx > dy) {
          dragging = true;
          el.dataset.dragging = '1';
        }
      }, { passive: true });

      const end = () => {
        if (dragging) {
          // Keep the flag alive for the synthetic click event that follows a swipe
          setTimeout(() => { el.dataset.dragging = '0'; }, 250);
        } else {
          el.dataset.dragging = '0';
        }
      };

      on(el, 'touchend', end, { passive: true });
      on(el, 'touchcancel', end, { passive: true });
    };

    if (native) installDragFlag(overlaySlider);

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

    const scrollToIndex = (idx, behavior = 'smooth') => {
      const w = overlaySlider.clientWidth || 1;
      safeScrollTo(overlaySlider, idx * w, behavior);
      updateActive(idx);
    };

    // Desktop animation (kept for non-touch / non-native mode)
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
      const inClass = direction > 0 ? 'slide-in-right' : 'slide-in-left';

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

    const goTo = (idx, direction = +1) => {
      if (images.length < 2) return;
      if (idx === current) return;

      if (native) {
        scrollToIndex(idx, 'smooth');
      } else {
        animateTo(idx, direction);
      }
    };

    // Native mode: keep dots synced while the user swipes (scroll-snap).
    if (native) {
      let raf = 0;
      on(overlaySlider, 'scroll', () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const w = overlaySlider.clientWidth || 1;
          const idx = Math.round(overlaySlider.scrollLeft / w);
          if (idx !== current) updateActive(idx);
        });
      }, { passive: true });
    }

    // Infinite loop on swipe (native scroll-snap mode)
    if (native) {
      installInfiniteLoopSwipe(
        overlaySlider,
        () => current,
        () => images.length,
        (idx) => scrollToIndex(idx, 'auto')
      );
    }

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
        el.decoding = 'async';
        el.loading = (idx === 0) ? 'eager' : 'lazy';
        if (idx === 0) el.classList.add('active');
        overlaySlider.appendChild(el);
      });

      // Warm up images immediately so the *first* swipe is fluid too (mobile)
      if (native) warmUpCarouselImages(overlaySlider, getOverlayImgs(), { force: true });

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
          goTo(idx, dir);
        });
        overlayDots.appendChild(btn);
      });

      // Full-photo mode toggle when clicking the image (optional UX)
      Array.from(getOverlayImgs()).forEach((imgEl) => {
        imgEl.addEventListener('click', (ev) => {
          ev.stopPropagation();
          // If the user just swiped, ignore the synthetic click
          if (native && overlaySlider.dataset.dragging === '1') return;
          overlay.classList.toggle('full-photo-mode');
        });
      });

      current = 0;

      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');

      // Helpful class for styling when only 1 image
      overlay.classList.toggle('single-image', images.length <= 1);

      // Ensure first state is correct
      if (native) {
        scrollToIndex(0, 'auto');
      } else {
        updateActive(0);
      }
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
      goTo(prevIndex, -1);
    });

    on(nextBtn, 'click', (ev) => {
      ev.stopPropagation();
      if (images.length < 2) return;
      const nextIndex = (current + 1) % images.length;
      goTo(nextIndex, +1);
    });

    // Swipe on overlay slider
    if (!native) {
      // Use a getter because slides are rebuilt on open
      attachSwipe(
        overlaySlider,
        () => overlaySlider.querySelectorAll('img'),
        () => current,
        (newIndex) => updateActive(newIndex)
      );
    }

    // Wire room cards to open overlay (only if overlay exists)
    qsa('.room-card').forEach((card) => {
      on(card, 'click', (event) => {
        // Do not open overlay when clicking on CTA buttons or dots
        if (event.target.closest('.room-reserve-btn')) return;
        if (event.target.closest('.details-btn')) return;
        if (event.target.closest('.room-dots')) return;

        // If the user is swiping the room carousel, ignore the synthetic click
        const roomSlider = event.target.closest('.room-slider');
        if (roomSlider && roomSlider.dataset && roomSlider.dataset.dragging === '1') return;

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
