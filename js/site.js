/* Portfólio Heloisa Borges · interações
   Filtros de projetos · copiar e-mail · menu com a seção ativa · respiro de 30px ao clicar no menu · desenho do topo perto do texto · brilho da grade do topo · ano do rodapé */
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
    a.addEventListener("click",function(e){e.preventDefault();filtrar(a.dataset.filtroArea);document.dispatchEvent(new CustomEvent("menu:fixar"));window.scrollTo({top:topoProjetos(),behavior:"smooth"});});
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
  function vai(id){ var y = destino(id); if (y === null) return; document.dispatchEvent(new CustomEvent('menu:fixar')); window.scrollTo(0, y); }
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
/* Desenho do topo (retângulo de ouro, espiral e caneta Bézier)
   · tamanho máximo: o desenho cresce com a tela até a âncora de baixo da curva ficar centralizada na divisória
     entre o topo e o Sobre (o meio do espaço entre os dois blocos); a partir daí, para de crescer
   · fica o mais perto possível do texto, sem encostar (só desloca na horizontal)
   · em telas estreitas, onde o desenho já fica atrás do texto, nada muda */
(function(){
  var svg=document.querySelector(".hero .bezier"); if(!svg||!svg.getScreenCTM) return;
  var FOLGA=24, pendente=false;
  function pontos(){
    var pts=[];
    function add(el,x,y){var m=el.getScreenCTM(); if(!m) return; var q=new DOMPoint(x,y).matrixTransform(m); pts.push([q.x,q.y]);}
    [].forEach.call(svg.querySelectorAll("path"),function(el){var L=el.getTotalLength(); for(var i=0;i<=160;i++){var q=el.getPointAtLength(L*i/160); add(el,q.x,q.y);}});
    [].forEach.call(svg.querySelectorAll("line"),function(el){var x1=el.x1.baseVal.value,y1=el.y1.baseVal.value,x2=el.x2.baseVal.value,y2=el.y2.baseVal.value; for(var i=0;i<=30;i++) add(el,x1+(x2-x1)*i/30,y1+(y2-y1)*i/30);});
    [].forEach.call(svg.querySelectorAll("circle, rect"),function(el){var b=el.getBoundingClientRect(); pts.push([b.left,b.top],[b.left,b.bottom],[b.right,b.top],[b.right,b.bottom]);});
    return pts;
  }
  function obstaculos(){
    // linhas reais de texto do topo (e do título do Sobre, onde a parte de baixo do desenho chega em telas largas) + chips e botões
    var out=[];
    [].forEach.call(document.querySelectorAll(".hero .display, .hero .chip, .hero .lead, .hero .btn, .hero .status, #sobre .cabecalho .label, #sobre .cabecalho .h2"),function(el){
      if(el.matches(".chip, .btn")){var b=el.getBoundingClientRect(); out.push([b.left,b.top,b.right,b.bottom]); return;}
      var tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;
      while((n=tw.nextNode())){ if(!n.textContent.trim()) continue; var rg=document.createRange(); rg.selectNodeContents(n);
        [].forEach.call(rg.getClientRects(),function(x){ if(x.width>0) out.push([x.left,x.top,x.right,x.bottom]); }); }
    });
    return out;
  }
  function limita(){
    // escala máxima = posição da divisória ÷ altura da âncora de baixo no desenho (o desenho é alinhado no topo e à direita)
    var hero=svg.parentNode, st=hero.querySelector(".status"), rot=document.querySelector("#sobre .cabecalho .label"), an=svg.querySelector(".bz-anchor");
    var vb=svg.viewBox.baseVal; if(!st||!rot||!an||!vb||!vb.width) return;
    var topo=hero.getBoundingClientRect().top, meio=(st.getBoundingClientRect().bottom+rot.getBoundingClientRect().top)/2-topo;
    var cy=an.y.baseVal.value+an.height.baseVal.value/2, kMax=meio/cy, larguraMax=vb.width*kMax;
    if(hero.clientWidth>larguraMax){ svg.style.width=larguraMax+"px"; svg.style.left="auto"; }
  }
  function ajusta(){
    pendente=false;
    svg.style.transform=""; svg.style.width=""; svg.style.left="";
    if(getComputedStyle(svg).display==="none") return; // celular: desenho escondido
    limita();
    var pts=pontos(), obs=obstaculos(), s=Infinity;
    for(var i=0;i<pts.length;i++){ var px=pts[i][0], py=pts[i][1];
      for(var j=0;j<obs.length;j++){ var o=obs[j];
        if(py<o[1]-FOLGA||py>o[3]+FOLGA) continue;          // não está na altura deste texto
        if(px>=o[2]+FOLGA){ s=Math.min(s,px-(o[2]+FOLGA)); } // à direita do texto: pode chegar até a folga
        else if(px>o[0]-FOLGA){ s=0; }                        // já está colado ou atrás do texto: não mexe
      }
    }
    if(!isFinite(s)||s<1) return;
    svg.style.transform="translateX("+(-Math.floor(s))+"px)";
  }
  function agenda(){ if(!pendente){ pendente=true; requestAnimationFrame(ajusta); } }
  ajusta();
  window.addEventListener("resize",agenda);
  window.addEventListener("load",agenda);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(agenda);
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
/* Altura do rodapé
   · computador e telas intermediárias: a mesma altura do cabeçalho
   · celular (texto e logo um embaixo do outro): 86px */
(function(){
  var cab=document.querySelector("header.nav"), rod=document.querySelector("footer.rodape"), inn=rod&&rod.querySelector(".inner"); if(!cab||!inn) return;
  var CELULAR=86, txt=inn.querySelector("p"), logo=inn.querySelector(".rodape__logo"), pendente=false;
  function iguala(){
    pendente=false;
    var borda=parseFloat(getComputedStyle(rod).borderTopWidth)||0;
    var empilhado=txt&&logo&&logo.getBoundingClientRect().top>=txt.getBoundingClientRect().bottom-1;
    var total=empilhado?CELULAR:cab.getBoundingClientRect().height;
    inn.style.minHeight=Math.max(0,total-borda)+"px";
  }
  function agenda(){ if(!pendente){ pendente=true; requestAnimationFrame(iguala); } }
  iguala();
  window.addEventListener("resize",agenda);
  window.addEventListener("load",agenda);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(agenda);
})();
/* Ano no rodapé */
(function(){var a=document.querySelector("[data-ano]");if(a)a.textContent=new Date().getFullYear();})();
