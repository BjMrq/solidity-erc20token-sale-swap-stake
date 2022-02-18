"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./helpers/utils");
const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const SatiEthSwap = artifacts.require("SatiEthSwap");
contract("Deployment state", (accounts) => {
    it("SatiToken is deployed with the correct initial supply", async () => {
        const deployedSatiTokenInstance = await SatiToken.deployed();
        const totalSupply = await deployedSatiTokenInstance.totalSupply();
        assert.equal(totalSupply.toString(), (0, utils_1.toUnit)("1000000"));
    });
    it("Sale contract is deployed with half Sati token supply", async () => {
        const deployedSatiTokenInstance = await SatiToken.deployed();
        const saleContractBalance = await deployedSatiTokenInstance.balanceOf(SatiTokenSale.address);
        assert.equal(saleContractBalance.toString(), (0, utils_1.toUnit)("500000"));
    });
    it("Swap contract is deployed with half Sati token supply", async () => {
        const deployedSatiTokenInstance = await SatiToken.deployed();
        const swapInstance = await SatiEthSwap.deployed();
        const swapContractBalance = await deployedSatiTokenInstance.balanceOf(swapInstance.address);
        assert.equal(swapContractBalance.toString(), (0, utils_1.toUnit)("250000"));
    });
});
//# sourceMappingURL=Deployement.test.js.map