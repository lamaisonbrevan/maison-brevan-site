/*
 * Gallery page script
 * - Builds the masonry grid dynamically from assets/images/gallery
 * - Thumbnails are annotated with scroll-fade classes; global script.js handles reveal animations
 * - Full-screen overlay (modal) to browse photos with swipe support
 *
 * Notes:
 * - The script is loaded with `defer`, so DOM elements are available when it runs.
 * - We still guard for safety in case the script loading strategy changes.
 */

(function () {
  'use strict';

  const ready = () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const overlay = document.getElementById('galleryOverlay');
    if (!galleryGrid || !overlay) return;

    // ------------------------------------------------------------------
    // Build gallery thumbnails (skip missing indices to avoid broken images)
    // ------------------------------------------------------------------
    const patternClasses = ['big', 'tall', 'wide', '', '', 'wide', 'tall', 'big'];
    const NUM_GALLERY_IMAGES = 99;

    // 1‑based indices that do not exist in the gallery folder
    const excludedIndices = new Set([
      1, 2, 3, 7, 9, 18, 19, 30, 32, 36, 40, 41, 49, 50, 57, 65, 74, 75, 77, 79,
      84, 85, 86, 88, 98, 99
    ]);

    const imagesData = [];
    for (let idx = 1; idx <= NUM_GALLERY_IMAGES; idx += 1) {
      if (excludedIndices.has(idx)) continue;
      const num = String(idx).padStart(2, '0');
      imagesData.push({
        src: `assets/images/gallery/gallery-${num}.jpg`,
        alt: `Photo ${idx}`
      });
    }

    galleryGrid.innerHTML = '';
    const frag = document.createDocumentFragment();

    imagesData.forEach((data, i) => {
      const cls = patternClasses[i % patternClasses.length];
      const item = document.createElement('div');
      item.className = `gallery-item${cls ? ' ' + cls : ''} scroll-fade-up`;
      item.setAttribute('data-index', String(i));

      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      item.appendChild(img);

      const plus = document.createElement('div');
      plus.className = 'plus-icon';
      plus.textContent = '+';
      plus.setAttribute('aria-hidden', 'true');
      item.appendChild(plus);

      frag.appendChild(item);
    });

    galleryGrid.appendChild(frag);

    // ------------------------------------------------------------------
    // Overlay logic
    // ------------------------------------------------------------------
    const slider = overlay.querySelector('.gallery-slider');
    const dotsContainer = overlay.querySelector('.gallery-dots');
    const prevBtn = overlay.querySelector('.prev');
    const nextBtn = overlay.querySelector('.next');
    const closeBtn = overlay.querySelector('.gallery-close');

    if (!slider || !dotsContainer || !prevBtn || !nextBtn || !closeBtn) return;

    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');

    // Collect image sources from gallery items
    const images = Array.from(galleryItems).map((item) => {
      const img = item.querySelector('img');
      return img ? img.src : '';
    });

    let currentIndex = 0;

    // Touch mobiles: use scroll-snap (CSS) for an Instagram-like feel.
    const nativeCarousel = (() => {
      try {
        return !!(window.matchMedia && window.matchMedia('(max-width: 900px) and (pointer: coarse)').matches);
      } catch (_) {
        return false;
      }
    })();

    const safeScrollTo = (el, left, behavior) => {
      if (!el) return;
      try {
        el.scrollTo({ left, behavior });
      } catch (_) {
        el.scrollLeft = left;
      }
    };

    // Sync dots + active state while using native scroll-snap
    let nativeScrollBound = false;
    const bindNativeScroll = () => {
      if (!nativeCarousel || nativeScrollBound) return;
      nativeScrollBound = true;

      let raf = 0;
      slider.addEventListener(
        'scroll',
        () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            const w = slider.clientWidth || 1;
            const idx = Math.round(slider.scrollLeft / w);
            if (idx !== currentIndex) showSlide(idx);
          });
        },
        { passive: true }
      );
    };

    const scrollToSlide = (idx, behavior = 'smooth') => {
      const w = slider.clientWidth || 1;
      safeScrollTo(slider, idx * w, behavior);
      showSlide(idx);
    };

    function animateGallerySlide(newIndex, direction) {
      if (newIndex === currentIndex) return;
      const slides = slider.querySelectorAll('img');
      const currentImg = slides[currentIndex];
      const nextImg = slides[newIndex];

      if (!currentImg || !nextImg) return;

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
        const imgs = slider.querySelectorAll('img');
        imgs.forEach((img, i) => img.classList.toggle('active', i === newIndex));

        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((btn, i) => btn.classList.toggle('active', i === newIndex));

        currentIndex = newIndex;

        currentImg.classList.remove('slide-out-left', 'slide-out-right');
        nextImg.classList.remove('slide-in-left', 'slide-in-right');
      }, 500);
    }

    function showSlide(index) {
      const slides = slider.querySelectorAll('img');
      slides.forEach((img, i) => img.classList.toggle('active', i === index));
      currentIndex = index;

      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((btn, i) => btn.classList.toggle('active', i === index));
    }

    function openOverlay(index) {
      // Slides
      slider.innerHTML = '';
      const slidesFrag = document.createDocumentFragment();
      images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Galerie photo ${i + 1}`;
        img.decoding = 'async';
        img.loading = (i === index) ? 'eager' : 'lazy';
        if (i === index) img.classList.add('active');
        slidesFrag.appendChild(img);
      });
      slider.appendChild(slidesFrag);

      // Dots
      dotsContainer.innerHTML = '';
      const dotsFrag = document.createDocumentFragment();
      images.forEach((_, i) => {
        const btn = document.createElement('button');
        if (i === index) btn.classList.add('active');
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (nativeCarousel) {
            scrollToSlide(i, 'smooth');
            return;
          }
          const dir = i > currentIndex ? 1 : -1;
          animateGallerySlide(i, dir);
        });
        dotsFrag.appendChild(btn);
      });
      dotsContainer.appendChild(dotsFrag);

      // Ensure the overlay is visible immediately
      window.scrollTo({ top: 0, behavior: 'auto' });

      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      currentIndex = index;

      if (nativeCarousel) {
        bindNativeScroll();
        requestAnimationFrame(() => scrollToSlide(index, 'auto'));
      }
    }

    // Open overlay on thumbnail click
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', (ev) => {
        ev.preventDefault();
        openOverlay(i);
      });
    });

    prevBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      if (nativeCarousel) {
        scrollToSlide(newIndex, 'smooth');
        return;
      }
      animateGallerySlide(newIndex, -1);
    });

    nextBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const newIndex = (currentIndex + 1) % images.length;
      if (nativeCarousel) {
        scrollToSlide(newIndex, 'smooth');
        return;
      }
      animateGallerySlide(newIndex, +1);
    });

    const close = () => {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    };

    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) close();
    });

    // Touch swipe navigation for the gallery overlay (desktop / non-native mode)
    // Re-use the global attachSwipe helper (script.js) for consistent behaviour.
    if (!nativeCarousel && window.attachSwipe) {
      window.attachSwipe(slider, {
        getSlides: () => slider.querySelectorAll('img'),
        getCurrentIndex: () => currentIndex,
        onIndexChange: (newIndex) => showSlide(newIndex),
        axis: 'x'
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }
})();
