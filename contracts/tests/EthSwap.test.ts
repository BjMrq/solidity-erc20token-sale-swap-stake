import { SatiEthSwapInstance, SatiTokenInstance } from "../types";
import { nameAccounts } from "./helpers/founding";
import { numberOfToken } from "./helpers/utils";
import { tokenSupply } from "./helpers/variables";

const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");

const freshTokenAndSwapContractsDeploy = async () => {
  const satiTokenInstance = await SatiToken.new(tokenSupply.total);

  const swapInstance = await SatiEthSwap.new(satiTokenInstance.address);
  await satiTokenInstance.transfer(swapInstance.address, numberOfToken("1000"));

  return { satiTokenInstance, swapInstance };
};

contract("EthSwap", (accounts) => {
  const { deployerAccount, swapBuyerAccount, swapBuyerAccount2 } =
    nameAccounts(accounts);

  let swapInstance: SatiEthSwapInstance;
  let satiTokenInstance: SatiTokenInstance;

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

    const swapBuyerBalance = await satiTokenInstance.balanceOf(
      swapBuyerAccount
    );

    expect(swapBuyerBalance.toString()).equal(numberOfToken("100"));
  });

  it("Change the sati eth rate", async () => {
    await swapInstance.setEthToSatiRate(200, {
      from: deployerAccount,
    });

    await swapInstance.swapEthForSati({
      from: swapBuyerAccount2,
      value: web3.utils.toWei("1", "ether"),
    });

    const swapBuyerBalance = await satiTokenInstance.balanceOf(
      swapBuyerAccount2
    );

    expect(swapBuyerBalance.toString()).equal(numberOfToken("200"));
  });
});
