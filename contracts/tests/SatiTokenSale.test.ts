import { assert } from "chai";
import { nameAccounts } from "../helpers/founding";
import { toUnit } from "../helpers/utils";

const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");

contract("SatiTokenSale", (accounts) => {
  const { saleBuyerAccount } = nameAccounts(accounts);

  // it("Buyers need to complete KYC verification", async () => {
  //   const deployedSatiTokenInstance = await SatiToken.deployed();
  //   const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();

  //   try {
  //     await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
  //       value: "100",
  //     });
  //   } catch (error) {
  //     assert.equal(
  //       (error as Error).message,
  //       "Returned error: VM Exception while processing transaction: revert You must complete KYC before purchasing tokens -- Reason given: You must complete KYC before purchasing tokens."
  //     );
  //   }

  //   const buyerBalance = await deployedSatiTokenInstance.balanceOf(
  //     saleBuyerAccount
  //   );

  //   assert.equal(buyerBalance.toString(), "0");
  // });

  it("Buyers need to have enough Ether to buy Sati", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();
    const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();

    try {
      await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
        value: toUnit(200),
      });
    } catch (error) {
      assert.equal(
        (error as Error).message.includes(
          "Reason given: not enough Ether available"
        ),
        true
      );
    }

    const buyerBalance = await deployedSatiTokenInstance.balanceOf(
      saleBuyerAccount
    );

    assert.equal(buyerBalance.toString(), "0");
  });

  it("Sale can distribute token to buyers", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();
    const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();
    const kYCValidationInstance = await KYCValidation.deployed();

    await kYCValidationInstance.seKYCCompletedFor(saleBuyerAccount);

    await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
      value: toUnit("0.01"),
    });

    const buyerBalance = await deployedSatiTokenInstance.balanceOf(
      saleBuyerAccount
    );

    assert.equal(buyerBalance.toString(), toUnit(30));
  });
});
