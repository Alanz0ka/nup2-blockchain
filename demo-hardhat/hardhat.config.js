import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  solidity: "0.8.28",
  networks: {
    // Rede local persistente: `npx hardhat node` em outro terminal
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
  },
});
