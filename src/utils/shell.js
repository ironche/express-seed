import { exec } from 'child_process';

export function shell(cmd, outputAsArray) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject({ err, stderr });
        return;
      }
      resolve(
        outputAsArray ? stdout.split('\n') : stdout
      );
    });
  });
}
