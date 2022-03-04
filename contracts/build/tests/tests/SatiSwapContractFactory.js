"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_mocks_1 = require("../helpers/deploy-mocks");
const founding_1 = require("../helpers/founding");
const SatiSwapContractFactory = artifacts.require("SatiSwapContractFactory");
const SatiToken = artifacts.require("SatiToken");
contract("SatiSwapContractFactory", (accounts) => {
    const { deployerAccount, maliciousAccount } = (0, founding_1.nameAccounts)(accounts);
    it("Only owner can deploy swap contract", async () => {
        const deployedSatiSwapContractFactory = await SatiSwapContractFactory.deployed();
        const deployedSatiToken = await SatiToken.deployed();
        const erc20TokenInstance = await (0, deploy_mocks_1.deployERC20TokenMockWithAddressOf)((0, founding_1.nameAccounts)(accounts).deployerAccount);
        const mockPriceFeedERC20Token = await (0, deploy_mocks_1.deployPriceFeedMockWithRateOf)(`100000000`);
        try {
            await deployedSatiSwapContractFactory.deployNewSwapContract(deployedSatiToken.address, erc20TokenInstance.address, mockPriceFeedERC20Token.address, { from: maliciousAccount });
        }
        catch (error) {
            expect(error.message).to.equal("Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
        }
    });
});
//# sourceMappingURL=SatiSwapContractFactory.js.map