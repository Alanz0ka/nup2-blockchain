# Demo Hardhat: contrato de votação em rede local

Testado em 15/11/2026 no Mac (Node 26, Hardhat 3.22, solc 0.8.28): 5 testes passando, `demo.js`, `benchmark.js` e o DApp funcionando.

## Antes de tudo
1. Node.js 22.10 ou mais novo (`node -v`).
2. **Copie esta pasta para fora do Google Drive** (por exemplo `~/nup2-demo`) antes de instalar. O `node_modules` tem milhares de arquivos e não deve ser sincronizado.
3. Na pasta copiada: `npm install`. Na primeira vez que compilar, o Hardhat baixa o compilador Solidity (precisa de internet).

## Comandos (um terminal cada)
| Para quê | Comando |
|---|---|
| Rodar os testes | `npx hardhat test` |
| Subir a blockchain local (deixar aberto) | `npx hardhat node` |
| Demonstração completa | `npx hardhat run scripts/demo.js --network localhost` |
| Só publicar o contrato (para o DApp) | `npx hardhat run scripts/publicar.js --network localhost` |
| Servir o DApp | `python3 -m http.server 3000 --directory dapp` e abrir http://localhost:3000 |
| Comparativo banco x blockchain | `npx hardhat run scripts/benchmark.js` |

Também existem atalhos no `package.json`: `npm run no`, `npm run demo`, `npm run publicar`, `npm run dapp`, `npm run benchmark`, `npm run teste`.

## Pontos de atenção
- **O endereço do contrato muda.** Num nó recém-iniciado o primeiro contrato publicado fica em `0x5FbDB2315678afecb367f032d93F642f64180aa3`, que é o valor padrão do DApp. Se você já rodou o `demo.js` e depois o `publicar.js`, o segundo contrato terá outro endereço (o script imprime). Para o DApp, reinicie o nó (Ctrl+C e `npx hardhat node` de novo) e rode só o `publicar.js`, ou cole o endereço novo na página.
- As contas e chaves que o nó mostra são **públicas e só servem para teste**. Nunca use em rede real.
- O `benchmark.js` usa a rede simulada embutida, não precisa do nó aberto. Variáveis: `N=500`, `GWEI=10`, `ETH_REAIS=<cotação>`. O preço do gas e do ETH que vêm no script são **exemplos**: ajuste antes de apresentar.
- Porta 8545 ocupada: feche o outro nó (`pkill -f "hardhat node"` no Mac) ou mude a porta.
- O DApp carrega a biblioteca ethers de um CDN, então precisa de internet. Plano B: usar só o `demo.js`.
- Por que Hardhat e não Ganache: a Consensys encerrou o Truffle e o Ganache em setembro de 2023 e arquivou os repositórios, recomendando o Hardhat.

## Arquivos
- `contracts/Votacao.sol`: o contrato.
- `test/Votacao.test.js`: 5 testes (dono, voto, voto repetido, opção inválida, encerramento).
- `scripts/demo.js`: roteiro da demonstração ao vivo.
- `scripts/publicar.js`: publica o contrato para o DApp.
- `scripts/benchmark.js`: SQLite em disco x blockchain local, com custo estimado em gas.
- `dapp/index.html`: front-end de uma página, sem build, que fala com o nó por RPC.
