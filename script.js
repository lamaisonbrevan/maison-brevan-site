/*
 * Basic slider functionality for the static index page.
 * This script rotates through a set of hero images every few seconds
 * and updates the corresponding navigation dots. Users can also
 * click a dot to jump to a specific slide.
 */

/*
 * Global helper for toggling the mobile navigation
 *
 * Some browsers and page configurations may prevent dynamically
 * attaching click handlers to buttons on pages other than the home page.
 * To ensure the hamburger menu works reliably everywhere, we expose
 * a function on the window object.  It accepts an event, stops it
 * propagating, locates the `.mobile-nav` element in the current
 * document and toggles its `.open` class.  All `<button class="hamburger">`
 * elements can therefore call this function via their `onclick`
 * attribute in the markup.
 */
// Toggle the mobile navigation by adding/removing the `.open` class on the
// `.mobile-nav` element.  This function is called from the menu button
// `onclick` handlers defined in the HTML.  When opening the menu it
// registers a one‑time document click listener that will close the menu
// if the click target is outside the menu and the button.  This ensures
// consistent behaviour across all pages without relying on page‑specific
// DOMContentLoaded code.
window.toggleMobileNav = function (ev) {
  if (ev) {
    // Prevent the click from bubbling and immediately triggering the outside
    // click handler when it is first attached.
    ev.stopPropagation();
  }
  const mobileNavEl = document.querySelector('.mobile-nav');
  if (!mobileNavEl) return;
  // Toggle the open state
  const isOpen = mobileNavEl.classList.toggle('open');
  if (isOpen) {
    // Handler to close the menu on outside click
    const outsideClickHandler = function(e) {
      const clickInsideMenu = mobileNavEl.contains(e.target);
      const clickOnButton = !!e.target.closest('.hamburger');
      if (!clickInsideMenu && !clickOnButton) {
        mobileNavEl.classList.remove('open');
        document.removeEventListener('click', outsideClickHandler);
      }
    };
    // Register one‑time outside click listener
    document.addEventListener('click', outsideClickHandler);
    // Close the menu when any link inside it is clicked
    mobileNavEl.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavEl.classList.remove('open');
      }, { once: true });
    });
  }
};

/*
 * Global helper to scroll back to the top of the homepage when the site
 * title badge is clicked.  If invoked on the index page it simply
 * scrolls to the top; if invoked on any other page it navigates to
 * index.html#home.  This helper prevents the default anchor behavior and
 * ensures consistent positioning across pages.  It can be called from
 * markup via `onclick="scrollToTop(event)"` on the title link.
 */
window.scrollToTop = function(ev) {
  if (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  const path = window.location.pathname;
  // Determine if we are already on the homepage (index.html or root)
  const onHome = /(?:index\.html)?$/.test(path) && !path.includes('reserve') && !path.includes('gallery') && !path.includes('autour') && !path.includes('mentions') && !path.includes('confidentialite') && !path.includes('cookies') && !path.includes('cgv');
  if (onHome) {
    // Smoothly scroll to the very top of the document
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Navigate to the homepage anchor
    window.location.href = 'index.html#home';
  }
};

document.addEventListener("DOMContentLoaded", () => {
  
  // If the page is loaded with an anchor (#chambres or #contact) from another page,
  // automatically scroll to the target section after the DOM is ready.  For the
  // rooms section (#chambres) we apply an offset equal to the header height
  // plus an extra constant to ensure the hero image above is fully offscreen.
  // For other anchors (e.g. #contact) we simply call scrollIntoView.  Without this
  // logic, users arriving at index.html via an anchor sometimes need to click
  // the navigation link twice to reach the intended section.  See nav links on
  // other pages like galerie or autour.
  const hash = window.location.hash;
  if (hash) {
    const id = hash.substring(1);
    const target = document.getElementById(id);
    if (target) {
      setTimeout(() => {
        if (id === 'chambres') {
          // When navigating to the rooms section on page load, scroll such that
          // the "Nos chambres" heading appears fully below the fixed header.
          // Locate the first h2 following the anchor and compute an offset
          // relative to it.  Use a delay to ensure the initial page layout and
          // anchor jump have completed before adjusting the scroll position.
          const headingEl = document.querySelector('#chambres + h2');
          if (headingEl) {
            const header = document.querySelector('.site-header');
            const headerOffset = header ? header.offsetHeight : 0;
            // Also account for the site title badge that floats over the hero.
            // When scrolling to the rooms section, the badge can otherwise
            // overlap the "Nos chambres" heading.  Include its height in the
            // offset calculation so the heading appears entirely below it.
            const badge = document.querySelector('.site-title-badge');
            const badgeHeight = badge ? badge.offsetHeight : 0;
            const extraMargin = 20;
            const adjustScroll = () => {
              const y = headingEl.getBoundingClientRect().top + window.pageYOffset - headerOffset - badgeHeight - extraMargin;
              window.scrollTo({ top: y, behavior: 'smooth' });
            };
            // Perform the adjustment after a brief timeout to allow the default
            // anchor jump to occur.  A second timeout ensures the heading
            // remains in view after any CSS transitions or images load.
            setTimeout(() => {
              adjustScroll();
              setTimeout(adjustScroll, 200);
            }, 50);
          }
        } else if (id === 'home') {
          // When navigating to the home section (#home) on page load from another
          // page, simply scroll to the very top of the document.  Without this
          // branch the default handler would scroll to the bottom, which is
          // intended only for contact anchors.  The hero section sits at the
          // top of the page so no offset is required.
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // For other anchors (e.g. contact) scroll to the element and then
          // ensure the page reaches the very bottom.  Without the extra
          // scroll, the first click sometimes stops short of the footer.
          target.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            // Scroll all the way to the bottom to reveal the contact details.
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }, 400);
        }
      }, 10);
    }
  }
const slides = document.querySelectorAll(".hero img");
  const dots = document.querySelectorAll(".hero .dots button");
  let current = 0;

  function showSlide(index) {
    // Fallback slide update without animation.  This method
    // immediately toggles the active class on the images and dots.
    slides.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    current = index;
  }

  // ------------------------------------------------------------------
  // Sliding animation for the hero slider
  // This helper animates the transition between the current slide and
  // the next/previous slide using CSS classes defined in style.css.
  // The direction parameter should be +1 for forward navigation or
  // -1 for backward navigation.  After the animation completes, the
  // active states are updated and animation classes are removed.
  function animateHeroSlide(newIndex, direction) {
    if (newIndex === current) return;
    const currentImg = slides[current];
    const nextImg = slides[newIndex];
    // Remove any lingering animation classes
    [currentImg, nextImg].forEach((img) => {
      img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
    });
    // Determine which animation classes to apply based on direction
    if (direction > 0) {
      currentImg.classList.add('slide-out-left');
      nextImg.classList.add('slide-in-right');
    } else {
      currentImg.classList.add('slide-out-right');
      nextImg.classList.add('slide-in-left');
    }
    // Schedule update of active classes after the animation duration
    setTimeout(() => {
      slides.forEach((img, i) => {
        img.classList.toggle('active', i === newIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === newIndex);
      });
      current = newIndex;
      // Remove animation classes so future animations can be applied
      currentImg.classList.remove('slide-out-left', 'slide-out-right');
      nextImg.classList.remove('slide-in-left', 'slide-in-right');
    }, 500);
  }

  // Auto-rotate every 5 seconds using sliding animation
  let intervalId = setInterval(() => {
    const next = (current + 1) % slides.length;
    animateHeroSlide(next, +1);
  }, 5000);

  // Pause on hover
  const hero = document.querySelector(".hero");
  hero.addEventListener('mouseenter', () => clearInterval(intervalId));
  hero.addEventListener('mouseleave', () => {
    intervalId = setInterval(() => {
      const next = (current + 1) % slides.length;
      animateHeroSlide(next, +1);
    }, 5000);
  });

  // Dot click handler with sliding animation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const direction = i > current ? 1 : -1;
      animateHeroSlide(i, direction);
    });
  });

  // Attach a generic swipe handler to the hero that animates the
  // slides during the drag and decides on the final slide on
  // touchend.  See attachSwipe() definition for implementation.
  // The handler updates the global `current` and uses
  // animateHeroSlide() to perform the slide once the swipe ends.
  attachSwipe(hero, slides, () => current, (newIndex, direction) => {
    animateHeroSlide(newIndex, direction);
  });

  // Show initial slide
  showSlide(0);

  /**
   * Attach swipe handling to a slider container.
   *
   * This helper enables drag‑to‑swipe functionality on any carousel.  It
   * listens to touchstart/move/end events on the given container,
   * translates the images during the drag, and decides on
   * touchend whether to commit to the next/previous slide or revert
   * back to the current one.  Threshold is based on 25% of the
   * container width.  The `getIndex` function must return the
   * current slide index, and `setIndex` is called with the new
   * index and direction (+1 or –1) when the slide should change.
   *
   * @param {HTMLElement} container The DOM element to attach listeners to.
   * @param {NodeListOf<HTMLElement>} imgList A list of the images in the slider.
   * @param {Function} getIndex Function returning the current active index.
   * @param {Function} setIndex Function accepting (newIndex, direction) and performing the slide change.
   */
  function attachSwipe(container, imgList, getIndex, setIndex) {
    let startX = null;
    let isDragging = false;
    let containerWidth = null;
    let currentIndex = null;
    let neighborIndex = null;
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      containerWidth = container.offsetWidth;
      currentIndex = getIndex();
      // Disable transitions during drag
      imgList.forEach(img => {
        img.style.transition = 'none';
      });
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
      if (!isDragging || startX === null) return;
      const diff = e.touches[0].clientX - startX;
      // Translate current image
      const currentImg = imgList[currentIndex];
      currentImg.style.transform = `translateX(${diff}px)`;
      // Determine which neighbouring image to move based on drag direction
      if (diff < 0) {
        neighborIndex = (currentIndex + 1) % imgList.length;
        const neighborImg = imgList[neighborIndex];
        neighborImg.style.transform = `translateX(${containerWidth + diff}px)`;
      } else if (diff > 0) {
        neighborIndex = (currentIndex - 1 + imgList.length) % imgList.length;
        const neighborImg = imgList[neighborIndex];
        neighborImg.style.transform = `translateX(${-containerWidth + diff}px)`;
      }
    }, { passive: true });
    container.addEventListener('touchend', (e) => {
      if (!isDragging || startX === null) return;
      const diff = e.changedTouches[0].clientX - startX;
      // Restore transitions
      imgList.forEach(img => {
        img.style.transition = '';
      });
      const threshold = containerWidth * 0.25;
      if (Math.abs(diff) > threshold) {
        // Determine direction and compute new index
        const direction = diff < 0 ? +1 : -1;
        const newIndex = (currentIndex + direction + imgList.length) % imgList.length;
        // Reset transforms before animating with our slide functions
        imgList.forEach(img => {
          img.style.transform = '';
        });
        setIndex(newIndex, direction);
      } else {
        // Revert translation
        imgList.forEach(img => {
          img.style.transform = '';
        });
      }
      startX = null;
      isDragging = false;
    });
  }

  // Expose attachSwipe globally so other scripts (gallery.js, around overlay)
  // can reuse the same drag‑to‑swipe behaviour.  Without assigning
  // attachSwipe to window, the helper remains scoped within this
  // closure and cannot be invoked from other modules or inline scripts.
  window.attachSwipe = attachSwipe;

  // --------------------------------------------------------------
  // Performance: Enable native lazy‑loading for images
  //
  // Assign the `loading="lazy"` attribute to offscreen images.  The
  // first hero image loads eagerly because it appears above the
  // fold.  All subsequent hero images, room slider images and
  // gallery images are marked as lazy so the browser will defer
  // downloading them until they are close to entering the viewport.
  const heroImgs = document.querySelectorAll('.hero img');
  heroImgs.forEach((img, i) => {
    if (i > 0) {
      img.setAttribute('loading', 'lazy');
    }
  });
  document.querySelectorAll('.room-slider img').forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
  // Note: gallery images live on their own page, but if any exist on
  // this page we apply lazy loading as well.
  document.querySelectorAll('.gallery-item img').forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });

  /*
   * Room card sliders
   * For each room card, rotate through its images and update dots.
   */
  const roomCards = document.querySelectorAll(".room-card");
  roomCards.forEach((card) => {
    const images = card.querySelectorAll(".room-slider img");
    const navDots = card.querySelectorAll(".room-dots button");
    if (images.length === 0) return;
    let index = 0;

    function showRoomSlide(i) {
      images.forEach((img, idx) => {
        img.classList.toggle("active", idx === i);
      });
      navDots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === i);
      });
      index = i;
    }

    /*
     * Animate room card slide transition.
     *
     * This function adds CSS classes to the current and next images
     * to produce a sliding animation similar to the hero slider.  The
     * direction parameter should be +1 for forward (next) and -1 for
     * backward (previous).  After the animation completes, it
     * cleans up classes and sets the new active image.
     */
    function animateRoomSlide(newIndex, direction) {
      // If the requested slide is already active, do nothing
      if (newIndex === index) return;
      const currentImg = images[index];
      const nextImg = images[newIndex];
      // Determine which classes to add based on direction
      const outClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
      const inClass  = direction > 0 ? 'slide-in-right' : 'slide-in-left';
      // Remove any previous animation classes
      images.forEach(img => {
        img.classList.remove('slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
      });
      // Assign z-index values so the incoming image appears above
      currentImg.style.zIndex = '1';
      nextImg.style.zIndex = '2';
      // Update dot states immediately
      navDots[index].classList.remove('active');
      navDots[newIndex].classList.add('active');
      // Add animation classes
      currentImg.classList.add(outClass);
      nextImg.classList.add(inClass);
      // After animation completes, clean up and set active
      setTimeout(() => {
        images.forEach((img, idx) => {
          img.classList.remove('active', 'slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
          img.style.zIndex = '';
          if (idx === newIndex) {
            img.classList.add('active');
          }
        });
        index = newIndex;
      }, 500);
    }

    // Autoplay interval for each room card using sliding animation
    let roomInterval = setInterval(() => {
      const next = (index + 1) % images.length;
      animateRoomSlide(next, +1);
    }, 5000);

    // Pause on hover over the room image
    const roomImgContainer = card.querySelector(".room-image");
    roomImgContainer.addEventListener("mouseenter", () => {
      clearInterval(roomInterval);
    });
    roomImgContainer.addEventListener("mouseleave", () => {
      roomInterval = setInterval(() => {
        const next = (index + 1) % images.length;
        animateRoomSlide(next, +1);
      }, 5000);
    });

    // Dot click handlers for manual navigation
    navDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const direction = i > index ? 1 : -1;
        animateRoomSlide(i, direction);
      });
    });

    // Initialise first slide
    showRoomSlide(0);

    // Attach swipe handling to the room image container.  The
    // generic attachSwipe() function handles the drag motion and
    // decides which slide to show once the finger is lifted.  It
    // pauses the autoplay interval during the swipe and restarts it
    // afterwards.
    attachSwipe(
      roomImgContainer,
      images,
      () => index,
      (newIndex, direction) => {
        clearInterval(roomInterval);
        animateRoomSlide(newIndex, direction);
        // Restart autoplay interval after the animation
        roomInterval = setInterval(() => {
          const next = (index + 1) % images.length;
          animateRoomSlide(next, +1);
        }, 5000);
      }
    );
  });

  /*
   * Room overlay functionality
   * When a room card is clicked (except on the reserve button), display a modal
   * with a larger image carousel and extended description. Users can navigate
   * between photos using arrows and close the overlay via the close button or
   * by clicking outside the content area.
   */
  const overlay = document.getElementById('roomOverlay');
  const overlaySlider = document.getElementById('overlaySlider');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  // Keep a reference to the dot container.  This element may be moved into
  // the slider on open, so we declare it with let to allow reassignment.
  let overlayDotsContainer = document.getElementById('overlayDots');
  const overlayClose = overlay.querySelector('.overlay-close');
  // Navigation arrows are removed; images are navigated using dots only

  let overlayImages = [];
  let currentOverlayIndex = 0;

  // When present in the DOM, navigation arrows allow users to cycle through
  // photos in the room overlay.  Select them now and add click handlers
  // below.  Because these buttons are inserted in the HTML markup, they
  // always exist even if hidden via CSS.
  const overlayPrev = overlay.querySelector('.overlay-prev');
  const overlayNext = overlay.querySelector('.overlay-next');

  // Add click handlers to the overlay navigation arrows.  These handlers
  // adjust the current index and update the overlay to show the previous
  // or next image.  Use stopPropagation() so that clicking an arrow does
  // not close the overlay or trigger other click listeners.
  if (overlayPrev && overlayNext) {
    overlayPrev.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (!overlayImages || overlayImages.length === 0) return;
      const prevIndex = (currentOverlayIndex - 1 + overlayImages.length) % overlayImages.length;
      updateOverlaySlide(prevIndex);
    });
    overlayNext.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (!overlayImages || overlayImages.length === 0) return;
      const nextIndex = (currentOverlayIndex + 1) % overlayImages.length;
      updateOverlaySlide(nextIndex);
    });
  }

  function updateOverlaySlide(index) {
    const imgs = overlaySlider.querySelectorAll('img');
    imgs.forEach((img, idx) => {
      img.classList.toggle('active', idx === index);
    });
    currentOverlayIndex = index;
    // Update active state of overlay dots
    const dotButtons = overlayDotsContainer.querySelectorAll('button');
    dotButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });
  }

  function openOverlay(card) {
    // Gather image sources and alt texts
    overlayImages = [];
    const imgs = card.querySelectorAll('.room-slider img');
    imgs.forEach((img) => {
      overlayImages.push({ src: img.src, alt: img.alt || '' });
    });
    // Populate the overlay slider.  Clear out any existing images and then
    // append the new set of images.  Unlike earlier versions, we leave
    // the dot container outside of the slider so that it is not removed
    // when re-rendering the images.
    overlaySlider.innerHTML = '';
    overlayImages.forEach((data, idx) => {
      const el = document.createElement('img');
      el.src = data.src;
      el.alt = data.alt;
      if (idx === 0) {
        el.classList.add('active');
      }
      overlaySlider.appendChild(el);
    });
    // Set title
    const titleEl = card.querySelector('h3');
    const title = titleEl ? titleEl.textContent.trim() : '';
    overlayTitle.textContent = title;
    // Do not display the extended description when opening a room.  The
    // overlay is intentionally minimal: only the room name is shown.
    overlayText.textContent = '';
    // Reset index
    currentOverlayIndex = 0;
    // Create dot buttons for overlay navigation
    overlayDotsContainer.innerHTML = '';
    overlayImages.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        updateOverlaySlide(idx);
      });
      if (idx === 0) btn.classList.add('active');
      overlayDotsContainer.appendChild(btn);
    });
    // Attach click handlers to each image in the overlay slider to toggle
    // full-photo mode.  When the user clicks on the photo, the overlay
    // enters a minimalist view: the description disappears and a
    // watermark fills the remaining space.  Clicking again exits the
    // mode.  Use stopPropagation so the click does not close the
    // overlay itself.
    const overlayImgs = overlaySlider.querySelectorAll('img');
    overlayImgs.forEach((imgEl) => {
      imgEl.addEventListener('click', (ev) => {
        ev.stopPropagation();
        overlay.classList.toggle('full-photo-mode');
      });
    });
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    // Update the visibility of overlay arrows based on the number of images.
    if (overlayImages.length > 1) {
      overlay.classList.remove('single-image');
    } else {
      overlay.classList.add('single-image');
    }
  }

  // Attach click handlers to room cards.  Only clicking on the room image
  // should open the overlay.  Interactions with other elements (reserve
  // button, slider dots, card body) must not trigger the overlay.
  roomCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      // Do not open overlay when clicking on the reserve button
      if (event.target.closest('.room-reserve-btn')) {
        return;
      }
      // Do not open overlay when clicking on details button
      if (event.target.closest('.details-btn')) {
        return;
      }
      // Do not open overlay when clicking on the room dots
      if (event.target.closest('.room-dots')) {
        // Allow dot click to navigate slides without opening overlay
        return;
      }
      // Only open overlay when the user clicks on an actual image
      const clickedImg = event.target.closest('.room-image img');
      if (!clickedImg) {
        return;
      }
      openOverlay(card);
    });
    // Prevent dot clicks from bubbling up to the card handler.  Without
    // this, clicking a dot would open the overlay.  Stop propagation to
    // limit the click scope.
    const navDots = card.querySelectorAll('.room-dots button');
    navDots.forEach((dot, i) => {
      dot.addEventListener('click', (ev) => {
        ev.stopPropagation();
        // Show the corresponding slide
        const images = card.querySelectorAll('.room-slider img');
        const buttons = card.querySelectorAll('.room-dots button');
        images.forEach((img, idx) => {
          img.classList.toggle('active', idx === i);
        });
        buttons.forEach((btn, idx) => {
          btn.classList.toggle('active', idx === i);
        });
      });
    });
    // When clicking the explicit “Plus de détails” button, open the
    // overlay for this card.  Note: currently there is no details button,
    // but keep this for backward compatibility.  Stop propagation so
    // the card handler doesn’t also fire.
    const detailsButton = card.querySelector('.details-btn');
    if (detailsButton) {
      detailsButton.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openOverlay(card);
      });
    }
  });

  // Close overlay when clicking the close button
  overlayClose.addEventListener('click', () => {
    overlay.classList.remove('show');
    overlay.classList.remove('full-photo-mode');
    overlay.setAttribute('aria-hidden', 'true');
  });

  // Close overlay when clicking outside the content
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.classList.remove('show');
      overlay.classList.remove('full-photo-mode');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });

  // Enable closing the room overlay with the Escape key.  This
  // accessibility enhancement lets keyboard users quickly exit the
  // modal without needing to tab to the close button.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });

  // --------------------------------------------------------------
  // Touch swipe navigation for the room overlay slider
  // When the overlay is open on touch devices, users can swipe left or
  // right on the enlarged photo to move to the next or previous image.
  // The swipe distance threshold of 50px prevents accidental slide
  // changes when tapping.  Because the overlay sits on top of other
  // content, stopPropagation() is used during touchend to avoid
  // closing the overlay.
  let overlayTouchStartX = null;
  overlaySlider.addEventListener('touchstart', (e) => {
    overlayTouchStartX = e.touches[0].clientX;
  });
  overlaySlider.addEventListener('touchend', (e) => {
    if (overlayTouchStartX === null) return;
    const diff3 = e.changedTouches[0].clientX - overlayTouchStartX;
    if (Math.abs(diff3) > 50 && overlayImages && overlayImages.length > 0) {
      e.stopPropagation();
      if (diff3 < 0) {
        const nextIdx = (currentOverlayIndex + 1) % overlayImages.length;
        updateOverlaySlide(nextIdx);
      } else {
        const prevIdx = (currentOverlayIndex - 1 + overlayImages.length) % overlayImages.length;
        updateOverlaySlide(prevIdx);
      }
    }
    overlayTouchStartX = null;
  });

  /*
   * Page transition handling
   * When the page loads, fade it in.  When a navigation link with
   * data-transition is clicked, fade the page out before navigating
   * away.  Anchor links (href beginning with '#') are ignored so
   * in-page scroll links behave normally.
   */
  // Page transitions are handled globally via transition.js using
  // a page-turn effect on the `.page-wrapper`.  The fade logic that
  // previously lived here has been removed.  Navigation links with
  // the data-transition attribute will be intercepted by the
  // transition.js script.

  // Custom scroll offset for the Chambres link.  When the user
  // clicks on the "chambres" link in the navigation while on the
  // index page, we want to scroll the rooms section into view with
  // enough offset so the preceding hero image is completely out of
  // the viewport.  This prevents a portion of the hero photo from
  // remaining visible above the "Nos chambres" heading.
  const chambresLink = document.querySelector('a[href="#chambres"]');
  if (chambresLink) {
    chambresLink.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById('chambres');
      if (!target) return;
      // Find the heading that follows the hidden anchor and scroll
      // relative to it so the "Nos chambres" title appears below the header.
      const headingEl = target.nextElementSibling;
      if (headingEl) {
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight : 0;
        // Include the site title badge height in the scroll offset so the
        // "Nos chambres" heading clears the floating badge as well as
        // the fixed header.  Without this additional offset, part of the
        // heading may remain hidden beneath the badge.
        const badge = document.querySelector('.site-title-badge');
        const badgeHeight = badge ? badge.offsetHeight : 0;
        const extraMargin = 20;
        const y = headingEl.getBoundingClientRect().top + window.pageYOffset - headerOffset - badgeHeight - extraMargin;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }

  // Ensure the "Contact" link always scrolls to the footer on the first click.
  // Without this handler, navigating via #contact sometimes stops short and
  // requires a second click.  Attach listeners to all contact anchors on the
  // page.  When clicked, we prevent the default anchor behaviour, scroll
  // the footer into view, and then perform a second scroll to the very end
  // after a short delay to guarantee the contact section is fully visible.
  const contactLinks = document.querySelectorAll('a[href="#contact"]');
  contactLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      // Prevent the default in-page anchor behaviour so we can control the
      // scroll offset precisely.  Without canceling the default, some
      // browsers may jump to the anchor immediately and then stop short of
      // the footer, requiring a second click.
      event.preventDefault();
      const contactTarget = document.getElementById('contact');
      if (!contactTarget) return;
      // Scroll the contact section into view smoothly.
      contactTarget.scrollIntoView({ behavior: 'smooth' });
      // To ensure the page reaches the absolute bottom, schedule two
      // additional scrolls after increasing delays.  On some devices the
      // first scroll may finish before content is fully rendered; the
      // second call guarantees the footer is exposed.  A third call
      // provides an extra safeguard in case transitions or lazy loaded
      // images shift the page height.
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 500);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 1000);
    });
  });

  /*
   * Scroll reveal animations
   * Select all elements marked for animation and observe them. When they
   * enter the viewport (30% visible), add the `in-view` class to trigger
   * their CSS transition. Once an element has been animated, unobserve it
   * to avoid triggering again on future scrolls.
   */
  const animatedItems = document.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right');
  /*
   * Scroll reveal animations
   *
   * Instead of unobserving each target after it enters the viewport, keep
   * observing and toggle the `.in-view` class based on intersection.  When
   * the element leaves the viewport, remove the class so it will animate
   * again on the next scroll into view.  This allows repeated animations
   * as the user scrolls up and down.
   */
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    // Observe when the target first becomes visible (intersection ratio > 0)
    // and again when at least 30% of it is visible.  Including a zero
    // threshold ensures we also receive a callback when the element is
    // completely out of view.  Without a zero threshold, the observer
    // won't fire when the element leaves the viewport, so the
    // `in‑view` class would never be removed.  See MDN docs on
    // IntersectionObserver thresholds for details:
    // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#threshold
    threshold: [0, 0.3]
  });
  animatedItems.forEach((item) => {
    scrollObserver.observe(item);
  });

  // Navigate to previous image
  // Arrows removed: navigation handled via overlay dots only

  /*
   * Navigation letter animation
   *
   * Wrap each character of the navigation links in a <span> with the
   * class .nav-letter.  A CSS variable (--delay) is set on each span
   * based on its index so that the transform transition will be
   * staggered across the word.  On hover the letters translate
   * upwards in sequence, creating a wave effect.  Because the
   * translation script swaps out the text content on language
   * changes, this wrapper function is invoked once on page load
   * and again after the user selects a new language.
   */
  function wrapNavLetters() {
    /*
     * Build a list of elements whose text should animate in a wave on hover.  In addition to
     * the primary navigation links on the left and right, include room reserve buttons and
     * price tags.  Each of these elements contains plain text to be wrapped in spans.
     */
    const links = document.querySelectorAll(
      '.nav-left a, .nav-right a, .room-reserve-btn, .price-tag'
    );
    links.forEach((link) => {
      // Grab the plain text of the link.  Trim to remove excess whitespace.
      const text = link.textContent.trim();
      // Clear existing content to remove any previously wrapped spans
      link.innerHTML = '';
      // Iterate over each character and create a span wrapper.  Spaces are
      // appended as plain text nodes so that spacing isn’t collapsed when
      // using inline‑block spans.  This preserves phrases like « Autour de la maison ».
      Array.from(text).forEach((char, idx) => {
        if (/\s/.test(char)) {
          // Append whitespace characters directly without wrapping
          link.appendChild(document.createTextNode(char));
        } else {
          const span = document.createElement('span');
          span.classList.add('nav-letter');
          span.textContent = char;
          // Assign a staggered delay to each letter via a CSS variable.  The delay
          // is in milliseconds and scales with the index to produce a wave.
          span.style.setProperty('--delay', `${idx * 50}ms`);
          link.appendChild(span);
        }
      });
    });
  }

  // Expose the wrap function globally so lang.js can call it after applying translations
  window.wrapNavLetters = wrapNavLetters;

  // Wrap navigation letters on initial load
  wrapNavLetters();

  // Re-wrap letters whenever the language is changed.  The language
  // selection buttons live inside #lang-menu and are identified by
  // the data-lang attribute.  After the translation script updates
  // the text of the nav links, we call wrapNavLetters() to rebuild
  // the spans.
  const langButtons = document.querySelectorAll('#lang-menu button[data-lang]');
  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Use a timeout of 0 to schedule the re-wrap after the translation
      // has been applied.  Without the delay the function may run
      // before the textContent is updated.
      setTimeout(() => {
        wrapNavLetters();
      }, 0);
    });
  });

  /**
   * Assign external URLs to the social icons globally.  On some pages the
   * Instagram and Facebook icons may still have a placeholder href (#).  To
   * ensure they always open the correct profiles, update their href,
   * target and rel attributes after the DOM has loaded.  If additional
   * social icons are added in the future, this function can be extended
   * accordingly.
   */
  function setSocialLinks() {
    document.querySelectorAll('a[aria-label="Instagram"]').forEach((a) => {
      a.setAttribute('href', 'https://www.instagram.com/maisonbrevan/');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('a[aria-label="Facebook"]').forEach((a) => {
      a.setAttribute('href', 'https://www.facebook.com/profile.php?id=61585826054527');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  // Execute the social link assignment once the page DOM is ready
  setSocialLinks();

  // (Removed) Mobile navigation close behaviour for JavaScript‑controlled menu.
  // The closing logic is now integrated into the `toggleMobileNav` helper so
  // that it operates consistently across pages.
});