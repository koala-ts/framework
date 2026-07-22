module.exports = {
  forbidden: [
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-framework-source-imports-from-packages',
      severity: 'error',
      from: {
        path: '^src/(?!packages/)',
      },
      to: {
        path: '^src/packages/',
      },
    },
    {
      name: 'no-platform-runtime-imports-from-generic-packages',
      severity: 'error',
      from: {
        path: '^src/packages/',
        pathNot: '^src/packages/fastify-bridge/',
      },
      to: {
        path: '^node_modules/(?:@koa/router|koa|express|fastify)(?:/|$)',
      },
    },
  ],
  options: {
    exclude: {
      path: '(^|/)dist/',
    },
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: {
      fileName: 'tsconfig.check.json',
    },
  },
};
