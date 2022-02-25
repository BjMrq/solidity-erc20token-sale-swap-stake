import { satiTokenSupply } from "../helpers/variables";

const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");

module.exports = async function (deployer) {
  const [deployerAddress] = await web3.eth.getAccounts();

  // SALE
  const satiToken = await SatiToken.deployed();

  await deployer.deploy(KYCValidation);
  await deployer.deploy(
    SatiTokenSale,
    100,
    deployerAddress,
    SatiToken.address,
    KYCValidation.address
  );

  await satiToken.transfer(SatiTokenSale.address, satiTokenSupply.sale);
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
