// Справочник: ☰-дерево, поиск Pagefind (индекс грузится при первом касании поля), якоря-ссылки на подзаголовках.
(function () {
  var body = document.body;
  var menu = document.getElementById('hcMenu'), bd = document.getElementById('hcBackdrop');
  if (menu) menu.addEventListener('click', function () { body.classList.toggle('nav-open'); });
  if (bd) bd.addEventListener('click', function () { body.classList.remove('nav-open'); });

  document.querySelectorAll('.hc-doc h2[id],.hc-doc h3[id]').forEach(function (h) {
    var a = document.createElement('a');
    a.className = 'pl'; a.href = '#' + h.id; a.textContent = '#'; a.setAttribute('aria-label', 'Ссылка на раздел');
    h.appendChild(a);
  });
  var toc = document.querySelector('.hc-toc');
  if (toc && window.innerWidth > 860) toc.open = true;
  if (location.hash.length > 1) {
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) t.classList.add('hit');
  }

  var input = document.getElementById('hcQ'), box = document.getElementById('hcRes');
  if (!input || !box) return;
  var pf = null, loading = null;
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load() {
    if (!loading) loading = import(new URL('pagefind/pagefind.js', document.baseURI).href).then(function (m) { pf = m; return m.options({ baseUrl: document.body.getAttribute('data-base') || '/' }).then(function () { return m; }); }).catch(function () { loading = null; return null; });
    return loading;
  }
  async function run() {
    var q = input.value.trim();
    if (!q) { box.classList.remove('on'); return; }
    var m = await load();
    if (!m) { box.innerHTML = '<div class="none">Поиск сейчас недоступен. Выберите раздел в меню ☰.</div>'; box.classList.add('on'); return; }
    var s = await m.debouncedSearch(q, {}, 150);
    if (s === null) return;
    var datas = await Promise.all(s.results.slice(0, 8).map(function (r) { return r.data(); }));
    var h = '';
    datas.forEach(function (d) {
      var path = esc((d.meta && d.meta.section ? d.meta.section + ' › ' : '') + (d.meta && d.meta.title || ''));
      (d.sub_results || []).slice(0, 2).forEach(function (sr) {
        h += '<a href="' + esc(sr.url) + '"><div class="rt">' + esc(sr.title || (d.meta && d.meta.title)) + '</div><div class="rp">' + path + '</div><div class="rx">' + sr.excerpt + '</div></a>';
      });
    });
    if (window.innerWidth <= 860) box.style.top = (document.querySelector('.hc-head').getBoundingClientRect().bottom + 6) + 'px';
    box.innerHTML = h || '<div class="none">Ничего не нашлось. Попробуйте другое слово.</div>';
    box.classList.add('on');
  }
  input.addEventListener('focus', load);
  input.addEventListener('input', run);
  box.addEventListener('click', function () { box.classList.remove('on'); input.blur(); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.hc-search')) box.classList.remove('on'); });
  var pre = new URLSearchParams(location.search).get('q');
  if (pre) { input.value = pre; run(); }
})();
