# Próximos passos

Apresentação: **terça, 24/11/2026**. Estado em 22/11/2026: deck, PDF e as três demos testados de novo no Mac; benchmark e slide 19 atualizados.

## Até terça (depende do Alan e da equipe)
1. Mandar o PDF do deck e a `DIVISAO-TAREFAS.md` para Murilo e Klaus hoje e fechar quem fica com qual parte (a divisão é uma proposta).
2. Perguntar ao professor ou à turma se os 20 a 30 minutos são da equipe ou de cada integrante. O deck foi feito para 30 min da equipe.
3. Cada um lê as notas de fala dos seus slides (aba de anotações do PowerPoint) e o `PERGUNTAS-PROVAVEIS.md`.
4. Ensaio cronometrado com os três (segunda à noite, no mínimo um em chamada).
5. Gravar a tela de cada demo como plano B (QuickTime no Mac: Cmd+Shift+5).
6. Decidir qual notebook roda as demos. Se for o Mac do Alan, está tudo pronto em `~/nup2-demo`; se for outro, copiar `demo-hardhat/` para fora do Drive e rodar `npm install` com internet, antes de ir para a sala.

## Roteiro de terça (Mac do Alan)
Antes de sair de casa: abrir o PDF do deck, abrir 3 abas do terminal em `~/nup2-demo` e deixar o `hardhat node` já de pé.

| Momento | Terminal | Comando |
|---|---|---|
| Parte 1 (Murilo) | 1 | `node ~/repos/nup2-blockchain/demo-mini-blockchain/mini-chain.js` (e de novo com `DIFICULDADE=5`) |
| Parte 2 (Alan) | 1 | `npx hardhat node` (já aberto) |
| Parte 2 (Alan) | 2 | `npx hardhat run scripts/demo.js --network localhost` |
| Parte 2 (Alan), se tiver internet | 3 | reiniciar o nó, `npx hardhat run scripts/publicar.js --network localhost`, `python3 -m http.server 3000 --directory dapp` e abrir http://localhost:3000 |
| Parte 3 (Klaus) | 2 | `npx hardhat run scripts/benchmark.js` (não precisa do nó) |

Plano B: se a demo quebrar, mostrar a gravação de tela ou a saída que já está nos slides 14 e 19. Sem internet, pular o DApp (o resto não precisa de rede).

## Depois
- Registrar no `HISTORICO.md` como foi a apresentação e as perguntas feitas pelo professor.
