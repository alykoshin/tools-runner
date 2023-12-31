"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const logicalUnaryFns = {
    not: (a) => !a,
};
function calcUnary(op, val) {
    switch (op) {
        case '+':
            return +val;
        case '-':
            return -val;
        case '*':
            return val;
        case '/':
            return 1 / val;
        case '=':
        case '/=':
        case '>':
        case '<':
        case '>=':
        case '<=':
        case 'and':
        case 'or':
            return true;
        case 'min':
        case 'max':
            return val;
        case 'not':
            return logicalUnaryFns[op](val);
        case 'mod':
        case 'rem':
        default:
            throw new Error(`Invalid u-nary operation ${op}`);
    }
}
const arithBinaryOps = [
    '+',
    '-',
    '*',
    '/',
    /*'rem',*/ 'mod',
    'max',
    'min',
];
// type ArithBinaryOps = typeof arithBinaryOps[number];
// const arithBiFns: Record<ArithBinaryOps, ArithBinaryFn> = {
const arithBiFns = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    // 'rem':
    mod: (a, b) => a % b,
    max: (a, b) => (a < b ? b : a),
    min: (a, b) => (a > b ? b : a),
};
const arithBiComp = {
    '=': (a, b) => a === b,
    '/=': (a, b) => a !== b,
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
};
const logicalBiFns = {
    and: (a, b) => a && b,
    or: (a, b) => a || b,
};
const biMap = {
    ...arithBiFns,
    ...arithBiComp,
    ...logicalBiFns,
};
// type binaryOps = keyof typeof biOps;
function calcBinary(op, val1, val2) {
    switch (op) {
        case '+':
        case '-':
        case '/':
        case '*':
        case 'mod':
        case 'max':
        case 'min':
        case '=':
        case '/=':
        case '/=':
            const fn = biMap[op];
            if (typeof fn !== 'function') {
                throw new Error(`Invalid bi-nary operation ${op}`);
                // throw new Error(`Invalid opCode "${op}"`);
            }
            const res = fn(val1, val2);
            return { result: res, last: val2, stop: false };
        default:
            throw new Error(`Invalid bi-nary operation ${op}`);
        // throw new Error(`Invalid opCode "${op}"`);
    }
}
const operators = async function (action, args, state) {
    const { evaluate } = state;
    (0, validateArgs_1.validateArgs)(args, { minCount: 1 });
    if (args.length === 1) {
        const v1 = await evaluate(args[0]);
        return calcUnary(action, v1);
    }
    else {
        let res;
        const [p1, ...p_rest] = args;
        let v_prev = await evaluate(p1);
        // let v_prev = v1;
        for (const p_curr of p_rest) {
            const v_curr = await evaluate(p_curr);
            const { result, last, stop } = calcBinary(action, v_prev, v_curr);
            res = result;
            if (stop) {
                break;
            }
            v_prev = last; //currValue;
        }
        return res;
    }
};
const reduce = /*async*/ function (
// ...args: [
arr, reducer, initial
//   // initial: A
// ]
) {
    // const [arr, reducer, initial] = args;
    let start = 0;
    // let acc = typeof initial === 'undefined' ? await evaluate(arr[start++]) : await evaluate(initial);
    // initial = typeof initial === 'undefined' ? arr[start++] : initial;
    // let acc = await evaluate(initial);
    // let acc = initial;
    // let acc = args.length === 2 ? arr[start++] : initial;
    let acc = typeof initial === 'undefined' ? arr[start++] : initial;
    let stop = false;
    for (let i = start; i < arr.length; i++) {
        // const curr = await evaluate(arr[i]);
        const curr = arr[i];
        const new_acc = /* await */ reducer(acc, curr, i, arr, () => (stop = true));
        if (stop)
            break;
        acc = new_acc;
    }
    return acc;
};
const pReduce = async function (...args) {
    const [arr, reducer, /* initial, */ dflt] = args;
    if (arr.length === 0) {
        return dflt;
    }
    else if (arr.length === 1) {
        return reducer(dflt, arr[0], 0, arr, () => undefined);
    }
    return reduce(arr, reducer);
    // let start = 0;
    // // let acc = typeof initial === 'undefined' ? await evaluate(arr[start++]) : await evaluate(initial);
    // // initial = typeof initial === 'undefined' ? arr[start++] : initial;
    // // let acc = await evaluate(initial);
    // // let acc = args.length === 2 ? arr[start++] : initial;
    // let acc = arr[start++];
    // let stop = false;
    // for (let i = start; i < arr.length; i++) {
    //   // const curr = await evaluate(arr[i]);
    //   const curr = arr[i];
    //   const new_acc = reducer(acc, curr, i, arr, () => (stop = true));
    //   if (stop) break;
    //   acc = new_acc;
    // }
    // return acc;
};
//
const plog = function (logger) {
    return async function (res) {
        const result = await res;
        logger.log(result);
        return result;
    };
};
//
/**
 * String concatenation
 * In brief: `concatenate` & `strcat`
 *
 * @name concatenate
 * @description
 * {@link http://www.ulisp.com/show?3L#concatenate}
 *
 * {@link https://stackoverflow.com/questions/53043195/string-addition-assignment-in-lisp}
 * {@link http://clhs.lisp.se/Body/f_concat.htm}
 */
exports.actions = {
    /** @name + */
    '+': async (action, params, { evaluate, logger }) => {
        return plog(logger)(pReduce(params, async (acc, p) => await evaluate(acc) + await evaluate(p), 0));
    },
    /** @name - */
    '-': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) - await evaluate(p), 0)),
    /** @name * */
    '*': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) * await evaluate(p), 1)),
    /** @name / */
    '/': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) / await evaluate(p), 1)),
    /** @name 1+ */
    '1+': async (action, args, { evaluate, logger }) => {
        (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
        return evaluate(['+', ...args, 1]);
    },
    /** @name 1- */
    '1-': async (action, args, { evaluate, logger }) => {
        (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
        return evaluate(['-', ...args, 1]);
    },
    /** @name % */
    '%': operators,
    /** @name = */
    '=': operators,
    /** @name /= */
    '/=': operators,
    /** @name > */
    '>': operators,
    /** @name < */
    '<': operators,
    /** @name >= */
    '>=': operators,
    /** @name <= */
    '<=': operators,
    /** @name min */
    min: operators,
    /** @name max */
    max: operators,
    /** @name mod */
    mod: operators,
    /** @name rem */
    rem: operators,
    /** @name and */
    and: operators,
    /** @name or */
    or: operators,
    /** @name not */
    not: operators,
};
exports.default = exports.actions;
//# sourceMappingURL=operators.js.map