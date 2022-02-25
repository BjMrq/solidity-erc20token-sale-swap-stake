import {
  deployPriceFeedMockWithRateOf,
  deployERC20TokenMockWithAddressOf,
} from "../helpers/deploy-mocks";
import { toToken, toUnit } from "../helpers/utils";
import { satiTokenSupply } from "../helpers/variables";
import { SatiSwapContractFactoryInstance } from "../types";

const SatiToken = artifacts.require("SatiToken");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const SatiSwapContractFactory = artifacts.require("SatiSwapContractFactory");

const addSatiLiquidityFor = async (numberOfPools: number) => {
  const satiSupplyPerLiquiditySwap = toUnit(
    (Number(toToken(satiTokenSupply.total)) -
      Number(toToken(satiTokenSupply.sale))) /
      numberOfPools /
      20
  );

  const satiToken = await SatiToken.deployed();

  return async (contractAddress: string) => {
    await satiToken.transfer(contractAddress, satiSupplyPerLiquiditySwap);
  };
};

const deploySwapERC20Token =
  (swapContractFactory: SatiSwapContractFactoryInstance) =>
  async (ercToken: SwapTokenAddressInfo) =>
    await swapContractFactory.deployNewSwapContract(
      (
        await SatiToken.deployed()
      ).address,
      ercToken.tokenAddress,
      ercToken.priceFeedAddress
    );

const getAddressesSwapTokenInfo = async (
  deployerAddress: string
): Promise<AllSwapTokenAddressInfo> => ({
  development: {
    ETH: {
      priceFeedAddress: (await deployPriceFeedMockWithRateOf("365000000000"))
        .address,
    },
    ERCTokens: [
      {
        name: "LINK",
        tokenAddress: (await deployERC20TokenMockWithAddressOf(deployerAddress))
          .address,
        priceFeedAddress: (await deployPriceFeedMockWithRateOf("1733443308"))
          .address,
      },
    ],
  },
  ganache_local: {
    ETH: {
      priceFeedAddress: (await deployPriceFeedMockWithRateOf("365000000000"))
        .address,
    },
    ERCTokens: [
      {
        name: "LINK",
        tokenAddress: (await deployERC20TokenMockWithAddressOf(deployerAddress))
          .address,
        priceFeedAddress: (await deployPriceFeedMockWithRateOf("1733443308"))
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
  const currentNetwork: PossibleNetwork = deployer.network;

  const [deployerAddress] = await web3.eth.getAccounts();

  const tokenAndPriceFeedAddressesByNetwork: AllSwapTokenAddressInfo =
    await getAddressesSwapTokenInfo(deployerAddress);

  const addSatiLiquidityForContract = await addSatiLiquidityFor(
    1 + tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.length
  );

  // ETH

  await deployer.deploy(
    SatiEthSwap,
    SatiToken.address,
    tokenAndPriceFeedAddressesByNetwork[currentNetwork].ETH.priceFeedAddress
  );

  const satiEthSwap = await SatiEthSwap.deployed();

  addSatiLiquidityForContract(satiEthSwap.address);

  //ERC20 TOKENS

  await deployer.deploy(SatiSwapContractFactory);
  const deployedSatiSwapContractFactory =
    await SatiSwapContractFactory.deployed();

  await Promise.all(
    tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.map(
      deploySwapERC20Token(deployedSatiSwapContractFactory)
    )
  );

  await Promise.all(
    (
      await deployedSatiSwapContractFactory.getAllSwapPairs()
    ).map(async (swapPairName) =>
      addSatiLiquidityForContract(
        await deployedSatiSwapContractFactory.deployedSatiSwapContractsRegistry(
          swapPairName
        )
      )
    )
  );
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
