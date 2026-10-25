const menu = document.querySelector('[data-menu]');

if (menu instanceof HTMLDetailsElement) {
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      menu.open = false;
    }
  });

  document.addEventListener('click', (event) => {
    if (menu.open && event.target instanceof Node && !menu.contains(event.target)) {
      menu.open = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      const toggle = menu.querySelector('summary');
      if (toggle instanceof HTMLElement) toggle.focus();
    }
  });
}

const header = document.querySelector('[data-header]');

if (header instanceof HTMLElement) {
  let ticking = false;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

const spyMenus = document.querySelectorAll('[data-spy]');

for (const spy of spyMenus) {
  const links = Array.from(spy.querySelectorAll('a[href*="#"]'));
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href')?.split('#')[1];
      return id ? document.getElementById(id) : null;
    })
    .filter((section) => section instanceof HTMLElement);

  if (!sections.length || !('IntersectionObserver' in window)) continue;

  const setCurrent = (id) => {
    for (const link of links) {
      const href = link.getAttribute('href');
      link.setAttribute('aria-current', href?.endsWith(`#${id}`) ? 'true' : 'false');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length) {
        setCurrent(visible[0].target.id);
      }
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );

  for (const section of sections) observer.observe(section);
}

const consentReset = document.querySelector('[data-consent-reset]');

if (consentReset) {
  consentReset.addEventListener('click', () => {
    try {
      window.localStorage.removeItem('vv-consent');
    } catch (error) {
      /* storage can be blocked; reloading still asks again */
    }
    window.location.reload();
  });
}
