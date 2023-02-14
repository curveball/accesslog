import { Context, Middleware } from '@curveball/kernel';
import * as chalk from 'chalk';

type AccessLogOptions = {

  blacklist?: string[];
  disableColor?: boolean;
  forceColor?: boolean;

};

export function accessLog(blacklist?: string[]): Middleware;
export function accessLog(options: AccessLogOptions): Middleware;
export default function accessLog(arg?: string[]|AccessLogOptions): Middleware {

  let counter = 0;
  let blacklist: Set<string>;

  let disableColor = false;

  if (arg === undefined) {
    blacklist = new Set(['/health']);
  } else if (Array.isArray(arg)) {
    blacklist = new Set(arg);
  } else {

    if (arg.blacklist) {
      blacklist = new Set(arg.blacklist);
    } else {
      blacklist = new Set(['/health']);
    }
    if (arg.disableColor) {
      disableColor = true;
    }

  }


  return (ctx, next) => {

    if (blacklist.has(ctx.request.path)) {
      return next();
    }

    counter++;
    const reqNumber = counter;

    if (!disableColor && chalk.supportsColor) {
      return colorLog(reqNumber, ctx, next);
    } else {
      return monoLog(reqNumber, ctx, next);
    }

  };
}

async function monoLog(reqNumber: number, ctx: Context, next: () => Promise<void>) {

  const startTime = new Date().getTime();

  console.info('=> (%i) %s %s', reqNumber, ctx.request.method, ctx.request.path);
  await next();
  const endTime = new Date().getTime();
  console.log('<= (%i) %s %s', reqNumber, ctx.response.status, (endTime - startTime) + 'ms');

}

async function colorLog(reqNumber: number, ctx: Context, next: () => Promise<void>) {

  let method: string;
  switch (ctx.request.method) {
    default:
      method = ctx.request.method;
      break;
    case 'GET' :
      method = chalk.green(ctx.request.method);
      break;
    case 'DELETE' :
      method = chalk.redBright(ctx.request.method);
      break;
    case 'PUT' :
      method = chalk.cyan(ctx.request.method);
      break;
    case 'POST' :
      method = chalk.blue(ctx.request.method);
      break;
    case 'PATCH' :
      method = chalk.magenta(ctx.request.method);
      break;
  }

  const startTime = new Date().getTime();
  console.log('=> (%i) %s %s', reqNumber, method, ctx.request.path);
  await next();
  const endTime = new Date().getTime();

  let status: string;
  switch (Math.floor(ctx.response.status / 100)) {

    default :
      status = chalk.gray(ctx.response.status);
      break;

    case 2:
      status = chalk.green(ctx.response.status);
      break;

    case 3:
      status = chalk.yellowBright(ctx.response.status);
      break;

    case 4:
      status = chalk.red(ctx.response.status);
      break;

    case 5:
      status = chalk.redBright(ctx.response.status);
      break;

  }

  const time = endTime - startTime;
  let strTime: string;
  if (time < 10) {
    strTime = chalk.greenBright(time + 'ms');
  } else if (time < 100) {
    strTime = chalk.yellowBright(time, 'ms');
  } else {
    strTime = chalk.redBright(time, 'ms');
  }

  console.log('<= (%i) %s %s', reqNumber, status, strTime);

}
