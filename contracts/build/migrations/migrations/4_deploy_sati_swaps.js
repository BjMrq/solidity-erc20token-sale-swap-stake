"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_mocks_1 = require("../helpers/deploy-mocks");
const utils_1 = require("../helpers/utils");
const variables_1 = require("../helpers/variables");
const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const SatiSwapContractFactory = artifacts.require("SatiSwapContractFactory");
const addSatiLiquidityFor = async (numberOfPools) => {
    const satiSupplyPerLiquiditySwap = (0, utils_1.toUnit)((Number((0, utils_1.toToken)(variables_1.satiTokenSupply.total)) -
        Number((0, utils_1.toToken)(variables_1.satiTokenSupply.sale))) /
        numberOfPools /
        20);
    const satiToken = await SatiToken.deployed();
    return async (contractAddress) => {
        await satiToken.transfer(contractAddress, satiSupplyPerLiquiditySwap);
    };
};
const deploySwapERC20Token = (swapContractFactory) => async (ercToken) => await swapContractFactory.deployNewSwapContract((await SatiToken.deployed()).address, ercToken.tokenAddress, ercToken.priceFeedAddress);
const getAddressesSwapTokenInfo = async (deployerAddress) => ({
    development: {
        ETH: {
            priceFeedAddress: (await (0, deploy_mocks_1.deployPriceFeedMockWithRateOf)("365000000000"))
                .address,
        },
        ERCTokens: [
            {
                name: "LINK",
                tokenAddress: (await (0, deploy_mocks_1.deployERC20TokenMockWithAddressOf)(deployerAddress))
                    .address,
                priceFeedAddress: (await (0, deploy_mocks_1.deployPriceFeedMockWithRateOf)("1733443308"))
                    .address,
            },
        ],
    },
    ganache_local: {
        ETH: {
            priceFeedAddress: (await (0, deploy_mocks_1.deployPriceFeedMockWithRateOf)("365000000000"))
                .address,
        },
        ERCTokens: [
            {
                name: "LINK",
                tokenAddress: (await (0, deploy_mocks_1.deployERC20TokenMockWithAddressOf)(deployerAddress))
                    .address,
                priceFeedAddress: (await (0, deploy_mocks_1.deployPriceFeedMockWithRateOf)("1733443308"))
                    .address,
            },
        ],
    },
    kovan: {
        ETH: {
            priceFeedAddress: "",
        },
        ERCTokens: [
            {
                name: "LINK",
                tokenAddress: "0xa36085f69e2889c224210f603d836748e7dc0088",
                priceFeedAddress: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0",
            },
            {
                name: "BAT",
                tokenAddress: "0x482dC9bB08111CB875109B075A40881E48aE02Cd",
                priceFeedAddress: "0x9441D7556e7820B5ca42082cfa99487D56AcA958",
            },
        ],
    },
});
module.exports = async function (deployer) {
    //@ts-expect-error
    const currentNetwork = deployer.network;
    const [deployerAddress] = await web3.eth.getAccounts();
    const tokenAndPriceFeedAddressesByNetwork = await getAddressesSwapTokenInfo(deployerAddress);
    const addSatiLiquidityForContract = await addSatiLiquidityFor(1 + tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.length);
    // ETH
    await deployer.deploy(SatiEthSwap, SatiToken.address, tokenAndPriceFeedAddressesByNetwork[currentNetwork].ETH.priceFeedAddress);
    const satiEthSwap = await SatiEthSwap.deployed();
    addSatiLiquidityForContract(satiEthSwap.address);
    //ERC20 TOKENS
    await deployer.deploy(SatiSwapContractFactory);
    const deployedSatiSwapContractFactory = await SatiSwapContractFactory.deployed();
    await Promise.all(tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.map(deploySwapERC20Token(deployedSatiSwapContractFactory)));
    await Promise.all((await deployedSatiSwapContractFactory.getAllSwapPairs()).map(async (swapPairName) => addSatiLiquidityForContract(await deployedSatiSwapContractFactory.deployedSatiSwapContractsRegistry(swapPairName))));
};
//# sourceMappingURL=4_deploy_sati_swaps.js.map