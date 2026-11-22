# NUP2: Blockchain e Arquiteturas Descentralizadas

Equipe: José Alan, Murilo e Klaus. Tema na planilha do professor Luiz Marcelo Freitas da Silva: **Dia 6, "Blockchain e Arquiteturas Descentralizadas"** (Web3, smart contracts, DApps, consenso, quando NÃO usar blockchain, trade-offs). Demonstração prevista na planilha: "contrato simples em rede local (Ganache/Hardhat)".

**Apresentação: terça-feira, 24/11/2026** (confirmado pelo Alan em 22/11/2026).

## O que o professor pediu (Classroom, 07/10)
- Apresentação de 20 a 30 minutos, mais até 15 minutos de perguntas.
- Apresentação **individual de cada integrante**, mostrando que estudou o tema.
- Slides com contextualização teórica dos tópicos.
- Exemplos práticos em tempo real, vídeo de terceiros etc., que demonstrem a teoria em casos concretos.
- Quem não fizer o trabalho terá como assunto da prova de reavaliação os temas apresentados.

| Critério | Peso | O que fazer |
|---|---|---|
| Apresentação oral | 20% | Falar sem ler, ensaiar o tempo de cada parte |
| Demonstração do conhecimento | 30% | Explicar com as próprias palavras e responder perguntas. **Só ler os slides zera esta nota** |
| Qualidade do material | 20% | Deck pronto, referências, texto sem erros |
| Demonstração dos casos práticos | 30% | Uma demo ao vivo por integrante, com plano B |

## Divisão proposta (ajustem entre vocês)
Os nomes podem ser trocados. O que importa é que cada um tenha **uma parte, uma demo e as perguntas daquela parte**.

| Parte | Quem | Slides | Tempo | Demo ao vivo | Pasta/arquivo |
|---|---|---|---|---|---|
| Abertura | Murilo | 1 e 2 | 1 min | | |
| 1. Fundamentos e consenso | Murilo | 3 a 8 | 9 min | Mini-blockchain em Node.js: minerar, adulterar, ver a cadeia quebrar | `demo-mini-blockchain/mini-chain.js` |
| 2. Contratos inteligentes e DApps | Alan | 9 a 15 | 10 min | Contrato de votação no Hardhat (deploy, votos, regras sendo recusadas) e DApp de uma página | `demo-hardhat/` |
| 3. Quando NÃO usar e trade-offs | Klaus | 16 a 21 | 9 min | Benchmark SQLite x blockchain e custo em gas | `demo-hardhat/scripts/benchmark.js` |
| Fechamento e perguntas | Klaus | 22 e 23 | 1 min + 15 | | |

Total planejado: cerca de 30 minutos de fala, com folga para a demo falhar e ser refeita. Se passar de 30, cortar o slide 13 (Web2 x Web3) e o 21 (alternativas).

## O que cada um estuda e prepara
**Murilo (Parte 1)**
- Ler: whitepaper do Bitcoin (as 9 páginas), problema dos generais bizantinos, diferença entre PoW, PoS e BFT.
- Entender para explicar sem olhar: hash, bloco, nonce, por que adulterar quebra a cadeia, o que é ataque de 51%.
- Rodar `node mini-chain.js` várias vezes e com `DIFICULDADE=5`.
- Notas de fala nos slides 1 a 8 (aba de anotações do PowerPoint).

**Alan (Parte 2)**
- Ler: ethereum.org/developers (contratos, gas, transações), código de `Votacao.sol`.
- Entender para explicar sem olhar: EVM, estado, gas, evento, `msg.sender`, `revert`, por que o contrato não se edita, The DAO.
- Ensaiar os 3 terminais da demo (ver `demo-hardhat/README.md`).
- Notas de fala nos slides 9 a 15.

**Klaus (Parte 3)**
- Ler: "Do you need a blockchain?" (Wüst e Gervais, 2018), LGPD art. 18, relatório do piloto Drex fase 1.
- Entender para explicar sem olhar: fluxograma de decisão, trilema, por que o benchmark local é o melhor caso, alternativas (log de auditoria, Merkle, Raft).
- Refazer o benchmark na máquina de vocês e atualizar o slide 19 se os números mudarem muito.
- Notas de fala nos slides 16 a 22.

## Antes da apresentação (todos)
- [ ] Ensaio completo cronometrado, uma vez em dupla e uma com os três.
- [ ] Um notebook só roda as três demos (ou cada um leva a sua). Testar o projetor/HDMI.
- [ ] `npm install` feito antes, **sem depender da internet da sala** (exceção: o DApp usa CDN; o plano B é o `demo.js`).
- [ ] Prints ou gravação de tela de cada demo como plano B.
- [x] Slide 19 atualizado em 22/11/2026 (benchmark refeito; 1 gwei e 1 ETH = R$ 10.400 como exemplo, com o gas real do dia na nota).
- [ ] Ler `PERGUNTAS-PROVAVEIS.md`.
- [ ] Revisar a ABNT das referências (slide 23) se o professor exigir.

## A confirmar com o professor ou com a turma
1. ~~Data do Dia 6.~~ Confirmada: terça, 24/11/2026.
2. **Os 20 a 30 minutos são da equipe ou de cada integrante?** O deck foi montado para 30 minutos da equipe. Se for por integrante, cada parte precisa ser ampliada e as demos podem ficar mais longas.
3. Nome completo e sobrenomes de Murilo e Klaus, para a capa, se for pedida.
4. Nome da disciplina (não aparece nas imagens).
5. A planilha: o comentário de 20/10 dizia "não consegui editar". Conferir se a equipe já aparece no Dia 6 (na imagem enviada aparece: José Alan, Murilo, Klaus).
