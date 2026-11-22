# Seminário NUP2: Blockchain e Arquiteturas Descentralizadas

Trabalho da faculdade (professor Luiz Marcelo Freitas da Silva, Classroom). Equipe: José Alan, Murilo e Klaus. Tema do Dia 6 da planilha:
Web3, smart contracts, DApps, consenso, quando NÃO usar blockchain, trade-offs. Pessoal/estudo, não vai para a pasta de chamados da I.Soluções.

## Arquivos
- `DIVISAO-TAREFAS.md`: requisitos do professor, divisão em 3 partes, checklist e dúvidas em aberto.
- `PERGUNTAS-PROVAVEIS.md`: perguntas e respostas curtas para os 15 minutos de arguição.
- `NUP2 - Blockchain e Arquiteturas Descentralizadas.pptx`: 23 slides com notas de fala em cada um. Gerado por `slides/gerar-slides.js`.
- `demo-hardhat/`: contrato `Votacao.sol`, testes, scripts de demo e benchmark, DApp de uma página. Ver o README dele.
- `demo-mini-blockchain/mini-chain.js`: mini-blockchain sem dependências.

## Regras
- Texto sem travessões nem tiques de IA (`memorias/geral/feedback-texto-sem-cara-de-ia.md`). Conferir com busca por "—" e "–".
- Nada de `node_modules` dentro do Drive: instalar numa cópia fora dele.
- Para regenerar os slides: numa pasta de trabalho, `npm install pptxgenjs react-icons react react-dom sharp`; depois
  `NODE_PATH=<pasta>/node_modules node gerar-slides.js saida.pptx`. Revisar em imagem (LibreOffice + pdftoppm) depois de mexer no layout.
- Números do slide 19 (benchmark) são de uma execução em 22/11/2026 e variam; se refizer, atualizar o slide e a nota.
- Nenhuma entrega foi enviada ao Classroom. A apresentação é oral, no Dia 6: terça, 24/11/2026.
- Cópias de trabalho fora do Drive no Mac: `~/nup2-demo` (demo-hardhat com `node_modules`) e `~/nup2-slides-build` (dependências do gerador de slides).
