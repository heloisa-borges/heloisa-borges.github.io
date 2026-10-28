# Portfólio · Heloisa Borges

Portfólio de design gráfico e UX/UI. Site estático (HTML, CSS e JavaScript puro), pronto para o GitHub Pages.

## Estrutura

```
index.html          página principal: topo, Sobre, Áreas de atuação, Projetos, Contato
galeria.html        Galeria de Edição & Tratamento de Imagem: antes e depois lado a lado
css/cores.css       cartela de cores (variáveis) e regras de uso
css/tipografia.css  fontes (variáveis) e a escala tipográfica documentada
css/estilo.css      estilos do site
css/galeria.css     estilos da galeria e do card da galeria em Projetos
js/site.js          filtros de projetos, copiar e-mail, menu ativo, rolagem do menu (30 px até o título), desenho do topo,
                    brilho da grade, altura do rodapé, ano do rodapé
js/galeria.js       imagens provisórias da galeria e botão Voltar; nas duas páginas: menu que some ao rolar
                    e botão de voltar ao topo
img/                foto do Sobre em WebP (480, 960 e 1600 px de largura; o navegador escolhe o tamanho certo)
```

## Foto do Sobre

A foto é um PNG recortado, sem fundo, em 1600 × 2000 px (4:5). O degradê, o contorno e os cantos em ciano
são desenhados pelo site. Para trocar a foto, gere de novo os três arquivos `img/foto-heloisa-480.webp`,
`-960.webp` e `-1600.webp` mantendo a proporção 4:5.

## Fotos da galeria

As imagens da galeria ainda são provisórias (desenhos gerados pelo `js/galeria.js`).
Para usar as fotos reais, crie a pasta `img/galeria/` e, em `galeria.html`, troque cada
`<div class="foto__img" data-cena="...">` por `<img src="img/galeria/nome-antes.jpg" alt="Descrição da foto">`.
Use a proporção 4:3 (por exemplo, 1600 × 1200 px).

## Publicar no GitHub Pages

1. Suba o conteúdo desta pasta para um repositório.
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. O site fica disponível em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

## Identidade

- **Cores:** Carvão, Vinho & Ciano-gelo (ver `css/cores.css`).
- **Fontes:** Cormorant Garamond, DM Sans e DM Mono, pelo Google Fonts (licença SIL Open Font License).
- **Ícones:** Material Design Icons (Pictogrammers), licença Apache 2.0.
