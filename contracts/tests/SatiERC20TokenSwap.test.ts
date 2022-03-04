import {
  deployERC20TokenMockWithAddressOf,
  deployPriceFeedMockWithRateOf
} from "../helpers/deploy-mocks";
import { foundAccountFrom, nameAccounts } from "../helpers/founding";
import { toToken, toUnit } from "../helpers/utils";
import { satiTokenSupply } from "../helpers/variables";
import {
  MockERC20TokenInstance, SatiERC20TokenSwapInstance,
  SatiTokenInstance
} from "../types";

const SatiToken = artifacts.require("SatiToken");
const SatiERC20TokenSwap = artifacts.require("SatiERC20TokenSwap");

const initialSwapTestSatiSupply = "100";

const stiERC20TokenRate = 18;

const freshTokenAndSwapContractsDeploy = async (accounts: Truffle.Accounts) => {
  const satiTokenInstance = await SatiToken.new(satiTokenSupply.total);

  const erc20TokenInstance = await deployERC20TokenMockWithAddressOf(
    nameAccounts(accounts).deployerAccount
  );

  const mockPriceFeedERC20Token = await deployPriceFeedMockWithRateOf(
    `${stiERC20TokenRate}00000000`
  );

  const swapInstance = await SatiERC20TokenSwap.new(
    satiTokenInstance.address,
    erc20TokenInstance.address,
    mockPriceFeedERC20Token.address
  );

  await satiTokenInstance.transfer(
    swapInstance.address,
    toUnit(initialSwapTestSatiSupply)
  );

  return {
    satiTokenInstance,
    swapInstance,
    erc20TokenInstance,
  };
};

contract("SatiERC20TokenSwap", (accounts) => {
  const { swapERC20TokenBuyerAccount, swapSatiBuyerAccount } =
    nameAccounts(accounts);

  const foundAccountWith = foundAccountFrom(accounts);

  let swapInstance: SatiERC20TokenSwapInstance;
  let satiTokenInstance: SatiTokenInstance;
  let erc20TokenInstance: MockERC20TokenInstance;

  beforeEach(async () => {
    const freshInstances = await freshTokenAndSwapContractsDeploy(accounts);

    swapInstance = freshInstances.swapInstance;
    satiTokenInstance = freshInstances.satiTokenInstance;
    erc20TokenInstance = freshInstances.erc20TokenInstance;
  });

  it("Can not swap ERC20 Token for Sati if there is no more Sati in the contract", async () => {
    const ERC20TokenAmountToEmptySupply = toUnit(
      Number(initialSwapTestSatiSupply) / stiERC20TokenRate
    );

    const emptySatiReserve = async () => {
      await erc20TokenInstance.approve(
        swapInstance.address,
        ERC20TokenAmountToEmptySupply,
        {
          from: swapSatiBuyerAccount,
        }
      );

      await swapInstance.swapPairedTokenForSati(ERC20TokenAmountToEmptySupply, {
        from: swapSatiBuyerAccount,
      });
    };

    await foundAccountWith(erc20TokenInstance, {
      accountToFound: swapSatiBuyerAccount,
      amount: toUnit("1000"),
    });

    await emptySatiReserve();

    await erc20TokenInstance.approve(swapInstance.address, toUnit("1"), {
      from: swapSatiBuyerAccount,
    });

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

  it("Can swap ERC20 Token for Sati", async () => {
    const pairedTokenToSwap = toUnit("1");
    const supposedSatiTokenAmount = toUnit(1 * stiERC20TokenRate);

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

    const swapBuyerSatiBalance = await satiTokenInstance.balanceOf(
      swapSatiBuyerAccount
    );

    const swapInstanceSatiBalance = await satiTokenInstance.balanceOf(
      swapInstance.address
    );

    expect(swapBuyerSatiBalance.toString()).equal(supposedSatiTokenAmount);
    expect(swapInstanceSatiBalance.toString()).equal(
      toUnit(
        Number(initialSwapTestSatiSupply) -
          Number(toToken(supposedSatiTokenAmount))
      )
    );
  });

  it("Emit an event with swap info when swapping ERC20Token for sati", async () => {
    await foundAccountWith(erc20TokenInstance, {
      accountToFound: swapSatiBuyerAccount,
      amount: toUnit("1"),
    });

    await erc20TokenInstance.approve(swapInstance.address, toUnit("1"), {
      from: swapSatiBuyerAccount,
    });

    const { logs: swapLogs } = await swapInstance.swapPairedTokenForSati(
      toUnit("1"),
      {
        from: swapSatiBuyerAccount,
        value: toUnit("1"),
      }
    );

    const [rateEvent, swapRateEvent, swapTransferEvent] = swapLogs;

    expect(rateEvent.event).equal("Rate");
    //@ts-expect-error
    expect(rateEvent.args.timeStamp.toString()).equal("1");
    //@ts-expect-error
    expect(rateEvent.args.scaledPrice.toString()).equal(toUnit(18));

    expect(swapRateEvent.event).equal("SwapRate");
    //@ts-expect-error
    expect(swapRateEvent.args.sellingAmount.toString()).equal(toUnit(1));
    //@ts-expect-error
    expect(swapRateEvent.args.buyingAmount.toString()).equal(toUnit(18));

    expect(swapTransferEvent.event).equal("SwapTransfer");
    //@ts-expect-error
    expect(swapTransferEvent.args.beneficiary.toString()).equal(
      swapSatiBuyerAccount
    );
    //@ts-expect-error
    expect(swapTransferEvent.args.amountSent.toString()).equal(toUnit(1));
    //@ts-expect-error
    expect(swapTransferEvent.args.amountReceived.toString()).equal(toUnit(18));
  });

  it("Can not swap sati for ERC20 Token if buyer does not have enough sati", async () => {
    try {
      await swapInstance.swapSatiForPairedToken(toUnit("100"), {
        from: swapERC20TokenBuyerAccount,
      });
    } catch (error) {
      expect((error as Error).message).equal(
        "Returned error: VM Exception while processing transaction: revert Not enough STI -- Reason given: Not enough STI."
      );
    }
  });

  it("Can swap Sati for ERC20Token", async () => {
    await satiTokenInstance.transfer(swapERC20TokenBuyerAccount, toUnit("100"));

    await foundAccountWith(erc20TokenInstance, {
      accountToFound: swapInstance.address,
      amount: toUnit("100"),
    });

    await satiTokenInstance.increaseAllowance(
      swapInstance.address,
      toUnit("100"),
      {
        from: swapERC20TokenBuyerAccount,
      }
    );

    await swapInstance.swapSatiForPairedToken(toUnit("100"), {
      from: swapERC20TokenBuyerAccount,
    });

    const swapBuyerBalance = await satiTokenInstance.balanceOf(
      swapERC20TokenBuyerAccount
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
