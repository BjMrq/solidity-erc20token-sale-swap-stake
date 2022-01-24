"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const founding_1 = require("./helpers/founding");
const utils_1 = require("./helpers/utils");
const variables_1 = require("./helpers/variables");
const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const freshTokenAndSwapContractsDeploy = async () => {
    const satiTokenInstance = await SatiToken.new(variables_1.tokenSupply.total);
    const swapInstance = await SatiEthSwap.new(satiTokenInstance.address);
    await satiTokenInstance.transfer(swapInstance.address, (0, utils_1.numberOfToken)("1000"));
    return { satiTokenInstance, swapInstance };
};
contract("EthSwap", (accounts) => {
    const { deployerAccount, swapBuyerAccount, swapBuyerAccount2 } = (0, founding_1.nameAccounts)(accounts);
    let swapInstance;
    let satiTokenInstance;
    beforeEach(async () => {
        const freshInstances = await freshTokenAndSwapContractsDeploy();
        swapInstance = freshInstances.swapInstance;
        satiTokenInstance = freshInstances.satiTokenInstance;
    });
    it("Can swap ether for Sati", async () => {
        await swapInstance.swapEthForSati({
            from: swapBuyerAccount,
            value: web3.utils.toWei("1", "ether"),
        });
        const swapBuyerBalance = await satiTokenInstance.balanceOf(swapBuyerAccount);
        expect(swapBuyerBalance.toString()).equal((0, utils_1.numberOfToken)("100"));
    });
    it("Change the sati eth rate", async () => {
        await swapInstance.setEthToSatiRate(200, {
            from: deployerAccount,
        });
        await swapInstance.swapEthForSati({
            from: swapBuyerAccount2,
            value: web3.utils.toWei("1", "ether"),
        });
        const swapBuyerBalance = await satiTokenInstance.balanceOf(swapBuyerAccount2);
        expect(swapBuyerBalance.toString()).equal((0, utils_1.numberOfToken)("200"));
    });
});
//# sourceMappingURL=EthSwap.test.js.map