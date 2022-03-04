import { satiTokenSupply } from "../helpers/variables";

const SatiToken = artifacts.require("SatiToken");

module.exports = async function (deployer) {
  // TOKEN
  await deployer.deploy(SatiToken, satiTokenSupply.total);
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
