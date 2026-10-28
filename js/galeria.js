/* Portfólio Heloisa Borges · Galeria
   Ilustrações PROVISÓRIAS de antes e depois, só para mostrar o layout.
   Quando as fotos reais entrarem (<img>), este arquivo pode ser apagado. */
(function(){
  var CENAS={
    retrato:function(depois){return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="r'+(depois?1:0)+'" cx="70%" cy="20%" r="90%"><stop offset="0" stop-color="#7a2a55"/><stop offset=".55" stop-color="#2a2030"/><stop offset="1" stop-color="#121116"/></radialGradient></defs><rect width="400" height="300" fill="url(#r'+(depois?1:0)+')"/><ellipse cx="200" cy="300" rx="120" ry="90" fill="#3a3340"/><circle cx="200" cy="140" r="58" fill="#c99a86"/><path d="M142 130c0-40 26-66 58-66s58 26 58 66c-10-22-30-34-58-34s-48 12-58 34z" fill="#2b1d22"/>'+(depois?'':'<g fill="#7a4a3a" opacity=".55"><circle cx="178" cy="150" r="4"/><circle cx="222" cy="160" r="3"/><circle cx="208" cy="128" r="2.5"/><circle cx="190" cy="170" r="3"/><circle cx="230" cy="138" r="2"/></g>')+'</svg>';},
    produto:function(depois){return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'+(depois?'<defs><linearGradient id="p1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2030"/><stop offset="1" stop-color="#121116"/></linearGradient></defs><rect width="400" height="300" fill="url(#p1)"/><ellipse cx="200" cy="248" rx="70" ry="10" fill="#000" opacity=".45"/>':'<rect width="400" height="300" fill="#5d5a52"/><g fill="#6f6b61"><rect x="0" y="0" width="60" height="300"/><rect x="120" y="0" width="40" height="300"/><rect x="250" y="0" width="70" height="300"/></g><rect x="0" y="210" width="400" height="90" fill="#4a463f"/><rect x="40" y="150" width="60" height="70" fill="#7d7468"/><circle cx="330" cy="180" r="30" fill="#8a7f70"/>')+'<rect x="172" y="90" width="56" height="156" rx="14" fill="#8FD3DE"/><rect x="186" y="62" width="28" height="34" rx="6" fill="#d6d3dc"/><rect x="172" y="140" width="56" height="44" fill="#570C36"/></svg>';},
    paisagem:function(){return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e3f6b"/><stop offset=".6" stop-color="#c46a5a"/><stop offset="1" stop-color="#e8b07a"/></linearGradient></defs><rect width="400" height="300" fill="url(#c)"/><circle cx="290" cy="150" r="34" fill="#f6d39a"/><path d="M0 210 L90 150 L170 200 L250 140 L400 220 L400 300 L0 300z" fill="#3a2a3e"/><path d="M0 250 L120 200 L220 245 L320 205 L400 240 L400 300 L0 300z" fill="#1f1824"/></svg>';},
    composicao:function(depois){return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="n'+(depois?1:0)+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+(depois?'#0f1424':'#5c6f86')+'"/><stop offset="1" stop-color="'+(depois?'#3b1a35':'#9aa9b8')+'"/></linearGradient></defs><rect width="400" height="300" fill="url(#n'+(depois?1:0)+')"/>'+(depois?'<g fill="#ECEAF0"><circle cx="40" cy="40" r="1.5"/><circle cx="120" cy="70" r="1"/><circle cx="200" cy="30" r="1.5"/><circle cx="330" cy="60" r="1"/><circle cx="360" cy="110" r="1.5"/><circle cx="80" cy="120" r="1"/><circle cx="250" cy="95" r="1"/></g><circle cx="300" cy="80" r="30" fill="#f2efe6"/><circle cx="312" cy="72" r="28" fill="#0f1424" opacity=".9"/>':'')+'<path d="M0 230 Q100 200 200 228 T400 222 L400 300 L0 300z" fill="'+(depois?'#121116':'#4b5563')+'"/><rect x="186" y="150" width="28" height="80" fill="'+(depois?'#1c1b21':'#6b7280')+'"/><polygon points="176,150 200,118 224,150" fill="'+(depois?'#1c1b21':'#6b7280')+'"/>'+(depois?'<rect x="195" y="170" width="10" height="14" fill="#8FD3DE"/>':'')+'</svg>';}
  };
  var FILTRO_ANTES={retrato:'saturate(.7) contrast(.9) brightness(.92)',produto:'none',paisagem:'saturate(.35) contrast(.7) brightness(.78)',composicao:'none'};
  function pinta(el){var c=el.dataset.cena,antes=el.dataset.estado==='antes';if(!CENAS[c])return;el.innerHTML=CENAS[c](!antes);if(antes&&FILTRO_ANTES[c]!=='none')el.style.filter=FILTRO_ANTES[c];}
  [].slice.call(document.querySelectorAll('[data-cena]')).forEach(pinta);
})();

/* Navegação entre o portfólio e a Galeria
   · Ao abrir a Galeria, guarda a posição exata de onde a pessoa clicou (Áreas ou Projetos).
   · A Galeria sempre abre no topo.
   · "Voltar" leva ao topo da seção de onde a pessoa saiu (Áreas ou Projetos). */
(function(){
  var CHAVE = 'galeria-origem', RESTAURAR = 'galeria-restaurar';
  function le(k){ try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch(e){ return null; } }
  function grava(k, v){ try { sessionStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  function apaga(k){ try { sessionStorage.removeItem(k); } catch(e){} }
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(e){}

  var naGaleria = !!document.getElementById('galeria') && !document.getElementById('projetos');

  if (!naGaleria) {
    // Portfólio: guarda a origem ao clicar em qualquer link para a Galeria
    [].slice.call(document.querySelectorAll('a[href="galeria.html"]')).forEach(function(a){
      a.addEventListener('click', function(){
        grava(CHAVE, { y: window.scrollY, de: a.closest('#areas') ? 'areas' : 'projetos' });
      });
    });
    // Voltando da Galeria: devolve a página ao mesmo ponto
    var r = le(RESTAURAR);
    if (r) {
      apaga(RESTAURAR);
      var alvo = document.getElementById(r.de === 'areas' ? 'areas' : 'projetos');
      var nav = document.querySelector('header.nav');
      // mostra só 30px de respiro entre o menu fixo e o título da seção (rótulo)
      var vai = function(){ if (!alvo) return; document.dispatchEvent(new CustomEvent('menu:fixar')); var t = alvo.querySelector('.cabecalho') || alvo; var h = nav ? nav.offsetHeight : 0; window.scrollTo(0, Math.round(t.getBoundingClientRect().top + window.scrollY - h - 30)); };
      vai(); requestAnimationFrame(vai);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(vai);
      window.addEventListener('load', vai);
    }
    return;
  }

  // Galeria: sempre começa no topo
  var topo = function(){ window.scrollTo(0, 0); };
  topo(); requestAnimationFrame(topo); window.addEventListener('load', topo);
  window.addEventListener('pageshow', topo);

  var o = le(CHAVE);
  var voltar = document.querySelector('.voltar');
  if (voltar) {
    if (o && o.de === 'areas') voltar.setAttribute('href', './#areas');
    voltar.addEventListener('click', function(e){
      if (!o) return; // sem origem guardada: segue o link normal
      e.preventDefault();
      grava(RESTAURAR, o);
      window.location.href = './';
    });
  }
})();

/* Botão "voltar ao topo" com anel de progresso (Galeria e página principal)
   A posição vertical é do CSS (sticky); aqui só o progresso, a margem direita e a visibilidade.
   · Galeria: aparece depois do título da galeria; fica a no máximo 20px dos cards
   · Página principal: aparece depois do primeiro bloco; fica a no máximo 20px da coluna de conteúdo */
(function(){
  var btn = document.querySelector('.topo-btn'), area = document.querySelector('.topo-area'); if (!btn || !area) return;
  var prog = btn.querySelector('.prog'), C = 2 * Math.PI * 24; prog.style.strokeDasharray = C;
  var cab = document.querySelector('#galeria .cabecalho') || document.querySelector('.hero'), card = document.querySelector('.trabalho');
  // borda direita do conteúdo: o card da galeria ou, na página principal, a coluna de texto
  function direita(){
    if (card) return card.getBoundingClientRect().right;
    var col = document.querySelector('main .inner'); if (!col) return document.documentElement.clientWidth;
    return col.getBoundingClientRect().right - (parseFloat(getComputedStyle(col).paddingRight) || 0);
  }
  var ultimo = window.scrollY, parado, pendente = false;
  var sobrepoe = false; // o botão invade as fotos? (só em telas sem margem lateral)
  function margem(){
    var vw = document.documentElement.clientWidth, sobra = vw - direita();
    var compacto = sobra < 52 + 40, largura = compacto ? 48 : 52;
    area.classList.toggle('compacto', compacto); btn.classList.toggle('compacto', compacto);
    // no máximo 20px do conteúdo à esquerda (os cards, na galeria); em margens estreitas fica centralizado,
    // sempre a pelo menos 24px da borda direita
    var centro = (sobra - largura) / 2;
    var dir = Math.max(24, Math.round(sobra - largura - Math.min(20, centro)));
    area.style.right = dir + 'px';
    sobrepoe = sobra - largura - dir < 0; // o botão invade o conteúdo
    return compacto;
  }
  var compacto = margem();
  function atualiza(){
    pendente = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    prog.style.strokeDashoffset = C * (1 - p);
    var mostrar = cab && cab.getBoundingClientRect().bottom < 0;
    btn.classList.toggle('visivel', !!mostrar);
    // só some ao rolar para baixo quando cobre o conteúdo (celular); parado no fim da página, nunca some
    var noFim = area.getBoundingClientRect().bottom <= window.innerHeight;
    if (sobrepoe && !noFim) {
      if (window.scrollY > ultimo + 2 && mostrar) btn.classList.add('oculto'); else if (window.scrollY < ultimo) btn.classList.remove('oculto');
      clearTimeout(parado); parado = setTimeout(function(){ btn.classList.remove('oculto'); }, 700);
    } else { clearTimeout(parado); btn.classList.remove('oculto'); }
    ultimo = window.scrollY;
  }
  function agenda(){ if (!pendente) { pendente = true; requestAnimationFrame(atualiza); } }
  window.addEventListener('scroll', agenda, { passive: true });
  window.addEventListener('resize', function(){ compacto = margem(); agenda(); });
  atualiza();
  btn.addEventListener('click', function(){
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduz ? 'auto' : 'smooth' });
  });
})();

/* Menu (Galeria e página principal · computador e celular)
   · ao rolar para baixo, o menu sobe junto com a página, pixel a pixel, como se estivesse preso ao topo dela
   · ao rolar para cima (subida clara de 55px), ele desce de volta e fica fixo no topo da tela
   · perto do topo da página, ele volta junto com o conteúdo
   · ao navegar pelo menu, "Ver projetos", Áreas ou "Voltar" da galeria, o menu fica visível
     (assim os 30px entre o menu e o título da seção continuam valendo) */
(function(){
  var nav = document.querySelector('header.nav'); if (!nav) return;
  var raiz = document.documentElement, SUBIDA = 55;
  var h = 0, desloc = 0, subida = 0, ultimo = 0, pendente = false, trava = 0, travaFim = 0;
  function altura(){ h = nav.getBoundingClientRect().height + (parseFloat(getComputedStyle(nav).top) || 0); if (desloc > h) desloc = h; }
  // posição da rolagem sem o "elástico" do iPhone (acima do topo ou abaixo do fim),
  // contada a partir de onde o menu fica preso (se houver algo acima dele, como o aviso da prévia)
  // (ignora o que não aparece na tela, como <style> e <script>)
  function base(){
    for (var el = nav.previousElementSibling; el; el = el.previousElementSibling) {
      var cs = getComputedStyle(el), r = el.getBoundingClientRect();
      if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute' || r.height === 0) continue;
      return Math.max(0, r.bottom + window.scrollY);
    }
    return 0;
  }
  function posY(){ var max = Math.max(0, raiz.scrollHeight - window.innerHeight); return Math.max(0, Math.min(Math.max(0, window.scrollY), max) - base()); }
  function aplica(anima){
    nav.classList.toggle('nav--anima', !!anima);
    nav.style.transform = desloc > 0 ? 'translateY(' + (-desloc) + 'px)' : '';
  }
  function atualiza(){
    pendente = false;
    var y = posY(), d = y - ultimo; ultimo = y;
    var agora = Date.now();
    if (agora < trava) { trava = Math.min(travaFim, agora + 200); subida = 0; return; } // rolagem feita pelo site: menu continua visível
    if (d > 0) {                                   // descendo: o menu acompanha a página
      subida = 0;
      if (desloc < h) { desloc = Math.min(h, desloc + d); aplica(false); }
    } else if (d < 0) {                            // subindo
      subida -= d;
      if (desloc > y) { desloc = y; aplica(false); }                 // perto do topo: volta junto com a página
      if (desloc > 0 && subida >= SUBIDA) { desloc = 0; aplica(true); } // subida clara: o menu aparece
    }
  }
  altura(); ultimo = posY();
  window.addEventListener('scroll', function(){ if (!pendente) { pendente = true; requestAnimationFrame(atualiza); } }, { passive: true });
  window.addEventListener('resize', altura);
  nav.addEventListener('focusin', function(){ if (desloc > 0) { desloc = 0; subida = 0; aplica(true); } });
  // pedido do próprio site antes de rolar até uma seção: mostra o menu e ignora essa rolagem
  document.addEventListener('menu:fixar', function(){
    var agora = Date.now(); trava = agora + 250; travaFim = agora + 1500;
    if (desloc > 0) { desloc = 0; aplica(false); }
    subida = 0; ultimo = posY();
  });
})();
