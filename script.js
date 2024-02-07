'use strict';
///////////////////////////////////////
// Selection
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');

///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Strategy Pencocokan
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  // Memilih button
  const clicked = e.target.closest('.operations__tab');

  // Guard clausa, jika tidak ada element yang cocok maka akan segera dikembalikan
  if (!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // Menghapus class pada semuanya
  clicked.classList.add('operations__tab--active'); // Hanya menambahkannya ke elemen yang diseleksi

  // Active content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active')); // Menghapus class pada semuanya
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // Hanya menambahkannya ke elemen yang diseleksi
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  // Mencocokan element yang ingin kita cari
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // Menyeleksi element saudara dan logo untuk menhgatur opacitynya
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    // Mengatur style opacity
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation
const header = document.querySelector('.header');
const heightNav = nav.getBoundingClientRect().height; // Kita membutuhkan nilai yang dinamis
const stickyNav = function (entries) {
  const entry = entries[0];
  // Kondisi yang diperlukan adalah ketika header tidak memotong viewport kita menambahkan class sticky
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${heightNav}px`,
  threshold: 0,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal Section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images
const imageTargets = document.querySelectorAll('img[data-src]');

const lazyLoading = function (entries, observer) {
  const entry = entries[0];
  console.log(entry);

  // Guard Clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Load event
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Deleting observer
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  rootMargin: '200px',
  threshold: 0,
});
imageTargets.forEach(function (img) {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  // 0. Variable Pengkondisian
  let curSlide = 0;
  const maxSlide = slides.length; // Length berbasis 1 bukan 0

  // 1. Function for crating dots slide
  const createDots = function () {
    // Looping each slide
    slides.forEach(function (_, i) {
      // Create and Add element
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `
    <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };

  // 1. Function go to slide
  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%) `;
    });
  };

  // 2. Kondisi awal program
  goToSlide(0); // Output : 0% 100% 200% 300%. Menambahkan property transform ke setiap slide
  createDots(); // Membuat element dots
  activeDot(0); // Dot active di kondisi awal

  // 3. Function activeDot
  function activeDot(slide) {
    // Menghapus class dulu pada semua element dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Menambahkan class sesuai dengan data atribut
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  // 4. Function next slide
  const nextSlide = function () {
    // Pengkondisian slide maksimal
    if (curSlide === maxSlide - 1) {
      // - Jika sudah max slide maka akan kembali ke slide awal
      curSlide = 0;
    } else {
      // - Setiap Clik akan menambah 1
      curSlide++;
    }

    goToSlide(curSlide); // Output : -100% 0% 100% 200%
    activeDot(curSlide);
  };

  // 5. Function previous slide
  const prevSlide = function () {
    // Pengkondisian slide minimal
    if (curSlide === 0) {
      // - Jika sudah min slide maka akan kembali ke slide akhir
      curSlide = maxSlide - 1;
    } else {
      // - Setiap Clik akan mengurangi 1
      curSlide--;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  // 6. Event di button
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // 7. Event di Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // 8. Event di dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slideSet = e.target.dataset.slide;
      goToSlide(slideSet);
      activeDot(slideSet);
    }
  });
};
slider();


