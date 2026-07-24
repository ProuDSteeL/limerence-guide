// Limerence Stories — общее поведение сайта: клик по переключателю темы.
// Тема ДО первой отрисовки ставится инлайновым скриптом в <head> каждой страницы (иначе будет
// мигание — FOUC), этот файл только навешивает обработчик клика, общий для всех страниц.
(function () {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', cur);
    try { localStorage.setItem('theme', cur); } catch (e) {}
    var m = document.querySelector('meta[name=theme-color]');
    if (m) m.content = cur === 'light' ? '#f5f1fb' : '#0f0b1e';
  });
})();
