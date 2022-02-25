"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../helpers/variables");
const SatiToken = artifacts.require("SatiToken");
module.exports = async function (deployer) {
    // TOKEN
    await deployer.deploy(SatiToken, variables_1.satiTokenSupply.total);
};
//# sourceMappingURL=2_deploy_sati_token.js.map