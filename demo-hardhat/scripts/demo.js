// Demonstração ao vivo: publica o contrato, vota com contas diferentes,
// tenta violar as regras e mostra o resultado e o custo em gas.
// Rodar com o nó local aberto em outro terminal:
//   npx hardhat run scripts/demo.js --network localhost
import { network } from "hardhat";

const { ethers } = await network.getOrCreate();

const linha = (t) => console.log(`\n=== ${t} ===`);

const [dono, ana, bia, caio] = await ethers.getSigners();

linha("1. Publicando o contrato (deploy)");
const votacao = await ethers.deployContract("Votacao", [
  "Melhor linguagem para contratos",
  ["Solidity", "Vyper", "Rust"],
]);
const recibo = await votacao.deploymentTransaction().wait();
console.log("Endereço do contrato:", await votacao.getAddress());
console.log("Dono (quem publicou):", dono.address);
console.log("Bloco do deploy:     ", recibo.blockNumber);
console.log("Gas gasto no deploy: ", recibo.gasUsed.toString());

linha("2. Votando com contas diferentes");
for (const [quem, nome, opcao] of [
  [ana, "Ana", 0],
  [bia, "Bia", 0],
  [caio, "Caio", 2],
]) {
  const tx = await votacao.connect(quem).votar(opcao);
  const r = await tx.wait();
  console.log(
    `${nome} votou em "${await votacao.nomeDaOpcao(opcao)}" | bloco ${r.blockNumber} | gas ${r.gasUsed} | hash ${tx.hash.slice(0, 12)}...`,
  );
}

linha("3. Tentando burlar as regras (todas devem falhar)");
const tentativas = [
  ["Ana votando de novo", () => votacao.connect(ana).votar(1)],
  ["Opção que não existe", () => votacao.connect(dono).votar(7)],
  ["Ana tentando encerrar (não é dona)", () => votacao.connect(ana).encerrar()],
];
for (const [descricao, fn] of tentativas) {
  try {
    await fn();
    console.log(`${descricao}: ACEITO (isso não deveria acontecer)`);
  } catch (e) {
    const motivo = e.message.match(/custom error '([^']+)'/)?.[1] ?? e.shortMessage ?? "revertido";
    console.log(`${descricao}: recusado pelo contrato -> ${motivo}`);
  }
}

linha("4. Encerrando e lendo o resultado");
const fim = await (await votacao.connect(dono).encerrar()).wait();
console.log("Votação encerrada no bloco", fim.blockNumber);
const total = await votacao.totalOpcoes();
for (let i = 0n; i < total; i++) {
  console.log(`  ${await votacao.nomeDaOpcao(i)}: ${await votacao.votos(i)} voto(s)`);
}

linha("5. Registro público (eventos gravados na cadeia)");
const eventos = await votacao.queryFilter(votacao.filters.VotoRegistrado());
for (const ev of eventos) {
  console.log(`  bloco ${ev.blockNumber}: ${ev.args.eleitor} votou na opção ${ev.args.opcao}`);
}
console.log(
  "\nNão existe 'apagar' nem 'editar': corrigir um voto só é possível com uma nova transação, que fica registrada.",
);
