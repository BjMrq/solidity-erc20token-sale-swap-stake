const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: "./contracts/source",
  contracts_build_directory: "./contracts/build/contracts",
  test_directory: "./contracts/build/tests",
  migrations_directory: "./contracts/build/migrations",
  compilers: {
    solc: {
      version: "^0.8.11",
    },
  },
  networks: {
    development: {
      network_id: "5777",
      host: "127.0.0.1",
      port: 8545,
    },
  },
};
