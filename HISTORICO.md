# Histórico

## 15/11/2026
- Alan enviou prints do Classroom (orientações do NUP2, 07/10) e da planilha (Dia 6: Blockchain e Arquiteturas Descentralizadas, equipe José Alan, Murilo e Klaus) e pediu a divisão de tarefas e a apresentação.
- Criada a divisão em três partes (Murilo, Alan, Klaus), cada uma com demo ao vivo.
- Deck de 23 slides em pptx (pptxgenjs), com notas de fala. Validação do arquivo passou e todos os slides foram conferidos em imagem.
- Demo Hardhat 3 testada: 5 testes passando, `demo.js`, `benchmark.js` e o DApp no navegador funcionando contra um nó local.
- Mini-blockchain em Node.js testada.
- Pesquisado na web: Ganache descontinuado pela Consensys (set/2023), Drex tirou a DLT da fase seguinte (ago/2025), requisitos do Hardhat 3 (Node 22.10 ou mais novo).
- Erro encontrado e corrigido: a diferença de gas entre votos vem do contador da opção (zero para um), não do endereço do eleitor.
- Benchmark (200 votos, Mac do Alan): SQLite em disco 3.261 votos/s; blockchain local 507 votos/s; ~55.461 gas por voto em média.

## 22/11/2026
- Alan confirmou que a apresentação é terça, 24/11/2026.
- Demo copiada para `~/nup2-demo` (fora do Drive), `npm install` refeito: 5 testes passando, `demo.js` contra o nó local e a mini-blockchain funcionando (Node 26.13).
- Benchmark refeito duas vezes (200 votos): SQLite 3.592 e 3.270 votos/s; blockchain local 543 e 539 votos/s; 55.461 gas por voto. Slide 19 atualizado com a primeira execução.
- Exemplo de custo do slide 19 trocado de 5 gwei / R$ 15.000 para 1 gwei / R$ 10.400 (1 voto = R$ 0,58; 200 votos = R$ 115,36). Pesquisado na web em 22/11: gas médio na camada 1 em torno de 0,2 gwei (Etherscan) e 1 ETH entre R$ 10.260 e R$ 10.450 (Coinbase, Trust Wallet, Xe, dados de 18 e 19/11). Os padrões do `benchmark.js` acompanharam.
- Deck e PDF regenerados (23 slides), slide 19 conferido em imagem.
- `PROXIMOS-PASSOS.md` reescrito com o roteiro de terça e o que depende da equipe.
