import createMiddleware from '../createMiddleware';

function setup() {
  const requestHandler = jest.fn();
  const bot = {
    createRequestHandler: () => requestHandler,
  };
  return {
    bot,
    requestHandler,
  };
}

it('should response 200 when no error be thrown', async () => {
  const { bot, requestHandler } = setup();
  requestHandler.mockReturnValue(Promise.resolve());

  const middleware = createMiddleware(bot);

  const request = { body: {} };
  const response = {};

  await middleware({ request, response });

  expect(response.status).toBe(200);
});

it('should overwrite response when provided', async () => {
  const { bot, requestHandler } = setup();
  requestHandler.mockReturnValue(
    Promise.resolve({
      status: 400,
      headers: {
        'X-Header': 'x',
      },
      body: {
        name: 'x',
      },
    })
  );

  const middleware = createMiddleware(bot);

  const request = { body: {} };
  const response = {};

  await middleware({ request, response });

  expect(response.status).toBe(400);
  expect(response.headers).toEqual({
    'X-Header': 'x',
  });
  expect(response.body).toEqual({
    name: 'x',
  });
});

it('should throw when no body exists', async () => {
  const { bot, requestHandler } = setup();
  requestHandler.mockReturnValue(Promise.resolve());

  const middleware = createMiddleware(bot);

  const request = {};
  const response = {};

  let error;
  try {
    await middleware({ request, response });
  } catch (err) {
    error = err;
  }

  expect(error).toBeDefined();
  expect(error.message).toMatch(/Missing body parser/);
});
