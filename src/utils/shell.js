import { exec } from 'child_process';

export function shell(cmd, outputAsArray) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      const res = outputAsArray ? stdout.split('\n') : stdout;

      resolve({
        stderr,
        stdout: res,
      });
    });
  });
}
