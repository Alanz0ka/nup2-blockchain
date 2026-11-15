# NUP2: Blockchain e Arquiteturas Descentralizadas

Material do seminário NUP2: Web3, contratos inteligentes, DApps, consenso, quando não usar blockchain e trade-offs.
Este README explica como rodar todos os códigos do repositório. Cada integrante apresenta uma parte com uma demonstração ao vivo.

## O que tem aqui

| Item | Para que serve | Quem usa |
|---|---|---|
| `NUP2 - Blockchain e Arquiteturas Descentralizadas.pptx` e `.pdf` | Os 23 slides. O `.pptx` tem as notas de fala (aba de anotações). | Todos |
| `DIVISAO-TAREFAS.md` | Requisitos do professor, divisão em três partes e checklist | Todos |
| `PERGUNTAS-PROVAVEIS.md` | Perguntas e respostas curtas para a arguição | Todos |
| `demo-mini-blockchain/` | Demo 1: mini-blockchain em Node.js, sem dependências | Parte 1 (Murilo) |
| `demo-hardhat/` | Demo 2: contrato de votação em rede local, testes e DApp | Parte 2 (Alan) |
| `demo-hardhat/scripts/benchmark.js` | Demo 3: banco de dados x blockchain | Parte 3 (Klaus) |
| `slides/gerar-slides.js` | Gerador do deck (só se quiser regenerar os slides) | Opcional |

## Requisitos

- **Node.js 22.13 ou mais novo** (recomendado a versão LTS atual). Confira com `node -v`. Baixe em https://nodejs.org.
- **Git** (para baixar o repositório) e **internet** na primeira instalação.
- Um **navegador** (para o DApp).
- **Python 3** só para servir a página do DApp (alternativa abaixo).

Os comandos abaixo funcionam no Mac e no Linux. No Windows use o PowerShell; onde mudar, está indicado.

## 0. Baixar

```bash
git clone https://github.com/Alanz0ka/nup2-blockchain.git
cd nup2-blockchain
```

## 1. Demo 1: mini-blockchain (Parte 1)

Não precisa instalar nada.

```bash
cd demo-mini-blockchain
node mini-chain.js
```

O que acontece, em ordem:
1. Minera 4 blocos (o hash precisa começar com `0000`) e mostra quantas tentativas cada um levou.
2. Valida a cadeia: `{ ok: true }`.
3. Muda "Ana paga 10 a Bia" para "Ana paga 1000 a Bia" no bloco 1. A validação falha no bloco 1.
4. Refaz a prova de trabalho só do bloco 1. Agora o bloco 2 acusa que o hash anterior não bate.
5. Refaz todos os blocos seguintes e a cadeia volta a ser válida (aqui é rápido porque a rede é de brinquedo).

Para ver a prova de trabalho ficando mais lenta, aumente a dificuldade:

```bash
DIFICULDADE=5 node mini-chain.js
```

No PowerShell: `$env:DIFICULDADE=5; node mini-chain.js`.

## 2. Demo 2: contrato de votação com Hardhat (Parte 2)

### 2.1 Instalar (uma vez)

**Dica:** se o repositório estiver numa pasta sincronizada (Google Drive, OneDrive), copie a pasta `demo-hardhat` para fora dela antes do `npm install`. O `node_modules` tem milhares de arquivos.

```bash
cd demo-hardhat
npm install
```

O `npm install` pode mostrar avisos de vulnerabilidades e de scripts de instalação (esbuild). Eles não impedem nada e podem ser ignorados neste projeto de demonstração.

### 2.2 Rodar os testes

```bash
npx hardhat test
```

Na primeira vez o Hardhat baixa o compilador Solidity (precisa de internet). Resultado esperado: `5 passing`.

### 2.3 Demonstração ao vivo (dois terminais)

**Terminal 1:** sobe uma blockchain local e deixa rodando. Ela mostra 20 contas de teste com 10.000 ETH cada.

```bash
npx hardhat node
```

**Terminal 2** (na mesma pasta `demo-hardhat`): publica o contrato, vota, tenta burlar as regras e mostra o resultado.

```bash
npx hardhat run scripts/demo.js --network localhost
```

A saída tem cinco partes:
1. **Deploy:** endereço do contrato, bloco e gas gasto (cerca de 810 mil).
2. **Votos:** Ana, Bia e Caio votam. Cada voto mostra o bloco e o gas (55 mil a 72 mil).
3. **Tentativas de burlar:** voto repetido (`JaVotou`), opção inexistente (`OpcaoInvalida`) e quem não é dono tentando encerrar (`SomenteDono`). Todas são recusadas pelo contrato.
4. **Resultado:** total de votos por opção.
5. **Eventos:** lista pública de quem votou, com o número do bloco.

Cada vez que você roda o `demo.js` ele publica um contrato novo. Para repetir do zero, pare o nó (Ctrl+C) e suba de novo.

### 2.4 DApp (página que conversa com o contrato)

O DApp é uma página única (`dapp/index.html`) que lê o contrato e envia votos pelo navegador, sem servidor próprio.

1. Reinicie o nó (Terminal 1: Ctrl+C e `npx hardhat node`) para ele começar limpo.
2. Publique só o contrato (Terminal 2):
   ```bash
   npx hardhat run scripts/publicar.js --network localhost
   ```
   Num nó novo o endereço é `0x5FbDB2315678afecb367f032d93F642f64180aa3`, que já vem preenchido na página.
3. Sirva a página (Terminal 3, na pasta `demo-hardhat`):
   ```bash
   python3 -m http.server 3000 --directory dapp
   ```
   No Windows use `python -m http.server 3000 --directory dapp` (ou `py -m http.server ...`).
   Sem Python: `npx http-server dapp -p 3000`.
4. Abra http://localhost:3000, clique em **Conectar**, escolha uma conta e uma opção e clique em **Votar**.
5. Escolha a mesma conta e vote de novo: a página mostra "Recusado pelo contrato: esta conta já votou".

A página carrega a biblioteca ethers de um CDN, então precisa de internet. Se o endereço do contrato for outro, cole-o no campo da página.

As contas do nó local já vêm destravadas, por isso a página assina direto. Numa rede de verdade quem assina é uma carteira como a MetaMask.

### 2.5 Atalhos do `package.json`

```bash
npm run teste       # testes
npm run no          # nó local
npm run demo        # demo.js no nó local
npm run publicar    # publicar.js no nó local
npm run dapp        # serve o DApp na porta 3000 (usa python3)
npm run benchmark   # demo 3
```

### 2.6 O contrato em resumo

`contracts/Votacao.sol` guarda um título, as opções e um contador por opção. Regras:
- Cada endereço vota uma vez (`JaVotou`).
- Só vale votar em opção que existe (`OpcaoInvalida`).
- Só o dono encerra a votação (`SomenteDono`), e depois de encerrada ninguém mais vota (`VotacaoFechada`).
- Cada voto emite o evento `VotoRegistrado`, que serve de registro público.

## 3. Demo 3: banco de dados x blockchain (Parte 3)

Roda na pasta `demo-hardhat`. Não precisa do nó aberto, usa a rede simulada embutida no Hardhat.

```bash
npx hardhat run scripts/benchmark.js
```

Ele grava 200 votos em um banco SQLite (arquivo em disco, um `INSERT` por vez) e no contrato `Votacao` numa blockchain local (uma transação por voto). Mostra o tempo, os votos por segundo e o gas médio por voto, e estima o custo em reais numa rede pública.

Parâmetros opcionais (variáveis de ambiente):

| Variável | O que muda | Padrão |
|---|---|---|
| `N` | quantidade de votos | 200 |
| `GWEI` | preço do gas em gwei | 5 |
| `ETH_REAIS` | cotação de 1 ETH em reais | 15000 |

```bash
N=500 GWEI=10 ETH_REAIS=18000 npx hardhat run scripts/benchmark.js
```

No PowerShell: `$env:N=500; $env:GWEI=10; $env:ETH_REAIS=18000; npx hardhat run scripts/benchmark.js`.

**Leia o resultado com cuidado.** O preço do gas e a cotação do ETH são exemplos: ajuste para o valor do dia. A rede local é o melhor caso possível (um nó só, mineração instantânea, sem rede). Numa rede pública cada voto espera um bloco (cerca de 12 segundos no Ethereum) e custa gas. Os tempos mudam em cada máquina e em cada execução; refaça antes de apresentar e atualize o slide 19 se os números mudarem muito. Esse script usa o módulo `node:sqlite`, por isso pede Node 22.13 ou mais novo.

## 4. Slides

- Abra o `.pptx` no PowerPoint, Keynote ou Google Slides. As notas de fala estão em cada slide.
- O `.pdf` é só para leitura e envio.

Para regenerar o `.pptx` depois de editar o `slides/gerar-slides.js` (opcional), numa pasta de trabalho fora do repositório:

```bash
npm install pptxgenjs react-icons react react-dom sharp
NODE_PATH=./node_modules node /caminho/para/slides/gerar-slides.js "saida.pptx"
```

Depois confira os slides visualmente, porque mexer em posições pode causar sobreposições.

## 5. Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `Unsupported Node.js version` ou erro de sintaxe ao instalar | Node antigo | Instale o Node 22.13 ou mais novo |
| `npx hardhat test` demora na primeira vez | Baixando o compilador Solidity | Aguarde; precisa de internet |
| `HHE703: Cannot connect to the network "localhost"` no `demo.js` | O nó local não está rodando | Suba `npx hardhat node` no outro terminal antes |
| Porta 8545 ocupada | Outro nó aberto | Feche o outro terminal. No Mac/Linux: `pkill -f "hardhat node"` |
| DApp: "Falha ao conectar" | Nó desligado ou endereço do contrato errado | Reinicie o nó, rode `publicar.js` e use o endereço que ele imprimiu |
| DApp: página em branco ou erro de módulo | Sem internet (biblioteca vem de CDN) | Conecte-se à internet ou use só o `demo.js` |
| `benchmark.js`: erro com `node:sqlite` | Node anterior a 22.13 | Atualize o Node |
| `Cannot find module` | `npm install` não foi feito na pasta `demo-hardhat` | Rode `npm install` lá |
| O contrato publicado tem outro endereço | Você já publicou outro antes no mesmo nó | Reinicie o nó e publique só uma vez, ou cole o novo endereço no DApp |

As contas e chaves que o nó local mostra são **públicas e só servem para teste**. Nunca envie valor real para elas.

## 6. Licença e uso

Material acadêmico. O contrato e os scripts são exemplos didáticos, sem auditoria, e não devem ser usados com dinheiro real.
