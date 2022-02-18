const SatiToken = artifacts.require("SatiToken");
const SatiTokenSale = artifacts.require("SatiTokenSale");
const KYCValidation = artifacts.require("KYCValidation");
const SatiEthSwap = artifacts.require("SatiEthSwap");
const SatiSwapTokenSwap = artifacts.require("SatiSwapTokenSwap");
const MockPriceFeed = artifacts.require("MockV3Aggregator");
const ERC20Token = artifacts.require("MockERC20Token");

const satiToEthRate = 100;

module.exports = async function (deployer) {
  const tokenSupply = {
    total: "1000000000000000000000000",
    swapEth: "250000000000000000000000",
    swapLink: "250000000000000000000000",
    sale: "500000000000000000000000",
  };

  const [deployerAddress] = await web3.eth.getAccounts();

  // TOKEN
  await deployer.deploy(SatiToken, tokenSupply.total);
  const satiToken = await SatiToken.deployed();

  // SALE
  await deployer.deploy(KYCValidation);
  await deployer.deploy(
    SatiTokenSale,
    satiToEthRate,
    deployerAddress,
    SatiToken.address,
    KYCValidation.address
  );

  await satiToken.transfer(SatiTokenSale.address, tokenSupply.sale);

  //Swap
  // ETH
  const mockPriceFeedEth = await MockPriceFeed.new(8, "306544330800", 1, 1, 1);

  await deployer.deploy(
    SatiEthSwap,
    SatiToken.address,
    mockPriceFeedEth.address
  );

  //ERC20
  deployer.deploy(ERC20Token, 10000000000, deployerAddress);

  const mockPriceFeedERC20 = await MockPriceFeed.new(
    8,
    "17334433080000000000",
    1,
    1,
    1
  );

  await deployer.deploy(
    SatiSwapTokenSwap,
    SatiToken.address,
    mockPriceFeedERC20.address,
    mockPriceFeedERC20.address
  );

  await satiToken.transfer(SatiEthSwap.address, tokenSupply.swapEth);
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
