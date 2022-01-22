"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundAccountFrom = exports.nameAccounts = void 0;
const nameAccounts = (accounts) => ({
    deployerAccount: accounts[0],
    saleBuyerAccount: accounts[1],
    senderAccount: accounts[2],
    receiverAccount: accounts[3],
});
exports.nameAccounts = nameAccounts;
const foundAccountFrom = (accounts) => async (satiTokenInstance, { accountToFound, amount, }) => {
    await satiTokenInstance.transfer(accountToFound, amount, {
        from: accounts[0],
    });
};
exports.foundAccountFrom = foundAccountFrom;
//# sourceMappingURL=founding.js.map