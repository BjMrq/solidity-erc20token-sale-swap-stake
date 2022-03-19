import { toUnit } from "../helpers/utils";

const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");

contract("Deployment state", () => {
  it("SatiToken is deployed with the correct initial supply", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();

    const totalSupply = await deployedSatiTokenInstance.totalSupply();

    assert.equal(totalSupply.toString(), toUnit("1000000"));
  });

  it("Sale contract is deployed with half Sati token supply", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();

    const saleContractBalance = await deployedSatiTokenInstance.balanceOf(
      SatiTokenSale.address
    );

    assert.equal(saleContractBalance.toString(), toUnit("5000"));
  });
});
