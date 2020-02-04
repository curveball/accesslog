Curveball Access Log
=====================

This package is a middleware for [Curveball][1] that will automatically log
HTTP requests and responses to the console.


Installation
------------

    npm install @curveball/accesslog


Getting started
---------------

```typescript
import accessLog from '@curveball/accesslog';
import { Application } from '@curveball/core';

const app = new Application();
app.use(accessLog());
```

### Blacklisting urls

If you'd like to remove certain urls from the access log, you can specify a
whitelist.

The default whitelist contains one url: `/health`, as this is often an
endpoint used by load balancers and container orchestrators to see if the
service is alive.

To specify an alternative blacklist, just pass a list of strings to the
`accessLog` function.

```typescript
import accessLog from '@curveball/accesslog';
import { Application } from '@curveball/core';

const app = new Application();
app.use(accessLog([
  '/ignore'
]));
```


[1]: https://github.com/curveball/
