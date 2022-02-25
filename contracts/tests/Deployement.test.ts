import { toUnit } from "../helpers/utils";
import { satiTokenSupply } from "../helpers/variables";

const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const SatiEthSwap = artifacts.require("SatiEthSwap");

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

  it("Swap contract is deployed with part of Sati supply", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();
    const swapInstance = await SatiEthSwap.deployed();

    const swapContractBalance = await deployedSatiTokenInstance.balanceOf(
      swapInstance.address
    );

    assert.equal(swapContractBalance.toString(), toUnit("24875"));
  });
});
