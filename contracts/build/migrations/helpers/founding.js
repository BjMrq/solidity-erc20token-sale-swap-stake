"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundAccountFrom = exports.nameAccounts = void 0;
const nameAccounts = (accounts) => ({
  deployerAccount: accounts[0],
  saleBuyerAccount: accounts[1],
  senderAccount: accounts[2],
  receiverAccount: accounts[3],
  swapSatiBuyerAccount: accounts[4],
  swapEthBuyerAccount: accounts[5],
  swapRateBuyerAccount: accounts[5],
  swapERC20TokenBuyerAccount: accounts[6],
  faucetProviderAccount: accounts[7],
});
exports.nameAccounts = nameAccounts;
const foundAccountFrom =
  (accounts) =>
  async (tokenInstance, { accountToFound, amount }) => {
    const { deployerAccount } = (0, exports.nameAccounts)(accounts);
    await tokenInstance.approve(deployerAccount, amount, {
      from: deployerAccount,
    });
    await tokenInstance.transferFrom(deployerAccount, accountToFound, amount, {
      from: deployerAccount,
    });
  };
exports.foundAccountFrom = foundAccountFrom;
//# sourceMappingURL=founding.js.map
