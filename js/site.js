/* Portfólio Heloisa Borges · interações
   Filtros de projetos · copiar e-mail · menu com a seção ativa · respiro de 30px ao clicar no menu · brilho da grade do topo · ano do rodapé */
(function(){
  var botoes=[].slice.call(document.querySelectorAll("[data-filtro]"));
  var projetos=[].slice.call(document.querySelectorAll(".projeto"));
  function filtrar(area){
    botoes.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.filtro===area));});
    projetos.forEach(function(p){
      var mostra=area==="todos"||p.dataset.area===area;
      p.hidden=!mostra;
      if(mostra){p.classList.remove("entrando");void p.offsetWidth;p.classList.add("entrando");}
    });
  }
  botoes.forEach(function(b){b.addEventListener("click",function(){filtrar(b.dataset.filtro);});});
  // Áreas de atuação → Projetos: para com 30px entre o menu e o rótulo da seção (o mesmo respiro do menu e do Voltar da galeria)
  function topoProjetos(){
    var s=document.getElementById("projetos"),t=s.querySelector(".cabecalho")||s,nav=document.querySelector("header.nav");
    var h=nav?nav.offsetHeight+(parseFloat(getComputedStyle(nav).top)||0):0;
    return Math.max(0,Math.round(t.getBoundingClientRect().top+window.scrollY-h-30));
  }
  [].slice.call(document.querySelectorAll("[data-filtro-area]")).forEach(function(a){
    a.addEventListener("click",function(e){e.preventDefault();filtrar(a.dataset.filtroArea);window.scrollTo({top:topoProjetos(),behavior:"smooth"});});
  });
})();
(function(){
  var b=document.getElementById("copiar-email"); if(!b) return;
  b.addEventListener("click",function(){
    var t=b.dataset.copiar;
    function ok(){b.textContent="Copiado";setTimeout(function(){b.textContent="Copiar";},1800);}
    function sel(){var r=document.createRange();r.selectNodeContents(document.getElementById("email"));var x=getSelection();x.removeAllRanges();x.addRange(r);b.textContent="Selecionado · Ctrl+C";setTimeout(function(){b.textContent="Copiar";},2400);}
    try{navigator.clipboard.writeText(t).then(ok,sel);}catch(e){sel();}
  });
})();
/* Destaca no menu a seção visível */
(function(){
  var links=[].slice.call(document.querySelectorAll('header.nav nav a[href^="#"]'));
  var secoes=links.map(function(a){return document.querySelector(a.getAttribute("href"));});
  var nav=document.querySelector("header.nav"), pendente=false;
  function atualiza(){
    pendente=false;
    var limite=(nav?nav.getBoundingClientRect().bottom:0)+40, atual=-1;
    secoes.forEach(function(sec,i){ if(sec && sec.getBoundingClientRect().top<=limite) atual=i; });
    var rod=document.querySelector("footer.rodape"); // fim da página = rodapé inteiro na tela
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4||(rod&&rod.getBoundingClientRect().bottom<=window.innerHeight+4)){
      var c=secoes.length-1; if(secoes[c]&&secoes[c].getBoundingClientRect().top<window.innerHeight) atual=c;
    }
    links.forEach(function(a,i){ var on=i===atual; a.classList.toggle("ativo",on); if(on) a.setAttribute("aria-current","true"); else a.removeAttribute("aria-current"); });
  }
  function agenda(){ if(!pendente){pendente=true;requestAnimationFrame(atualiza);} }
  window.addEventListener("scroll",agenda,{passive:true}); window.addEventListener("resize",agenda); atualiza();
})();
/* Menu (e o botão "Ver projetos" do topo): Sobre, Áreas e Projetos param com 30px entre o menu e o rótulo da seção
   (o mesmo respiro de quando a pessoa volta da galeria). Contato desce até o fim da página, mostrando o rodapé.
   Vale para o clique no menu e para quem chega de outra página já com #sobre, #areas, #projetos ou #contato no endereço. */
(function(){
  var RESPIRO = 30, IDS = ['sobre','areas','projetos','contato'];
  var nav = document.querySelector('header.nav');
  function destino(id){
    var s = document.getElementById(id); if (!s) return null;
    if (id === 'contato') { // desce até o rodapé aparecer por completo (fim da página)
      var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight), rod = document.querySelector('footer.rodape');
      return rod ? Math.min(max, Math.max(0, Math.round(rod.getBoundingClientRect().bottom + window.scrollY - window.innerHeight))) : max;
    }
    var t = s.querySelector('.cabecalho') || s;
    var h = nav ? nav.offsetHeight + (parseFloat(getComputedStyle(nav).top) || 0) : 0;
    return Math.max(0, Math.round(t.getBoundingClientRect().top + window.scrollY - h - RESPIRO));
  }
  function vai(id){ var y = destino(id); if (y === null) return; window.scrollTo(0, y); }
  // links do menu + botão "Ver projetos" do topo da página
  [].slice.call(document.querySelectorAll('header.nav nav a[href^="#"], .actions a.btn-primary[href="#projetos"]')).forEach(function(a){
    var id = a.getAttribute('href').slice(1); if (IDS.indexOf(id) < 0) return;
    a.addEventListener('click', function(e){
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); vai(id);
      try { if (location.hash !== '#' + id) history.pushState(null, '', '#' + id); } catch(err){}
    });
  });
  window.addEventListener('popstate', function(){ var id = location.hash.slice(1); if (IDS.indexOf(id) >= 0) vai(id); });
  // chegando de outra página (ex.: menu da galeria): o navegador pula sozinho para a seção,
  // então acertamos de novo quando as fontes e imagens terminam de carregar, a menos que a pessoa já tenha rolado
  var inicial = location.hash.slice(1);
  if (IDS.indexOf(inicial) >= 0) {
    var mexeu = false, marca = function(){ mexeu = true; };
    ['wheel','touchstart','keydown','mousedown'].forEach(function(ev){ window.addEventListener(ev, marca, { passive: true, once: true }); });
    var acerta = function(){ if (!mexeu) vai(inicial); };
    acerta(); requestAnimationFrame(acerta);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(acerta);
    window.addEventListener('load', function(){ acerta(); setTimeout(acerta, 0); requestAnimationFrame(acerta); });
  }
})();
/* Brilho da grade: só com mouse */
(function(){
  var h=document.querySelector(".hero"),l=h&&h.querySelector(".hero__luz"); if(!l) return;
  h.addEventListener("pointermove",function(e){
    if(e.pointerType!=="mouse") return;
    var r=h.getBoundingClientRect();
    l.style.setProperty("--x",(e.clientX-r.left)+"px"); l.style.setProperty("--y",(e.clientY-r.top)+"px");
    h.classList.add("luz-ativa");
  },{passive:true});
  h.addEventListener("pointerleave",function(){h.classList.remove("luz-ativa")});
})();
/* Ano no rodapé */
(function(){var a=document.querySelector("[data-ano]");if(a)a.textContent=new Date().getFullYear();})();
