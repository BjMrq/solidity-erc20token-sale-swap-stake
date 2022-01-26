"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const founding_1 = require("./helpers/founding");
const utils_1 = require("./helpers/utils");
const variables_1 = require("./helpers/variables");
const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
const MockPriceFeed = artifacts.require("MockV3Aggregator");
const Ratable = artifacts.require("Ratable");
const initialSwapTestSatiSupply = "1000";
const freshTokenAndSwapContractsDeploy = async (accounts) => {
    const satiTokenInstance = await SatiToken.new(variables_1.tokenSupply.total);
    const kYCValidationInstance = await KYCValidation.new();
    const saleTokenInstance = await SatiTokenSale.new(variables_1.satiToEthRate, (0, founding_1.nameAccounts)(accounts).deployerAccount, satiTokenInstance.address, kYCValidationInstance.address);
    await satiTokenInstance.transfer(saleTokenInstance.address, variables_1.tokenSupply.sale);
    const swapInstance = await SatiEthSwap.new(satiTokenInstance.address);
    await satiTokenInstance.transfer(swapInstance.address, (0, utils_1.token)(initialSwapTestSatiSupply));
    return {
        satiTokenInstance,
        swapInstance,
        saleTokenInstance,
        kYCValidationInstance,
    };
};
const buySatiTokenOnSaleInit = (satiTokenInstance, kYCValidationInstance) => async (saleBuyerAccount, tokenAmount) => {
    await kYCValidationInstance.seKYCCompletedFor(saleBuyerAccount);
    return await satiTokenInstance.buyTokens(saleBuyerAccount, {
        value: (0, utils_1.token)(String(Number(tokenAmount) / variables_1.satiToEthRate)),
    });
};
contract("EthSwap", (accounts) => {
    const { deployerAccount, swapEthBuyerAccount, swapSatiBuyerAccount, swapRateBuyerAccount, } = (0, founding_1.nameAccounts)(accounts);
    let swapInstance;
    let satiTokenInstance;
    let saleTokenInstance;
    let buySatiTokenOnSale;
    beforeEach(async () => {
        const freshInstances = await freshTokenAndSwapContractsDeploy(accounts);
        swapInstance = freshInstances.swapInstance;
        satiTokenInstance = freshInstances.satiTokenInstance;
        saleTokenInstance = freshInstances.saleTokenInstance;
        buySatiTokenOnSale = buySatiTokenOnSaleInit(saleTokenInstance, freshInstances.kYCValidationInstance);
    });
    it("Can not swap ether for Sati if there is no more Sati in the contract", async () => {
        await swapInstance.swapEthForSati({
            from: swapSatiBuyerAccount,
            value: (0, utils_1.token)(String(Number(initialSwapTestSatiSupply) / 100)),
        });
        try {
            await swapInstance.swapEthForSati({
                from: swapSatiBuyerAccount,
                value: (0, utils_1.token)("1"),
            });
        }
        catch (error) {
            expect(error.message).equal("Returned error: VM Exception while processing transaction: revert not enough Sati available -- Reason given: not enough Sati available.");
        }
    });
    it.only("Can swap ether for Sati", async () => {
        const mockPriceFeed = await MockPriceFeed.new(8, 100, 1, 1, 1);
        await swapInstance.swapEthForSati({
            from: swapSatiBuyerAccount,
            value: (0, utils_1.token)("1"),
        });
        const swapBuyerBalance = await satiTokenInstance.balanceOf(swapSatiBuyerAccount);
        const swapInstanceBalance = await satiTokenInstance.balanceOf(swapInstance.address);
        expect(swapInstanceBalance.toString()).equal((0, utils_1.token)(String(Number(initialSwapTestSatiSupply) - 100)));
        expect(swapBuyerBalance.toString()).equal((0, utils_1.token)("100"));
    });
    it("Emit an event with swap info when swapping eth for sati", async () => {
        const { logs: swapLogs } = await swapInstance.swapEthForSati({
            from: swapSatiBuyerAccount,
            value: (0, utils_1.token)("1"),
        });
        expect(swapLogs[0].event).equal("SwapTransfer");
        expect(swapLogs[0].args.swapName).equal("Eth to Sati");
        expect(swapLogs[0].args.beneficiary).equal(swapSatiBuyerAccount);
        expect(swapLogs[0].args.amountSent.toString()).equal((0, utils_1.token)("1"));
        expect(swapLogs[0].args.amountReceived.toString()).equal((0, utils_1.token)("100"));
    });
    it("Can not swap sati for ether if buyer does not have enough sati", async () => {
        try {
            await swapInstance.swapSatiForEth((0, utils_1.token)("100"), {
                from: swapEthBuyerAccount,
            });
        }
        catch (error) {
            expect(error.message).equal("Returned error: VM Exception while processing transaction: revert not enough Sati available -- Reason given: not enough Sati available.");
        }
    });
    it("Can swap Sati for eth", async () => {
        await buySatiTokenOnSale(swapEthBuyerAccount, "100");
        await satiTokenInstance.increaseAllowance(swapInstance.address, (0, utils_1.token)("100"), {
            from: swapEthBuyerAccount,
        });
        await swapInstance.swapSatiForEth((0, utils_1.token)("100"), {
            from: swapEthBuyerAccount,
        });
        const swapBuyerBalance = await satiTokenInstance.balanceOf(swapEthBuyerAccount);
        const swapInstanceBalance = await satiTokenInstance.balanceOf(swapInstance.address);
        expect(swapBuyerBalance.toString()).equal("0");
        expect(swapInstanceBalance.toString()).equal((0, utils_1.token)(String(Number(initialSwapTestSatiSupply) + 100)));
    });
});
//# sourceMappingURL=EthSwap.test.js.map