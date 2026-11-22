// Comparativo de trade-offs: gravar N votos num banco SQLite x numa blockchain local.
// A rede local (Hardhat) minera na hora, então o tempo medido AQUI é o melhor caso possível.
// Numa rede de verdade, cada bloco leva segundos (Ethereum, ~12 s) ou minutos (Bitcoin, ~10 min).
//   npx hardhat run scripts/benchmark.js
import { network } from "hardhat";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const N = Number(process.env.N ?? 200);
// Valores ilustrativos para estimar custo. Ajuste antes de apresentar (veja o preço do gas do dia).
// Referência de 22/11/2026: gas médio ~0,2 gwei (Etherscan) e 1 ETH ~R$ 10.400; 1 gwei é um exemplo redondo.
const GWEI = Number(process.env.GWEI ?? 1);
const ETH_EM_REAIS = Number(process.env.ETH_REAIS ?? 10400);

const { ethers } = await network.getOrCreate();
const signers = await ethers.getSigners();

// --- Banco de dados tradicional ---
// Arquivo em disco e um INSERT por vez (cada um confirmado), para ser justo com "1 transação por voto".
const pasta = mkdtempSync(join(tmpdir(), "nup2-"));
const db = new DatabaseSync(join(pasta, "votos.db"));
db.exec("CREATE TABLE votos (eleitor TEXT PRIMARY KEY, opcao INTEGER)");
const ins = db.prepare("INSERT INTO votos (eleitor, opcao) VALUES (?, ?)");
let t0 = performance.now();
for (let i = 0; i < N; i++) ins.run(`eleitor-${i}`, i % 3);
const tBanco = performance.now() - t0;
db.close();
rmSync(pasta, { recursive: true, force: true });

// --- Blockchain local (uma transação por voto, como no mundo real) ---
const votacao = await ethers.deployContract("Votacao", ["Benchmark", ["A", "B", "C"]]);
const carteiras = [];
for (let i = 0; i < N; i++) {
  const w = ethers.Wallet.createRandom().connect(ethers.provider);
  // 100 ETH de mentira, só existe na rede de teste
  await ethers.provider.send("hardhat_setBalance", [w.address, "0x56BC75E2D63100000"]);
  carteiras.push(w);
}
let gasTotal = 0n;
t0 = performance.now();
for (let i = 0; i < N; i++) {
  const r = await (await votacao.connect(carteiras[i]).votar(i % 3)).wait();
  gasTotal += r.gasUsed;
}
const tChain = performance.now() - t0;

const gasMedio = Number(gasTotal) / N;
const custoEth = (gasMedio * GWEI) / 1e9;

console.log(`\nGravando ${N} votos\n`);
console.log("                      SQLite (em disco)     Blockchain local");
console.log(`Tempo total           ${tBanco.toFixed(1).padStart(10)} ms         ${tChain.toFixed(0).padStart(8)} ms`);
console.log(`Votos por segundo     ${Math.round((N / tBanco) * 1000).toString().padStart(10)}              ${Math.round((N / tChain) * 1000).toString().padStart(8)}`);
console.log(`Custo por voto        ${"R$ 0,00".padStart(10)}         ${("~" + gasMedio.toFixed(0) + " gas").padStart(14)}`);
console.log(
  `\nCusto estimado de 1 voto numa rede pública a ${GWEI} gwei e 1 ETH = R$ ${ETH_EM_REAIS}: R$ ${(custoEth * ETH_EM_REAIS).toFixed(2)}`,
);
console.log(`Custo de ${N} votos: R$ ${(custoEth * ETH_EM_REAIS * N).toFixed(2)}`);
console.log(
  "\nLeitura: a rede local é rápida porque tem 1 nó e minera na hora. Numa rede pública cada voto espera um bloco,\n" +
    "e o custo em gas não existe no banco de dados tradicional.",
);
