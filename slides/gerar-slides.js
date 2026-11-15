// Gera "NUP2 - Blockchain e Arquiteturas Descentralizadas.pptx"
// Uso (numa pasta de trabalho com as dependências instaladas):
//   npm install pptxgenjs react-icons react react-dom sharp
//   SKILL_PPTX=<pasta do skill pptx> node gerar-slides.js saida.pptx
// O SKILL_PPTX só é usado para gravar as cores do tema (apply_theme.js).
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const path = require("path");

const SAIDA = process.argv[2] || "NUP2 - Blockchain e Arquiteturas Descentralizadas.pptx";
const SKILL = process.env.SKILL_PPTX;

// ---------- Tema ----------
const HEX = {
  tinta: "1B1F2A", branco: "FFFFFF", grafite: "2B3347", gelo: "F3F5F8",
  teal: "0F8B8D", indigo: "5B5FC7", laranja: "D9480F", ambar: "F2A900",
  verde: "2F9E44", vermelho: "C92A2A", cinza: "6B7280", linha: "D5DAE1",
};
const THEME = {
  name: "NUP2 Blockchain",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.tinta, lt1: HEX.branco, dk2: HEX.grafite, lt2: HEX.gelo,
    accent1: HEX.teal, accent2: HEX.indigo, accent3: HEX.laranja,
    accent4: HEX.ambar, accent5: HEX.verde, accent6: HEX.vermelho,
    hlink: HEX.teal, folHlink: HEX.cinza,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 polegadas
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Blockchain e Arquiteturas Descentralizadas";
pres.author = "José Alan, Murilo e Klaus";
const C = pres.SchemeColor;
const S = pres.ShapeType;

const PARTES = {
  1: { cor: C.accent1, hex: HEX.teal, nome: "Murilo", rotulo: "Parte 1 · Murilo" },
  2: { cor: C.accent2, hex: HEX.indigo, nome: "Alan", rotulo: "Parte 2 · Alan" },
  3: { cor: C.accent3, hex: HEX.laranja, nome: "Klaus", rotulo: "Parte 3 · Klaus" },
};
const MONO = "Courier New";

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "CLARO",
  objects: [
    { rect: { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.background1 } } },
    {
      placeholder: {
        options: { name: "title", type: "title", x: 0.5, y: 0.3, w: 7.1, h: 0.85, fontSize: 30, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 },
        text: "",
      },
    },
  ],
  slideNumber: { x: 9.2, y: 5.25, w: 0.5, h: 0.25, fontSize: 10, color: HEX.cinza, align: "right" },
});
pres.defineSlideMaster({
  title: "ESCURO",
  objects: [
    { rect: { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.text1 } } },
    {
      placeholder: {
        options: { name: "title", type: "title", x: 0.5, y: 0.3, w: 7.1, h: 0.85, fontSize: 30, bold: true, color: C.background1, align: "left", valign: "middle", margin: 0 },
        text: "",
      },
    },
  ],
  slideNumber: { x: 9.2, y: 5.25, w: 0.5, h: 0.25, fontSize: 10, color: HEX.cinza, align: "right" },
});

// ---------- Ícones ----------
async function icone(nome, corHex, tam = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[nome], { color: "#" + corHex, size: String(tam) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
async function iconeEmCirculo(slide, nome, x, y, d, corFundo, nomeObj) {
  slide.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: corFundo }, line: { color: corFundo, width: 0 }, objectName: nomeObj + " fundo" });
  const p = d * 0.5;
  slide.addImage({ data: await icone(nome, HEX.branco), x: x + (d - p) / 2, y: y + (d - p) / 2, w: p, h: p, altText: nomeObj, objectName: nomeObj });
}

// ---------- Auxiliares ----------
function linha(slide, x1, y1, x2, y2, opt = {}) {
  const o = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: opt.cor || C.text2, width: opt.larg || 1.5, dashType: opt.tracejado ? "dash" : "solid" } };
  if (opt.seta) o.line.endArrowType = "triangle";
  // inverter conforme o sentido
  if (x2 < x1) o.flipH = true;
  if (y2 < y1) o.flipV = true;
  slide.addShape(S.line, o);
}
function pilula(slide, parte) {
  const p = PARTES[parte];
  slide.addShape(S.roundRect, { x: 7.75, y: 0.42, w: 1.75, h: 0.34, rectRadius: 0.17, fill: { color: p.cor }, line: { color: p.cor, width: 0 }, objectName: "Etiqueta da parte" });
  slide.addText(p.rotulo, { x: 7.75, y: 0.42, w: 1.75, h: 0.34, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Texto da etiqueta" });
}
function fonte(slide, texto, escuro = false) {
  slide.addText(texto, { x: 0.5, y: 5.2, w: 8.5, h: 0.3, fontSize: 10, color: escuro ? "9AA3B2" : HEX.cinza, margin: 0, valign: "middle", isTextBox: true, objectName: "Fonte" });
}
function novoSlide(layout, secao, titulo, parte) {
  const s = pres.addSlide({ masterName: layout, sectionTitle: secao });
  if (titulo) s.addText(titulo, { placeholder: "title" });
  if (parte) pilula(s, parte);
  return s;
}
// bloco da cadeia (motivo visual repetido)
function bloco(slide, x, y, w, h, corBorda, corTexto, linhas, opt = {}) {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: opt.fundo || C.background1 }, line: { color: corBorda, width: 1.5 }, objectName: opt.nome || "Bloco" });
  slide.addText(linhas, { x: x + 0.08, y: y + 0.04, w: w - 0.16, h: h - 0.08, fontSize: opt.tam || 11, color: corTexto, fontFace: opt.mono ? MONO : undefined, align: opt.align || "left", valign: "middle", margin: 0, isTextBox: true, objectName: (opt.nome || "Bloco") + " texto" });
}
function cadeiaDeBlocos(slide, x, y, n, w, h, gap, corBorda, corTexto, fundo, rotulos) {
  for (let i = 0; i < n; i++) {
    const bx = x + i * (w + gap);
    bloco(slide, bx, y, w, h, corBorda, corTexto, rotulos[i], { fundo, mono: true, tam: 10, nome: "Bloco " + (i + 1) });
    if (i < n - 1) linha(slide, bx + w, y + h / 2, bx + w + gap, y + h / 2, { cor: corBorda, larg: 2 });
  }
}

const NOTAS = {};
const nota = (slide, texto) => slide.addNotes(texto.trim());

// ============ SLIDES ============
(async () => {
  // ---- 1. Título ----
  pres.addSection({ title: "Abertura" });
  let s = pres.addSlide({ masterName: "ESCURO", sectionTitle: "Abertura" });
  s.addText("Blockchain e arquiteturas descentralizadas", { x: 0.6, y: 0.95, w: 5.4, h: 1.7, fontSize: 36, bold: true, color: C.background1, fontFace: THEME.headFontFace, valign: "top", margin: 0, isTextBox: true, objectName: "Título" });
  s.addText("Web3, contratos inteligentes, DApps, consenso e quando não usar", { x: 0.6, y: 3.05, w: 5.2, h: 0.8, fontSize: 18, color: "C9D1DE", valign: "top", margin: 0, isTextBox: true, objectName: "Subtítulo" });
  s.addText("Seminário NUP2  |  José Alan, Murilo e Klaus", { x: 0.6, y: 4.6, w: 5.6, h: 0.35, fontSize: 14, color: HEX.ambar, bold: true, margin: 0, isTextBox: true, objectName: "Autores" });
  cadeiaDeBlocos(s, 6.35, 1.55, 2, 1.45, 0.95, 0.35, HEX.teal, C.background1, C.text2, [
    [{ text: "bloco 0", options: { breakLine: true, color: HEX.ambar, bold: true } }, { text: "anterior 0000", options: { breakLine: true } }, { text: "hash 0000c2", options: {} }],
    [{ text: "bloco 1", options: { breakLine: true, color: HEX.ambar, bold: true } }, { text: "anterior 0000c2", options: { breakLine: true } }, { text: "hash 000091", options: {} }],
  ]);
  cadeiaDeBlocos(s, 6.35, 2.95, 2, 1.45, 0.95, 0.35, HEX.teal, C.background1, C.text2, [
    [{ text: "bloco 2", options: { breakLine: true, color: HEX.ambar, bold: true } }, { text: "anterior 000091", options: { breakLine: true } }, { text: "hash 00005b", options: {} }],
    [{ text: "bloco 3", options: { breakLine: true, color: HEX.ambar, bold: true } }, { text: "anterior 00005b", options: { breakLine: true } }, { text: "hash 00004c", options: {} }],
  ]);
  nota(s, `
QUEM FALA: Murilo (abertura). TEMPO: 1 minuto.
Apresentar o grupo e o tema: blockchain como arquitetura descentralizada, com foco em três perguntas. Como a rede concorda sem um dono (consenso)? O que dá para construir em cima (contratos inteligentes e DApps)? E quando blockchain é a escolha errada?
Dizer que cada integrante apresenta uma parte e mostra uma demonstração prática ao vivo.`);

  // ---- 2. Roteiro ----
  s = novoSlide("CLARO", "Abertura", "Roteiro da apresentação");
  const cards = [
    { n: "1", cor: HEX.teal, t: "Fundamentos e consenso", q: "Murilo", min: "9 min", demo: "Demo: mini-blockchain em Node.js" },
    { n: "2", cor: HEX.indigo, t: "Contratos inteligentes e DApps", q: "Alan", min: "10 min", demo: "Demo: contrato em rede local (Hardhat) e DApp" },
    { n: "3", cor: HEX.laranja, t: "Quando não usar e trade-offs", q: "Klaus", min: "9 min", demo: "Demo: banco de dados x blockchain" },
  ];
  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(S.roundRect, { x, y: 1.4, w: 2.9, h: 3.3, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão " + c.n });
    s.addShape(S.ellipse, { x: x + 0.25, y: 1.65, w: 0.7, h: 0.7, fill: { color: c.cor }, line: { color: c.cor, width: 0 }, objectName: "Número " + c.n });
    s.addText(c.n, { x: x + 0.25, y: 1.65, w: 0.7, h: 0.7, fontSize: 24, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Número " + c.n + " texto" });
    s.addText(c.t, { x: x + 0.25, y: 2.5, w: 2.45, h: 0.85, fontSize: 18, bold: true, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Título do cartão " + c.n });
    s.addText(`${c.q}  |  ${c.min}`, { x: x + 0.25, y: 3.4, w: 2.45, h: 0.3, fontSize: 14, color: C.text2, margin: 0, isTextBox: true, objectName: "Quem e tempo " + c.n });
    s.addText(c.demo, { x: x + 0.25, y: 3.8, w: 2.45, h: 0.7, fontSize: 14, color: c.cor, bold: true, valign: "top", margin: 0, isTextBox: true, objectName: "Demo " + c.n });
  });
  fonte(s, "Cada integrante apresenta a própria parte. Total: cerca de 28 minutos, mais perguntas.");
  nota(s, `
QUEM FALA: Murilo. TEMPO: 30 segundos.
Mostrar a divisão: três partes, três apresentadores, uma demonstração prática em cada parte (é o que a nota de casos práticos pede). Avisar que a ordem segue a lógica: primeiro como funciona, depois o que se constrói em cima, por fim quando não vale a pena.
Tempo total planejado: cerca de 28 minutos, dentro da faixa de 20 a 30 do professor.`);

  // ================= PARTE 1 =================
  pres.addSection({ title: "Parte 1 · Fundamentos e consenso" });
  const P1 = "Parte 1 · Fundamentos e consenso";

  // ---- 3. Centralizado x federado x ponto a ponto ----
  s = novoSlide("CLARO", P1, "Quem controla o sistema?", 1);
  const nos = (cx, cy, pts, cor) => {
    pts.forEach(([px, py]) => linha(s, cx, cy, cx + px, cy + py, { cor: HEX.cinza, larg: 1.25 }));
  };
  const no = (cx, cy, r, cor, nomeObj) => s.addShape(S.ellipse, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: cor }, line: { color: cor, width: 0 }, objectName: nomeObj });
  // (a) centralizado
  {
    const cx = 1.75, cy = 2.55;
    const raios = [[0, -0.85], [0.8, -0.3], [0.8, 0.5], [0, 0.85], [-0.8, 0.5], [-0.8, -0.3]];
    nos(cx, cy, raios);
    raios.forEach(([dx, dy], i) => no(cx + dx, cy + dy, 0.13, HEX.cinza, "Nó cliente " + i));
    no(cx, cy, 0.24, HEX.teal, "Servidor central");
  }
  // (b) federado
  {
    const hubs = [[4.5, 1.9, [[-0.55, -0.3], [0.05, -0.62], [0.6, -0.3]]], [5.4, 3.05, [[0.65, -0.25], [0.75, 0.25], [0.3, 0.62]]], [3.6, 3.05, [[-0.65, -0.25], [-0.75, 0.25], [-0.3, 0.62]]]];
    for (let h = 0; h < 3; h++) { const n = (h + 1) % 3; linha(s, hubs[h][0], hubs[h][1], hubs[n][0], hubs[n][1], { cor: HEX.indigo, larg: 1.75 }); }
    hubs.forEach(([hx, hy, cl], h) => {
      cl.forEach(([dx, dy], i) => {
        linha(s, hx, hy, hx + dx, hy + dy, { cor: HEX.cinza, larg: 1 });
        no(hx + dx, hy + dy, 0.1, HEX.cinza, `Cliente ${h}-${i}`);
      });
      no(hx, hy, 0.2, HEX.indigo, "Centro " + h);
    });
  }
  // (c) ponto a ponto
  {
    const p = [[7.55, 1.75], [8.45, 2.15], [8.55, 3.05], [7.7, 3.45], [6.8, 3.0], [6.85, 2.1]];
    for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) linha(s, p[i][0], p[i][1], p[j][0], p[j][1], { cor: HEX.laranja, larg: 1 });
    p.forEach(([px, py], i) => no(px, py, 0.17, HEX.laranja, "Par " + i));
  }
  [["Centralizado", "Um servidor decide e guarda tudo (banco da empresa)", 0.35, HEX.teal],
   ["Federado", "Vários centros, cada um com seu dono (nuvem, bancos)", 3.35, HEX.indigo],
   ["Ponto a ponto", "Muitos donos, sem centro (Bitcoin, Ethereum)", 6.35, HEX.laranja]].forEach(([t, d, x, cor]) => {
    s.addText(t, { x, y: 3.95, w: 3.0, h: 0.35, fontSize: 18, bold: true, color: cor, align: "center", margin: 0, isTextBox: true, objectName: "Rótulo " + t });
    s.addText(d, { x: x + 0.1, y: 4.32, w: 2.8, h: 0.65, fontSize: 14, color: C.text2, align: "center", valign: "top", margin: 0, isTextBox: true, objectName: "Descrição " + t });
  });
  nota(s, `
QUEM FALA: Murilo. TEMPO: 1 minuto e meio.
Ideia central: a pergunta de arquitetura é "quem pode decidir e quem pode alterar os dados".
Centralizado: um servidor (o banco do site, o sistema da empresa). Simples e rápido, mas é ponto único de falha e de confiança.
Federado: vários centros, cada um com um dono (rede bancária, nuvem). Reduz o ponto único, mas os donos precisam confiar uns nos outros.
Ponto a ponto: muitos donos, nenhum centro. É o modelo do Bitcoin e do Ethereum.
Observação de terminologia: o texto clássico de Paul Baran (1964) chama o segundo de "descentralizado" e o terceiro de "distribuído". Usei "federado" e "ponto a ponto" porque confundem menos. Se o professor perguntar, é a mesma coisa.`);

  // ---- 4. Livro-razão compartilhado ----
  s = novoSlide("CLARO", P1, "Um livro-razão compartilhado", 1);
  const rot = (n, anterior, hash) => [
    [{ text: "bloco " + n, options: { breakLine: true, bold: true, color: HEX.teal } }, { text: "dados da transação", options: { breakLine: true } }, { text: "anterior " + anterior, options: { breakLine: true } }, { text: "hash " + hash, options: {} }],
  ][0];
  cadeiaDeBlocos(s, 0.5, 1.55, 4, 1.8, 1.3, 0.45, HEX.teal, C.text1, C.background2, [rot(1, "0000", "00c2"), rot(2, "00c2", "9120"), rot(3, "9120", "5b55"), rot(4, "5b55", "4cd6")]);
  s.addText("Cada bloco guarda o hash do anterior", { x: 0.5, y: 3.4, w: 8.9, h: 0.3, fontSize: 14, italic: true, color: HEX.cinza, align: "center", margin: 0, isTextBox: true, objectName: "Legenda da cadeia" });
  const tres = [["FaPlusCircle", "Só se acrescenta", "Blocos novos entram no fim da cadeia."], ["FaCopy", "Todos têm cópia", "Cada nó guarda e confere a cadeia inteira."], ["FaLink", "Mexer quebra os seguintes", "O hash muda e o bloco seguinte aponta para o antigo."]];
  for (let i = 0; i < 3; i++) {
    const x = 0.5 + i * 3.1;
    await iconeEmCirculo(s, tres[i][0], x, 3.9, 0.55, HEX.teal, "Ícone " + tres[i][1]);
    s.addText(tres[i][1], { x: x + 0.7, y: 3.82, w: 2.2, h: 0.5, fontSize: 14, bold: true, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Título " + tres[i][1] });
    s.addText(tres[i][2], { x: x + 0.7, y: 4.3, w: 2.2, h: 0.7, fontSize: 12, color: C.text2, valign: "top", margin: 0, isTextBox: true, objectName: "Texto " + tres[i][1] });
  }
  nota(s, `
QUEM FALA: Murilo. TEMPO: 1 minuto e meio.
Definição simples: blockchain é um registro (livro-razão) mantido por muitos computadores ao mesmo tempo, em que os registros são agrupados em blocos e cada bloco aponta para o anterior por meio de um hash.
O hash é uma "impressão digital" do conteúdo: qualquer mudança no bloco gera um hash completamente diferente.
Por isso adulterar um bloco antigo é detectável: o bloco seguinte guarda o hash antigo e deixa de bater. Isso a gente vai mostrar na demonstração.
Cuidado com a palavra "imutável": o sistema não impede que alguém tente mudar, ele torna a mudança detectável e muito cara. Dizer "praticamente imutável" ou "à prova de adulteração".`);

  // ---- 5. Anatomia de um bloco ----
  s = novoSlide("CLARO", P1, "Anatomia de um bloco", 1);
  // pilha do bloco
  s.addShape(S.roundRect, { x: 0.5, y: 1.4, w: 4.0, h: 3.55, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.teal, width: 1.5 }, objectName: "Bloco aberto" });
  s.addText("Cabeçalho", { x: 0.7, y: 1.5, w: 3.6, h: 0.3, fontSize: 14, bold: true, color: HEX.teal, margin: 0, isTextBox: true, objectName: "Rótulo cabeçalho" });
  ["Hash do bloco anterior", "Raiz de Merkle das transações", "Data e hora", "Nonce (prova de trabalho)"].forEach((t, i) => {
    s.addShape(S.roundRect, { x: 0.7, y: 1.85 + i * 0.47, w: 3.6, h: 0.4, rectRadius: 0.05, fill: { color: C.background1 }, line: { color: HEX.linha, width: 1 }, objectName: "Campo " + t });
    s.addText(t, { x: 0.8, y: 1.85 + i * 0.47, w: 3.4, h: 0.4, fontSize: 14, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto " + t });
  });
  s.addText("Corpo", { x: 0.7, y: 3.8, w: 3.6, h: 0.3, fontSize: 14, bold: true, color: HEX.teal, margin: 0, isTextBox: true, objectName: "Rótulo corpo" });
  s.addShape(S.roundRect, { x: 0.7, y: 4.15, w: 3.6, h: 0.6, rectRadius: 0.05, fill: { color: C.background1 }, line: { color: HEX.linha, width: 1 }, objectName: "Campo transações" });
  s.addText("Lista de transações", { x: 0.8, y: 4.15, w: 3.4, h: 0.6, fontSize: 14, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto transações" });
  // árvore de Merkle
  s.addText("Árvore de Merkle", { x: 5.2, y: 1.4, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: HEX.teal, align: "center", margin: 0, isTextBox: true, objectName: "Título árvore" });
  const tx = [5.3, 6.35, 7.4, 8.45];
  const mk = (x, y, w, t, fundo, cor) => bloco(s, x, y, w, 0.4, HEX.teal, cor || C.text1, [{ text: t, options: {} }], { fundo, mono: true, tam: 11, align: "center", nome: "Nó " + t });
  mk(6.85, 1.85, 1.0, "raiz", C.background2);
  mk(5.8, 2.75, 1.0, "H(A+B)", C.background2);
  mk(7.9, 2.75, 1.0, "H(C+D)", C.background2);
  linha(s, 6.8, 2.75, 7.35, 2.25, { cor: HEX.teal }); linha(s, 7.9, 2.75, 7.35, 2.25, { cor: HEX.teal });
  ["A", "B", "C", "D"].forEach((t, i) => {
    mk(tx[i] - 0.1, 3.75, 0.8, "tx " + t, C.background2);
  });
  linha(s, 5.75, 3.75, 6.3, 3.15, { cor: HEX.teal }); linha(s, 6.8, 3.75, 6.3, 3.15, { cor: HEX.teal });
  linha(s, 7.85, 3.75, 8.4, 3.15, { cor: HEX.teal }); linha(s, 8.9, 3.75, 8.4, 3.15, { cor: HEX.teal });
  s.addText("Uma raiz resume todas as transações. Mudar uma delas muda a raiz e, com ela, o hash do bloco.", { x: 5.2, y: 4.3, w: 4.3, h: 0.7, fontSize: 14, color: C.text2, align: "center", valign: "top", margin: 0, isTextBox: true, objectName: "Legenda árvore" });
  nota(s, `
QUEM FALA: Murilo. TEMPO: 1 minuto e meio.
Um bloco tem cabeçalho e corpo. O cabeçalho carrega o hash do bloco anterior (é o que forma a corrente), a raiz de Merkle, a data e o nonce. O corpo é a lista de transações.
A árvore de Merkle: cada transação vira um hash, os hashes são juntados em pares e hasheados de novo até sobrar um só, a raiz. Vantagem: provar que uma transação está num bloco exige poucos hashes, não o bloco inteiro (é o que carteiras leves usam).
O nonce é o número que os mineradores variam para encontrar um hash que comece com zeros (próximo slide e demo).`);

  // ---- 6. Consenso: o problema ----
  s = novoSlide("CLARO", P1, "Consenso: por que é difícil", 1);
  // gasto duplo
  const caixa = (x, y, w, h, t, cor, tam = 14) => {
    s.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: cor, width: 1.5 }, objectName: "Caixa " + t });
    s.addText(t, { x, y, w, h, fontSize: tam, bold: true, color: C.text1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Texto " + t });
  };
  caixa(0.5, 2.55, 1.4, 0.8, "Ana\n10 moedas", HEX.teal);
  caixa(3.9, 1.5, 1.4, 0.8, "Bia", HEX.indigo);
  caixa(3.9, 3.6, 1.4, 0.8, "Caio", HEX.indigo);
  linha(s, 1.9, 2.8, 3.9, 1.95, { cor: HEX.vermelho, larg: 2, seta: true });
  linha(s, 1.9, 3.1, 3.9, 4.0, { cor: HEX.vermelho, larg: 2, seta: true });
  s.addText("envia 10", { x: 2.0, y: 1.9, w: 1.4, h: 0.3, fontSize: 12, color: HEX.vermelho, bold: true, margin: 0, isTextBox: true, objectName: "Rótulo envio 1" });
  s.addText("envia os mesmos 10", { x: 1.7, y: 3.85, w: 2.1, h: 0.3, fontSize: 12, color: HEX.vermelho, bold: true, margin: 0, isTextBox: true, objectName: "Rótulo envio 2" });
  s.addText("Gasto duplo: quem decide qual vale, sem um banco no meio?", { x: 0.5, y: 4.6, w: 5.0, h: 0.5, fontSize: 14, bold: true, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Pergunta gasto duplo" });
  // texto à direita
  s.addShape(S.roundRect, { x: 5.9, y: 1.4, w: 3.6, h: 3.6, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão bizantino" });
  s.addText([
    { text: "Problema dos generais bizantinos", options: { bold: true, fontSize: 16, color: HEX.teal, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Lamport, Shostak e Pease, 1982", options: { fontSize: 12, color: HEX.cinza, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Nós podem falhar, atrasar mensagens ou mentir.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Mesmo assim, os honestos precisam chegar à mesma versão dos dados.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Consenso é o protocolo que resolve isso.", options: { bullet: true } },
  ], { x: 6.1, y: 1.55, w: 3.2, h: 3.3, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Texto bizantino" });
  nota(s, `
QUEM FALA: Murilo. TEMPO: 1 minuto e meio.
Sem banco central, o que impede a Ana de mandar as mesmas 10 moedas para duas pessoas ao mesmo tempo? Em sistema centralizado o banco registra na ordem e recusa a segunda. Numa rede sem dono, os nós podem receber as duas transações em ordens diferentes.
Isso é uma instância do problema dos generais bizantinos (Lamport, Shostak e Pease, 1982): como um grupo coordena uma ação quando alguns membros podem trair e as mensagens podem se perder.
O consenso é o conjunto de regras pelas quais os nós escolhem uma única versão do histórico. A diferença entre os mecanismos está em quem tem o direito de propor o próximo bloco e quanto isso custa.`);

  // ---- 7. Mecanismos de consenso ----
  s = novoSlide("CLARO", P1, "Como se escolhe o próximo bloco", 1);
  const hd = (t, cor) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: cor }, align: "center", valign: "middle" } });
  const cel = (t, o = {}) => ({ text: t, options: { color: C.text1, valign: "middle", ...o } });
  s.addTable([
    [{ text: "", options: { fill: { color: C.background1 } } }, hd("Prova de trabalho", HEX.teal), hd("Prova de participação", HEX.indigo), hd("Tolerância a falhas bizantinas", HEX.laranja)],
    [cel("Quem propõe", { bold: true }), cel("Quem resolve um quebra-cabeça de hash primeiro"), cel("Validador sorteado, com moedas em garantia"), cel("Líder que rotaciona entre membros conhecidos")],
    [cel("Custo", { bold: true }), cel("Energia e hardware"), cel("Capital imobilizado, com perda em caso de fraude"), cel("Baixo, mas exige confiar na lista de membros")],
    [cel("Quem entra", { bold: true }), cel("Qualquer um"), cel("Qualquer um com o mínimo de moedas"), cel("Só participantes autorizados")],
    [cel("Exemplos", { bold: true }), cel("Bitcoin"), cel("Ethereum, desde setembro de 2022"), cel("Hyperledger Besu (QBFT), usado no piloto do Drex")],
  ], { x: 0.5, y: 1.4, w: 9.0, colW: [1.35, 2.5, 2.5, 2.65], rowH: [0.5, 0.78, 0.78, 0.65, 0.78], fontSize: 14, border: { type: "solid", pt: 1, color: HEX.linha }, fill: { color: C.background2 }, margin: [0.05, 0.1, 0.05, 0.1], objectName: "Tabela de consenso" });
  fonte(s, "Fontes: bitcoin.org (Nakamoto, 2008); ethereum.org (Proof-of-stake); documentação do Hyperledger Besu.");
  nota(s, `
QUEM FALA: Murilo. TEMPO: 2 minutos.
Três famílias de consenso:
1) Prova de trabalho (Bitcoin): para propor um bloco é preciso achar um nonce que faça o hash começar com zeros. Isso custa energia, e é esse custo que torna a fraude cara. Bloco a cada cerca de 10 minutos.
2) Prova de participação (Ethereum desde o Merge, setembro de 2022): validadores colocam moedas em garantia (32 ETH para ser validador individual) e são sorteados para propor e atestar blocos. Se agirem de forma desonesta, perdem parte da garantia (slashing). Consumo de energia muito menor. Blocos a cada 12 segundos.
3) Tolerância a falhas bizantinas em redes permissionadas (QBFT no Hyperledger Besu, PBFT): os membros são conhecidos, votam em rodadas, e a rede tolera até um terço de nós defeituosos ou mal-intencionados. Rápido, mas só faz sentido se você confia na lista de participantes.
Ponto a reforçar: o mecanismo de consenso é uma escolha de projeto que define custo, velocidade e quem pode participar. Não existe um "melhor" absoluto.`);

  // ---- 8. Demo 1 ----
  s = novoSlide("ESCURO", P1, "Demo 1: mini-blockchain", 1);
  s.addText([
    { text: "Em Node.js, sem bibliotecas", options: { bold: true, color: HEX.ambar, breakLine: true, paraSpaceAfter: 8 } },
    { text: "1.  Minerar 4 blocos (hash com 4 zeros)", options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: "2.  Validar a cadeia", options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: "3.  Adulterar o valor do bloco 1", options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: "4.  Refazer a prova de trabalho dele", options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: "5.  Ver quem acusa o erro", options: {  } },
  ], { x: 0.5, y: 1.4, w: 3.6, h: 3.1, fontSize: 16, color: C.background1, valign: "top", margin: 0, isTextBox: true, objectName: "Passos da demo 1" });
  s.addShape(S.roundRect, { x: 4.3, y: 1.4, w: 5.2, h: 3.1, rectRadius: 0.08, fill: { color: C.text2 }, line: { color: HEX.cinza, width: 1 }, objectName: "Terminal" });
  s.addText([
    { text: "$ node mini-chain.js", options: { color: HEX.ambar, breakLine: true } },
    { text: "bloco 1 minerado: 11.451 tentativas", options: { breakLine: true } },
    { text: "Validação: { ok: true }", options: { color: "7EE2A8", breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "(Ana paga 10 vira Ana paga 1000)", options: { color: "C9D1DE", breakLine: true } },
    { text: "Validação: { ok: false, bloco: 1,", options: { color: "FF8A8A", breakLine: true } },
    { text: "  motivo: conteúdo não bate com o hash }", options: { color: "FF8A8A", breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Refez o bloco 1, mas o bloco 2 acusa:", options: { color: "C9D1DE", breakLine: true } },
    { text: "  hash anterior não aponta p/ o anterior", options: { color: "FF8A8A" } },
  ], { x: 4.45, y: 1.5, w: 4.9, h: 2.9, fontSize: 12, fontFace: MONO, color: C.background1, valign: "top", margin: 0, isTextBox: true, objectName: "Saída do terminal" });
  s.addText("Arquivo: demo-mini-blockchain/mini-chain.js  |  Dificuldade ajustável: DIFICULDADE=5 node mini-chain.js", { x: 0.5, y: 4.75, w: 9.0, h: 0.35, fontSize: 12, color: "9AA3B2", margin: 0, isTextBox: true, objectName: "Comando" });
  nota(s, `
QUEM FALA: Murilo. TEMPO: 2 minutos de demonstração ao vivo.
Rodar: node mini-chain.js (dentro de demo-mini-blockchain).
Roteiro de fala:
1) O programa minera 4 blocos. Mostrar o número de tentativas: o computador testa nonces até o hash começar com 0000. É a prova de trabalho em miniatura.
2) Validação ok.
3) O programa muda "Ana paga 10" para "Ana paga 1000" no bloco 1. A validação falha no bloco 1: o conteúdo não bate mais com o hash gravado.
4) O fraudador refaz a prova de trabalho só do bloco 1. Agora o bloco 1 está consistente, mas o bloco 2 acusa que o hash anterior não aponta mais para o bloco 1.
5) Para esconder a fraude ele teria de refazer todos os blocos seguintes. Aqui são 4 blocos e um computador, por isso é rápido. Numa rede real, ele teria de superar o poder de todo o resto da rede (ataque de 51%).
Se a demonstração falhar ao vivo: ter a saída impressa neste slide como plano B. Aumentar DIFICULDADE para 5 mostra a prova de trabalho ficando visivelmente mais lenta.
Passar a palavra ao Alan.`);

  // ================= PARTE 2 =================
  pres.addSection({ title: "Parte 2 · Contratos inteligentes e DApps" });
  const P2 = "Parte 2 · Contratos inteligentes e DApps";

  // ---- 9. Contratos inteligentes ----
  s = novoSlide("CLARO", P2, "Contratos inteligentes", 2);
  // esquerda: definição + diagrama
  s.addText("Programa guardado na blockchain, com código e estado próprios, que executa quando alguém envia uma transação.", { x: 0.5, y: 1.35, w: 4.6, h: 1.1, fontSize: 18, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Definição" });
  caixa(0.5, 3.0, 1.45, 0.9, "Conta\n(carteira)", HEX.indigo);
  s.addShape(S.roundRect, { x: 3.35, y: 2.75, w: 1.75, h: 1.4, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.indigo, width: 1.5 }, objectName: "Contrato" });
  s.addText([{ text: "Contrato", options: { bold: true, breakLine: true } }, { text: "código", options: { fontFace: MONO, fontSize: 12, breakLine: true } }, { text: "estado", options: { fontFace: MONO, fontSize: 12 } }], { x: 3.35, y: 2.75, w: 1.75, h: 1.4, fontSize: 14, color: C.text1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Texto contrato" });
  linha(s, 1.95, 3.45, 3.35, 3.45, { cor: HEX.indigo, larg: 2, seta: true });
  s.addText("transação", { x: 1.95, y: 3.1, w: 1.4, h: 0.3, fontSize: 12, color: HEX.indigo, bold: true, align: "center", margin: 0, isTextBox: true, objectName: "Rótulo transação" });
  const atrib = [["FaCode", "O código é a regra", "O que está escrito é o que acontece, para todos."], ["FaCopy", "Executa em todos os nós", "Cada nó roda o mesmo código e chega ao mesmo resultado."], ["FaLock", "Publicado, não se edita", "Corrigir exige publicar um contrato novo."]];
  for (let i = 0; i < 3; i++) {
    const y = 1.4 + i * 1.2;
    await iconeEmCirculo(s, atrib[i][0], 5.6, y, 0.6, HEX.indigo, "Ícone " + atrib[i][1]);
    s.addText(atrib[i][1], { x: 6.4, y: y - 0.05, w: 3.1, h: 0.35, fontSize: 16, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true, objectName: "Título " + atrib[i][1] });
    s.addText(atrib[i][2], { x: 6.4, y: y + 0.3, w: 3.1, h: 0.6, fontSize: 14, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: "Texto " + atrib[i][1] });
  }
  s.addText("Nem inteligente, nem contrato no sentido jurídico: é um programa determinístico.", { x: 0.5, y: 4.55, w: 4.8, h: 0.55, fontSize: 14, italic: true, color: HEX.cinza, valign: "top", margin: 0, isTextBox: true, objectName: "Observação" });
  nota(s, `
QUEM FALA: Alan. TEMPO: 1 minuto e meio.
A ideia veio de Nick Szabo (anos 1990), mas ficou prática com o Ethereum (proposto por Vitalik Buterin em 2013, no ar em 2015). O Bitcoin tem scripts limitados; o Ethereum tem uma máquina virtual (EVM) que roda programas completos.
Um contrato é um programa que mora num endereço da blockchain. Ele tem código e estado (variáveis guardadas). Ele só roda quando recebe uma transação.
Três consequências: o código é a regra (não depende de um funcionário aplicar), todos os nós executam e conferem o mesmo resultado, e depois de publicado não se edita.
O nome é enganoso: não é "inteligente" e não é um contrato jurídico. Quem entrega valor jurídico é a lei, não o código.`);

  // ---- 10. Ciclo de uma transação ----
  s = novoSlide("CLARO", P2, "Da carteira ao bloco", 2);
  const etapas = [
    ["1", "Carteira assina", "A chave privada assina a transação."],
    ["2", "Nó propaga", "A transação espera na fila (mempool)."],
    ["3", "Validador monta o bloco", "Escolhe transações e propõe o bloco."],
    ["4", "Todos reexecutam", "Cada nó roda o contrato e confere."],
    ["5", "Estado atualizado", "Resultado e eventos ficam gravados."],
  ];
  etapas.forEach(([n, t, d], i) => {
    const x = 0.5 + i * 1.82;
    s.addShape(S.roundRect, { x, y: 1.55, w: 1.62, h: 2.15, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Etapa " + n });
    s.addShape(S.ellipse, { x: x + 0.52, y: 1.7, w: 0.55, h: 0.55, fill: { color: HEX.indigo }, line: { color: HEX.indigo, width: 0 }, objectName: "Círculo etapa " + n });
    s.addText(n, { x: x + 0.52, y: 1.7, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Número etapa " + n });
    s.addText(t, { x: x + 0.1, y: 2.35, w: 1.42, h: 0.55, fontSize: 14, bold: true, color: C.text1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Título etapa " + n });
    s.addText(d, { x: x + 0.1, y: 2.9, w: 1.42, h: 0.75, fontSize: 12, color: C.text2, align: "center", valign: "top", margin: 0, isTextBox: true, objectName: "Texto etapa " + n });
    if (i < 4) linha(s, x + 1.62, 2.62, x + 1.82, 2.62, { cor: HEX.indigo, larg: 2, seta: true });
  });
  s.addShape(S.roundRect, { x: 0.5, y: 4.0, w: 9.0, h: 0.95, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.ambar, width: 1.5 }, objectName: "Caixa do gas" });
  s.addText([
    { text: "Gas: ", options: { bold: true, color: HEX.laranja } },
    { text: "cada operação do contrato tem um preço. Quem envia a transação paga, e isso impede laços infinitos e spam na rede." },
  ], { x: 0.7, y: 4.0, w: 8.6, h: 0.95, fontSize: 14, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto do gas" });
  nota(s, `
QUEM FALA: Alan. TEMPO: 1 minuto e meio.
Seguir a transação passo a passo.
1) A carteira assina com a chave privada. Quem tem a chave controla a conta; não existe "esqueci a senha".
2) Um nó recebe e repassa; a transação fica na fila (mempool).
3) O validador (ou minerador) escolhe transações e monta o bloco.
4) Todos os nós reexecutam as transações do bloco e conferem se chegam ao mesmo estado. É por isso que o código precisa ser determinístico (sem aleatório local, sem horário do computador).
5) O estado novo e os eventos ficam gravados.
Gas: unidade de custo de computação. Impede loops infinitos e dá incentivo econômico a quem valida. Se o gas acaba no meio, a transação é revertida e o gás gasto não volta.`);

  // ---- 11. Gas, limites e imutabilidade ----
  s = novoSlide("CLARO", P2, "Custo e limites na prática", 2);
  const stats = [
    ["810 mil", "gas para publicar o contrato de votação", "Medido na demo (Hardhat, solc 0.8.28)", HEX.indigo],
    ["55 a 72 mil", "gas por voto", "O primeiro voto em cada opção custa mais: o contador sai de zero", HEX.indigo],
    ["2016", "The DAO: um bug, cerca de 3,6 milhões de ETH desviados", "Código publicado não se corrige; a rede teve de fazer um hard fork", HEX.vermelho],
  ];
  stats.forEach(([g, d, f, cor], i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(S.roundRect, { x, y: 1.4, w: 2.9, h: 3.45, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão " + g });
    s.addText(g, { x: x + 0.15, y: 1.55, w: 2.6, h: 0.9, fontSize: 36, bold: true, color: cor, fontFace: THEME.headFontFace, align: "left", valign: "middle", margin: 0, fit: "shrink", isTextBox: true, objectName: "Número " + g });
    s.addText(d, { x: x + 0.15, y: 2.5, w: 2.6, h: 1.0, fontSize: 16, bold: true, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Descrição " + g });
    s.addText(f, { x: x + 0.15, y: 3.65, w: 2.6, h: 1.05, fontSize: 13, color: C.text2, valign: "top", margin: 0, isTextBox: true, objectName: "Nota " + g });
  });
  nota(s, `
QUEM FALA: Alan. TEMPO: 1 minuto.
Os dois primeiros números vêm da própria demonstração (rodada em 15/11/2026): publicar o contrato custou 810.488 gas; cada voto custou entre 55 mil e 72 mil. A diferença entre votos acontece porque gravar um valor novo na memória do contrato (de zero para diferente de zero) custa mais que atualizar um valor que já existe. Na demo, Ana e Caio votaram em opções ainda sem votos (cerca de 72 mil gas) e Bia votou numa opção que já tinha um voto (cerca de 55 mil).
Em rede pública, o gas é pago em ETH, então esses números viram dinheiro (o Klaus mostra isso na Parte 3).
O terceiro cartão é o caso clássico: The DAO, 2016, um fundo de investimento feito de contratos. Um bug de reentrância permitiu a um atacante sacar repetidamente antes que o saldo fosse atualizado. Cerca de 3,6 milhões de ETH foram desviados. Como o contrato é imutável, a comunidade do Ethereum decidiu fazer um hard fork para devolver o dinheiro; quem discordou manteve a cadeia antiga, que virou o Ethereum Classic.
Mensagem: o que dá segurança (imutabilidade) é também o que impede de corrigir um erro.`);

  // ---- 12. Arquitetura de um DApp ----
  s = novoSlide("CLARO", P2, "Arquitetura de um DApp", 2);
  const caixas = [["Usuário", "navegador"], ["Front-end", "HTML, JS, ethers.js"], ["Carteira", "MetaMask assina"], ["Nó RPC", "Alchemy, Infura ou nó próprio"], ["Contrato", "na blockchain"]];
  caixas.forEach(([t, d], i) => {
    const x = 0.5 + i * 1.82;
    const dest = i === 4;
    s.addShape(S.roundRect, { x, y: 1.5, w: 1.58, h: 1.25, rectRadius: 0.08, fill: { color: dest ? HEX.indigo : C.background2 }, line: { color: HEX.indigo, width: 1.5 }, objectName: "Componente " + t });
    s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { x: x + 0.05, y: 1.5, w: 1.48, h: 1.25, color: dest ? C.background1 : C.text1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Texto " + t });
    if (i < 4) linha(s, x + 1.58, 2.12, x + 1.82, 2.12, { cor: HEX.indigo, larg: 2, seta: true });
  });
  s.addText("Fora da cadeia (off-chain)", { x: 0.5, y: 3.15, w: 9.0, h: 0.35, fontSize: 16, bold: true, color: HEX.laranja, margin: 0, isTextBox: true, objectName: "Título off-chain" });
  [["Arquivos grandes", "IPFS, armazenamento externo. Na cadeia fica só o hash."], ["Oráculos", "Levam dados do mundo real (preço, clima) para dentro do contrato."], ["Indexadores", "Organizam eventos para consulta rápida (por exemplo, The Graph)."]].forEach(([t, d], i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(S.roundRect, { x, y: 3.6, w: 2.9, h: 1.4, rectRadius: 0.08, fill: { color: C.background1 }, line: { color: HEX.laranja, width: 1.25, dashType: "dash" }, objectName: "Off-chain " + t });
    s.addText([{ text: t, options: { bold: true, fontSize: 14, breakLine: true } }, { text: d, options: { fontSize: 13, color: C.text2 } }], { x: x + 0.12, y: 3.65, w: 2.66, h: 1.3, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto off-chain " + t });
  });
  nota(s, `
QUEM FALA: Alan. TEMPO: 1 minuto e meio.
DApp é uma aplicação com o back-end (a lógica e os dados que importam) no contrato. A parte visual continua sendo uma página web comum.
Fluxo: o usuário abre o front-end, que usa uma biblioteca (ethers.js ou web3.js) para falar com a carteira (MetaMask) e com um nó da rede por RPC. A carteira assina; o nó envia; o contrato executa.
Ninguém roda nó próprio na maioria dos DApps: usam provedores como Alchemy ou Infura. Isso é uma recentralização escondida que vale citar: o "descentralizado" muitas vezes depende de poucos provedores.
Na parte de baixo, o que NÃO fica na cadeia: arquivos grandes (guardar na cadeia é caro, então se usa IPFS e grava só o hash), oráculos (a blockchain não enxerga o mundo externo sozinha) e indexadores (consultar histórico direto na cadeia é lento).
Na nossa demonstração o front-end é uma única página HTML (dapp/index.html) que conversa com o nó local.`);

  // ---- 13. Web2 x Web3 ----
  s = novoSlide("CLARO", P2, "Web2 x Web3", 2);
  const th = (t, cor) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: cor }, align: "center", valign: "middle" } });
  s.addTable([
    [{ text: "", options: { fill: { color: C.background1 } } }, th("Web2 (aplicação tradicional)", HEX.cinza), th("Web3 (DApp)", HEX.indigo)],
    [cel("Regras do negócio", { bold: true }), cel("Servidor da empresa"), cel("Contrato na blockchain")],
    [cel("Dados", { bold: true }), cel("Banco da empresa"), cel("Cadeia pública, com arquivos fora dela")],
    [cel("Identidade", { bold: true }), cel("Conta, e-mail e senha"), cel("Carteira e chave privada")],
    [cel("Quem muda as regras", { bold: true }), cel("A empresa, quando quiser"), cel("Ninguém, ou votação dos usuários")],
    [cel("Custo por operação", { bold: true }), cel("Infraestrutura da empresa"), cel("Gas, pago por quem usa")],
    [cel("Recuperar acesso", { bold: true }), cel("Redefinir senha"), cel("Perdeu a chave, perdeu a conta")],
  ], { x: 0.5, y: 1.4, w: 9.0, colW: [2.4, 3.3, 3.3], rowH: 0.52, fontSize: 14, border: { type: "solid", pt: 1, color: HEX.linha }, fill: { color: C.background2 }, margin: [0.04, 0.1, 0.04, 0.1], objectName: "Tabela Web2 x Web3" });
  nota(s, `
QUEM FALA: Alan. TEMPO: 1 minuto.
Comparação direta. O que muda não é a interface, é quem manda nos dados e nas regras.
Pontos fortes do Web3: sem dono único, regras públicas e auditáveis, o usuário controla o próprio ativo.
Pontos fracos, que a Parte 3 aprofunda: custo por operação, desempenho, e responsabilidade total do usuário. Perdeu a chave privada, perdeu o acesso, e não há suporte para recuperar.
"Web3" é um termo de marketing em disputa (Gavin Wood cunhou em 2014; críticos dizem que a web continua centralizada em provedores). Usamos aqui como "aplicações sobre blockchain".`);

  // ---- 14. Demo 2 ----
  s = novoSlide("ESCURO", P2, "Demo 2: contrato em rede local", 2);
  s.addShape(S.roundRect, { x: 0.5, y: 1.35, w: 5.0, h: 2.75, rectRadius: 0.08, fill: { color: C.text2 }, line: { color: HEX.cinza, width: 1 }, objectName: "Código" });
  s.addText([
    { text: "function votar(uint256 opcao) external {", options: { breakLine: true } },
    { text: "  if (!aberta) revert VotacaoFechada();", options: { breakLine: true } },
    { text: "  if (jaVotou[msg.sender]) revert JaVotou();", options: { breakLine: true } },
    { text: "  if (opcao >= opcoes.length)", options: { breakLine: true } },
    { text: "      revert OpcaoInvalida();", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "  jaVotou[msg.sender] = true;", options: { breakLine: true } },
    { text: "  votos[opcao] += 1;", options: { breakLine: true } },
    { text: "  emit VotoRegistrado(msg.sender, opcao);", options: { breakLine: true } },
    { text: "}", options: {} },
  ], { x: 0.65, y: 1.5, w: 4.7, h: 2.5, fontSize: 12, fontFace: MONO, color: "E6EBF2", valign: "top", margin: 0, isTextBox: true, objectName: "Código Solidity" });
  s.addText("Passo a passo", { x: 5.8, y: 1.35, w: 3.7, h: 0.35, fontSize: 16, bold: true, color: HEX.ambar, margin: 0, isTextBox: true, objectName: "Título passos" });
  [["Terminal 1", "npx hardhat node"], ["Terminal 2", "npx hardhat run scripts/demo.js --network localhost"], ["Navegador", "dapp/index.html (DApp)"], ["Testes", "npx hardhat test"]].forEach(([t, c], i) => {
    const y = 1.8 + i * 0.8;
    s.addText(t, { x: 5.8, y, w: 3.7, h: 0.28, fontSize: 12, color: "9AA3B2", margin: 0, isTextBox: true, objectName: "Rótulo " + t });
    s.addText(c, { x: 5.8, y: y + 0.27, w: 3.7, h: 0.45, fontSize: 12, fontFace: MONO, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: "Comando " + t });
  });
  nota(s, `
QUEM FALA: Alan. TEMPO: 3 a 4 minutos de demonstração ao vivo.
Preparação ANTES da aula: abrir 3 terminais na pasta demo-hardhat (npm install já feito), rodar uma vez "npx hardhat test" para baixar o compilador, deixar o Terminal 1 com "npx hardhat node" pronto.
Roteiro:
1) Mostrar o código do contrato (arquivo contracts/Votacao.sol). Explicar as três regras: só vota quem não votou, só em opção existente, e só com a votação aberta. msg.sender é quem assinou a transação. O evento VotoRegistrado é o registro público.
2) Terminal 1: "npx hardhat node". Mostrar que sobe uma blockchain local com 20 contas de 10.000 ETH de teste. Dizer que as chaves dessas contas são públicas, só servem para teste.
3) Terminal 2: "npx hardhat run scripts/demo.js --network localhost". Acompanhar a saída: deploy, três votos com número de bloco e gas, tentativas de burlar (voto repetido, opção inválida, não-dono encerrando) sendo recusadas pelo contrato, resultado e eventos.
4) Opcional (30 segundos): publicar com scripts/publicar.js, abrir dapp/index.html por "python3 -m http.server 3000" na pasta dapp e votar pela página.
Plano B: ter prints da saída do demo.js e o vídeo/gif gravado.
Por que Hardhat e não Ganache: a planilha cita os dois. Ganache foi descontinuado pela Consensys em setembro de 2023 e o repositório foi arquivado; a própria Consensys recomendou migrar para o Hardhat. Por isso usamos Hardhat.`);

  // ---- 15. O que a demo mostrou ----
  s = novoSlide("CLARO", P2, "O que a demonstração mostrou", 2);
  const achados = [
    ["FaGavel", "Regras aplicadas pelo código", "Voto repetido, opção inválida e encerramento por quem não é dono foram recusados com erros do próprio contrato."],
    ["FaListAlt", "Registro público", "Cada voto virou um evento com endereço, opção e número do bloco."],
    ["FaCoins", "Custo mensurável", "Cada operação gastou gas, de 810 mil (deploy) a 55 mil (voto)."],
    ["FaBan", "Sem editar, sem apagar", "Corrigir um voto só com uma nova transação, que também fica registrada."],
  ];
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.4 + row * 1.75;
    s.addShape(S.roundRect, { x, y, w: 4.4, h: 1.55, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão " + achados[i][1] });
    await iconeEmCirculo(s, achados[i][0], x + 0.2, y + 0.2, 0.6, HEX.indigo, "Ícone " + achados[i][1]);
    s.addText(achados[i][1], { x: x + 1.0, y: y + 0.15, w: 3.25, h: 0.4, fontSize: 16, bold: true, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Título " + achados[i][1] });
    s.addText(achados[i][2], { x: x + 1.0, y: y + 0.6, w: 3.25, h: 0.9, fontSize: 13, color: C.text2, valign: "top", margin: 0, isTextBox: true, objectName: "Texto " + achados[i][1] });
  }
  nota(s, `
QUEM FALA: Alan. TEMPO: 1 minuto.
Amarrar a demonstração à teoria.
Regras no código: ninguém precisou "fiscalizar" o voto. As regras foram aplicadas pela rede, igual para todos.
Registro público: os eventos são o que permite auditar. Qualquer pessoa pode listar todos os votos e conferir o resultado.
Custo: tudo que gravamos custou gas. Em rede pública isso seria dinheiro.
Imutabilidade: não existe comando de editar ou apagar. Isso é ótimo para auditoria, e é um problema para dados pessoais (Klaus fala disso agora).
Passar a palavra ao Klaus.`);

  // ================= PARTE 3 =================
  pres.addSection({ title: "Parte 3 · Quando não usar e trade-offs" });
  const P3 = "Parte 3 · Quando não usar e trade-offs";

  // ---- 16. Fluxograma ----
  s = novoSlide("CLARO", P3, "Preciso mesmo de uma blockchain?", 3);
  const perguntas = ["Preciso guardar dados compartilhados?", "Vários participantes precisam escrever?", "Eles não confiam uns nos outros?", "Não há intermediário confiável?"];
  const saidas = ["Banco de dados comum", "Banco de dados comum", "Banco compartilhado com permissões", "Banco com auditoria e assinatura"];
  const PY = (i) => 1.3 + i * 0.78, PH = 0.55;
  perguntas.forEach((q, i) => {
    const y = PY(i);
    s.addShape(S.roundRect, { x: 0.5, y, w: 4.4, h: PH, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.laranja, width: 1.5 }, objectName: "Pergunta " + (i + 1) });
    s.addText(perguntas[i], { x: 0.6, y, w: 4.2, h: PH, fontSize: 14, bold: true, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto pergunta " + (i + 1) });
    linha(s, 4.9, y + PH / 2, 5.8, y + PH / 2, { cor: HEX.cinza, larg: 1.5, seta: true });
    s.addText("não", { x: 5.0, y: y - 0.02, w: 0.7, h: 0.26, fontSize: 12, bold: true, color: HEX.cinza, margin: 0, align: "center", isTextBox: true, objectName: "Rótulo não " + (i + 1) });
    s.addShape(S.roundRect, { x: 5.8, y, w: 3.7, h: PH, rectRadius: 0.08, fill: { color: C.background1 }, line: { color: HEX.cinza, width: 1.25 }, objectName: "Saída " + (i + 1) });
    s.addText(saidas[i], { x: 5.9, y, w: 3.5, h: PH, fontSize: 14, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto saída " + (i + 1) });
    linha(s, 2.7, y + PH, 2.7, PY(i + 1), { cor: HEX.verde, larg: 1.5, seta: true });
    s.addText("sim", { x: 2.82, y: y + PH - 0.01, w: 0.6, h: 0.25, fontSize: 12, bold: true, color: HEX.verde, margin: 0, isTextBox: true, objectName: "Rótulo sim " + (i + 1) });
  });
  s.addShape(S.roundRect, { x: 0.5, y: PY(4), w: 4.4, h: PH, rectRadius: 0.08, fill: { color: HEX.verde }, line: { color: HEX.verde, width: 0 }, objectName: "Resultado blockchain" });
  s.addText("Pode fazer sentido usar blockchain", { x: 0.6, y: PY(4), w: 4.2, h: PH, fontSize: 14, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto resultado blockchain" });
  s.addText("Mesmo com \"sim\" em tudo, confira privacidade, custo e desempenho.", { x: 5.8, y: PY(4), w: 3.7, h: PH, fontSize: 12, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: "Aviso final" });
  fonte(s, "Adaptado de Wüst e Gervais, \"Do you need a blockchain?\", IEEE CVCBT, 2018.");
  nota(s, `
QUEM FALA: Klaus. TEMPO: 1 minuto e meio.
Este é o slide mais importante da Parte 3. Versão simplificada do fluxo de decisão de Wüst e Gervais (2018): antes de escolher blockchain, responda em sequência.
1) Preciso guardar dados compartilhados? Se não, nem precisa de nada disso.
2) Vários participantes precisam escrever? Se só um escreve, um banco de dados comum resolve.
3) Eles não confiam uns nos outros? Se confiam, um banco compartilhado com permissões resolve.
4) Não existe um intermediário em quem todos confiem (um órgão, um cartório, um consórcio)? Se existe, um banco com auditoria e assinatura digital resolve.
Só quem responde "sim" a tudo chega ao quadrado verde. E ainda assim é preciso avaliar privacidade, custo e desempenho (próximos slides).
Frase de efeito aceitável: "se você consegue desenhar uma caixa chamada 'servidor confiável' na sua arquitetura, provavelmente não precisa de blockchain".`);

  // ---- 17. Quando NÃO usar ----
  s = novoSlide("CLARO", P3, "Quando não usar blockchain", 3);
  const nao = [
    ["FaUserTie", "Um só dono dos dados", "Se uma entidade manda em tudo, o consenso só adiciona custo."],
    ["FaEraser", "Dados pessoais (LGPD)", "A lei prevê eliminação de dados. Registro imutável não elimina."],
    ["FaTachometerAlt", "Alto volume e baixa latência", "Redes públicas processam dezenas de transações por segundo."],
    ["FaSyncAlt", "Dados que mudam toda hora", "Cada alteração vira uma transação paga e registrada."],
    ["FaDollarSign", "Custo por operação inviável", "Gas ou infraestrutura de consenso pesam no orçamento."],
    ["FaUsers", "Sem equipe para operar", "Chaves, contratos e nós exigem prática e cuidado."],
  ];
  for (let i = 0; i < 6; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * 3.1, y = 1.4 + row * 1.85;
    s.addShape(S.roundRect, { x, y, w: 2.9, h: 1.7, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão " + nao[i][1] });
    await iconeEmCirculo(s, nao[i][0], x + 0.15, y + 0.15, 0.5, HEX.laranja, "Ícone " + nao[i][1]);
    s.addText(nao[i][1], { x: x + 0.75, y: y + 0.12, w: 2.05, h: 0.56, fontSize: 14, bold: true, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Título " + nao[i][1] });
    s.addText(nao[i][2], { x: x + 0.15, y: y + 0.8, w: 2.6, h: 0.85, fontSize: 13, color: C.text2, valign: "top", margin: 0, isTextBox: true, objectName: "Texto " + nao[i][1] });
  }
  nota(s, `
QUEM FALA: Klaus. TEMPO: 1 minuto e meio.
Seis situações em que blockchain costuma ser a escolha errada.
1) Um só dono dos dados: o consenso distribuído só faz sentido se há partes que não confiam entre si.
2) Dados pessoais: a LGPD (Lei 13.709/2018, art. 18) garante ao titular a eliminação de dados. Gravar dado pessoal direto numa cadeia pública imutável conflita com isso. Alternativa comum: guardar o dado fora da cadeia e só o hash dentro (mas mesmo o hash de dado pessoal pode ser considerado dado pessoal, é uma zona cinzenta jurídica; dizer isso com cautela).
3) Alto volume e baixa latência: o Bitcoin processa algo da ordem de 7 transações por segundo; o Ethereum na camada 1, dezenas. Redes permissionadas e camadas 2 aliviam, mas com outras concessões.
4) Dados que mudam toda hora: cada alteração é uma transação.
5) Custo: gas em rede pública; infraestrutura e governança em rede privada.
6) Equipe: operar chaves e contratos exige disciplina. Um erro de chave ou de código é irreversível.`);

  // ---- 18. Trilema e números ----
  s = novoSlide("CLARO", P3, "Trade-offs: o trilema", 3);
  // triângulo
  s.addShape(S.triangle, { x: 0.9, y: 1.6, w: 3.6, h: 3.0, fill: { color: C.background2 }, line: { color: HEX.laranja, width: 2 }, objectName: "Triângulo do trilema" });
  s.addText("Escalabilidade", { x: 1.6, y: 1.35, w: 2.2, h: 0.3, fontSize: 14, bold: true, color: C.text1, align: "center", margin: 0, isTextBox: true, objectName: "Vértice escalabilidade" });
  s.addText("Descentralização", { x: 0.2, y: 4.62, w: 2.2, h: 0.3, fontSize: 14, bold: true, color: C.text1, align: "center", margin: 0, isTextBox: true, objectName: "Vértice descentralização" });
  s.addText("Segurança", { x: 3.0, y: 4.62, w: 2.0, h: 0.3, fontSize: 14, bold: true, color: C.text1, align: "center", margin: 0, isTextBox: true, objectName: "Vértice segurança" });
  s.addText("Redes simples tendem a entregar duas das três", { x: 1.55, y: 3.3, w: 2.3, h: 0.8, fontSize: 12, italic: true, color: C.text2, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Legenda trilema" });
  // números
  s.addText("Ordem de grandeza", { x: 5.4, y: 1.4, w: 4.1, h: 0.35, fontSize: 16, bold: true, color: HEX.laranja, margin: 0, isTextBox: true, objectName: "Título ordens" });
  [["Bitcoin", "cerca de 7 transações por segundo", "bloco a cada ~10 minutos"], ["Ethereum (camada 1)", "dezenas de transações por segundo", "bloco a cada 12 segundos"], ["Banco de dados comum", "milhares de gravações por segundo", "confirmação em milissegundos"]].forEach(([t, a, b], i) => {
    const y = 1.85 + i * 1.05;
    s.addShape(S.roundRect, { x: 5.4, y, w: 4.1, h: 0.92, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão " + t });
    s.addText([{ text: t, options: { bold: true, fontSize: 14, breakLine: true } }, { text: a, options: { fontSize: 13, breakLine: true } }, { text: b, options: { fontSize: 13, color: C.text2 } }], { x: 5.55, y, w: 3.85, h: 0.92, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto " + t });
  });
  fonte(s, "Valores aproximados e variam com a época. Camadas 2 (rollups) aumentam a vazão com outras concessões.");
  nota(s, `
QUEM FALA: Klaus. TEMPO: 1 minuto e meio.
O trilema (termo popularizado por Vitalik Buterin): é difícil ter ao mesmo tempo descentralização, segurança e escalabilidade. Se você aumenta o tamanho do bloco para processar mais transações, exige nós mais potentes, e menos gente consegue rodar um nó (perde descentralização).
Ordens de grandeza: Bitcoin cerca de 7 tx/s, bloco a cada 10 minutos. Ethereum na camada 1, dezenas de tx/s, bloco a cada 12 segundos. Bancos de dados comuns, milhares por segundo. Não precisa decorar o número exato; a diferença é de ordens de grandeza.
Soluções: camadas 2 (rollups) agrupam muitas transações e gravam um resumo na camada 1; redes permissionadas aceitam menos descentralização em troca de velocidade.
Fonte do número: documentação do Bitcoin e do Ethereum; os valores variam com atualizações. Se o professor perguntar o número exato, dizer que é aproximado.`);

  // ---- 19. Demo 3 ----
  s = novoSlide("ESCURO", P3, "Demo 3: banco x blockchain", 3);
  s.addChart(pres.charts.BAR, [{ name: "Votos por segundo", labels: ["SQLite (em disco)", "Blockchain local"], values: [3261, 507] }], {
    x: 0.5, y: 1.35, w: 5.0, h: 3.5, barDir: "col", chartColors: [HEX.teal, HEX.laranja],
    showTitle: true, title: "Gravações por segundo (200 votos)", titleColor: "FFFFFF", titleFontSize: 14, titleFontFace: "+mn-lt",
    showValue: true, dataLabelColor: "FFFFFF", dataLabelFontSize: 14, dataLabelFontFace: "+mn-lt", dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0",
    catAxisLabelColor: "E6EBF2", catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelColor: "9AA3B2", valAxisLabelFontSize: 11, valAxisLabelFontFace: "+mn-lt", valAxisLabelFormatCode: "#,##0",
    valGridLine: { color: "3A4256", size: 0.75 }, catGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 4000,
  });
  s.addShape(S.roundRect, { x: 5.8, y: 1.35, w: 3.7, h: 3.5, rectRadius: 0.08, fill: { color: C.text2 }, line: { color: HEX.cinza, width: 1 }, objectName: "Terminal" });
  s.addText([
    { text: "$ npx hardhat run scripts/benchmark.js", options: { color: HEX.ambar, breakLine: true, fontSize: 11 } },
    { text: "", options: { breakLine: true } },
    { text: "Custo por voto: ~55.461 gas", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Rede pública (exemplo):", options: { color: "C9D1DE", breakLine: true } },
    { text: "5 gwei, 1 ETH = R$ 15.000", options: { color: "C9D1DE", breakLine: true } },
    { text: "1 voto  = R$ 4,16", options: { color: "FFB4B4", bold: true, breakLine: true } },
    { text: "200 votos = R$ 831,92", options: { color: "FFB4B4", bold: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Banco de dados: R$ 0,00 por voto", options: { color: "7EE2A8" } },
  ], { x: 5.95, y: 1.45, w: 3.4, h: 3.3, fontSize: 12, fontFace: MONO, color: C.background1, valign: "top", margin: 0, isTextBox: true, objectName: "Saída do benchmark" });
  fonte(s, "Medido no Mac do Alan, em 15/11/2026; refaça na sua máquina. Rede local = melhor caso. Preço do gas e do ETH são exemplos.", true);
  nota(s, `
QUEM FALA: Klaus. TEMPO: 2 minutos de demonstração ao vivo.
Rodar na pasta demo-hardhat: npx hardhat run scripts/benchmark.js (não precisa do nó aberto, usa a rede simulada embutida). Variáveis opcionais: N=500, GWEI=10, ETH_REAIS=<cotação do dia>.
O script grava N votos em dois lugares: um banco SQLite em arquivo (um INSERT por vez, para ser justo) e o contrato Votacao numa blockchain local (uma transação por voto).
Resultado da nossa execução (15/11/2026, 200 votos): SQLite cerca de 3.261 votos/s; blockchain local cerca de 507 votos/s. Os números mudam a cada execução e em cada máquina, então REFAZER antes da apresentação e atualizar o slide se der muito diferente.
ATENÇÃO para não exagerar: a rede local é o melhor caso possível (um nó só, mineração instantânea, sem rede, sem consenso). Numa rede pública cada voto espera um bloco (12 s no Ethereum) e custa gas.
Custo: o script pega o gas médio por voto (~55 mil) e multiplica por um preço de gas e uma cotação do ETH que são EXEMPLOS. Hoje o gas na camada 1 do Ethereum costuma ser bem baixo; ajustar os valores com o preço do dia antes de apresentar e dizer que é estimativa.
Mensagem: o banco de dados faz o mesmo trabalho mais rápido e de graça. Blockchain só se paga quando o ganho de não precisar de um intermediário confiável compensa isso.`);

  // ---- 20. Casos reais ----
  s = novoSlide("CLARO", P3, "Casos reais", 3);
  const casos = [
    ["Bitcoin", "Funcionou", HEX.verde, "Dinheiro digital sem intermediário, numa rede aberta e sem dono. Aqui a descentralização é o objetivo."],
    ["The DAO (2016)", "Falha de código", HEX.vermelho, "Bug de reentrância desviou cerca de 3,6 milhões de ETH. A rede se dividiu em Ethereum e Ethereum Classic."],
    ["Ronin Bridge (2022)", "Falha de operação", HEX.vermelho, "Chaves de validadores comprometidas. Perda de mais de US$ 600 milhões. O problema foi a segurança das chaves."],
    ["Drex (Brasil)", "Mudou de rumo", HEX.ambar, "Piloto da fase 1 usou Hyperledger Besu. Em 2025 o Banco Central tirou a DLT da fase seguinte, citando privacidade."],
  ];
  casos.forEach(([t, tag, cor, d], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.4 + row * 1.8;
    s.addShape(S.roundRect, { x, y, w: 4.4, h: 1.65, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Cartão " + t });
    s.addText(t, { x: x + 0.2, y: y + 0.12, w: 2.6, h: 0.4, fontSize: 16, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true, objectName: "Título " + t });
    s.addShape(S.roundRect, { x: x + 2.75, y: y + 0.17, w: 1.5, h: 0.3, rectRadius: 0.15, fill: { color: cor }, line: { color: cor, width: 0 }, objectName: "Etiqueta " + t });
    s.addText(tag, { x: x + 2.75, y: y + 0.17, w: 1.5, h: 0.3, fontSize: 11, bold: true, color: cor === HEX.ambar ? HEX.tinta : C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Texto etiqueta " + t });
    s.addText(d, { x: x + 0.2, y: y + 0.6, w: 4.0, h: 1.0, fontSize: 13, color: C.text2, valign: "top", margin: 0, isTextBox: true, objectName: "Texto " + t });
  });
  fonte(s, "Fontes: Relatório do Piloto Drex, fase 1 (Banco Central do Brasil); imprensa especializada sobre a fase seguinte (ago/2025).");
  nota(s, `
QUEM FALA: Klaus. TEMPO: 1 minuto e meio.
Quatro casos para mostrar que a pergunta "preciso de blockchain?" tem respostas diferentes.
Bitcoin: o caso em que a descentralização é o produto. Funciona porque o problema (dinheiro sem autoridade central) exige exatamente isso.
The DAO (2016): vimos na Parte 2. Lição: contrato imutável com bug é um risco financeiro real. Hoje existe auditoria de contratos e ferramentas de análise, mas incidentes continuam.
Ronin Bridge (março de 2022): a ponte entre redes usada por um jogo foi esvaziada depois que atacantes controlaram a maioria das chaves de validadores (5 de 9). Não foi falha da blockchain em si, foi de operação e de centralização das chaves. Perda de mais de 600 milhões de dólares.
Drex: o real digital brasileiro. O piloto da fase 1 (2023 e 2024) usou Hyperledger Besu com instituições financeiras. Em agosto de 2025 o Banco Central anunciou que a próxima fase não usaria DLT (o foco passou a ser conciliação de gravames), em parte pelas exigências de privacidade nas operações. As notícias posteriores divergem sobre o cronograma, então dizer "até onde sabemos" e que o assunto está em mudança.
Cuidado com datas e valores ao falar: citar como "aproximadamente".`);

  // ---- 21. Alternativas ----
  s = novoSlide("CLARO", P3, "Alternativas que já resolvem muito", 3);
  const alt = [
    ["FaDatabase", "Banco com trilha de auditoria", "Tabela só de inclusão, permissões estritas e cópias de segurança."],
    ["FaFileSignature", "Assinatura digital e carimbo de tempo", "Prova quem assinou e quando, sem rede de mineração."],
    ["FaTree", "Log transparente com árvore de Merkle", "Usado em Certificate Transparency: qualquer um verifica o histórico."],
    ["FaNetworkWired", "Banco distribuído com consenso por falha", "Raft em etcd e CockroachDB: replica dados entre servidores de um mesmo dono."],
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.4 + i * 0.9;
    s.addShape(S.roundRect, { x: 0.5, y, w: 9.0, h: 0.78, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.linha, width: 1 }, objectName: "Linha " + alt[i][1] });
    await iconeEmCirculo(s, alt[i][0], 0.65, y + 0.1, 0.58, HEX.laranja, "Ícone " + alt[i][1]);
    s.addText(alt[i][1], { x: 1.45, y, w: 3.4, h: 0.78, fontSize: 15, bold: true, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Título " + alt[i][1] });
    s.addText(alt[i][2], { x: 4.95, y, w: 4.4, h: 0.78, fontSize: 13, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: "Texto " + alt[i][1] });
  }
  nota(s, `
QUEM FALA: Klaus. TEMPO: 1 minuto.
Arquitetura descentralizada não é sinônimo de blockchain. Quatro alternativas que atendem muitos casos:
1) Banco de dados com trilha de auditoria: tabela só de inclusão, permissões, backup. Para a maioria dos sistemas corporativos, é suficiente.
2) Assinatura digital com carimbo de tempo: prova autoria e data sem precisar de rede.
3) Log transparente baseado em árvore de Merkle: é o que o Certificate Transparency faz com certificados TLS. Dá verificação pública sem mineração e sem moeda.
4) Bancos distribuídos com consenso tolerante a falhas (Raft, em etcd e CockroachDB): replicam dados entre servidores de um mesmo dono, com alta disponibilidade. Tolera falha de nó, mas não tolera nó mentiroso (não é bizantino).
Mensagem: antes de escolher blockchain, tente o mais simples que resolve.`);

  // ---- 22. Conclusão ----
  pres.addSection({ title: "Encerramento" });
  s = pres.addSlide({ masterName: "ESCURO", sectionTitle: "Encerramento" });
  s.addText("Blockchain é uma ferramenta, não um padrão", { x: 0.6, y: 0.5, w: 8.8, h: 0.9, fontSize: 34, bold: true, color: C.background1, fontFace: THEME.headFontFace, margin: 0, valign: "middle", isTextBox: true, objectName: "Título da conclusão" });
  const conc = [
    ["1", "Resolve confiança", "Entre partes que não confiam umas nas outras e não querem um intermediário. É para isso que o consenso existe.", HEX.teal],
    ["2", "Cobra um preço", "Desempenho, dinheiro (gas), privacidade e a impossibilidade de corrigir erros por edição.", HEX.indigo],
    ["3", "Pergunte antes", "Preciso mesmo? Se um banco com auditoria resolve, é a melhor escolha.", HEX.laranja],
  ];
  conc.forEach(([n, t, d, cor], i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(S.roundRect, { x, y: 1.75, w: 2.9, h: 2.5, rectRadius: 0.1, fill: { color: C.text2 }, line: { color: cor, width: 1.5 }, objectName: "Conclusão " + n });
    s.addShape(S.ellipse, { x: x + 0.2, y: 1.95, w: 0.55, h: 0.55, fill: { color: cor }, line: { color: cor, width: 0 }, objectName: "Círculo " + n });
    s.addText(n, { x: x + 0.2, y: 1.95, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Número " + n });
    s.addText(t, { x: x + 0.9, y: 1.95, w: 1.9, h: 0.55, fontSize: 16, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true, objectName: "Título " + n });
    s.addText(d, { x: x + 0.2, y: 2.7, w: 2.5, h: 1.45, fontSize: 14, color: "E6EBF2", valign: "top", margin: 0, isTextBox: true, objectName: "Texto " + n });
  });
  s.addText("Perguntas?", { x: 0.6, y: 4.6, w: 4.0, h: 0.5, fontSize: 24, bold: true, color: HEX.ambar, margin: 0, valign: "middle", isTextBox: true, objectName: "Perguntas" });
  nota(s, `
QUEM FALA: Klaus (fechamento). TEMPO: 1 minuto.
Três mensagens para levar.
1) Blockchain resolve confiança entre partes que não confiam umas nas outras e não querem intermediário. O consenso existe para isso (Murilo).
2) Tem preço: desempenho, dinheiro, privacidade, e erros não se corrigem por edição (Alan e Klaus).
3) A pergunta certa vem antes: preciso mesmo? Se um banco com auditoria resolve, é a melhor escolha.
Abrir para perguntas (até 15 minutos). Cada um responde sobre a sua parte; ver o arquivo PERGUNTAS-PROVAVEIS.md.`);

  // ---- 23. Referências ----
  s = novoSlide("CLARO", "Encerramento", "Referências");
  s.addText([
    "NAKAMOTO, S. Bitcoin: a peer-to-peer electronic cash system. 2008. bitcoin.org/bitcoin.pdf",
    "BUTERIN, V. Ethereum white paper: a next-generation smart contract and decentralized application platform. 2013. ethereum.org/whitepaper",
    "LAMPORT, L.; SHOSTAK, R.; PEASE, M. The Byzantine generals problem. ACM TOPLAS, v. 4, n. 3, 1982.",
    "WÜST, K.; GERVAIS, A. Do you need a blockchain? IEEE Crypto Valley Conference on Blockchain Technology, 2018.",
    "ETHEREUM.ORG. Documentação para desenvolvedores: contratos inteligentes, gas, proof-of-stake. ethereum.org/developers",
    "HARDHAT. Documentação do Hardhat 3. hardhat.org/docs",
    "CONSENSYS. Sunset of Truffle and Ganache (set. 2023). consensys.io/blog",
    "BANCO CENTRAL DO BRASIL. Relatório do Piloto Drex, fase 1. bcb.gov.br",
    "BRASIL. Lei nº 13.709/2018 (LGPD), art. 18.",
  ].map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 5 } })), { x: 0.5, y: 1.3, w: 9.0, h: 3.8, fontSize: 13, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Lista de referências" });
  nota(s, `
Slide de referências. Conferir cada link antes de apresentar e ajustar ao padrão ABNT, se o professor pedir.`);

  await pres.writeFile({ fileName: SAIDA });
  if (SKILL) {
    const { applyTheme } = require(path.join(SKILL, "scripts", "apply_theme.js"));
    await applyTheme(SAIDA, THEME);
  }
  console.log("Gerado:", SAIDA);
})().catch((e) => { console.error(e); process.exit(1); });
