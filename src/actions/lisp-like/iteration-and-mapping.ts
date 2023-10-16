/** @format */

import {LogPrefix, Logger} from '../../lib/log';
import {
  ActionListExecutor,
  ActionMethodState,
  Actions,
  Parameter,
  Parameters,
  ensureList,
  isEmptyList,
  isList,
} from '../../apps/runner/lib/types';
import {series1, series2, seriesn} from './helpers/series';

/**
 * @module iteration-and-mapping
 */

const sliceParams = async function (
  listOfLists: Parameters
): Promise<Parameters | null> {
  ensureList(listOfLists);
  const slice: Parameters = [];
  for (const list of listOfLists) {
    ensureList(list);
    if (isEmptyList(list)) {
      return list;
    }
    const p = (list as Parameter[]).shift();
    // const r = await evaluate(p);
    // slice.push(r);
    slice.push(p);
  }
  return slice;
};

//

let actions: Actions = {};

//

// function Car<T>(obj: T[]): T {
//   return obj[0];
// }

// function Cdr<T>(obj: T[]): T {
//   return obj[obj.length - 1];
// }

// function consp(obj: any): boolean {
//   return isList(obj);
// }

// function nullp(obj: any): boolean {
//   return isList(obj) && obj.length === 0;
// }

// function error_list(obj: any) {
//   throw new Error(`Ex`);
// }

// function VALUES1<T>(value: T): T {
//   return value;
// }

// function LISPFUNNR(name: string, x: 1, fn: ActionListExecutor) {
//   actions[name] = fn;
// }

// //

// function popSTACK(list: any[]) {
//   return list.pop;
// }

// LISPFUNNR('car', 1, (_, p) => {
//   /* (CAR list), CLTL p. 262 */
//   return VALUES1(car(popSTACK(p)));
// });

// LISPFUNNR('cdr', 1, (_, p) => {
//   /* (CDR list), CLTL p. 262 */
//   return VALUES1(cdr(popSTACK(p)));
// });

// // LISPFUNNR('cddadr', 1, (_, p) => {
// //   /* (CDDADR list), CLTL p. 263 */
// //   return VALUES1(cdr(cdr(car(cdr(popSTACK(p))))));
// // });

// //
// // https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/list.d#l234
// //
// // /* UP: Returns (car obj), with type check */
// // local object car (object obj) {

// // prettier-ignore
// function car(obj: any) {
//   if (consp(obj))
//     return Car(obj);
//   else if (nullp(obj))
//     return obj;
//   else
//     error_list(obj);
// }

// // https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/list.d#l244
// //
// // /* UP: Returns (cdr obj), with type check */
// // local object cdr (object obj) {

// // prettier-ignore
// function cdr(obj: any) {
//   if (consp(obj))
//     return Cdr(obj);
//   else if (nullp(obj))
//     return obj;
//   else
//     error_list(obj);
// }

// /* actions = */ Object.assign(actions, {
const actions2: Actions = {
  /** @name prog1 */
  prog1: async function (_, args, {evaluate}) {
    return series1(args, evaluate);
  },

  /** @name prog2 */
  prog2: async function (_, args, {evaluate}) {
    return series2(args, evaluate);
  },

  /** @name progn */
  progn: async function (_, args, {evaluate}) {
    return seriesn(args, evaluate);
  },

  /**
   * @name mapc
   *
   * !!! todo: Not modify list !!!
   */
  mapc: async function (_, [fn, ...listOfLists], {evaluate, logger}) {
    ensureList(listOfLists);
    ensureList(listOfLists[0]);
    const list0 = listOfLists[0].slice(); // save first list as we modify arrays inside `sliceParams`
    fn = await evaluate(fn);
    let ps;
    while ((ps = await sliceParams(listOfLists))) {
      const rs = await evaluate([fn, ...ps]);
    }
    return list0;
  },

  /**
   * @name mapcar
   *
   * !!! todo: Not modify list !!!
   */
  mapcar: async function (_, [fn, ...lists], {evaluate, logger}) {
    let ps;
    fn = await evaluate(fn);
    const results = [];
    while ((ps = await sliceParams(lists))) {
      const rs = await evaluate([fn, ...ps]);
      results.push(rs);
    }
    return results;
  },
};
/* actions = */ Object.assign(actions, actions2);

export default actions;
