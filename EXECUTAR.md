# Como executar os exemplos

Guia curto, na ordem da apresentação. Cada exemplo diz o comando, o que você deve ver e o que isso mostra.
O guia completo, com parâmetros e solução de problemas, está no [README.md](README.md).

## Antes de começar

1. **Node.js 22.13 ou mais novo.** Confira no terminal:
   ```bash
   node -v
   ```
2. **Abra a pasta do repositório no VS Code** (`code .` dentro da pasta, ou Arquivo > Abrir Pasta).
3. **Abra o terminal do VS Code** com `` Ctrl+` ``. Para um segundo ou terceiro terminal, clique no `+` do painel.
4. **Instale as dependências uma vez** (precisa de internet):
   ```bash
   cd demo-hardhat
   npm install
   ```
   Os avisos de vulnerabilidade e de `esbuild` podem ser ignorados.

Se o repositório estiver numa pasta sincronizada (Google Drive, OneDrive), copie a pasta `demo-hardhat` para fora dela antes do `npm install`.

> **Windows (PowerShell 5.1):** se aparecer erro de política de execução, troque `npm` por `npm.cmd` e `npx` por `npx.cmd`. Para o Python do DApp use `python` ou `py` no lugar de `python3`.

## Resumo: qual comando roda o quê

| # | Exemplo | Pasta | Comando | Precisa do nó aberto? |
|---|---|---|---|---|
| 1 | Mini-blockchain | `demo-mini-blockchain` | `node mini-chain.js` | Não |
| 2 | Testes do contrato | `demo-hardhat` | `npx hardhat test` | Não |
| 3 | Demo do contrato | `demo-hardhat` | `npx hardhat run scripts/demo.js --network localhost` | **Sim** |
| 4 | DApp no navegador | `demo-hardhat` | `publicar.js` e servidor da página (ver abaixo) | **Sim** |
| 5 | Banco x blockchain | `demo-hardhat` | `npx hardhat run scripts/benchmark.js` | Não |

## Exemplo 1: mini-blockchain

```bash
cd demo-mini-blockchain
node mini-chain.js
```

Você deve ver:
- 4 blocos minerados, com o número de tentativas de cada um.
- `Validação: { ok: true }`.
- Depois da adulteração, `ok: false` apontando o bloco 1 ("o conteúdo não bate com o hash gravado").
- Depois de refazer só o bloco 1, o bloco 2 acusa "o hash anterior não aponta para o bloco anterior".
- No fim, a cadeia volta a ser válida, mas só porque a rede é de brinquedo.

Mostra: o hash encadeado quebra a cadeia quando alguém mexe num bloco antigo.

Versão com a prova de trabalho mais lenta:

```bash
DIFICULDADE=5 node mini-chain.js
```
No PowerShell: `$env:DIFICULDADE=5; node mini-chain.js`.

## Exemplo 2: testes do contrato

```bash
cd demo-hardhat
npx hardhat test
```

Na primeira vez ele baixa o compilador Solidity e demora um pouco. Você deve ver 5 testes com ✔ e `5 passing`.

Mostra: as regras do contrato (`Votacao.sol`) funcionam: dono, voto, voto repetido, opção inválida e encerramento.

## Exemplo 3: demo do contrato (dois terminais)

**Terminal 1.** Sobe uma blockchain local e deixa rodando. Ela lista 20 contas de teste com 10.000 ETH cada.

```bash
cd demo-hardhat
npx hardhat node
```

**Terminal 2.** Publica o contrato, vota e tenta burlar as regras:

```bash
cd demo-hardhat
npx hardhat run scripts/demo.js --network localhost
```

Você deve ver:
1. **Deploy:** gas de 810.488.
2. **Três votos:** Ana (72.297 gas), Bia (55.197) e Caio (72.309), cada um em um bloco novo.
3. **Três tentativas recusadas:** `JaVotou()`, `OpcaoInvalida()` e `SomenteDono()`.
4. **Resultado:** Solidity 2, Vyper 0, Rust 1.
5. **Eventos:** lista pública de quem votou, com o número do bloco.

Mostra: as regras valem para todos, não dá para editar nem apagar um voto, e cada operação tem custo em gas.

Cada execução do `demo.js` publica um contrato novo. Para repetir do zero, pare o nó (`Ctrl+C` no Terminal 1) e suba de novo.

## Exemplo 4: DApp no navegador (três terminais)

1. **Terminal 1:** pare o nó (`Ctrl+C`) e suba de novo, para começar limpo.
   ```bash
   npx hardhat node
   ```
2. **Terminal 2:** publique só o contrato.
   ```bash
   npx hardhat run scripts/publicar.js --network localhost
   ```
   Num nó novo o endereço é `0x5FbDB2315678afecb367f032d93F642f64180aa3`, que já vem preenchido na página.
3. **Terminal 3:** sirva a página.
   ```bash
   python3 -m http.server 3000 --directory dapp
   ```
   Sem Python: `npx http-server dapp -p 3000`.
4. Abra http://localhost:3000 no navegador (precisa de internet, a biblioteca vem de um CDN).
5. Clique em **Conectar**. Deve aparecer "Conectado. Bloco atual: 1. Votação aberta."
6. Escolha uma conta e uma opção e clique em **Votar**. Deve aparecer "Voto confirmado no bloco 2" e o resultado e os eventos atualizam.
7. Clique em **Votar** de novo com a mesma conta. Deve aparecer "Recusado pelo contrato: esta conta já votou."

Mostra: uma página comum conversando com o contrato, sem servidor próprio guardando votos. Numa rede de verdade quem assina é uma carteira como a MetaMask.

## Exemplo 5: banco de dados x blockchain

Não precisa do nó aberto.

```bash
cd demo-hardhat
npx hardhat run scripts/benchmark.js
```

Você deve ver algo como (os números mudam a cada máquina e a cada execução):

| | SQLite em disco | Blockchain local |
|---|---|---|
| Votos por segundo | 3.000 a 3.600 | 500 a 550 |
| Custo por voto | R$ 0,00 | ~55.461 gas |

Com os padrões atuais (1 gwei e 1 ETH = R$ 10.400): R$ 0,58 por voto e R$ 115,36 para 200 votos.

Para mudar os parâmetros:

```bash
N=500 GWEI=2 ETH_REAIS=10000 npx hardhat run scripts/benchmark.js
```
No PowerShell: `$env:N=500; $env:GWEI=2; $env:ETH_REAIS=10000; npx hardhat run scripts/benchmark.js`.

Mostra: o banco de dados faz o mesmo trabalho mais rápido e de graça. Ressalva: a rede local é o melhor caso possível (um nó só, mineração instantânea). Numa rede pública cada voto espera um bloco e custa gas. O preço do gas e a cotação do ETH são exemplos.

## Atalhos do npm (na pasta `demo-hardhat`)

```bash
npm run teste       # exemplo 2
npm run no          # sobe o nó local
npm run demo        # exemplo 3 (com o nó aberto)
npm run publicar    # publica o contrato (exemplo 4)
npm run dapp        # serve o DApp na porta 3000
npm run benchmark   # exemplo 5
```

## Ao terminar

Pare o que ficou aberto com `Ctrl+C` em cada terminal (o nó e o servidor do DApp). No Mac ou Linux, se alguma porta ficar presa:

```bash
pkill -f "hardhat node"
pkill -f "http.server 3000"
```

## Se der erro

| Sintoma | O que fazer |
|---|---|
| `Cannot connect to the network "localhost"` | O nó não está rodando. Suba `npx hardhat node` no outro terminal |
| `Cannot find module` | Faltou `npm install` na pasta `demo-hardhat` |
| Erro de versão ou de `node:sqlite` | Atualize o Node para 22.13 ou mais novo |
| DApp: "Falha ao conectar" | Reinicie o nó, rode `publicar.js` e use o endereço que ele imprimiu |
| Porta 8545 ou 3000 ocupada | Feche o outro terminal ou use os `pkill` acima |

As contas e chaves que o nó mostra são públicas e só servem para teste. Nunca use em rede real.
