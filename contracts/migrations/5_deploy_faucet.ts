const Faucet = artifacts.require("Faucet");

module.exports = async function (deployer) {
  // TOKEN
  await deployer.deploy(Faucet);
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
