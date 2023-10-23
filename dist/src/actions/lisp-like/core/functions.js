"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.and_ = exports.null_ = exports.defun = exports.lambda = void 0;
const types_1 = require("../../../apps/runner/lib/types");
const series_1 = require("../helpers/series");
const util_1 = require("../../../apps/runner/lib/util");
const zipObject_1 = require("../helpers/zipObject");
//
/**
 * @module functions
 * @see
 * - Common Lisp: Working with &rest parameters --
 *   https://stackoverflow.com/questions/629699/common-lisp-working-with-rest-parameters <br>
 * - LispWorks -- Common Lisp HyperSpec -- Function APPLY --
 *   {@link http://clhs.lisp.se/Body/f_apply.htm}
 */
/**
 * @name lambda
 * @see
 * - An Introduction to Programming in Emacs Lisp -- C.4.3 A lambda Expression: Useful Anonymity --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/eintr/lambda.html} <br>
 * - An Introduction to Programming in Emacs Lisp -- 13.2 Lambda Expressions --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/elisp/Lambda-Expressions.html} <br>
 * - Common Lisp the Language, 2nd Edition -- 5.2.2. Lambda-Expressions --
 *   {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node64.html} <br>
 */
const lambda = async function (_, args, { evaluate }) {
    const [argnames, body] = (0, util_1.fn_check_params)(args, { exactCount: 2 });
    return createPrepareFn(argnames, body);
};
exports.lambda = lambda;
const createPrepareFn = function (argnames, body) {
    (0, types_1.ensureList)(argnames);
    (0, types_1.ensureList)(body);
    const fn = async function lambda(_, argvalues, state) {
        const { actions, evaluate, runner, logger, scopes } = state;
        argvalues = await (0, series_1.series)(argvalues, evaluate);
        const sc = (0, zipObject_1.zipObject)(argnames, argvalues);
        logger.debug('lambda:execute: scope:', sc, ',body:', body);
        const newState = {
            ...state,
            scopes: state.scopes.copy().new(sc),
        };
        state.scopes.push(sc);
        logger.debug('lambda:execute: scopes:', state.scopes);
        const res = await runner.evaluate(body, newState);
        logger.debug('lambda:execute: res:', res);
        return res;
    };
    return fn;
};
const defun = async function (_, args, state) {
    const [name, argnames, body] = (0, util_1.fn_check_params)(args, { exactCount: 3 });
    (0, types_1.ensureString)(name, `Expect string as a name of function`);
    state.actions[name] = createPrepareFn(argnames, body);
    return name;
};
exports.defun = defun;
/**
 * @name null_
 */
// prettier-ignore
exports.null_ = createPrepareFn(['x'], ['eq', 'x', []]);
// export const null_: ActionListExecutor = async function (_, args, {evaluate}) {
//   const [x] = fn_check_params(args, {exactCount: 1});
//   // prettier-ignore
//   return evaluate(['eq', x, []]);
// };
/**
 * @name and_
 */
// prettier-ignore
exports.and_ = createPrepareFn(['x', 'y'], ['cond', ['x', ['cond', ['y', ['quote', types_1.T]], [['quote', types_1.T], ['quote', []]]]],
    [['quote', types_1.T], ['quote', []]]]);
// export const and_: ActionListExecutor = async function (_, args, {evaluate}) {
//   const [x, y] = fn_check_params(args, {exactCount: 2});
//   // prettier-ignore
//   return evaluate(
//     ['cond',
//       [x, ['cond',  [y, ['quote', T]],
//                     [['quote', T], ['quote', []]],
//       [['quote', T], ['quote', []]],
//     ]]]);
// };
exports.actions = {
    lambda: exports.lambda,
    defun: exports.defun,
    null_: exports.null_,
    and_: exports.and_,
};
exports.default = exports.actions;
//# sourceMappingURL=functions.js.map