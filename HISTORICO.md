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
