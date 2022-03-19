import {
  deployERC20TokenMock,
  deployPriceFeedMockWithRateOf,
} from "../helpers/deploy-mocks";
import { foundAddressFrom, nameAccounts } from "../helpers/founding";
import { toToken, toUnit } from "../helpers/utils";
import { satiTokenSupply } from "../helpers/variables";
import {
  MockERC20TokenInstance,
  ERC20TokensSwapInstance,
  SatiTokenInstance,
} from "../types";

const SatiToken = artifacts.require("SatiToken");
const ERC20TokensSwap = artifacts.require("ERC20TokensSwap");

const initialSwapTestSatiSupply = "100";

const stiERC20TokenRate = 18;

const freshTokenAndSwapContractsDeploy = async (accounts: Truffle.Accounts) => {
  const satiTokenInstance = await SatiToken.new(satiTokenSupply.total);

  const erc20TokenInstance = await deployERC20TokenMock("Chain link", "LINK");

  const mockPriceFeedERC20Token = await deployPriceFeedMockWithRateOf(
    `${stiERC20TokenRate}00000000`
  );

  const swapInstance = await ERC20TokensSwap.new(
    erc20TokenInstance.address,
    satiTokenInstance.address,
    mockPriceFeedERC20Token.address
  );

  await satiTokenInstance.transfer(
    swapInstance.address,
    toUnit(initialSwapTestSatiSupply)
  );

  await erc20TokenInstance.transfer(
    swapInstance.address,
    "50000000000000000000000"
  );

  return {
    satiTokenInstance,
    swapInstance,
    erc20TokenInstance,
  };
};

contract("ERC20TokensSwap", (accounts) => {
  const { swapERC20TokenBuyerAccount, swapSatiBuyerAccount } =
    nameAccounts(accounts);

  const foundAddressWith = foundAddressFrom(accounts);

  let swapInstance: ERC20TokensSwapInstance;
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

      await swapInstance.swapBaseForQuoteToken(ERC20TokenAmountToEmptySupply, {
        from: swapSatiBuyerAccount,
      });
    };

    await foundAddressWith(erc20TokenInstance, {
      addressToFound: swapSatiBuyerAccount,
      amount: toUnit("1000"),
    });

    await emptySatiReserve();

    await erc20TokenInstance.approve(swapInstance.address, toUnit("1"), {
      from: swapSatiBuyerAccount,
    });

    try {
      await swapInstance.swapBaseForQuoteToken(toUnit("1"), {
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

    await foundAddressWith(erc20TokenInstance, {
      addressToFound: swapSatiBuyerAccount,
      amount: pairedTokenToSwap,
    });

    await erc20TokenInstance.approve(swapInstance.address, pairedTokenToSwap, {
      from: swapSatiBuyerAccount,
    });

    await swapInstance.swapBaseForQuoteToken(pairedTokenToSwap, {
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
    await foundAddressWith(erc20TokenInstance, {
      addressToFound: swapSatiBuyerAccount,
      amount: toUnit("1"),
    });

    await erc20TokenInstance.approve(swapInstance.address, toUnit("1"), {
      from: swapSatiBuyerAccount,
    });

    const { logs: swapLogs } = await swapInstance.swapBaseForQuoteToken(
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
    expect(rateEvent.args.scaledPrice.toString()).equal(toUnit(18));

    expect(swapRateEvent.event).equal("SwapRateInfo");
    expect(swapRateEvent.args.sellingAmount.toString()).equal(toUnit(1));
    expect(swapRateEvent.args.buyingAmount.toString()).equal(toUnit(18));

    expect(swapTransferEvent.event).equal("SwapTransferInfo");
    expect(swapTransferEvent.args.beneficiary.toString()).equal(
      swapSatiBuyerAccount
    );
    expect(swapTransferEvent.args.amountSent.toString()).equal(toUnit(1));
    expect(swapTransferEvent.args.amountReceived.toString()).equal(toUnit(18));
  });

  it("Can not swap sati for ERC20 Token if buyer does not have enough sati", async () => {
    try {
      await swapInstance.swapQuoteForBaseToken(toUnit("100"), {
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

    await foundAddressWith(erc20TokenInstance, {
      addressToFound: swapInstance.address,
      amount: toUnit("100"),
    });

    await satiTokenInstance.increaseAllowance(
      swapInstance.address,
      toUnit("100"),
      {
        from: swapERC20TokenBuyerAccount,
      }
    );

    await swapInstance.swapQuoteForBaseToken(toUnit("100"), {
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
