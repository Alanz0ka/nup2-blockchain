import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.getOrCreate();

describe("Votacao", function () {
  async function implantar() {
    const [dono, ana, bia] = await ethers.getSigners();
    const votacao = await ethers.deployContract("Votacao", [
      "Melhor linguagem",
      ["Solidity", "Rust", "Go"],
    ]);
    return { votacao, dono, ana, bia };
  }

  it("guarda o dono, o titulo e as opcoes", async function () {
    const { votacao, dono } = await implantar();
    expect(await votacao.dono()).to.equal(dono.address);
    expect(await votacao.titulo()).to.equal("Melhor linguagem");
    expect(await votacao.totalOpcoes()).to.equal(3n);
    expect(await votacao.nomeDaOpcao(1)).to.equal("Rust");
  });

  it("registra o voto e emite o evento", async function () {
    const { votacao, ana } = await implantar();
    await expect(votacao.connect(ana).votar(0))
      .to.emit(votacao, "VotoRegistrado")
      .withArgs(ana.address, 0n);
    expect(await votacao.votos(0)).to.equal(1n);
    expect(await votacao.jaVotou(ana.address)).to.equal(true);
  });

  it("nao deixa o mesmo endereco votar duas vezes", async function () {
    const { votacao, ana } = await implantar();
    await votacao.connect(ana).votar(1);
    await expect(votacao.connect(ana).votar(1)).to.be.revertedWithCustomError(
      votacao,
      "JaVotou",
    );
  });

  it("rejeita opcao inexistente", async function () {
    const { votacao, ana } = await implantar();
    await expect(votacao.connect(ana).votar(9)).to.be.revertedWithCustomError(
      votacao,
      "OpcaoInvalida",
    );
  });

  it("so o dono encerra e depois ninguem mais vota", async function () {
    const { votacao, dono, ana, bia } = await implantar();
    await expect(votacao.connect(ana).encerrar()).to.be.revertedWithCustomError(
      votacao,
      "SomenteDono",
    );
    await votacao.connect(ana).votar(2);
    await expect(votacao.connect(dono).encerrar())
      .to.emit(votacao, "VotacaoEncerrada")
      .withArgs(2n, 1n);
    await expect(votacao.connect(bia).votar(0)).to.be.revertedWithCustomError(
      votacao,
      "VotacaoFechada",
    );
  });
});
