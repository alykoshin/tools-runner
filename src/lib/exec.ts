import {spawn, SpawnOptionsWithoutStdio} from 'child_process';
import * as timers from "timers";

// export async function execute(options: {cwd: string}, command_line: string, log: (s: number | string) => void) {
//   log(command_line);
//   const p = $$`${command_line}`;
//   if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
//   p.stdout.on("data", data => log(data))
//   p.stderr.on("data", data => log(data))
//   await p;
// }

export async function execute(command_line: string, spawnOptions: SpawnOptionsWithoutStdio, execOptions: {
  encoding?: BufferEncoding, timeout?: number
}, log: (s: number | string) => void) {


  return new Promise((resolve, reject) => {
    if (!execOptions.encoding) execOptions.encoding = 'utf8';
    if (!execOptions.timeout) execOptions.timeout = 0;

    const p = spawn(command_line, spawnOptions);

    let stdout = "";
    let stderr = "";

    if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');

    p.stdout.setEncoding(execOptions.encoding); //'utf8');
    p.stderr.setEncoding(execOptions.encoding); //'utf8');

    p.stdout.on('data', function (data) {
      log(data);
      data = data.toString();
      stdout += data;
    });

    p.stderr.on('data', function (data) {
      log(data);
      data = data.toString();
      stderr += data;
    });

    p.on('close', function (code) {
      console.log(`child process closed with code ${code}`);
      if (code === 0) {
        resolve({code, stdout, stderr});
      } else {
        reject({code, stdout, stderr});
      }
    });

    p.on('exit', function (code, signal) {
      console.log(`child process exited with code ${code} and signal ${signal}`);
      if (code === 0) {
        resolve({code, stdout, stderr});
      } else {
        reject({code, stdout, stderr});
      }
    });

    if (execOptions.timeout !== 0) {
      setTimeout(()=> {
        console.log(`child process timed out in ${execOptions.timeout} ms`);
        console.warn(`WARN: Force kill not implemented`);

      }, execOptions.timeout);
    }

  });

}

// execute('dir', {shell: true,}, {}, (s) => console.log(s));
