import { numberOfToken } from "./helpers/utils";
import { tokenSupply } from "./helpers/variables";

const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const SatiEthSwap = artifacts.require("SatiEthSwap");

contract("Deployment state", (accounts) => {
  it("SatiToken is deployed with the correct initial supply", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();

    const totalSupply = await deployedSatiTokenInstance.totalSupply();

    assert.equal(totalSupply.toString(), numberOfToken("1000000"));
  });

  it("Sale contract is deployed with half Sati token supply", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();

    const saleContractBalance = await deployedSatiTokenInstance.balanceOf(
      SatiTokenSale.address
    );

    assert.equal(saleContractBalance.toString(), numberOfToken("500000"));
  });

  it("Swap contract is deployed with half Sati token supply", async () => {
    const deployedSatiTokenInstance = await SatiToken.deployed();
    const swapInstance = await SatiEthSwap.deployed();

    const swapContractBalance = await deployedSatiTokenInstance.balanceOf(
      swapInstance.address
    );

    assert.equal(swapContractBalance.toString(), numberOfToken("500000"));
  });
});
