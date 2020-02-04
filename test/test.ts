import { Application } from '@curveball/core';
import accessLog from '../src/index';
import { expect } from 'chai';

describe('accesslog', () => {

  let oldConsole:any;
  let out: any[] = [];

  beforeEach( () => { 

    oldConsole = console.log;
    console.log = (...parts:any) => out.push(parts);
    out = [];

  });

  afterEach( () => {

    console.log = oldConsole;
    out = [];

  });

  it('should log HTTP requests and responses', async () => {

    const app = new Application();
    app.use(accessLog());

    app.use( ctx => {

      ctx.status = 200;
      ctx.response.body = 'hello world';

    });

    const response = await app.subRequest('GET', '/');
    expect(response.status).to.equal(200);

    // Rewrite the only variable: timing of the response
    out[1][3] = '0ms';

    expect(out).to.eql([
      ['=> (%i) %s %s', 1, 'GET', '/'],
      ['<= (%i) %s %s', 1, 200, '0ms']
    ]);

  });
  it('should ignore things in the whitelist', async () => {

    const app = new Application();
    app.use(accessLog(['/foo']));

    app.use( ctx => {

      ctx.status = 200;
      ctx.response.body = 'hello world';

    });

    const response = await app.subRequest('GET', '/foo');
    expect(response.status).to.equal(200);

    expect(out).to.eql([]);

  });
});
