# Roteiro de fala do Alan: Parte 2, contratos inteligentes e DApps

Slides 9 a 15. Tempo planejado: 10 minutos. Soma dos tempos abaixo: cerca de 11 minutos, com a demo ao vivo no meio.
Se estourar, corte o slide 13 (Web2 x Web3) e fale só do 12 em um minuto.

Este roteiro serve para você falar com as suas palavras. As frases entre aspas são sugestões, não texto para decorar.
A nota de "demonstração do conhecimento" cai se parecer leitura.

## Entrada (depois da demo do Murilo)
Murilo termina a demo 1 e passa a palavra. Você começa ligando com o que acabou de ser mostrado:

> "O Murilo mostrou como a cadeia se protege e como a rede concorda. Agora eu vou mostrar o que se constrói em cima disso:
> programas que rodam dentro da blockchain, os contratos inteligentes, e as aplicações que usam esses contratos, os DApps."

Antes de falar: terminal 1 já com `npx hardhat node` rodando (de pé desde antes da aula), terminal 2 vazio na pasta `~/nup2-demo`.

---

## Slide 9: Contratos inteligentes (1 min 30 s)
**Ideia central:** um contrato é um programa guardado na blockchain, com código e estado, que roda quando alguém manda uma transação.

Falar:
- "Um contrato inteligente é um programa que mora num endereço da blockchain. Ele tem código e tem estado, que são as variáveis guardadas."
- "Ele não roda sozinho. Só executa quando uma conta manda uma transação para ele."
- Três consequências, uma por ícone:
  1. O código é a regra: ninguém precisa fiscalizar, o que está escrito é o que acontece.
  2. Todos os nós executam o mesmo código e precisam chegar ao mesmo resultado.
  3. Depois de publicado, não se edita. Para corrigir, publica-se um contrato novo.
- Fechar com a observação do rodapé: "O nome engana. Não é inteligente e não é contrato no sentido jurídico. É um programa determinístico."

Contexto se perguntarem: a ideia é de Nick Szabo (anos 1990). Ficou prática com o Ethereum, proposto por Vitalik Buterin em 2013 e no ar em 2015. O Bitcoin tem scripts limitados. O Ethereum tem uma máquina virtual, a **EVM**, que executa programas completos.

## Slide 10: Da carteira ao bloco (1 min 30 s)
**Ideia central:** o caminho de uma transação, e o que é gas.

Falar, seguindo as 5 caixas da esquerda para a direita:
1. "A carteira assina a transação com a chave privada. Quem tem a chave controla a conta. Não existe 'esqueci a senha'."
2. "Um nó recebe e repassa. A transação espera numa fila, o mempool."
3. "Um validador escolhe transações e monta o bloco."
4. "Todos os nós reexecutam o contrato e conferem se chegam ao mesmo estado. Por isso o código tem de ser determinístico: sem aleatório local, sem horário do computador."
5. "O estado novo e os eventos ficam gravados."

Caixa do gas: "Gas é o preço de cada operação do contrato. Quem envia a transação paga. Isso impede laço infinito e spam, e remunera quem valida. Se o gas acaba no meio, a transação é revertida e o gas gasto não volta."

## Slide 11: Custo e limites na prática (1 min)
**Ideia central:** os números da nossa demo, e o caso The DAO.

Falar:
- "Estes dois primeiros números saem da nossa própria demo. Publicar o contrato custou cerca de 810 mil de gas. Cada voto custou entre 55 e 72 mil."
- Por que a diferença entre votos (se perguntarem): gravar um valor novo no contrato, de zero para diferente de zero, custa mais do que atualizar um valor que já existe. Na demo, Ana e Caio votaram em opções ainda sem voto (cerca de 72 mil). Bia votou numa opção que já tinha um voto (cerca de 55 mil).
- "Em rede pública esse gas é pago em ETH, então vira dinheiro. O Klaus mostra isso na parte dele."
- The DAO, 2016: "Era um fundo de investimento feito de contratos. Um bug de reentrância deixou o atacante sacar várias vezes antes de o saldo ser atualizado. Foram cerca de 3,6 milhões de ETH desviados."
- "Como o contrato não se edita, a comunidade fez um hard fork para devolver o dinheiro. Quem discordou ficou na cadeia antiga, que virou o Ethereum Classic."
- Frase de fechamento: "O que dá segurança, a imutabilidade, é também o que impede de corrigir um erro."

Reentrância em uma frase: o contrato mandava o dinheiro antes de atualizar o saldo, e o atacante chamava a função de novo no meio do envio. Prevenção: atualizar o estado antes de enviar valor (checks-effects-interactions).

## Slide 12: Arquitetura de um DApp (1 min 30 s)
**Ideia central:** DApp é uma página web comum conversando com um contrato.

Falar, da esquerda para a direita:
- "O usuário abre um front-end, que é HTML e JavaScript normal. Ele usa uma biblioteca, como o ethers.js, para falar com a carteira, por exemplo a MetaMask, que assina. Depois a transação vai a um nó por RPC e chega ao contrato."
- "Na maioria dos DApps ninguém roda nó próprio. Usam provedores como Alchemy ou Infura. É uma recentralização escondida: o descentralizado muitas vezes depende de poucos provedores."
- Parte de baixo, o que fica fora da cadeia:
  - Arquivos grandes: guardar na cadeia é caro, então se usa IPFS e só o hash vai para a cadeia.
  - Oráculos: a blockchain não enxerga o mundo externo sozinha, então um serviço leva preço ou clima para dentro. É um ponto de confiança.
  - Indexadores: consultar histórico direto na cadeia é lento, então se organizam os eventos para consulta (por exemplo, The Graph).
- Ligar com a demo: "Na nossa demo o front-end é uma única página HTML falando com o nó local."

## Slide 13: Web2 x Web3 (1 min). Cortar se faltar tempo
**Ideia central:** o que muda não é a interface, é quem manda nos dados e nas regras.

Falar só três linhas da tabela:
- Regras do negócio: servidor da empresa x contrato na blockchain.
- Quem muda as regras: a empresa, quando quiser x ninguém, ou votação dos usuários.
- Recuperar acesso: redefinir senha x perdeu a chave, perdeu a conta.

Fechar: "Web3 é um termo de marketing em disputa. Aqui eu uso como aplicações sobre blockchain. Os pontos fracos, custo e desempenho, o Klaus aprofunda."

## Slide 14: Demo 2, contrato em rede local (3 a 4 min)
Mostrar o código do `votar` no slide e explicar as três regras, antes de ir ao terminal.

Falar sobre o código:
- "Três regras no começo da função: a votação tem de estar aberta, o endereço não pode ter votado, e a opção tem de existir. Se uma falha, o contrato dá `revert` e a transação inteira é desfeita."
- "`msg.sender` é quem assinou a transação. É assim que o contrato sabe quem está votando."
- "No fim, o `emit` grava um evento. O evento é o registro público que qualquer pessoa pode consultar."

Execução, na ordem:

| Passo | Onde | Comando | O que dizer |
|---|---|---|---|
| 1 | Terminal 1 (já aberto) | `npx hardhat node` | "Isto é uma blockchain local, com 20 contas de 10.000 ETH de teste. As chaves dessas contas são públicas, servem só para teste." |
| 2 | Terminal 2 | `npx hardhat run scripts/demo.js --network localhost` | Acompanhar a saída, bloco a bloco (abaixo) |
| 3 | Opcional, só com internet | reiniciar o nó, `npx hardhat run scripts/publicar.js --network localhost`, `python3 -m http.server 3000 --directory dapp`, abrir http://localhost:3000 | "Agora o mesmo contrato, votando por uma página web." Limite de 30 s |

O que o `demo.js` imprime e o que apontar:
1. **Deploy:** endereço do contrato, dono, número do bloco, gas do deploy (cerca de 810 mil). "Quem publicou vira o dono."
2. **Três votos** (Ana, Bia, Caio): bloco, gas e hash de cada um. "Cada voto saiu de uma conta diferente, cada um num bloco, com o gas gasto." Apontar que Bia gastou menos que Ana e Caio.
3. **Três tentativas de burlar:** voto repetido, opção que não existe e Ana tentando encerrar sem ser dona. Todas aparecem como "recusado pelo contrato", com o nome do erro. "Ninguém fiscalizou. Quem recusou foi o código, igual para todos."
4. **Encerramento e resultado:** bloco do encerramento e contagem por opção.
5. **Eventos:** lista de quem votou em quê, com o bloco. "Isso é o registro público. Dá para qualquer pessoa auditar."
- Frase final do script: não existe apagar nem editar. Corrigir um voto só com uma nova transação, que também fica registrada.

**Por que Hardhat e não Ganache** (a planilha do professor cita os dois): a Consensys encerrou o Ganache e o Truffle em setembro de 2023, arquivou os repositórios e recomendou o Hardhat.

**Plano B:** se a demo travar, não tente consertar ao vivo. Diga "vou mostrar a saída que já temos" e passe ao slide 15, que resume o que a demo mostraria. Ter a gravação de tela aberta em outra janela.
Porta 8545 ocupada: `pkill -f "hardhat node"` no Mac e subir de novo.

## Slide 15: O que a demonstração mostrou (1 min)
Quatro cartões, uma frase cada:
- Regras aplicadas pelo código: voto repetido, opção inválida e encerramento por quem não é dono foram recusados pelo próprio contrato.
- Registro público: cada voto virou um evento com endereço, opção e bloco.
- Custo mensurável: tudo gastou gas, de 810 mil (deploy) a 55 mil (voto). Em rede pública seria dinheiro.
- Sem editar, sem apagar: ótimo para auditoria, problema para dados pessoais.

## Passagem para o Klaus
> "Esse último ponto, não poder apagar, é o primeiro dos problemas. O Klaus mostra agora quando a blockchain é a escolha errada."

---

## Conceitos para explicar sem olhar
Cada um em uma frase, nas suas palavras:
- **EVM:** a máquina virtual do Ethereum que executa o código dos contratos. Todos os nós têm uma e chegam ao mesmo resultado.
- **Estado:** as variáveis guardadas pelo contrato (aqui: dono, votos, quem já votou, se está aberta).
- **Gas:** o preço em computação de cada operação, pago por quem envia a transação.
- **Evento:** um registro que o contrato emite e fica gravado na cadeia, barato de consultar.
- **`msg.sender`:** o endereço de quem assinou a transação que está chamando a função.
- **`revert`:** desfaz a transação inteira quando uma regra falha. O gas gasto até ali não volta.
- **Por que não se edita:** o código fica gravado no bloco e os blocos não se alteram. Para mudar, publica-se outro contrato ou usa-se um padrão de proxy, que passa a confiança para quem controla a atualização.
- **The DAO (2016):** reentrância, cerca de 3,6 milhões de ETH, hard fork, nasce o Ethereum Classic.

## Perguntas que mais podem cair na sua parte
As respostas completas estão em `PERGUNTAS-PROVAVEIS.md`, seção "Parte 2". As seis mais prováveis:
1. O que é um contrato inteligente, em uma frase?
2. O que é gas e quem paga?
3. Dá para corrigir um contrato com bug?
4. O que foi The DAO e o que é reentrância?
5. Como o contrato acessa dados do mundo real? (oráculos)
6. Por que o primeiro voto em cada opção custa mais gas?

Se não souber: "essa parte eu não estudei a fundo, mas pelo que entendi é isto", e passar a palavra a quem tem a parte. Não inventar número nem data.

## Checklist antes de subir
- [ ] Terminal 1 com `npx hardhat node` de pé, em `~/nup2-demo`.
- [ ] Terminal 2 vazio na mesma pasta. Rodar `npx hardhat test` uma vez antes, para o compilador já estar baixado.
- [ ] `Votacao.sol` aberto no editor, caso peçam para ver o código inteiro.
- [ ] Gravação de tela da demo pronta como plano B.
- [ ] Fonte do terminal grande o bastante para a sala ler.
- [ ] Internet testada só se for mostrar o DApp (ele carrega o ethers de um CDN).
