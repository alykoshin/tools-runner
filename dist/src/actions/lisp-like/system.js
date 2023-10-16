"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
/**
 * @module system
 * @see ...
 */
exports.actions = {
    /** @name sleep */
    sleep: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const nValue = Number(pValue);
        logger.debug(`sleep ${nValue} seconds`);
        await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
        logger.log(`sleep done`);
    },
    /** @name time */
    time: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const [pDuration] = params;
        const startTime = new Date();
        const value = await evaluate(pDuration);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);
        return value;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=system.js.map