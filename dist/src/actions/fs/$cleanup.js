"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cleanup = void 0;
const fsUtils_1 = require("../../helpers/fsUtils");
const util_1 = require("../../lib/util");
const $cleanup = async function (action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { minCount: 1 });
    const result = [];
    for (const p of parameters) {
        const pDirname = await runner.eval(p, state);
        const sDirname = String(pDirname);
        logger.debug(`cleanup ${sDirname}`);
        const res = await (0, fsUtils_1.removeDirRecursive)(sDirname);
        result.push(sDirname);
    }
    return result;
};
exports.$cleanup = $cleanup;
exports.default = exports.$cleanup;
//# sourceMappingURL=$cleanup.js.map