import {
  KYCValidationInstance,
  SatiEthSwapInstance,
  SatiTokenInstance,
  SatiTokenSaleInstance,
} from "../types";
import { nameAccounts } from "./helpers/founding";
import { token } from "./helpers/utils";
import { satiToEthRate, tokenSupply } from "./helpers/variables";

const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
const MockPriceFeed = artifacts.require("MockV3Aggregator");

const Ratable = artifacts.require("Ratable");

const initialSwapTestSatiSupply = "1000";

const freshTokenAndSwapContractsDeploy = async (accounts: Truffle.Accounts) => {
  // TODO USE MOCK FEED ADDRRESS TO BUILD SWAP INSTANCE
  const mockPriceFeed = await MockPriceFeed.new(8, 100, 1, 1, 1);

  const satiTokenInstance = await SatiToken.new(tokenSupply.total);

  const kYCValidationInstance = await KYCValidation.new();
  const saleTokenInstance = await SatiTokenSale.new(
    satiToEthRate,
    nameAccounts(accounts).deployerAccount,
    satiTokenInstance.address,
    kYCValidationInstance.address
  );

  await satiTokenInstance.transfer(saleTokenInstance.address, tokenSupply.sale);

  const swapInstance = await SatiEthSwap.new(satiTokenInstance.address);

  await satiTokenInstance.transfer(
    swapInstance.address,
    token(initialSwapTestSatiSupply)
  );

  return {
    satiTokenInstance,
    swapInstance,
    saleTokenInstance,
    kYCValidationInstance,
  };
};

const buySatiTokenOnSaleInit =
  (
    satiTokenInstance: SatiTokenSaleInstance,
    kYCValidationInstance: KYCValidationInstance
  ) =>
  async (saleBuyerAccount: string, tokenAmount: string | number) => {
    await kYCValidationInstance.seKYCCompletedFor(saleBuyerAccount);

    return await satiTokenInstance.buyTokens(saleBuyerAccount, {
      value: token(String(Number(tokenAmount) / satiToEthRate)),
    });
  };

contract("EthSwap", (accounts) => {
  const {
    deployerAccount,
    swapEthBuyerAccount,
    swapSatiBuyerAccount,
    swapRateBuyerAccount,
  } = nameAccounts(accounts);

  let swapInstance: SatiEthSwapInstance;
  let satiTokenInstance: SatiTokenInstance;
  let saleTokenInstance: SatiTokenSaleInstance;

  let buySatiTokenOnSale: (
    saleBuyerAccount: string,
    tokenAmount: string | number
  ) => Promise<any>;

  beforeEach(async () => {
    const freshInstances = await freshTokenAndSwapContractsDeploy(accounts);

    swapInstance = freshInstances.swapInstance;
    satiTokenInstance = freshInstances.satiTokenInstance;
    saleTokenInstance = freshInstances.saleTokenInstance;

    buySatiTokenOnSale = buySatiTokenOnSaleInit(
      saleTokenInstance,
      freshInstances.kYCValidationInstance
    );
  });

  it("Can not swap ether for Sati if there is no more Sati in the contract", async () => {
    await swapInstance.swapEthForSati({
      from: swapSatiBuyerAccount,
      value: token(String(Number(initialSwapTestSatiSupply) / 100)),
    });

    try {
      await swapInstance.swapEthForSati({
        from: swapSatiBuyerAccount,
        value: token("1"),
      });
    } catch (error) {
      expect((error as Error).message).equal(
        "Returned error: VM Exception while processing transaction: revert not enough Sati available -- Reason given: not enough Sati available."
      );
    }
  });

  it.only("Can swap ether for Sati", async () => {
    await swapInstance.swapEthForSati({
      from: swapSatiBuyerAccount,
      value: token("1"),
    });

    const swapBuyerBalance = await satiTokenInstance.balanceOf(
      swapSatiBuyerAccount
    );

    const swapInstanceBalance = await satiTokenInstance.balanceOf(
      swapInstance.address
    );

    expect(swapInstanceBalance.toString()).equal(
      token(String(Number(initialSwapTestSatiSupply) - 100))
    );
    expect(swapBuyerBalance.toString()).equal(token("100"));
  });

  it("Emit an event with swap info when swapping eth for sati", async () => {
    const { logs: swapLogs } = await swapInstance.swapEthForSati({
      from: swapSatiBuyerAccount,
      value: token("1"),
    });

    expect(swapLogs[0].event).equal("SwapTransfer");
    expect(swapLogs[0].args.swapName).equal("Eth to Sati");
    expect(swapLogs[0].args.beneficiary).equal(swapSatiBuyerAccount);
    expect(swapLogs[0].args.amountSent.toString()).equal(token("1"));
    expect(swapLogs[0].args.amountReceived.toString()).equal(token("100"));
  });

  it("Can not swap sati for ether if buyer does not have enough sati", async () => {
    try {
      await swapInstance.swapSatiForEth(token("100"), {
        from: swapEthBuyerAccount,
      });
    } catch (error) {
      expect((error as Error).message).equal(
        "Returned error: VM Exception while processing transaction: revert not enough Sati available -- Reason given: not enough Sati available."
      );
    }
  });

  it("Can swap Sati for eth", async () => {
    await buySatiTokenOnSale(swapEthBuyerAccount, "100");

    await satiTokenInstance.increaseAllowance(
      swapInstance.address,
      token("100"),
      {
        from: swapEthBuyerAccount,
      }
    );

    await swapInstance.swapSatiForEth(token("100"), {
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
      token(String(Number(initialSwapTestSatiSupply) + 100))
    );
  });
});
