"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
module.exports = async function (deployer) {
    const initialSupply = 1000000;
    const [deployerAddresses] = await web3.eth.getAccounts();
    await deployer.deploy(SatiToken, initialSupply);
    await deployer.deploy(KYCValidation);
    await deployer.deploy(SatiTokenSale, 1, deployerAddresses, SatiToken.address, KYCValidation.address);
    const satiToken = await SatiToken.deployed();
    await satiToken.transfer(SatiTokenSale.address, initialSupply / 2);
};
//# sourceMappingURL=2_deploy_contracts.js.map