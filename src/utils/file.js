import fs from 'fs';

export function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

export function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function readJSON(filePath) {
  return readFile(filePath).then(JSON.parse);
}

export function writeJSON(filePath, data) {
  return writeFile(filePath, JSON.stringify(data, null, 2));
}
