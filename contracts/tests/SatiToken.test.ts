import { SatiTokenInstance } from "../types";
import { foundAccountFrom, nameAccounts } from "./helpers/founding";

const SatiToken = artifacts.require("SatiToken");

contract("SatiToken", (accounts) => {
  const { senderAccount, receiverAccount } = nameAccounts(accounts);
  const foundAccountWith = foundAccountFrom(accounts);

  let newSatiTokenInstance: SatiTokenInstance;

  beforeEach(async () => {
    newSatiTokenInstance = await SatiToken.new(1000);
  });

  it("Is possible to send token between accounts", async () => {
    const satiTokenInstance = newSatiTokenInstance;

    const amount = 1;

    await foundAccountWith(satiTokenInstance, {
      accountToFound: senderAccount,
      amount,
    });

    await satiTokenInstance.transfer(receiverAccount, amount, {
      from: senderAccount,
    });

    const senderBalance = await satiTokenInstance.balanceOf(senderAccount);
    const receiverBalance = await satiTokenInstance.balanceOf(receiverAccount);

    assert.equal(senderBalance.toString(), "0");
    assert.equal(receiverBalance.toString(), "1");
  });

  it("Is not possible to send more tokens then the amount hold by an account", async () => {
    const satiTokenInstance = newSatiTokenInstance;

    await foundAccountWith(satiTokenInstance, {
      accountToFound: senderAccount,
      amount: 1,
    });

    try {
      await satiTokenInstance.transfer(receiverAccount, 2, {
        from: senderAccount,
      });
    } catch (error) {
      assert.equal(
        (error as Error).message,
        "Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance.",
        "Insufficient balance error wasn't thrown"
      );
    }

    const senderAccountBalance = await satiTokenInstance.balanceOf(
      senderAccount
    );

    const receiverAccountBalance = await satiTokenInstance.balanceOf(
      receiverAccount
    );

    assert.equal(senderAccountBalance.toString(), "1");
    assert.equal(receiverAccountBalance.toString(), "0");
  });

  it("Is not possible to send more token than total available supply", async () => {
    const satiTokenInstance = newSatiTokenInstance;
    try {
      await foundAccountWith(satiTokenInstance, {
        accountToFound: senderAccount,
        amount: "1000000000000000000000001",
      });
    } catch (error) {
      assert.equal(
        (error as Error).message,
        "Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance.",
        "Insufficient balance error wasn't thrown"
      );
    }

    const senderAccountBalance = await satiTokenInstance.balanceOf(
      senderAccount
    );

    assert.equal(senderAccountBalance.toString(), "0");
  });
});
