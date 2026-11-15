// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Votação simples para a demonstração do seminário NUP2.
/// Quem publica o contrato vira o dono, define as opções e pode encerrar.
/// Cada endereço vota uma única vez enquanto a votação estiver aberta.
contract Votacao {
    address public dono;
    string public titulo;
    string[] private opcoes;
    mapping(uint256 => uint256) public votos;
    mapping(address => bool) public jaVotou;
    bool public aberta = true;

    event VotoRegistrado(address indexed eleitor, uint256 indexed opcao);
    event VotacaoEncerrada(uint256 vencedor, uint256 votosDoVencedor);

    error SomenteDono();
    error VotacaoFechada();
    error JaVotou();
    error OpcaoInvalida();

    modifier somenteDono() {
        if (msg.sender != dono) revert SomenteDono();
        _;
    }

    constructor(string memory _titulo, string[] memory _opcoes) {
        require(_opcoes.length >= 2, "Informe ao menos duas opcoes");
        dono = msg.sender;
        titulo = _titulo;
        opcoes = _opcoes;
    }

    function votar(uint256 opcao) external {
        if (!aberta) revert VotacaoFechada();
        if (jaVotou[msg.sender]) revert JaVotou();
        if (opcao >= opcoes.length) revert OpcaoInvalida();

        jaVotou[msg.sender] = true;
        votos[opcao] += 1;
        emit VotoRegistrado(msg.sender, opcao);
    }

    function encerrar() external somenteDono {
        if (!aberta) revert VotacaoFechada();
        aberta = false;

        uint256 vencedor = 0;
        for (uint256 i = 1; i < opcoes.length; i++) {
            if (votos[i] > votos[vencedor]) vencedor = i;
        }
        emit VotacaoEncerrada(vencedor, votos[vencedor]);
    }

    function totalOpcoes() external view returns (uint256) {
        return opcoes.length;
    }

    function nomeDaOpcao(uint256 i) external view returns (string memory) {
        if (i >= opcoes.length) revert OpcaoInvalida();
        return opcoes[i];
    }
}
