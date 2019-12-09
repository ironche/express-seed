import fs from 'fs';
import http from 'http';

function getContentType(headers = {}) {
  const prop = new RegExp('Content-Type', 'i');
  const key = Object.keys(headers).find((k) => prop.test(k));
  return headers[key] || null;
}

function isContentTypeJson(headers = {}) {
  const contentType = getContentType(headers);
  return /application\/json/i.test(contentType);
}

export const HEADER_JSON = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export function makeRequest(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject();
      return;
    }

    const req = http.request(url, { method, headers }, (res) => {
      let receivedData = '';
      res.setEncoding('utf8');

      res.on('data', (data) => {
        receivedData += data;
      });

      res.on('end', () => {
        if (isContentTypeJson(res.headers)) {
          receivedData = JSON.parse(receivedData);
        }
        resolve({
          statusCode: res.statusCode,
          body: receivedData,
        });
      });
    });

    req.on('error', (e) => reject(e.message));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

export function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      const stream = fs.createWriteStream(filePath);

      stream.on('finish', () => {
        resolve();
      });

      res.on('data', (data) => {
        stream.write(data);
      });

      res.on('end', () => {
        stream.end();
      });
    });

    req.on('error', (e) => {
      fs.unlink(filePath);
      reject(e);
    });

    req.end();
  });
}

export async function findActiveServer(urls = [], index = 0, urlRequests = []) {
  let reqs;
  if (!index) {
    reqs = urls.map((u) => makeRequest(u));
  } else {
    reqs = urlRequests;
  }

  if (reqs.length > index) {
    try {
      const res = await reqs[index];

      return res.statusCode === 200
        ? urls[index]
        : findActiveServer(urls, index + 1, reqs);
    } catch (e) {
      return findActiveServer(urls, index + 1, reqs);
    }
  }
  return null;
}
