"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberOfToken = void 0;
const web3_utils_1 = require("web3-utils");
const numberOfToken = (amountWithoutDecimal) => (0, web3_utils_1.toWei)(amountWithoutDecimal, "ether");
exports.numberOfToken = numberOfToken;
//# sourceMappingURL=utils.js.map