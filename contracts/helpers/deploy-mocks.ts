const MockPriceFeed = artifacts.require("MockV3Aggregator");
const MockERC20Token = artifacts.require("MockERC20Token");

export const deployPriceFeedMockWithRateOf = async (ratePrice: string) =>
  await MockPriceFeed.new(8, ratePrice, 1, 1, 1);

export const deployERC20TokenMock = async (
  tokenName: string,
  tokenSymbol: string
) => await MockERC20Token.new(tokenName, tokenSymbol);
