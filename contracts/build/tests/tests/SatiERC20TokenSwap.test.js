"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const founding_1 = require("../helpers/founding");
const utils_1 = require("../helpers/utils");
const variables_1 = require("../helpers/variables");
const deploy_mocks_1 = require("../helpers/deploy-mocks");
const SatiToken = artifacts.require("SatiToken");
const SatiERC20TokenSwap = artifacts.require("SatiERC20TokenSwap");
const initialSwapTestSatiSupply = "100";
const stiERC20TokenRate = 18;
const freshTokenAndSwapContractsDeploy = async (accounts) => {
    const satiTokenInstance = await SatiToken.new(variables_1.satiTokenSupply.total);
    const erc20TokenInstance = await (0, deploy_mocks_1.deployERC20TokenMockWithAddressOf)((0, founding_1.nameAccounts)(accounts).deployerAccount);
    const mockPriceFeedERC20Token = await (0, deploy_mocks_1.deployPriceFeedMockWithRateOf)(`${stiERC20TokenRate}00000000`);
    const swapInstance = await SatiERC20TokenSwap.new(satiTokenInstance.address, erc20TokenInstance.address, mockPriceFeedERC20Token.address);
    await satiTokenInstance.transfer(swapInstance.address, (0, utils_1.toUnit)(initialSwapTestSatiSupply));
    return {
        satiTokenInstance,
        swapInstance,
        erc20TokenInstance,
    };
};
contract("SatiERC20TokenSwap", (accounts) => {
    const { swapERC20TokenBuyerAccount, swapSatiBuyerAccount } = (0, founding_1.nameAccounts)(accounts);
    const foundAccountWith = (0, founding_1.foundAccountFrom)(accounts);
    let swapInstance;
    let satiTokenInstance;
    let erc20TokenInstance;
    beforeEach(async () => {
        const freshInstances = await freshTokenAndSwapContractsDeploy(accounts);
        swapInstance = freshInstances.swapInstance;
        satiTokenInstance = freshInstances.satiTokenInstance;
        erc20TokenInstance = freshInstances.erc20TokenInstance;
    });
    it("Can not swap ERC20 Token for Sati if there is no more Sati in the contract", async () => {
        const ERC20TokenAmountToEmptySupply = (0, utils_1.toUnit)(Number(initialSwapTestSatiSupply) / stiERC20TokenRate);
        const emptySatiReserve = async () => {
            await erc20TokenInstance.approve(swapInstance.address, ERC20TokenAmountToEmptySupply, {
                from: swapSatiBuyerAccount,
            });
            await swapInstance.swapPairedTokenForSati(ERC20TokenAmountToEmptySupply, {
                from: swapSatiBuyerAccount,
            });
        };
        await foundAccountWith(erc20TokenInstance, {
            accountToFound: swapSatiBuyerAccount,
            amount: (0, utils_1.toUnit)("1000"),
        });
        await emptySatiReserve();
        await erc20TokenInstance.approve(swapInstance.address, (0, utils_1.toUnit)("1"), {
            from: swapSatiBuyerAccount,
        });
        try {
            await swapInstance.swapPairedTokenForSati((0, utils_1.toUnit)("1"), {
                from: swapSatiBuyerAccount,
            });
        }
        catch (error) {
            expect(error.message).equal("Returned error: VM Exception while processing transaction: revert Not enough STI -- Reason given: Not enough STI.");
        }
    });
    it("Can swap ERC20 Token for Sati", async () => {
        const pairedTokenToSwap = (0, utils_1.toUnit)("1");
        const supposedSatiTokenAmount = (0, utils_1.toUnit)(1 * stiERC20TokenRate);
        await foundAccountWith(erc20TokenInstance, {
            accountToFound: swapSatiBuyerAccount,
            amount: pairedTokenToSwap,
        });
        await erc20TokenInstance.approve(swapInstance.address, pairedTokenToSwap, {
            from: swapSatiBuyerAccount,
        });
        await swapInstance.swapPairedTokenForSati(pairedTokenToSwap, {
            from: swapSatiBuyerAccount,
        });
        const swapBuyerSatiBalance = await satiTokenInstance.balanceOf(swapSatiBuyerAccount);
        const swapInstanceSatiBalance = await satiTokenInstance.balanceOf(swapInstance.address);
        expect(swapBuyerSatiBalance.toString()).equal(supposedSatiTokenAmount);
        expect(swapInstanceSatiBalance.toString()).equal((0, utils_1.toUnit)(Number(initialSwapTestSatiSupply) -
            Number((0, utils_1.toToken)(supposedSatiTokenAmount))));
    });
    it("Emit an event with swap info when swapping ERC20Token for sati", async () => {
        await foundAccountWith(erc20TokenInstance, {
            accountToFound: swapSatiBuyerAccount,
            amount: (0, utils_1.toUnit)("1"),
        });
        await erc20TokenInstance.approve(swapInstance.address, (0, utils_1.toUnit)("1"), {
            from: swapSatiBuyerAccount,
        });
        const { logs: swapLogs } = await swapInstance.swapPairedTokenForSati((0, utils_1.toUnit)("1"), {
            from: swapSatiBuyerAccount,
            value: (0, utils_1.toUnit)("1"),
        });
        const [rateEvent, swapRateEvent, swapTransferEvent] = swapLogs;
        expect(rateEvent.event).equal("Rate");
        expect(rateEvent.args.timeStamp.toString()).equal("1");
        expect(rateEvent.args.scaledPrice.toString()).equal((0, utils_1.toUnit)(18));
        expect(swapRateEvent.event).equal("SwapRate");
        expect(swapRateEvent.args.sellingAmount.toString()).equal((0, utils_1.toUnit)(1));
        expect(swapRateEvent.args.buyingAmount.toString()).equal((0, utils_1.toUnit)(18));
        expect(swapTransferEvent.event).equal("SwapTransfer");
        expect(swapTransferEvent.args.beneficiary.toString()).equal(swapSatiBuyerAccount);
        expect(swapTransferEvent.args.amountSent.toString()).equal((0, utils_1.toUnit)(1));
        expect(swapTransferEvent.args.amountReceived.toString()).equal((0, utils_1.toUnit)(18));
    });
    it("Can not swap sati for ERC20 Token if buyer does not have enough sati", async () => {
        try {
            await swapInstance.swapSatiForPairedToken((0, utils_1.toUnit)("100"), {
                from: swapERC20TokenBuyerAccount,
            });
        }
        catch (error) {
            expect(error.message).equal("Returned error: VM Exception while processing transaction: revert Not enough STI -- Reason given: Not enough STI.");
        }
    });
    it("Can swap Sati for ERC20Token", async () => {
        await satiTokenInstance.transfer(swapERC20TokenBuyerAccount, (0, utils_1.toUnit)("100"));
        await foundAccountWith(erc20TokenInstance, {
            accountToFound: swapInstance.address,
            amount: (0, utils_1.toUnit)("100"),
        });
        await satiTokenInstance.increaseAllowance(swapInstance.address, (0, utils_1.toUnit)("100"), {
            from: swapERC20TokenBuyerAccount,
        });
        await swapInstance.swapSatiForPairedToken((0, utils_1.toUnit)("100"), {
            from: swapERC20TokenBuyerAccount,
        });
        const swapBuyerBalance = await satiTokenInstance.balanceOf(swapERC20TokenBuyerAccount);
        const swapInstanceBalance = await satiTokenInstance.balanceOf(swapInstance.address);
        expect(swapBuyerBalance.toString()).equal("0");
        expect(swapInstanceBalance.toString()).equal((0, utils_1.toUnit)(String(Number(initialSwapTestSatiSupply) + 100)));
    });
});
//# sourceMappingURL=SatiERC20TokenSwap.test.js.map