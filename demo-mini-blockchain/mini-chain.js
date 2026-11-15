// Mini blockchain didática, sem dependências (só o Node.js).
// Mostra: hash encadeado, prova de trabalho, validação da cadeia e o que acontece ao adulterar um bloco.
//   node mini-chain.js            (dificuldade 4, padrão)
//   DIFICULDADE=5 node mini-chain.js
import { createHash } from "node:crypto";

const DIFICULDADE = Number(process.env.DIFICULDADE ?? 4);
const prefixo = "0".repeat(DIFICULDADE);

const sha256 = (texto) => createHash("sha256").update(texto).digest("hex");

function calcularHash(b) {
  return sha256(`${b.indice}|${b.data}|${b.transacoes}|${b.hashAnterior}|${b.nonce}`);
}

function minerar(b) {
  const t0 = performance.now();
  b.nonce = 0;
  b.hash = calcularHash(b);
  while (!b.hash.startsWith(prefixo)) {
    b.nonce++;
    b.hash = calcularHash(b);
  }
  return { tentativas: b.nonce + 1, ms: performance.now() - t0 };
}

function novoBloco(indice, transacoes, hashAnterior) {
  return { indice, data: new Date().toISOString(), transacoes, hashAnterior, nonce: 0, hash: "" };
}

function cadeiaValida(cadeia) {
  for (let i = 0; i < cadeia.length; i++) {
    const b = cadeia[i];
    if (b.hash !== calcularHash(b)) return { ok: false, bloco: i, motivo: "o conteúdo não bate com o hash gravado" };
    if (!b.hash.startsWith(prefixo)) return { ok: false, bloco: i, motivo: "o hash não cumpre a prova de trabalho" };
    if (i > 0 && b.hashAnterior !== cadeia[i - 1].hash)
      return { ok: false, bloco: i, motivo: "o hash anterior não aponta para o bloco anterior" };
  }
  return { ok: true };
}

const titulo = (t) => console.log(`\n=== ${t} ===`);
const curto = (h) => `${h.slice(0, 10)}...${h.slice(-6)}`;
function mostrar(cadeia) {
  for (const b of cadeia) {
    console.log(
      `#${b.indice} | ${b.transacoes.padEnd(28)} | anterior ${curto(b.hashAnterior)} | hash ${curto(b.hash)} | nonce ${b.nonce}`,
    );
  }
}

titulo(`1. Minerando 4 blocos (dificuldade ${DIFICULDADE}: hash precisa começar com "${prefixo}")`);
const cadeia = [];
const transacoes = ["Gênesis", "Ana paga 10 a Bia", "Bia paga 4 a Caio", "Caio paga 1 a Ana"];
for (let i = 0; i < transacoes.length; i++) {
  const anterior = i === 0 ? "0".repeat(64) : cadeia[i - 1].hash;
  const bloco = novoBloco(i, transacoes[i], anterior);
  const { tentativas, ms } = minerar(bloco);
  cadeia.push(bloco);
  console.log(`bloco ${i} minerado: ${tentativas.toLocaleString("pt-BR")} tentativas em ${ms.toFixed(0)} ms`);
}

titulo("2. A cadeia");
mostrar(cadeia);
console.log("\nValidação:", cadeiaValida(cadeia));

titulo('3. Adulterando o bloco 1: "Ana paga 10 a Bia" vira "Ana paga 1000 a Bia"');
cadeia[1].transacoes = "Ana paga 1000 a Bia";
const r = cadeiaValida(cadeia);
console.log("Validação:", r);
console.log(`Detectado no bloco #${r.bloco}: ${r.motivo}.`);

titulo("4. O fraudador tenta esconder: refaz a prova de trabalho do bloco 1");
const refazer1 = minerar(cadeia[1]);
console.log(`bloco 1 re-minerado em ${refazer1.ms.toFixed(0)} ms, mas...`);
const r2 = cadeiaValida(cadeia);
console.log("Validação:", r2);
console.log(`Agora o bloco 2 acusa o erro: ${r2.motivo}.`);

titulo("5. Para fechar a fraude, ele precisa refazer TODOS os blocos seguintes");
let totalMs = refazer1.ms;
for (let i = 2; i < cadeia.length; i++) {
  cadeia[i].hashAnterior = cadeia[i - 1].hash;
  totalMs += minerar(cadeia[i]).ms;
}
console.log("Validação:", cadeiaValida(cadeia));
console.log(
  `Aqui foi rápido (${totalMs.toFixed(0)} ms) porque a rede é de brinquedo: 1 computador e 4 blocos.\n` +
    "Numa rede real, ele teria de refazer todos os blocos seguintes mais rápido do que o resto da rede\n" +
    "consegue minerar blocos novos (é o 'ataque de 51%').",
);
