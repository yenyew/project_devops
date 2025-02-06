var express = require('express');
var bodyParser = require("body-parser");
var promClient = require('prom-client'); // Import Prometheus client
var app = express();
const logger = require('./logger');

const PORT = process.env.PORT || 5050;
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

// Initialize Prometheus Metrics Registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Define Custom Metrics
const httpRequestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestCounter);

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5] // Define bucket intervals
});
register.registerMetric(httpRequestDuration);

// Middleware to Measure Request Time
app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
        httpRequestCounter.inc({ method: req.method, route: req.originalUrl, status_code: res.statusCode });
        end({ method: req.method, route: req.originalUrl, status_code: res.statusCode });
    });
    next();
});

// Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Job Management Routes
const { addJob } = require('./utils/create-job')
app.post('/add-job', addJob);
const { viewJobs } = require('./utils/view-job');
app.get('/view-jobs', viewJobs);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
    logger.info(`Demo project at: ${baseUrl}!`);
    logger.error(`Example of error log`);
});

module.exports = { app, server };
