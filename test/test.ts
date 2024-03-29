import { Application } from '@curveball/kernel';
import accessLog from '../src/index.js';
import { expect } from 'chai';


describe('accesslog - no color', () => {


  let oldConsole:any;
  let out: any[] = [];

  beforeEach( () => {

    oldConsole = console.info;
    console.info = (...parts:any) => out.push(parts);
    out = [];

  });

  afterEach( () => {

    console.info = oldConsole;
    out = [];

  });

  it('should log HTTP requests and responses', async () => {

    const app = new Application();
    app.use(accessLog({
      disableColor: true,
    }));

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
  it('should ignore things in the blacklist', async () => {

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
describe('accesslog - color', () => {

  let oldConsole:any;
  let out: any[] = [];

  beforeEach( () => {

    process.env.FORCE_COLOR='1';
    oldConsole = console.info;
    console.info = (...parts:any) => out.push(parts);
    out = [];

  });

  afterEach( () => {

    console.info = oldConsole;
    out = [];
    delete process.env.FORCE_COLOR;

  });

  it.skip('should log HTTP requests and responses', async () => {

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
      ['=> (%i) %s %s', 1, '\u001b[32mGET\u001b[39m', '/'],
      ['<= (%i) %s %s', 1, '\u001b[32m200\u001b[39m', '0ms']
    ]);

  });

});
