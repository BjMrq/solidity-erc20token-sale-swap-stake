import { deployPriceFeedMockWithRateOf } from "../helpers/deploy-mocks";
import { nameAccounts } from "../helpers/founding";
import { toToken, toUnit } from "../helpers/utils";
import { satiTokenSupply } from "../helpers/variables";
import { SatiEthSwapInstance, SatiTokenInstance } from "../types";

const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");

const initialSwapTestSatiSupply = "10000";

const stiEthRate = 3650;

const freshTokenAndSwapContractsDeploy = async (accounts: Truffle.Accounts) => {
  const satiTokenInstance = await SatiToken.new(satiTokenSupply.total);

  const mockPriceFeedEth = await deployPriceFeedMockWithRateOf(
    `${stiEthRate}00000000`
  );

  const swapInstance = await SatiEthSwap.new(
    satiTokenInstance.address,
    mockPriceFeedEth.address
  );

  await satiTokenInstance.transfer(
    swapInstance.address,
    toUnit(initialSwapTestSatiSupply)
  );

  return {
    satiTokenInstance,
    swapInstance,
  };
};

contract("SatiEthSwap", (accounts) => {
  const { swapEthBuyerAccount, swapSatiBuyerAccount } = nameAccounts(accounts);

  let swapInstance: SatiEthSwapInstance;
  let satiTokenInstance: SatiTokenInstance;

  beforeEach(async () => {
    const freshInstances = await freshTokenAndSwapContractsDeploy(accounts);

    swapInstance = freshInstances.swapInstance;
    satiTokenInstance = freshInstances.satiTokenInstance;
  });

  it("Can not swap ether for Sati if there is no more Sati in the contract", async () => {
    const ethAmountToEmptySupply = toUnit(
      Number(initialSwapTestSatiSupply) / stiEthRate
    );

    const emptySatiReserve = async () =>
      await swapInstance.swapPairedTokenForSati(ethAmountToEmptySupply, {
        from: swapSatiBuyerAccount,
        value: ethAmountToEmptySupply,
      });

    await emptySatiReserve();

    try {
      await swapInstance.swapPairedTokenForSati(toUnit("1"), {
        from: swapSatiBuyerAccount,
      });
    } catch (error) {
      expect((error as Error).message).equal(
        "Returned error: VM Exception while processing transaction: revert Not enough STI -- Reason given: Not enough STI."
      );
    }
  });

  it("Can swap ether for Sati", async () => {
    await swapInstance.swapPairedTokenForSati(toUnit("1"), {
      from: swapSatiBuyerAccount,
      value: toUnit("1"),
    });

    const swapBuyerBalance = await satiTokenInstance.balanceOf(
      swapSatiBuyerAccount
    );

    const swapInstanceBalance = await satiTokenInstance.balanceOf(
      swapInstance.address
    );

    const satiAmountFromEth = toUnit(stiEthRate);

    expect(swapBuyerBalance.toString()).equal(satiAmountFromEth);
    expect(swapInstanceBalance.toString()).equal(
      toUnit(
        Number(initialSwapTestSatiSupply) - Number(toToken(satiAmountFromEth))
      )
    );
  });

  it("Emit an event with swap info when swapping eth for sati", async () => {
    const { logs: swapLogs } = await swapInstance.swapPairedTokenForSati(
      toUnit("1"),
      {
        from: swapSatiBuyerAccount,
        value: toUnit("1"),
      }
    );

    const [rateEvent, swapRateEvent, swapTransferEvent] = swapLogs as {
      event: string;
      args: any;
    }[];

    expect(rateEvent.event).equal("Rate");
    expect(rateEvent.args.timeStamp.toString()).equal("1");
    expect(rateEvent.args.scaledPrice.toString()).equal(toUnit(3650));

    expect(swapRateEvent.event).equal("SwapRate");
    expect(swapRateEvent.args.sellingAmount.toString()).equal(toUnit(1));
    expect(swapRateEvent.args.buyingAmount.toString()).equal(toUnit(3650));

    expect(swapTransferEvent.event).equal("SwapTransfer");
    expect(swapTransferEvent.args.beneficiary.toString()).equal(
      swapSatiBuyerAccount
    );
    expect(swapTransferEvent.args.amountSent.toString()).equal(toUnit(1));
    expect(swapTransferEvent.args.amountReceived.toString()).equal(
      toUnit(3650)
    );
  });

  it("Can not swap sati for ether if buyer does not have enough sati", async () => {
    try {
      await swapInstance.swapSatiForPairedToken(toUnit("100"), {
        from: swapEthBuyerAccount,
      });
    } catch (error) {
      expect((error as Error).message).equal(
        "Returned error: VM Exception while processing transaction: revert Not enough STI -- Reason given: Not enough STI."
      );
    }
  });

  it("Can swap Sati for eth", async () => {
    await satiTokenInstance.transfer(swapEthBuyerAccount, toUnit("100"));

    await satiTokenInstance.increaseAllowance(
      swapInstance.address,
      toUnit("100"),
      {
        from: swapEthBuyerAccount,
      }
    );

    await swapInstance.swapSatiForPairedToken(toUnit("100"), {
      from: swapEthBuyerAccount,
    });

    const swapBuyerBalance = await satiTokenInstance.balanceOf(
      swapEthBuyerAccount
    );

    const swapInstanceBalance = await satiTokenInstance.balanceOf(
      swapInstance.address
    );

    expect(swapBuyerBalance.toString()).equal("0");
    expect(swapInstanceBalance.toString()).equal(
      toUnit(String(Number(initialSwapTestSatiSupply) + 100))
    );
  });
});
