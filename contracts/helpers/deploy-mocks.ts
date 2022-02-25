import { toUnit } from "./utils";

const MockPriceFeed = artifacts.require("MockV3Aggregator");
const ERC20Token = artifacts.require("MockERC20Token");

export const deployPriceFeedMockWithRateOf = async (ratePrice: string) =>
  await MockPriceFeed.new(8, ratePrice, 1, 1, 1);

export const deployERC20TokenMockWithAddressOf = async (
  deployerAddress: string
) => await ERC20Token.new(toUnit("1000"), deployerAddress);
