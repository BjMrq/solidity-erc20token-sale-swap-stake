"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toToken = exports.toUnit = void 0;
const web3_utils_1 = require("web3-utils");
const toUnit = (tokenAmount) => (0, web3_utils_1.toWei)(String(tokenAmount), "ether");
exports.toUnit = toUnit;
const toToken = (unitAmount) => (0, web3_utils_1.fromWei)(String(unitAmount), "ether");
exports.toToken = toToken;
//# sourceMappingURL=utils.js.map