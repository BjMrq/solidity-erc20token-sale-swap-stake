import {
  deployPriceFeedMockWithRateOf,
  deployERC20TokenMock,
} from "../helpers/deploy-mocks";
import {
  AllSwapTokenAddressInfo,
  PossibleNetwork,
  SwapTokenAddressInfo,
} from "../helpers/types";
import { toToken, toUnit } from "../helpers/utils";
import { satiTokenSupply } from "../helpers/variables";
import { ERC20Instance, SwapContractFactoryInstance } from "../types";

const SatiToken = artifacts.require("SatiToken");
const SwapContractFactory = artifacts.require("SwapContractFactory");

//TODO refactor that thing yo

const addSatiLiquidityFor = async (numberOfPools: number) => {
  const satiSupplyPerLiquiditySwap =
    (Number(toToken(satiTokenSupply.total)) -
      Number(toToken(satiTokenSupply.sale))) /
    numberOfPools /
    20;

  console.log(`Will supply ${satiSupplyPerLiquiditySwap}STI for each contract`);

  const satiToken = await SatiToken.deployed();

  return async (contractAddress: string, erc20TokenInstance: ERC20Instance) => {
    await satiToken.transfer(
      contractAddress,
      toUnit(satiSupplyPerLiquiditySwap)
    );
    await erc20TokenInstance.transfer(contractAddress, toUnit(500000000));
  };
};

const deploySwapERC20Token =
  (swapContractFactory: SwapContractFactoryInstance) =>
  async (ercToken: SwapTokenAddressInfo) =>
    await swapContractFactory.deployNewSwapContract(
      ercToken.erc20Token.address,
      (
        await SatiToken.deployed()
      ).address,
      ercToken.priceFeedAddress
    );

const getAddressesSwapTokenInfo =
  async (): Promise<AllSwapTokenAddressInfo> => ({
    development: {
      ERCTokens: [
        {
          name: "LINK",
          erc20Token: await deployERC20TokenMock("Chain link", "LINK"),
          priceFeedAddress: (await deployPriceFeedMockWithRateOf("1733443308"))
            .address,
        },
      ],
    },
    ganache: {
      ERCTokens: await Promise.all(
        [
          {
            name: "Basic Attention Token",
            symbol: "BAT",
            priceRate: "80000000",
          },
          {
            name: "BNB",
            symbol: "BNB",
            priceRate: "38400000000",
          },
          {
            name: "USD Coin",
            symbol: "USDC",
            priceRate: "100000000",
          },
          {
            name: "Wrapped BTC",
            symbol: "WBTC",
            priceRate: "4100000000000",
          },
          {
            name: "Dai Stablecoin",
            symbol: "DAI",
            priceRate: "100000000",
          },
          {
            name: "ChainLink Token",
            symbol: "LINK",
            priceRate: "1500000000",
          },
          {
            name: "TRON",
            symbol: "TRX",
            priceRate: "6000000",
          },
          {
            name: "Wrapped Litecoin",
            symbol: "WLTC",
            priceRate: "11000000000",
          },
          {
            name: "Matic Token",
            symbol: "MATIC",
            priceRate: "140000000",
          },
        ].map(async ({ name, symbol, priceRate }) => ({
          name,
          erc20Token: await deployERC20TokenMock(name, symbol),
          priceFeedAddress: (
            await deployPriceFeedMockWithRateOf(priceRate)
          ).address,
        }))
      ),
    },
    rinkeby: {
      ERCTokens: await Promise.all(
        [
          {
            name: "Basic Attention Token",
            symbol: "BAT",
            priceFeedAddress: "0x031dB56e01f82f20803059331DC6bEe9b17F7fC9",
          },
          {
            name: "BNB",
            symbol: "BNB",
            priceFeedAddress: "0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED",
          },
          {
            name: "USD Coin",
            symbol: "USDC",
            priceFeedAddress: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
          },
          {
            name: "Wrapped BTC",
            symbol: "WBTC",
            priceFeedAddress: "0xECe365B379E1dD183B20fc5f022230C044d51404",
          },
          {
            name: "Dai Stablecoin",
            symbol: "DAI",
            priceFeedAddress: "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF",
          },
          {
            name: "ChainLink Token",
            symbol: "LINK",
            priceFeedAddress: "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623",
          },
          {
            name: "TRON",
            symbol: "TRX",
            priceFeedAddress: "0xb29f616a0d54FF292e997922fFf46012a63E2FAe",
          },
          {
            name: "Wrapped Litecoin",
            symbol: "WLTC",
            priceFeedAddress: "0x4d38a35C2D87976F334c2d2379b535F1D461D9B4",
          },
          {
            name: "Matic Token",
            symbol: "MATIC",
            priceFeedAddress: "0x7794ee502922e2b723432DDD852B3C30A911F021",
          },
        ].map(async ({ name, symbol, priceFeedAddress }) => ({
          name,
          erc20Token: await deployERC20TokenMock(name, symbol),
          priceFeedAddress,
        }))
      ),
    },
    // kovan: {
    // ERCTokens: [
    //   {
    //     name: "LINK",
    //     erc20Token: "0xa36085f69e2889c224210f603d836748e7dc0088",
    //     priceFeedAddress: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0",
    //   },
    //   {
    //     name: "BAT",
    //     erc20Token: "0x482dC9bB08111CB875109B075A40881E48aE02Cd",
    //     priceFeedAddress: "0x9441D7556e7820B5ca42082cfa99487D56AcA958",
    //   },
    // ],
    // },
  });

module.exports = async function (deployer) {
  //@ts-expect-error since network is not typed on deployer
  const currentNetwork: PossibleNetwork = deployer.network;

  const tokenAndPriceFeedAddressesByNetwork = await getAddressesSwapTokenInfo();

  const addSatiLiquidityForContract = await addSatiLiquidityFor(
    1 + tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.length
  );

  //Deploy swap contracts

  await deployer.deploy(SwapContractFactory);
  const deployedSwapContractFactory = await SwapContractFactory.deployed();

  await Promise.all(
    tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.map(
      deploySwapERC20Token(deployedSwapContractFactory)
    )
  );

  //Provide liquidity
  await Promise.all(
    tokenAndPriceFeedAddressesByNetwork[currentNetwork].ERCTokens.map(
      async ({ erc20Token }) =>
        addSatiLiquidityForContract(
          (
            await deployedSwapContractFactory.deployedSwapContractsRegistry(
              `${await erc20Token.symbol()}/STI`
            )
          )[0],
          erc20Token
        )
    )
  );
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
