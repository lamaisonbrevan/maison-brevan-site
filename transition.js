// Page transition handler for a book‑like page flip effect.
//
// This script listens for clicks on anchor links that have the
// `data-transition` attribute.  When such a link is activated
// (excluding links that point to hash anchors), it triggers a
// rotation on the body element before navigating to the new page.
// On page load it also plays an entry rotation.  The associated
// CSS classes are defined in style.css.
document.addEventListener('DOMContentLoaded', () => {
  // Locate the primary wrapper that contains the page content.  If it
  // exists, apply the entry class to trigger the opening rotation.
  const wrapper = document.querySelector('.page-wrapper');
  if (wrapper) {
    wrapper.classList.add('page-turn-enter');
    // Use requestAnimationFrame to ensure the class is applied after
    // the initial render, then add the active class to animate to
    // the final state.
    requestAnimationFrame(() => {
      wrapper.classList.add('page-turn-enter-active');
    });
  } else {
    // Fallback: trigger a fade‑in on the body when no wrapper is
    // present (e.g., during error pages or other minimal pages).
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
      document.body.classList.add('page-enter-active');
    });
  }

  // Attach a click handler to links annotated with data-transition.  When
  // such a link is clicked we rotate the page wrapper to create a
  // book‑like page flip before navigating.  Hash links (#) are
  // ignored so in‑page navigation remains immediate.  The transition
  // duration is 0.8s, matching the CSS definition on .page-wrapper.
  const transitionLinks = document.querySelectorAll('a[data-transition]');
  transitionLinks.forEach((link) => {
    link.addEventListener('click', (ev) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      ev.preventDefault();
      if (wrapper) {
        // Kick off the exit rotation
        wrapper.classList.add('page-turn-exit');
        // Force reflow to ensure the exit-active class takes effect immediately
        // eslint-disable-next-line no-unused-expressions
        wrapper.offsetHeight;
        wrapper.classList.add('page-turn-exit-active');
        // Wait for the longer rotation animation (1s) to finish before navigating
        setTimeout(() => {
          window.location.href = href;
        }, 1000);
      } else {
        // Fallback to a fade‑out when no wrapper is available
        document.body.classList.add('page-exit');
        setTimeout(() => {
          window.location.href = href;
        }, 600);
      }
    });
  });
});

// When navigating back/forward via the browser, the page may be restored
// from the back-forward cache (bfcache) and DOMContentLoaded will not fire.
// This handler replays the entry animation and removes any exit classes.
window.addEventListener('pageshow', (event) => {
  // When navigating back/forward via the browser, the page may be
  // restored from the back‑forward cache (bfcache) and DOMContentLoaded
  // will not fire.  Regardless of whether the event is persisted, clear
  // any exit/enter classes and replay the entry animation on the
  // wrapper or body.  Without this, pages loaded from the bfcache
  // sometimes remain hidden behind an exit transformation.
  const wrapper = document.querySelector('.page-wrapper');
  if (wrapper) {
    wrapper.classList.remove(
      'page-turn-exit',
      'page-turn-exit-active',
      'page-turn-enter',
      'page-turn-enter-active'
    );
    wrapper.classList.add('page-turn-enter');
    requestAnimationFrame(() => {
      wrapper.classList.add('page-turn-enter-active');
    });
  } else {
    document.body.classList.remove('page-exit', 'page-exit-active');
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
      document.body.classList.add('page-enter-active');
    });
  }
});