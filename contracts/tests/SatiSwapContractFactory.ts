import {
  deployERC20TokenMock,
  deployPriceFeedMockWithRateOf,
} from "../helpers/deploy-mocks";
import { nameAccounts } from "../helpers/founding";

const SwapContractFactory = artifacts.require("SwapContractFactory");
const SatiToken = artifacts.require("SatiToken");

contract("SwapContractFactory", (accounts: Truffle.Accounts) => {
  const { maliciousAccount } = nameAccounts(accounts);

  it("Only owner can deploy swap contract", async () => {
    const deployedSwapContractFactory = await SwapContractFactory.deployed();
    const deployedSatiToken = await SatiToken.deployed();

    const erc20TokenInstance = await deployERC20TokenMock("Chain link", "LINK");

    const mockPriceFeedERC20Token = await deployPriceFeedMockWithRateOf(
      `100000000`
    );

    try {
      await deployedSwapContractFactory.deployNewSwapContract(
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

  it("Get deployed swap contract info", async () => {
    const deployedSwapContractFactory = await SwapContractFactory.deployed();
    const deployedSatiToken = await SatiToken.deployed();

    const deployedPairs = await deployedSwapContractFactory.getAllSwapPairs();

    const swapAddressesInfo =
      await deployedSwapContractFactory.deployedSwapContractsRegistry(
        deployedPairs[0]
      );

    expect(deployedPairs[0]).to.equal("LINK/STI");
    expect(Object.keys(swapAddressesInfo)).to.eql([
      "0",
      "1",
      "2",
      "swapContractAddress",
      "quoteTokenAddress",
      "baseTokenAddress",
    ]);
    //@ts-expect-error
    expect(swapAddressesInfo.quoteTokenAddress).to.equal(
      deployedSatiToken.address
    );
  });
});
