import chalk from 'chalk';

const PAD_LENGTH = 120;

function time() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((val) => `${val}`.padStart(2, '0'))
    .join(':');
}

function echo(val, type) {
  let paint;
  switch (type) {
    case 'info':
      paint = chalk.bgBlue.whiteBright;
      break;
    case 'warning':
      paint = chalk.bgYellow.whiteBright;
      break;
    case 'error':
      paint = chalk.bgRed.whiteBright;
      break;
    case 'success':
      paint = chalk.bgGreen.whiteBright;
      break;
    default:
      break;
  }
  let data;
  if (paint) {
    if (typeof val === 'string') {
      data = val.padEnd(PAD_LENGTH, ' ');
    } else {
      data = (JSON.stringify(val, null, 2) || 'undefined')
        .split('\n')
        .map((v) => v.padEnd(PAD_LENGTH, ' '))
        .join('\n');
    }
    data = paint(data);
  }
  // eslint-disable-next-line
  console.log(time().padEnd(PAD_LENGTH, '-'));
  // eslint-disable-next-line
  console.log(data);
}

export const info = (val) => echo(val, 'info');
export const success = (val) => echo(val, 'success');
export const warning = (val) => echo(val, 'warning');
export const error = (val) => echo(val, 'error');

export function logRequest(req, res, next) {
  const reqProps = {};
  [
    'headers',
    'url',
    'method',
    'params',
    'query',
    'body',
    'secret',
    'cookies',
    'signedCookies',
  ].forEach((p) => {
    reqProps[p] = req[p];
  });

  if (next) {
    info(reqProps);
    next();
  }
  return reqProps;
}
