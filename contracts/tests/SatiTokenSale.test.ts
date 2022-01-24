import { assert } from "chai";
import { nameAccounts } from "./helpers/founding";

const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");

contract("SatiTokenSale", (accounts) => {
  const { saleBuyerAccount } = nameAccounts(accounts);

  it("Buyers need to complete KYC verification", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();
    const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();

    try {
      await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
        value: "100",
      });
    } catch (error) {
      assert.equal(
        (error as Error).message,
        "Returned error: VM Exception while processing transaction: revert You must complete KYC before purchasing tokens -- Reason given: You must complete KYC before purchasing tokens."
      );
    }

    const buyerBalance = await deployedSatiTokenInstance.balanceOf(
      saleBuyerAccount
    );

    assert.equal(buyerBalance.toString(), "0");
  });

  it("Sale can distribute token to buyers after KYC verification", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();
    const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();
    const kYCValidationInstance = await KYCValidation.deployed();

    await kYCValidationInstance.seKYCCompletedFor(saleBuyerAccount);

    await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
      value: "100",
    });

    const buyerBalance = await deployedSatiTokenInstance.balanceOf(
      saleBuyerAccount
    );

    assert.equal(buyerBalance.toString(), "100");
  });
});
