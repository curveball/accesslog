import { Middleware } from '@curveball/core';

export default function(blacklist: string[] = ['/health']): Middleware {

  let counter = 0;

  const bl = new Set(blacklist);

  return async (ctx, next) => {

    if (bl.has(ctx.request.path)) {
      return next();
    }

    counter++;
    const reqNumber = counter;

    const startTime = new Date().getTime();

    // tslint:disable-next-line no-console
    console.log('=> (%i) %s %s', reqNumber, ctx.request.method, ctx.request.path);
    await next();
    const endTime = new Date().getTime();

    // tslint:disable-next-line no-console
    console.log('<= (%i) %s %s', reqNumber, ctx.response.status, (endTime - startTime) + 'ms');
  };
}

