import { nameAccounts } from "../helpers/founding";
import { toUnit } from "../helpers/utils";

const Faucet = artifacts.require("Faucet");

const fundFaucet = async (
  faucetProviderAccountAddress: string,
  faucetInstanceAddress: string
) =>
  await web3.eth.sendTransaction({
    from: faucetProviderAccountAddress,
    to: faucetInstanceAddress,
    value: toUnit("1"),
  });

contract("Faucet", (accounts: Truffle.Accounts) => {
  const { faucetProviderAccount } = nameAccounts(accounts);

  it("Can receive eth to be distributed", async () => {
    const faucetInstance = await Faucet.new();

    await fundFaucet(faucetProviderAccount, faucetInstance.address);

    const faucetSupply = await web3.eth.getBalance(faucetInstance.address);

    expect(faucetSupply.toString()).to.equal(toUnit("1"));
  });

  it("Does not send ether to addresses with lot of ether", async () => {
    const faucetInstance = await Faucet.new();

    await fundFaucet(faucetProviderAccount, faucetInstance.address);

    try {
      await faucetInstance.makeItRain(faucetProviderAccount, {
        from: faucetProviderAccount,
      });
    } catch (error) {
      expect((error as Error).message).to.equal("revert");
    }
  });
});
