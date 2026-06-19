/* ================================================
   Derin Coşguner — Portfolio  |  script.js
   ================================================ */
'use strict';

/* ── Navbar scroll ── */
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile menu ── */
var hamburger     = document.getElementById('hamburger');
var mobileOverlay = document.getElementById('mobile-overlay');
var mobileLinks   = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', function () {
  var isOpen = mobileOverlay.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var id = link.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    }
  });
});

/* ── Scroll reveal ── */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '-40px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ── Project filter ── */
var filterBtns    = document.querySelectorAll('.filter-btn');
var featuredProjs = document.querySelectorAll('.project-featured');
var projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var filter = btn.dataset.filter;
    featuredProjs.forEach(function (proj) {
      var show = (filter === 'all' || filter === proj.dataset.category);
      if (show) {
        proj.style.display = 'grid';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { proj.style.opacity = '1'; });
        });
      } else {
        proj.style.opacity = '0';
        setTimeout(function () { proj.style.display = 'none'; }, 300);
      }
    });
    projectCards.forEach(function (card) {
      var show = (filter === 'all' || filter === card.dataset.category);
      if (show) {
        card.style.display = 'block';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        setTimeout(function () { card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ── Timeline filter ── */
var tlFilterBtns  = document.querySelectorAll('.tl-filter-btn');
var tlItems       = document.querySelectorAll('.tl-item');
var tlActiveClass = {
  all: 'active', work: 'active-work',
  education: 'active-education', certification: 'active-cert', volunteering: 'active-vol'
};

tlFilterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    tlFilterBtns.forEach(function (b) {
      b.classList.remove('active','active-work','active-education','active-cert','active-vol');
    });
    var filter = btn.dataset.tlFilter;
    btn.classList.add(tlActiveClass[filter] || 'active');
    tlItems.forEach(function (item) {
      var match = (filter === 'all' || item.dataset.type === filter);
      if (match) {
        item.style.display = 'block';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        });
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(8px)';
        setTimeout(function () { item.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ── Certificate lightbox ── */
(function () {
  var lightbox      = document.getElementById('cert-lightbox');
  var lightboxImg   = document.getElementById('cert-lightbox-img');
  var lightboxOver  = document.getElementById('cert-lightbox-overlay');
  var lightboxClose = document.getElementById('cert-lightbox-close');

  if (!lightbox) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Certificate';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { lightboxImg.src = ''; }, 300);
  }

  document.querySelectorAll('.cert-zoom-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(btn.dataset.src, btn.dataset.alt);
    });
  });

  lightboxOver.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ── Image protection ── */
(function () {
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    img.addEventListener('dragstart',   function (e) { e.preventDefault(); });
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') { e.preventDefault(); }
  });
})();

/* ── Hero particle canvas ── */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var R = 59, G = 130, B = 246;
  var COUNT = 70, DIST = 140, SPEED = 0.3;
  var W, H, particles, rafId;
  var mouse = { x: null, y: null };

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.4 + 0.15;
  }
  Particle.prototype.step = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    if (mouse.x !== null) {
      var dx = this.x - mouse.x, dy = this.y - mouse.y;
      var d = Math.sqrt(dx*dx + dy*dy);
      if (d < 90) { this.x += dx*0.012; this.y += dy*0.012; }
    }
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba('+R+','+G+','+B+','+this.a+')';
    ctx.fill();
  };
  function build() { particles = []; for (var i=0;i<COUNT;i++) particles.push(new Particle()); }
  function drawLines() {
    for (var i=0;i<particles.length;i++) {
      for (var j=i+1;j<particles.length;j++) {
        var dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if (d<DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle='rgba('+R+','+G+','+B+','+(1-d/DIST)*0.15+')';
          ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    }
  }
  function loop() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(function(p){p.step();p.draw();});
    drawLines();
    rafId = requestAnimationFrame(loop);
  }
  window.addEventListener('resize', function(){resize();build();}, {passive:true});
  window.addEventListener('mousemove', function(e){mouse.x=e.clientX;mouse.y=e.clientY;}, {passive:true});
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) cancelAnimationFrame(rafId); else loop();
  });
  resize(); build(); loop();
})();

/* ── About photo gallery ── */
(function () {
  var gallery = document.querySelector('.about-gallery');
  if (!gallery) return;

  var track   = gallery.querySelector('.ag-track');
  var slides  = gallery.querySelectorAll('.ag-slide');
  var dots    = gallery.querySelectorAll('.ag-dot');
  var prevBtn = gallery.querySelector('.ag-prev');
  var nextBtn = gallery.querySelector('.ag-next');
  var current   = 0;
  var total     = slides.length;
  var slideW    = 0;
  var autoTimer = null;

  function initWidths() {
    slideW = gallery.offsetWidth;
    slides.forEach(function (s) { s.style.width = slideW + 'px'; });
  }

  function goTo(idx, instant) {
    current = ((idx % total) + total) % total;
    if (instant) {
      track.style.transition = 'none';
      track.style.transform  = 'translateX(-' + (current * slideW) + 'px)';
      void track.offsetHeight;
      track.style.transition = '';
    } else {
      track.style.transform = 'translateX(-' + (current * slideW) + 'px)';
    }
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); });
  });

  var touchStartX = 0;
  gallery.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  gallery.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

  gallery.addEventListener('mouseenter', stopAuto);
  gallery.addEventListener('mouseleave', startAuto);

  gallery.setAttribute('tabindex', '0');
  gallery.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
  });

  window.addEventListener('resize', function () {
    initWidths(); goTo(current, true);
  }, { passive: true });

  var glBox    = document.getElementById('cert-lightbox');
  var glBoxImg = document.getElementById('cert-lightbox-img');
  var glClose  = document.getElementById('cert-lightbox-close');
  var glOverlay= document.getElementById('cert-lightbox-overlay');

  slides.forEach(function (slide) {
    slide.addEventListener('click', function (e) {
      if (e.target.closest('.ag-btn') || e.target.closest('.ag-dots')) return;
      var img = slide.querySelector('.ag-img');
      if (!img || !glBox) return;
      glBoxImg.src = img.src;
      glBoxImg.alt = img.alt || 'Photo';
      glBox.classList.add('open');
      document.body.style.overflow = 'hidden';
      stopAuto();
    });
  });

  function resumeOnClose() {
    if (!glBox.classList.contains('open')) startAuto();
  }
  if (glClose)   glClose.addEventListener('click',   resumeOnClose);
  if (glOverlay) glOverlay.addEventListener('click', resumeOnClose);

  initWidths();
  goTo(0, true);
  startAuto();
})();

/* ── Gallery ── */
(function () {

  /* Program tab switching */
  var progTabs = document.querySelectorAll('.prog-tab');
  var galCards = document.querySelectorAll('.gal-card');

  progTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      progTabs.forEach(function (t) { t.classList.remove('prog-tab-active'); });
      tab.classList.add('prog-tab-active');
      var prog = tab.dataset.progTab;
      galCards.forEach(function (card) {
        var show = (prog === 'all' || card.dataset.prog === prog);
        if (show) {
          card.style.display = 'block';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { card.style.opacity = '1'; });
          });
        } else {
          card.style.opacity = '0';
          setTimeout(function () { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* View button — reuses the existing cert-lightbox */
  document.querySelectorAll('.gal-view-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.gal-card');
      var img  = card ? card.querySelector('.gal-img') : null;
      var src  = img ? img.src : btn.dataset.src;
      var alt  = btn.dataset.alt;
      if (!src) return;
      var lb    = document.getElementById('cert-lightbox');
      var lbImg = document.getElementById('cert-lightbox-img');
      if (!lb || !lbImg) return;
      lbImg.src = src;
      lbImg.alt = alt || 'Gallery Image';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });


})();
