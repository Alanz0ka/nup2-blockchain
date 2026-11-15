// Só publica o contrato no nó local (usado antes de abrir o DApp em dapp/index.html).
//   npx hardhat run scripts/publicar.js --network localhost
import { network } from "hardhat";

const { ethers } = await network.getOrCreate();
const votacao = await ethers.deployContract("Votacao", [
  "Melhor linguagem para contratos",
  ["Solidity", "Vyper", "Rust"],
]);
console.log("Contrato publicado em:", await votacao.getAddress());
