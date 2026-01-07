/*
 * Gallery page script
 * Provides scroll reveal animations for gallery items, hover effects with
 * zoom and plus icons, and a full-screen overlay to browse photos.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal for gallery items
  const animatedItems = document.querySelectorAll(
    '.scroll-fade-up, .scroll-fade-left, .scroll-fade-right'
  );
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    },
    {
      // Fire callbacks both when the element fully enters/exits the viewport
      // (intersection ratio 0) and when roughly one‑third of it is visible.
      // This enables us to remove the `.in‑view` class when the image is
      // completely scrolled out of view, so animations re‑trigger on
      // subsequent scrolls.  See MDN for how threshold arrays work:
      // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#threshold
      threshold: [0, 0.3]
    }
  );
  animatedItems.forEach((item) => {
    scrollObserver.observe(item);
  });

  // --------------------------------------------------------------------
  // Build a 99‑photo gallery dynamically.  The gallery grid is emptied
  // and repopulated with 99 items based on the images available in
  // assets/images/gallery.  Each file should be named
  // gallery-01.jpg, gallery-02.jpg, ..., gallery-99.jpg.  If fewer
  // files are present, the images will repeat cyclically.  The layout
  // classes (big, tall, wide, default) repeat every eight items to
  // create a varied masonry effect.

  const galleryGrid = document.querySelector('.gallery-grid');
  // CSS class pattern: big, tall, wide, default, default, wide, tall, big
  const patternClasses = ['big', 'tall', 'wide', '', '', 'wide', 'tall', 'big'];
  const NUM_GALLERY_IMAGES = 99;
  // Build an array of image descriptors.  Use two‑digit numbers for
  // consistency (01 to 99).  If a corresponding file does not exist,
  // the browser will fall back to a broken link; users should
  // populate the gallery folder with their own photos.
  const localImages = Array.from({ length: NUM_GALLERY_IMAGES }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
      src: `assets/images/gallery/gallery-${num}.jpg`,
      alt: `Photo ${i + 1}`
    };
  });
  // Clear existing static thumbnails
  galleryGrid.innerHTML = '';
  // Create gallery items dynamically
  localImages.forEach((data, i) => {
    const cls = patternClasses[i % patternClasses.length];
    const item = document.createElement('div');
    item.className = `gallery-item${cls ? ' ' + cls : ''} scroll-fade-up`;
    item.setAttribute('data-index', i);
    const img = document.createElement('img');
    img.src = data.src;
    img.alt = data.alt;
    img.loading = 'lazy';
    item.appendChild(img);
    const plus = document.createElement('div');
    plus.className = 'plus-icon';
    plus.textContent = '+';
    item.appendChild(plus);
    galleryGrid.appendChild(item);
  });

  // Re-observe newly created gallery items for scroll animations.  The
  // IntersectionObserver was initialised before the gallery grid was
  // rebuilt, so observe each of the new elements now.  This will
  // trigger fade‑in animations as they scroll into view.
  document.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right').forEach((item) => {
    scrollObserver.observe(item);
  });

  // --------------------------------------------------------------------
  // Performance: enable native lazy‑loading for gallery images
  //
  // All gallery photos are offscreen when the page first loads because
  // users typically start at the top.  Marking these images as lazy
  // hints to the browser that they need not be fetched immediately,
  // reducing bandwidth usage and speeding up the initial render.  See
  // https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading
  // for more details.  We set the `loading` attribute on every
  // thumbnail here rather than in the HTML to avoid repetitive markup.
  document.querySelectorAll('.gallery-item img').forEach((img, i) => {
    // Always defer loading; these thumbnails are not in the initial
    // viewport.  Browsers will load them just before they scroll into
    // view.
    img.setAttribute('loading', 'lazy');
  });

  // Hide decorative plus icons from assistive technologies.  The plus
  // symbol indicates that clicking will open the overlay, but it
  // should not be announced by screen readers as a separate element.
  document.querySelectorAll('.plus-icon').forEach((icon) => {
    icon.setAttribute('aria-hidden', 'true');
  });

  // Gallery overlay functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const overlay = document.getElementById('galleryOverlay');
  const slider = overlay.querySelector('.gallery-slider');
  const dotsContainer = overlay.querySelector('.gallery-dots');
  const prevBtn = overlay.querySelector('.prev');
  const nextBtn = overlay.querySelector('.next');
  const closeBtn = overlay.querySelector('.gallery-close');

  // Collect image sources from gallery items
  const images = Array.from(galleryItems).map((item) => {
    const img = item.querySelector('img');
    return img ? img.src : '';
  });

  let currentIndex = 0;

  // ------------------------------------------------------------------
  // Sliding animation for gallery overlay
  // This helper animates transitions between slides in the gallery
  // overlay using CSS keyframes defined in style.css.  The direction
  // argument should be +1 for forward navigation and -1 for backward.
  function animateGallerySlide(newIndex, direction) {
    if (newIndex === currentIndex) return;
    const slides = slider.querySelectorAll('img');
    const currentImg = slides[currentIndex];
    const nextImg = slides[newIndex];
    // Remove existing animation classes
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
      imgs.forEach((img, i) => {
        img.classList.toggle('active', i === newIndex);
      });
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((btn, i) => {
        btn.classList.toggle('active', i === newIndex);
      });
      currentIndex = newIndex;
      currentImg.classList.remove('slide-out-left', 'slide-out-right');
      nextImg.classList.remove('slide-in-left', 'slide-in-right');
    }, 500);
  }

  function showSlide(index) {
    const slides = slider.querySelectorAll('img');
    slides.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    currentIndex = index;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  function openOverlay(index) {
    // Clear existing slides
    slider.innerHTML = '';
    // Build a new slide for each image source
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Galerie photo ${i + 1}`;
      if (i === index) {
        img.classList.add('active');
      }
      slider.appendChild(img);
    });
    // Build navigation dots
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
      const btn = document.createElement('button');
      if (i === index) btn.classList.add('active');
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const dir = i > currentIndex ? 1 : -1;
        animateGallerySlide(i, dir);
      });
      dotsContainer.appendChild(btn);
    });
    // Scroll to the top of the page to ensure the overlay appears in view
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Show the overlay
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    currentIndex = index;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', (ev) => {
      // Open the overlay when clicking anywhere on the gallery item.  The
      // plus icon indicates the ability to expand the photo, but the
      // entire card is interactive to improve usability.
      ev.preventDefault();
      openOverlay(i);
    });
  });

  prevBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    animateGallerySlide(newIndex, -1);
  });
  nextBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const newIndex = (currentIndex + 1) % images.length;
    animateGallerySlide(newIndex, +1);
  });
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  });
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });

  // Allow closing the gallery overlay with the Escape key.  This
  // improves keyboard accessibility by giving users an intuitive way
  // to dismiss the modal without moving their focus to the close
  // button.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });

  // --------------------------------------------------------------
  // Touch swipe navigation for gallery overlay
  // Enable swiping left or right on the enlarged gallery photo to move
  // through the slideshow.  A threshold of 50 pixels distinguishes
  // intentional swipes from taps.  Stop propagation on touchend so
  // that a swipe does not inadvertently close the overlay.
  let galleryTouchStartX = null;
  slider.addEventListener('touchstart', (e) => {
    galleryTouchStartX = e.touches[0].clientX;
  });
  slider.addEventListener('touchend', (e) => {
    if (galleryTouchStartX === null) return;
    const diffX = e.changedTouches[0].clientX - galleryTouchStartX;
    if (Math.abs(diffX) > 50) {
      e.stopPropagation();
      if (diffX < 0) {
        const newIndex = (currentIndex + 1) % images.length;
        animateGallerySlide(newIndex, +1);
      } else {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        animateGallerySlide(newIndex, -1);
      }
    }
    galleryTouchStartX = null;
  });

  // Page transitions are handled globally via transition.js using
  // a page-turn effect applied to the `.page-wrapper`.  Fade
  // transitions previously defined here have been removed to avoid
  // conflicts.
});