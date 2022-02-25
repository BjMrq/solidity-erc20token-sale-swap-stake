"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../helpers/variables");
const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
module.exports = async function (deployer) {
    const [deployerAddress] = await web3.eth.getAccounts();
    // SALE
    const satiToken = await SatiToken.deployed();
    await deployer.deploy(KYCValidation);
    await deployer.deploy(SatiTokenSale, 100, deployerAddress, SatiToken.address, KYCValidation.address);
    await satiToken.transfer(SatiTokenSale.address, variables_1.satiTokenSupply.sale);
};
//# sourceMappingURL=3_deploy_sati_sale.js.map