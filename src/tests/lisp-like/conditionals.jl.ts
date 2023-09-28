import {Activity} from "../../lib/config";
import $sbcl from "../../actions/$sbcl";

export const config: Activity = {
  base_dir: './',
  version: '0.0.0',
  actions: {
    ...$sbcl,
    default: [
      'list',
      [ 'test-cond' ],
      [ 'test-when' ],
      [ 'test-unless' ],
      ['princ', 'assert-x:\n'+'  OK:   ${ assert_ok_count }\n'+'  FAIL: ${ assert_fail_count }'],
    ],
    "test-cond": [ 'list', 
      ['assert-equal',
        [ "cond",  
          [ ['/=', 1, 1 ], [ "list", 10 ], 11 ], 
          [ [ '=', 1, 1 ], [ "list", 20 ], 21 ] ], 
        [ "$sbcl-to-list", [
          '(cond',
            '( (/= 1 1) 10 11 )',
            '( (=  1 1) (list 20) 21 )',
          ')'
        ].join(' ') ]
      ],
    ],
    "test-when": [ "list",
      ['when',
        ['=', 1, 1], ['setq', 'res', 1]],
      ['assert-true', '${res}', '1']],
    "test-unless": ["list",
      ['setq', 'res', 0],
      ['unless',
        ['/=', 1, 1], ['setq', 'res', 1]],
      ['assert-true', '${res}', '1']],
  },
}

export default config;
