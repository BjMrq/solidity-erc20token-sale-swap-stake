"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const founding_1 = require("./helpers/founding");
const utils_1 = require("./helpers/utils");
const variables_1 = require("./helpers/variables");
const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const MockPriceFeed = artifacts.require("MockV3Aggregator");
const initialSwapTestSatiSupply = "10000";
const stiEthRate = 365;
const freshTokenAndSwapContractsDeploy = async (accounts) => {
    const satiTokenInstance = await SatiToken.new(variables_1.tokenSupply.total);
    const mockPriceFeedEth = await MockPriceFeed.new(8, `${stiEthRate}00000000`, 1, 1, 1);
    const swapInstance = await SatiEthSwap.new(satiTokenInstance.address, mockPriceFeedEth.address);
    await satiTokenInstance.transfer(swapInstance.address, (0, utils_1.toUnit)(initialSwapTestSatiSupply));
    return {
        satiTokenInstance,
        swapInstance,
    };
};
contract("EthSwap", (accounts) => {
    const { deployerAccount, swapEthBuyerAccount, swapSatiBuyerAccount, swapRateBuyerAccount, } = (0, founding_1.nameAccounts)(accounts);
    let swapInstance;
    let satiTokenInstance;
    beforeEach(async () => {
        const freshInstances = await freshTokenAndSwapContractsDeploy(accounts);
        swapInstance = freshInstances.swapInstance;
        satiTokenInstance = freshInstances.satiTokenInstance;
    });
    // it("Can not swap ether for Sati if there is no more Sati in the contract", async () => {
    //   const emptySatiReserve = async () =>
    //     await swapInstance.swapTokenForSatiSwap(
    //       toUnit(Number(initialSwapTestSatiSupply) / stiEthRate),
    //       {
    //         from: swapSatiBuyerAccount,
    //       }
    //     );
    //   await emptySatiReserve();
    //   try {
    //     await swapInstance.swapTokenForSatiSwap(toUnit("1"), {
    //       from: swapSatiBuyerAccount,
    //     });
    //   } catch (error) {
    //     expect((error as Error).message).equal(
    //       "Returned error: VM Exception while processing transaction: revert Not enough STI -- Reason given: Not enough STI."
    //     );
    //   }
    // });
    // it.only("Can swap ether for Sati", async () => {
    //   console.log(
    //     (await satiTokenInstance.balanceOf(swapInstance.address)).toString()
    //   );
    //   console.log(
    //     JSON.stringify(
    //       await swapInstance.getAmountOfSatiFromSwaptoToken("10000"),
    //       undefined,
    //       2
    //     )
    //   );
    //   try {
    //     const thing = await swapInstance.swapTokenForSatiSwap(toUnit("1"), {
    //       from: swapSatiBuyerAccount,
    //     });
    //     console.log(JSON.stringify(thing.logs, undefined, 2));
    //     const swapBuyerBalance = await satiTokenInstance.balanceOf(
    //       swapSatiBuyerAccount
    //     );
    //     const swapInstanceBalance = await satiTokenInstance.balanceOf(
    //       swapInstance.address
    //     );
    //     expect(swapInstanceBalance.toString()).equal(
    //       toUnit(String(Number(initialSwapTestSatiSupply) - 100))
    //     );
    //     expect(swapBuyerBalance.toString()).equal(toUnit("100"));
    //   } catch (error) {
    //     console.log(JSON.stringify(error, undefined, 2));
    //   }
    // });
    // it("Emit an event with swap info when swapping eth for sati", async () => {
    //   const { logs: swapLogs } = await swapInstance.swapEthForSati({
    //     from: swapSatiBuyerAccount,
    //     value: toUnit("1"),
    //   });
    //   expect(swapLogs[0].event).equal("SwapTransfer");
    //   expect(swapLogs[0].args.swapName).equal("Eth to Sati");
    //   expect(swapLogs[0].args.beneficiary).equal(swapSatiBuyerAccount);
    //   expect(swapLogs[0].args.amountSent.toString()).equal(toUnit("1"));
    //   expect(swapLogs[0].args.amountReceived.toString()).equal(toUnit("100"));
    // });
    // it("Can not swap sati for ether if buyer does not have enough sati", async () => {
    //   try {
    //     await swapInstance.swapSatiForEth(toUnit("100"), {
    //       from: swapEthBuyerAccount,
    //     });
    //   } catch (error) {
    //     expect((error as Error).message).equal(
    //       "Returned error: VM Exception while processing transaction: revert not enough Sati available -- Reason given: not enough Sati available."
    //     );
    //   }
    // });
    // it("Can swap Sati for eth", async () => {
    //   await buySatiTokenOnSale(swapEthBuyerAccount, "100");
    //   await satiTokenInstance.increaseAllowance(
    //     swapInstance.address,
    //     toUnit("100"),
    //     {
    //       from: swapEthBuyerAccount,
    //     }
    //   );
    //   await swapInstance.swapSatiForEth(toUnit("100"), {
    //     from: swapEthBuyerAccount,
    //   });
    //   const swapBuyerBalance = await satiTokenInstance.balanceOf(
    //     swapEthBuyerAccount
    //   );
    //   const swapInstanceBalance = await satiTokenInstance.balanceOf(
    //     swapInstance.address
    //   );
    //   expect(swapBuyerBalance.toString()).equal("0");
    //   expect(swapInstanceBalance.toString()).equal(
    //     toUnit(String(Number(initialSwapTestSatiSupply) + 100))
    //   );
    // });
});
//# sourceMappingURL=SatiSwapTokenSwap.test.js.map