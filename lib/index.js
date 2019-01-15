const express = require('express');
const { register, Gauge, collectDefaultMetrics } = require('prom-client');
const pick = require('lodash.pick');
const checkUrl = require('./check');

const server = express();



server.get('/probe', async (req, res) => {
    const url = req.query.url || '';
    checkUrl(url, (result) => {
        const is_valid = new Gauge({
            name: 'http_check_valid',
            help: 'If the site could be reached',
            labelNames: ['has_https']
        });

        const is_https = new Gauge({
            name: 'https_check_valid',
            help: 'If the site has a valid ssl certificate',
            labelNames: ['ssl_valid_hours']
        });

        const redirects = new Gauge({
            name: 'https_has_redirects',
            help: 'If the site has redirects',
            labelNames: ['redirect_target', 'redirects_codes', 'redirects_no']
        });

        // Is reachable
        is_valid.set(
            pick(result, ['has_https']),
            result.valid ? 1 : 0
        );

        // Redirects
        redirects.set(
            pick(result, ['redirect_target', 'redirects_codes', 'redirects_no']),
            result.redirects_no > 0 ? 1 : 0
        );

        // Https
        is_https.set(
            pick(result, ['ssl_valid_hours']),
            result.ssl_valid ? 1 : 0
        );

        res.set('Content-Type', register.contentType);
        res.end(register.metrics());
    });

});

module.exports = server;
