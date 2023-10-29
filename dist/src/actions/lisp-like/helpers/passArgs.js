"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.passArgs = void 0;
const types_1 = require("../../../apps/runner/lib/types");
class JLError extends Error {
    constructor(message) {
        super(message);
        // this.name = 'JLError';
        this.name = this.constructor.name;
    }
}
class KeywordNotSupportedError extends JLError {
    constructor(key) {
        super(`Keyword not supported: "${key}"`);
    }
}
const lessArgsErrorMsg = `Not enough arguments`;
class LessArgsError extends JLError {
    constructor() {
        super(lessArgsErrorMsg);
    }
}
function passArgs(names, values) {
    const res = {};
    let ni = 0; // names index
    let vi = 0; // values index
    let state = '&required'; // current state
    while (ni < names.length) {
        const n = names[ni];
        (0, types_1.ensureString)(n, `Parameter name must be Symbol (ie string)`);
        if (n === '&key' || n === '&allow-other-keys') {
            throw new KeywordNotSupportedError(n);
        }
        if (n === '&optional' || n === '&rest') {
            state = n;
            ni++;
            continue;
        }
        //
        const v = values[vi];
        if (state === '&required') {
            if (vi >= values.length) {
                throw new LessArgsError();
            }
            res[n] = v;
            ni++;
            vi++;
        }
        else if (state === '&optional') {
            res[n] = types_1.NIL;
            ni++;
            vi++;
        }
        else if (state === '&rest') {
            if (!res[n])
                res[n] = [];
            (0, types_1.ensureList)(res[n]);
            // if (!Array.isArray(res[n])) {
            // throw new Error('Expecting Array');
            // }
            // res[n].push(v);
            res[n].push(v);
            vi++;
            if (vi >= values.length) {
                break;
            }
        }
        // vi++;
    }
    return res;
}
exports.passArgs = passArgs;
function test() {
    console.log(passArgs(['a', 'b'], [1, 2]));
    console.log(passArgs(['a', 'b'], [1, 2, 3]));
    console.log(passArgs(['a', 'b', '&optional', 'c'], [1, 2, 3]));
    try {
        console.log(passArgs(['a', 'b', 'c'], [1, 2]));
        throw new Error('throw error');
    }
    catch (e) {
        if (e.message === lessArgsErrorMsg) {
            console.log('throws ok');
        }
        else {
            throw e;
        }
    }
    console.log(passArgs(['a', 'b', '&rest', 'c'], [1, 2, 3, 4, 5]));
}
test();
// export function zipObject<V>(names: List, values: List): KeyValueObject<V> {
//   // if (names.length !== values.length)
//   //   throw new Error(
//   //     `Length of names: ${names.length}, ` +
//   //       `values:${values.length}; must be the same.`
//   //   );
//   // let requiredCount = names.length;
//   const res: KeyValueObject<V> = {};
//   let ni = 0; // names index
//   let vi = 0; // values index
//   let state: ParamKeywords = '&required'; // current state
//   while (ni < names.length) {
//     const n = names[ni];
//     ensureString(n, `Parameter name must be Symbol (ie string)`);
//     if (n === '&key' || n === '&allow-other-keys') {
//       throw new KeywordNotSupportedError(n);
//     }
//     if (n === '&optional' || n === '&rest') {
//       state = n;
//       ni++;
//       continue;
//     }
//     //
//     const v = values[vi];
//     if (state === '&required') {
//       if (vi >= values.length) {
//         throw new LessArgsError();
//       }
//       res[n] = v;
//       ni++;
//       vi++;
//     } else if (state === '&optional') {
//       res[n] = NIL;
//       ni++;
//       vi++;
//     } else if (state === '&rest') {
//       if (!res[n]) res[n] = [];
//       if (!Array.isArray(res[n])) {
//         throw new Error('Expecting Array');
//       }
//       (res[n] as Array<V>).push(v);
//       vi++;
//       if (vi >= values.length) {
//         break;
//       }
//     }
//     // vi++;
//   }
//   return res;
// }
//# sourceMappingURL=passArgs.js.map