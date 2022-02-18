"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const founding_1 = require("./helpers/founding");
const utils_1 = require("./helpers/utils");
const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
contract("SatiTokenSale", (accounts) => {
    const { saleBuyerAccount } = (0, founding_1.nameAccounts)(accounts);
    it("Buyers need to complete KYC verification", async () => {
        const deployedSatiTokenInstance = await SatiToken.deployed();
        const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();
        try {
            await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
                value: "100",
            });
        }
        catch (error) {
            chai_1.assert.equal(error.message, "Returned error: VM Exception while processing transaction: revert You must complete KYC before purchasing tokens -- Reason given: You must complete KYC before purchasing tokens.");
        }
        const buyerBalance = await deployedSatiTokenInstance.balanceOf(saleBuyerAccount);
        chai_1.assert.equal(buyerBalance.toString(), "0");
    });
    it("Buyers need to have enough Ether to buy Sati", async () => {
        const deployedSatiTokenInstance = await SatiToken.deployed();
        const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();
        try {
            await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
                value: (0, utils_1.toUnit)(200),
            });
        }
        catch (error) {
            chai_1.assert.equal(error.message.includes("Reason given: not enough Ether available"), true);
        }
        const buyerBalance = await deployedSatiTokenInstance.balanceOf(saleBuyerAccount);
        chai_1.assert.equal(buyerBalance.toString(), "0");
    });
    it("Sale can distribute token to buyers after KYC verification", async () => {
        const deployedSatiTokenInstance = await SatiToken.deployed();
        const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();
        const kYCValidationInstance = await KYCValidation.deployed();
        await kYCValidationInstance.seKYCCompletedFor(saleBuyerAccount);
        await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
            value: "100",
        });
        const buyerBalance = await deployedSatiTokenInstance.balanceOf(saleBuyerAccount);
        chai_1.assert.equal(buyerBalance.toString(), "10000");
    });
});
//# sourceMappingURL=SatiTokenSale.test.js.map