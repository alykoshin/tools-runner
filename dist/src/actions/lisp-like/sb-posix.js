"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const print_1 = require("./helpers/print");
/**
 * simple-parallel-tasks
 * https://codeberg.org/glv/simple-parallel-tasks
 *
 * The simple-parallel-tasks Reference Manual
 * https://quickref.common-lisp.net/simple-parallel-tasks.html
 *
 */
/**
 * Package: SB-POSIX
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/
 */
/**
 * Function: SB-POSIX:SETENV
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/SETENV.html
 */
/**
 * Function: SB-POSIX:GETENV
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/GETENV.html
 */
/**
 * Function: SB-POSIX:MKDIR
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/MKDIR.html
 */
exports.actions = {
    chdir: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pCwd = await evaluate(params[0]);
        const sCwd = String(pCwd);
        const res = process.chdir(sCwd);
        return res;
    },
    getcwd: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 0 });
        const res = process.cwd();
        logger.debug((0, print_1.stringify)(res));
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=sb-posix.js.map