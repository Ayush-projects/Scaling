const promClient = require('prom-client');


const register = promClient.register;
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000], 
});

const orderCounter = new promClient.Counter({
  name: 'order_placements_total',
  help: 'Total number of orders placed',
});

const orderDurationHistogram = new promClient.Histogram({
  name: 'order_placement_duration_ms',
  help: 'Duration of order placement in ms',
  buckets: [50, 100, 200, 300, 500, 1000],
});

const promMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(duration);
  });
  next();
};


const metricsEndpoint = (app) => {
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
};

module.exports = { promMiddleware, metricsEndpoint, orderCounter, orderDurationHistogram };