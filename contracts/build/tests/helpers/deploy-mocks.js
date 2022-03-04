"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployERC20TokenMockWithAddressOf = exports.deployPriceFeedMockWithRateOf = void 0;
const utils_1 = require("./utils");
const MockPriceFeed = artifacts.require("MockV3Aggregator");
const ERC20Token = artifacts.require("MockERC20Token");
const deployPriceFeedMockWithRateOf = async (ratePrice) => await MockPriceFeed.new(8, ratePrice, 1, 1, 1);
exports.deployPriceFeedMockWithRateOf = deployPriceFeedMockWithRateOf;
const deployERC20TokenMockWithAddressOf = async (deployerAddress) => await ERC20Token.new((0, utils_1.toUnit)("1000"), deployerAddress);
exports.deployERC20TokenMockWithAddressOf = deployERC20TokenMockWithAddressOf;
//# sourceMappingURL=deploy-mocks.js.map