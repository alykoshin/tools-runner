/** @format */

import { execute } from '../lisp-like/helpers/exec';
import $versionActions from '../build/$version';
import { fn_check_params } from '../../lib/util';
import {
  ActionListExecutor,
  ActionMethodState,
  Parameters,
} from '../../lib/runner';

export type ZipActionConfig = {
  file_names: string[];
  archive_prefix: string;
  out_dir: string;
  exclude_files: string[];
};

// export type ZipAction = [
//   action: 'zip',
//   config: ZipActionConfig
// ]

export async function $zip(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
): Promise<string> {
  const { activity, runner, logger } = state;
  fn_check_params(parameters, { exactCount: 1 });
  const [pConfig] = parameters;

  const version = await ($versionActions.$version as ActionListExecutor)(
    action,
    [],
    state
  );

  const { file_names, archive_prefix, out_dir, exclude_files } =
    pConfig as ZipActionConfig;

  let a = 1;

  const date = new Date()
    .toISOString()
    .replace(/[:T]/g, '-')
    .replace(/\..+/, '');

  // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
  const zip_exe = 'c:/Program Files/7-Zip/7z.exe';

  const archive_name = `${archive_prefix}-v${version}-${date}.zip`;
  const archive_pathname = [out_dir, archive_name].join('/');

  const sFileNames = file_names.join(' ');

  // prettier-ignore
  const switches = [
    '-r',
  '-tzip',
    ...exclude_files.map(f => `-x!${f}`),
  ]
  // prettier-ignore
  const args = [
    'a',
    ...switches,
    archive_pathname,
    sFileNames,
  ];

  const command_line = [zip_exe, args].join(' ');

  const options = {
    cwd: activity.base_dir,
  };

  const r = await execute(command_line, options, { logger });
  return r.stdout;
}

export default $zip;
