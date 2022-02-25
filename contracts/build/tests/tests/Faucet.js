"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const founding_1 = require("../helpers/founding");
const utils_1 = require("../helpers/utils");
const Faucet = artifacts.require("Faucet");
const fundFaucet = async (faucetProviderAccountAddress, faucetInstanceAddress) => await web3.eth.sendTransaction({
    from: faucetProviderAccountAddress,
    to: faucetInstanceAddress,
    value: (0, utils_1.toUnit)("1"),
});
contract("Faucet", (accounts) => {
    const { faucetProviderAccount } = (0, founding_1.nameAccounts)(accounts);
    it("Can receive eth to be distributed", async () => {
        const faucetInstance = await Faucet.new();
        await fundFaucet(faucetProviderAccount, faucetInstance.address);
        const faucetSupply = await web3.eth.getBalance(faucetInstance.address);
        expect(faucetSupply.toString()).to.equal((0, utils_1.toUnit)("1"));
    });
    it("Does not send ether to addresses with lot of ether", async () => {
        const faucetInstance = await Faucet.new();
        await fundFaucet(faucetProviderAccount, faucetInstance.address);
        try {
            await faucetInstance.makeItRain(faucetProviderAccount, {
                from: faucetProviderAccount,
            });
        }
        catch (error) {
            expect(error.message).to.equal("revert");
        }
    });
});
//# sourceMappingURL=Faucet.js.map