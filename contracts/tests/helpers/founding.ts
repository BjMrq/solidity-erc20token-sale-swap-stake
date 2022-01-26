import { SatiTokenInstance } from "../../types";

export const nameAccounts = (accounts: Truffle.Accounts) => ({
  deployerAccount: accounts[0],
  saleBuyerAccount: accounts[1],
  senderAccount: accounts[2],
  receiverAccount: accounts[3],
  swapSatiBuyerAccount: accounts[4],
  swapEthBuyerAccount: accounts[5],
  swapRateBuyerAccount: accounts[5],
});

export const foundAccountFrom =
  (accounts: Truffle.Accounts) =>
  async (
    satiTokenInstance: SatiTokenInstance,
    {
      accountToFound,
      amount,
    }: {
      accountToFound: string;
      amount: number | string;
    }
  ) => {
    await satiTokenInstance.transfer(accountToFound, amount, {
      from: accounts[0],
    });
  };
