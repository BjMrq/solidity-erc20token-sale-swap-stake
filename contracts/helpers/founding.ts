import { ERC20Instance } from "../types";

export const nameAccounts = (accounts: Truffle.Accounts) => ({
  deployerAccount: accounts[0],
  saleBuyerAccount: accounts[1],
  senderAccount: accounts[2],
  receiverAccount: accounts[3],
  swapSatiBuyerAccount: accounts[4],
  swapEthBuyerAccount: accounts[5],
  swapRateBuyerAccount: accounts[5],
  swapERC20TokenBuyerAccount: accounts[6],
  faucetProviderAccount: accounts[7],
  maliciousAccount: accounts[7],
});

export const foundAddressFrom =
  (accounts: Truffle.Accounts) =>
  async (
    tokenInstance: ERC20Instance,
    {
      addressToFound,
      amount,
    }: {
      addressToFound: string;
      amount: number | string;
    }
  ) => {
    const { deployerAccount } = nameAccounts(accounts);
    await tokenInstance.transfer(addressToFound, amount, {
      from: deployerAccount,
    });
  };
