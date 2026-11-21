/* Visualizador com zoom para o fluxograma: abre na mesma página.
   Botões + e −, roda do mouse, pinça no celular, arrastar para mover,
   duplo clique para aproximar e teclas + − 0 Esc. */
(function () {
  var links = document.querySelectorAll('a[data-zoom]');
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;

  var ic = {
    menos: '<path d="M6 12h12"/>',
    mais: '<path d="M12 6v12M6 12h12"/>',
    ajustar: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    fechar: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }

  var dlg = document.createElement('dialog');
  dlg.className = 'zoom';
  dlg.setAttribute('aria-label', 'Fluxograma ampliado');
  dlg.innerHTML =
    '<div class="zoom__palco"><img class="zoom__img" alt="" draggable="false"></div>' +
    '<button type="button" class="zoom__fechar" aria-label="Fechar">' + svg(ic.fechar) + '</button>' +
    '<div class="zoom__barra" role="toolbar" aria-label="Zoom">' +
      '<button type="button" data-acao="menos" aria-label="Diminuir zoom">' + svg(ic.menos) + '</button>' +
      '<output class="zoom__nivel" aria-live="polite">100%</output>' +
      '<button type="button" data-acao="mais" aria-label="Aumentar zoom">' + svg(ic.mais) + '</button>' +
      '<button type="button" data-acao="ajustar" aria-label="Ajustar à tela">' + svg(ic.ajustar) + '</button>' +
    '</div>' +
    '<p class="zoom__dica"><span class="zoom__dica--mouse">Use a roda do mouse para dar zoom</span><span class="zoom__dica--toque">Use a pinça para dar zoom</span></p>';
  document.body.appendChild(dlg);

  var palco = dlg.querySelector('.zoom__palco');
  var img = dlg.querySelector('.zoom__img');
  var nivel = dlg.querySelector('.zoom__nivel');
  var natW = 1, natH = 1, ajuste = 1, esc = 1, x = 0, y = 0, origem = null;
  var vetor = true;
  var TOPO = 64, BASE = 96; // espaço livre para a dica e para a barra de zoom
  // SVG: até 8x o tamanho ajustado à tela. Imagem comum: até 2x o tamanho real, para não pixelar
  function maxEsc() { return vetor ? ajuste * 8 : Math.min(ajuste * 8, Math.max(ajuste * 1.5, 2)); }

  function medidas() { return palco.getBoundingClientRect(); }
  function pad() { return parseFloat(getComputedStyle(img).paddingLeft) || 0; }
  function limites() {
    var r = medidas(), w = natW * esc + 2 * pad(), h = natH * esc + 2 * pad();
    x = w <= r.width ? (r.width - w) / 2 : Math.min(0, Math.max(r.width - w, x));
    var faixa = r.height - TOPO - BASE;
    y = h <= faixa ? TOPO + (faixa - h) / 2 : h <= r.height ? (r.height - h) / 2 : Math.min(0, Math.max(r.height - h, y));
  }
  function desenhar() {
    limites();
    img.style.width = natW * esc + 'px';
    img.style.height = natH * esc + 'px';
    img.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    var p = Math.round(esc / ajuste * 100);
    nivel.textContent = p + '%';
    dlg.querySelector('[data-acao="menos"]').disabled = esc <= ajuste + 1e-6;
    dlg.querySelector('[data-acao="mais"]').disabled = esc >= maxEsc() - 1e-6;
    palco.classList.toggle('zoom__palco--mover', esc > ajuste + 1e-6);
    dlg.classList.toggle('zoom--ampliado', esc > ajuste + 1e-6);
  }
  function ajustar() {
    var r = medidas();
    var m = 32 + 2 * pad(); ajuste = Math.min((r.width - m) / natW, (r.height - TOPO - BASE - 2 * pad()) / natH);
    esc = ajuste; x = 0; y = 0; desenhar();
  }
  function zoomEm(nova, cx, cy) {
    var r = medidas();
    if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    nova = Math.max(ajuste, Math.min(maxEsc(), nova));
    x = cx - (cx - x) * (nova / esc);
    y = cy - (cy - y) * (nova / esc);
    esc = nova; desenhar();
  }

  function abrir(e) {
    e.preventDefault();
    origem = this;
    img.src = this.getAttribute('href');
    img.alt = this.getAttribute('data-alt') || '';
    dlg.setAttribute('aria-label', this.getAttribute('data-titulo') || 'Imagem ampliada');
    vetor = /\.svg(\?|$)/i.test(this.getAttribute('href'));
    dlg.showModal();
    document.documentElement.classList.add('zoom-aberto');
    var pronto = function () { natW = img.naturalWidth || 1; natH = img.naturalHeight || 1; ajustar(); };
    if (img.complete && img.naturalWidth) pronto(); else img.onload = pronto;
    if (!(img.complete && img.naturalWidth)) { img.style.width = img.style.height = '0px'; }
  }
  for (var i = 0; i < links.length; i++) links[i].addEventListener('click', abrir);

  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('zoom-aberto');
    if (origem) origem.focus();
  });
  dlg.querySelector('.zoom__fechar').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.zoom__barra').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a = b.getAttribute('data-acao');
    if (a === 'mais') zoomEm(esc * 1.5);
    else if (a === 'menos') zoomEm(esc / 1.5);
    else ajustar();
  });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomEm(esc * 1.5); }
    else if (e.key === '-') { e.preventDefault(); zoomEm(esc / 1.5); }
    else if (e.key === '0') { e.preventDefault(); ajustar(); }
    else if (/^Arrow/.test(e.key)) {
      e.preventDefault();
      var d = 80; if (e.key === 'ArrowLeft') x += d; if (e.key === 'ArrowRight') x -= d;
      if (e.key === 'ArrowUp') y += d; if (e.key === 'ArrowDown') y -= d; desenhar();
    }
  });
  window.addEventListener('resize', function () { if (dlg.open) ajustar(); });

  palco.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = medidas();
    zoomEm(esc * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  palco.addEventListener('dblclick', function (e) {
    var r = medidas();
    if (esc > ajuste * 1.05) ajustar(); else zoomEm(ajuste * 3, e.clientX - r.left, e.clientY - r.top);
  });

  // arrastar e pinça
  var dedos = {}, ultimo = null;
  function lista() { return Object.keys(dedos).map(function (k) { return dedos[k]; }); }
  palco.addEventListener('pointerdown', function (e) {
    palco.setPointerCapture(e.pointerId);
    dedos[e.pointerId] = { x: e.clientX, y: e.clientY };
    ultimo = null;
  });
  palco.addEventListener('pointermove', function (e) {
    if (!dedos[e.pointerId]) return;
    var ant = dedos[e.pointerId];
    dedos[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ps = lista();
    if (ps.length === 1) {
      x += e.clientX - ant.x; y += e.clientY - ant.y; desenhar();
    } else if (ps.length === 2) {
      var dist = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      var r = medidas(), mx = (ps[0].x + ps[1].x) / 2 - r.left, my = (ps[0].y + ps[1].y) / 2 - r.top;
      if (ultimo) { x += mx - ultimo.mx; y += my - ultimo.my; zoomEm(esc * dist / ultimo.dist, mx, my); }
      ultimo = { dist: dist, mx: mx, my: my };
    }
  });
  function soltar(e) { delete dedos[e.pointerId]; ultimo = null; }
  palco.addEventListener('pointerup', soltar);
  palco.addEventListener('pointercancel', soltar);
})();
