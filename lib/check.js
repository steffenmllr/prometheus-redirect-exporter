const { http, https } = require('follow-redirects');
const normalizeUrl = require('normalize-url');
const { parse } = require('url');

const checkUrl = (url, cb) => {
    const normedUrl = normalizeUrl(url)
    if (!normedUrl) {
        return Promise.reject({ valid: false });
    }
    const { hostname, protocol } = parse(normedUrl);
    const isHttps = protocol.includes('https');

    const options = {
        host: hostname,
        method: 'HEAD',
        rejectUnauthorized: true,
        agent: false,
        trackRedirects: true
    };

    const resolveWith = (res) => {
        const result = {
            valid: true,
            has_https: isHttps,
            redirects_no: res.redirects.length,
            redirects_codes: res.redirects.map(r => r.statusCode),
            redirect_target: normalizeUrl((res.redirects.pop() || {}).url || '')
        };

        if (isHttps) {
            const { valid_to } = res.connection.getPeerCertificate();
            result.ssl_valid = res.socket.authorized;
            const valid_ms = +new Date(valid_to) - +new Date()
            result.ssl_valid_hours = Math.round(valid_ms / 1000 / 60 / 60)
        }

        cb(result);
    };

    const req = isHttps ? https.request(options, resolveWith) : http.request(options, resolveWith);
    req.on('error', err => cb({ valid: false }));
    req.end();
};

module.exports = checkUrl;
