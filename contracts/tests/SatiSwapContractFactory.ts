import {
  deployERC20TokenMockWithAddressOf,
  deployPriceFeedMockWithRateOf,
} from "../helpers/deploy-mocks";
import { nameAccounts } from "../helpers/founding";

const SatiSwapContractFactory = artifacts.require("SatiSwapContractFactory");
const SatiToken = artifacts.require("SatiToken");

contract("SatiSwapContractFactory", (accounts: Truffle.Accounts) => {
  const { deployerAccount, maliciousAccount } = nameAccounts(accounts);

  it.only("Only owner can deploy swap contract", async () => {
    const deployedSatiSwapContractFactory =
      await SatiSwapContractFactory.deployed();
    const deployedSatiToken = await SatiToken.deployed();

    const erc20TokenInstance = await deployERC20TokenMockWithAddressOf(
      nameAccounts(accounts).deployerAccount
    );

    const mockPriceFeedERC20Token = await deployPriceFeedMockWithRateOf(
      `100000000`
    );

    try {
      await deployedSatiSwapContractFactory.deployNewSwapContract(
        deployedSatiToken.address,
        erc20TokenInstance.address,
        mockPriceFeedERC20Token.address,
        { from: maliciousAccount }
      );
    } catch (error) {
      expect((error as Error).message).to.equal(
        "Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner."
      );
    }
  });
});
