"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Faucet = artifacts.require("Faucet");
module.exports = async function (deployer) {
    // TOKEN
    await deployer.deploy(Faucet);
};
//# sourceMappingURL=5_deploy_faucet.js.map