"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const exec_1 = require("./helpers/exec");
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const types_1 = require("./helpers/types");
/**
 * @module trivial-shell
 * @see trivial-shell:shell-command  <br>
 * - {@link https://stackoverflow.com/questions/6065446/executing-a-shell-command-from-common-lisp} <br>
 * - {@link https://trivial-shell.common-lisp.dev/user-guide.html#shell-command}
 *
 */
exports.actions = {
    /**
     * @name shell-command
     */
    'shell-command': async function (_, args, state) {
        const { evaluate } = state;
        (0, validateArgs_1.validateArgs)(args, { minCount: 1 });
        const lastParam = args[args.length - 1];
        let config = {};
        if (typeof lastParam === 'object' && lastParam !== null) {
            config = lastParam;
            args = args.slice(0, args.length - 1);
        }
        const { cwd, env } = config || {};
        const result = [];
        for (const p of args) {
            const command = await evaluate(p);
            (0, types_1.ensureString)(command);
            const options = {
                cwd,
                env,
                // // stdio: 'inherit',
                // stdin: 'inherit',
                // stdout: 'pipe',
                // stderr: 'pipe',
            };
            const r = await (0, exec_1.execute)(command, options, { state });
            result.push(r.stdout);
        }
        return result.length === 1 ? result[0] : result;
    },
    /** @name os-process-id */
    'os-process-id': async function (_, args, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(args, { exactCount: 0 });
        return process.pid;
    },
    /** @name get-env-var */
    'get-env-var': async function (_, args, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
        const name = evaluate(args[0]);
        (0, types_1.ensureString)(name);
        return process.env[name];
    },
};
exports.default = exports.actions;
//# sourceMappingURL=trivial-shell.js.map