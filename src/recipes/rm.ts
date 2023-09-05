import fs from 'fs/promises';
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";

export interface RmAction {
  action: 'rm'
  files: string|string[]
  dry?: boolean
}

export async function action_rm(
  definition: RmAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  const dry = typeof definition.dry !== 'undefined' ? definition.dry : false;
  const files = Array.isArray(definition.files) ? definition.files : [definition.files];
  for (let pathname of files) {
    runner.debug(id, `[rm] deleting file "${pathname}"`)
    if (dry) {
      runner.debug(id, `[rm] "dry" flag is set; skipping`);
    } else {
      await fs.rm(pathname);
    }
  }
  runner.debug(id, `[cp] deleted ${files.length} dirs/files`)
}
