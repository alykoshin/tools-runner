/** @format */

import {
  isList,
  Expression,
  Actions,
  EvaluateFn,
  isNil,
} from '../../apps/runner/lib/types';
import {parse_sbcl_list} from '../../apps/translator-primitive/lisp2jl-primitive';
import {get_sbcl_cmd, preprocess_sbcl_expr} from './exec-prepare';
import {execute} from '../lisp-like/helpers/exec';
import {Logger} from '../../lib/log';

export const testRunner = async function (
  exprJlIn: Expression,
  strSbclIn: string,
  {actions, evaluate}: {actions: Actions; evaluate: EvaluateFn}
): Promise<{
  exprJlIn: Expression;
  exprJlOut: Expression;
  ok: boolean;
  strSbclIn: string;
  strSbclOut: string;
  exprSbclOut: Expression;
}> {
  const logger = new Logger({id: 0, level: 0, name: 'micro'}, 'info');

  const exprJlOut = await evaluate(exprJlIn);

  try {
    const c = get_sbcl_cmd(strSbclIn);
    const {stdout: strSbclOut} = await execute(c, {}, {logger});
    const exprSbclOut = parse_sbcl_list(strSbclOut, {logger});

    // console.log('exprJlOut:', exprJlOut);
    // console.log('sbclRaw:', sbclRaw);

    // check if lambda function was returned.
    // if so, do only partial comparison
    const jlLambda = isList(exprJlIn) && exprJlIn[0] === 'lambda';
    // const jlLambda = isFunction(exprJlOut) && exprJlOut.toString() === '[Function: lambda]';
    const sbclLambda = isList(exprSbclOut) && exprSbclOut[0] === 'lambda';

    const res = {
      exprJlIn,
      exprJlOut,
      strSbclIn: preprocess_sbcl_expr(strSbclIn),
    };

    if (jlLambda || sbclLambda) {
      return {
        ...res,
        ok: jlLambda === sbclLambda,
        strSbclOut,
        exprSbclOut,
      };
    }
    // console.log('>>>>', sbclParsed, exprJlOut);
    const ok =
      JSON.stringify(exprSbclOut) === JSON.stringify(exprJlOut) ||
      (isNil(exprSbclOut) && isNil(exprJlOut));

    return {
      ...res,
      ok,
      strSbclOut,
      exprSbclOut,
    };
  } catch (e) {
    throw e;
  }
};
