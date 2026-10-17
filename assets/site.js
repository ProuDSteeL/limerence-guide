// Limerence — общее поведение сайта: тема, меню на телефоне, «Развернуть» у примера, цель сбора.
// Тема до первой отрисовки ставится инлайн-скриптом в <head> (иначе мигание), здесь — только обработчики.
(function () {
  var root = document.documentElement, body = document.body;

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      var m = document.querySelector('meta[name=theme-color]');
      if (m) m.content = next === 'light' ? '#FAFAF9' : '#0C0C0E';
    });
  }

  // выдвижное меню (телефон): кнопка ☰/✕, фон и Escape закрывают, переход по ссылке — тоже
  var menuBtn = document.getElementById('menuToggle');
  var drawer = document.getElementById('siteDrawer');
  var backdrop = document.getElementById('siteBackdrop');
  function setMenu(open) {
    body.classList.toggle('nav-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('nav-open')); });
    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // главная: «Тарифы» подсвечивается, пока открыт блок #tarify
  function markTarify() {
    var onTarify = location.hash === '#tarify';
    document.querySelectorAll('[data-nav=home],[data-nav=tarify]').forEach(function (a) {
      var isTarify = a.getAttribute('data-nav') === 'tarify';
      var on = isTarify ? onTarify : !onTarify;
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  if (document.querySelector('.hero')) {
    markTarify();
    window.addEventListener('hashchange', markTarify);
  }

  // «Развернуть» у примера на главной
  document.querySelectorAll('.chat .more').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = document.getElementById(b.getAttribute('aria-controls'));
      var open = c.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.textContent = open ? 'Свернуть' : 'Развернуть';
    });
  });
})();
