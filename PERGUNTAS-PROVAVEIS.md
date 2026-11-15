# Perguntas prováveis e respostas curtas

Use como base para estudar, não para decorar. A nota de demonstração do conhecimento depende de explicar com as próprias palavras. Se não souber, diga o que sabe e o que não sabe.

## Parte 1: fundamentos e consenso (Murilo)
**Qual a diferença entre blockchain e um banco de dados distribuído?**
Um banco distribuído (Cassandra, CockroachDB) replica dados entre servidores que têm o mesmo dono e confiam uns nos outros: ele tolera falha de nó, não nó mentiroso. A blockchain assume que alguns participantes podem ser desonestos e usa consenso (e incentivo econômico) para chegar a uma versão única do histórico.

**O que impede alguém de alterar um bloco antigo?**
Cada bloco guarda o hash do anterior. Mudar um bloco muda o hash dele e invalida todos os seguintes. Para esconder a fraude é preciso refazer a prova de trabalho de todos os blocos seguintes e ainda ser mais rápido que o resto da rede. Isso é o ataque de 51%, caro em redes grandes e viável em redes pequenas.

**Então a blockchain é imutável?**
Na prática é "à prova de adulteração", não imutável em sentido absoluto. Redes pequenas já sofreram reorganização por ataque de 51%, e o Ethereum fez um hard fork em 2016 para reverter o caso The DAO.

**Por que o Bitcoin gasta tanta energia e o Ethereum não?**
Na prova de trabalho a segurança vem do gasto de energia para minerar. Na prova de participação (Ethereum desde setembro de 2022) a segurança vem de moedas colocadas em garantia, que podem ser perdidas se o validador agir de forma desonesta. O consumo de energia do Ethereum caiu em mais de 99% com essa mudança.

**O que é um fork?**
Quando a cadeia se divide. Soft fork é uma mudança de regra compatível com os nós antigos. Hard fork não é compatível: quem não atualiza segue outra cadeia (caso do Ethereum e do Ethereum Classic).

**Para que serve a árvore de Merkle?**
Resumir muitas transações em um único hash (a raiz) e permitir provar que uma transação está no bloco com poucos hashes.

## Parte 2: contratos inteligentes e DApps (Alan)
**O que é um contrato inteligente, em uma frase?**
Um programa guardado na blockchain, com código e estado próprios, que roda quando recebe uma transação e que todos os nós executam e conferem.

**Qual a diferença entre Bitcoin e Ethereum?**
O Bitcoin foi feito para transferir valor, com scripts limitados. O Ethereum tem uma máquina virtual (EVM) que executa programas completos, e por isso hospeda contratos e DApps.

**O que é gas e quem paga?**
Unidade de custo de computação. Cada operação tem um preço em gas e quem envia a transação paga, em ETH. Impede laços infinitos e spam e remunera quem valida.

**Dá para corrigir um contrato com bug?**
Não editando. É possível usar padrões de contrato atualizável (proxy), mas isso transfere a confiança para quem controla a atualização. Ou publica-se um contrato novo e migram-se os usuários.

**O que foi o caso The DAO e o que é reentrância?**
Em 2016, um fundo feito de contratos teve cerca de 3,6 milhões de ETH desviados por uma falha de reentrância: o contrato enviava o dinheiro antes de atualizar o saldo, e o atacante chamava a função de novo no meio do envio. A prevenção é atualizar o estado antes de enviar valor (padrão checks-effects-interactions) e usar proteções como o ReentrancyGuard.

**Como o contrato acessa dados do mundo real?**
Não acessa sozinho. Usa oráculos, serviços que levam dados externos (preço, clima) para dentro da cadeia. Eles são um ponto de confiança.

**Onde ficam as chaves privadas e o que acontece se perder?**
Na carteira do usuário (por exemplo, MetaMask). Quem tem a chave controla a conta. Perdida a chave, não há recuperação.

**Por que Hardhat e não Ganache?**
A planilha cita os dois. A Consensys encerrou o Ganache e o Truffle em setembro de 2023, arquivou os repositórios e recomendou o Hardhat, que é mantido e tem testes, console e rede local integrados.

**Por que o primeiro voto em cada opção custa mais gas que os seguintes?**
Gravar um valor novo na memória do contrato (de zero para diferente de zero) custa mais que atualizar um valor que já existe. Na demo, o voto que leva o contador de uma opção de 0 para 1 gastou cerca de 72 mil gas, e o voto seguinte na mesma opção, cerca de 55 mil. A marcação `jaVotou` do eleitor é sempre uma gravação nova e entra nos dois casos.

## Parte 3: quando NÃO usar e trade-offs (Klaus)
**Quando faz sentido usar blockchain?**
Quando vários participantes escrevem, não confiam uns nos outros e não há um intermediário em quem todos confiem, ou quando abrir mão do intermediário é o objetivo (caso do Bitcoin). Se uma dessas condições falha, um banco de dados resolve melhor.

**Blockchain e LGPD podem conviver?**
Há tensão: a LGPD (art. 18) prevê a eliminação de dados pessoais e a cadeia é difícil de editar. A prática comum é guardar o dado pessoal fora da cadeia e registrar nela só o necessário. Mesmo o hash de um dado pessoal pode ser considerado dado pessoal, e o tema ainda é debatido. Dizer isso com cautela.

**Qual a diferença entre blockchain pública e permissionada?**
Na pública qualquer um participa e valida (Bitcoin, Ethereum). Na permissionada só membros autorizados participam (Hyperledger Besu, Fabric), com consenso mais rápido, mas com menos descentralização e mais confiança na lista de membros.

**Por que o benchmark mostrou a blockchain local tão rápida?**
Porque a rede local tem um só nó, mineração instantânea e nenhuma latência de rede ou disputa de consenso. É o melhor caso possível. Numa rede pública cada transação espera um bloco (12 segundos no Ethereum, cerca de 10 minutos no Bitcoin) e custa gas. O banco de dados continua mais rápido e de graça.

**Como as redes tentam escalar?**
Camadas 2 (rollups) agrupam muitas transações e gravam um resumo na camada 1. Redes permissionadas trocam descentralização por velocidade. Sempre há concessão (trilema).

**O que aconteceu com o Drex?**
O piloto da fase 1 (2023 e 2024) usou Hyperledger Besu com instituições financeiras. Em agosto de 2025 o Banco Central anunciou que a fase seguinte não usaria a tecnologia DLT, com foco em conciliação de gravames, em parte por exigências de privacidade. O cronograma posterior tem informações divergentes: dizer "até onde sabemos".

**Existe alternativa à blockchain para auditoria?**
Sim: banco com trilha de auditoria, assinatura digital com carimbo de tempo, log transparente com árvore de Merkle (Certificate Transparency) e bancos replicados com Raft.

## Se não souber a resposta
Dizer "essa parte eu não estudei a fundo, mas pelo que entendi é isto" e passar a palavra a quem tem a parte. Inventar número ou data custa mais caro que admitir.
