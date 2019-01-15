const express = require('express');
const pick = require('lodash.pick');
const checkUrl = require('./check');
const { generateGauge } = require('./prometheus');
const server = express();

/** Health endpoint */
server.get('/', (req, res) => {
    res.status(200).send();
});

server.get('/probe', (req, res) => {
    const url = req.query.url;
    if(!url) {
        return res.status(400).send();
    }

    checkUrl(url, (result) => {
        const probeResult = [];

        // Check if the request is valid
        const http_check_valid = generateGauge({
            value: result.valid,
            name: 'http_check_valid',
            help: 'If the site could be reached',
            labels: pick(result, ['has_https'])
        }).join('\n');

        probeResult.push(http_check_valid);

        // Check if the https is ok
        const is_https = generateGauge({
            value: result.ssl_valid,
            name: 'https_check_valid',
            help: 'If the site has a valid ssl certificate',
            labels: pick(result, ['ssl_valid_hours'])
        }).join('\n');

        probeResult.push(is_https);

        // Redirects
        const redirects = generateGauge({
            value: result.ssl_valid,
            name: 'http_has_redirects',
            help: 'If the site has redirects',
            labels: pick(result, ['redirect_target', 'redirects_codes', 'redirects_no'])
        }).join('\n');

        probeResult.push(redirects);

        res.end(probeResult.join('\n\n'));

    });

});

module.exports = server;
