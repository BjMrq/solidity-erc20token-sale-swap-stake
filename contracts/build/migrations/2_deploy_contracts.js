"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
const SatiEthSwap = artifacts.require("SatiEthSwap");
module.exports = async function (deployer) {
    const tokenSupply = {
        total: "1000000000000000000000000",
        swap: "500000000000000000000000",
        sale: "500000000000000000000000", // totalSupply / 2
    };
    const [deployerAddresses] = await web3.eth.getAccounts();
    // TOKEN
    await deployer.deploy(SatiToken, tokenSupply.total);
    const satiToken = await SatiToken.deployed();
    // SALE
    await deployer.deploy(KYCValidation);
    await deployer.deploy(SatiTokenSale, 1, deployerAddresses, SatiToken.address, KYCValidation.address);
    await satiToken.transfer(SatiTokenSale.address, tokenSupply.sale);
    //SatiEthSwap
    await deployer.deploy(SatiEthSwap, SatiToken.address);
    await satiToken.transfer(SatiEthSwap.address, tokenSupply.swap);
};
//# sourceMappingURL=2_deploy_contracts.js.map