require("dotenv").config();
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: "./contracts/source",
  contracts_build_directory: "./contracts/build/abis",
  test_directory: "./contracts/build/tests/tests",
  migrations_directory: "./contracts/build/migrations/migrations",
  compilers: {
    solc: {
      version: "0.8.12",
      optimizer: {
        enable: true,
        runs: 200,
      },
      evmVersion: "byzantium",
    },
  },
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545,
      gas: 4612388,
    },
    ganache: {
      provider() {
        return new HDWalletProvider(
          "torch blur drum ridge venue surface ecology round pond happy maximum crush",
          "http://127.0.0.1:8545",
          0
        );
      },
      network_id: "1337",
      gas: 4612388,
    },
    kovan: {
      provider() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.KOVAN_NODE_ENDPOINT,
          0
        );
      },
      network_id: "42",
    },
    rinkeby: {
      provider() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.RINKEBY_NODE_ENDPOINT,
          0
        );
      },
      network_id: "4",
    },
  },
};
