"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const web3_utils_1 = require("web3-utils");
const token = (amountWithoutDecimal) => (0, web3_utils_1.toWei)(String(amountWithoutDecimal), "ether");
exports.token = token;
//# sourceMappingURL=utils.js.map