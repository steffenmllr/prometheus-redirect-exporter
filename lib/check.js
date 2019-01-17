const { http, https } = require('follow-redirects');
const normalizeUrl = require('normalize-url');
const { parse } = require('url');
const uniqBy = require('lodash.uniqby');

const checkUrl = (url, cb) => {
    const normedUrl = normalizeUrl(url, { stripWWW: false });
    if (!normedUrl) {
        return cb({ valid: false, url: normedUrl });
    }
    const { hostname, protocol } = parse(normedUrl);
    const isHttps = protocol.includes('https');

    const options = {
        host: hostname,
        method: 'HEAD',
        agent: false,
        rejectUnauthorized: true,
        trackRedirects: true
    };

    const resolveWith = (res) => {

        // we are filtering out slash redirects
        const redirects = uniqBy(res.redirects, r => {
            return normalizeUrl(r.url, { stripWWW: false });
        });

        const redirect_target = (redirects.pop() || {}).url;
        const result = {
            valid: true,
            url: normedUrl,
            has_https: isHttps,
            redirects_no: redirects.length,
            redirects_codes: redirects.map(r => r.statusCode),
            redirect_target
        };

        if (isHttps) {
            const { valid_to } = res.connection.getPeerCertificate();
            result.ssl_valid = res.socket.authorized;
            const valid_ms = +new Date(valid_to) - +new Date()
            result.ssl_valid_hours = Math.round(valid_ms / 1000 / 60 / 60)
        }

        // call destroy on the socket so we don' run into EADDRNOTAVAIL
        res.destroy();

        cb(result);
    };

    const req = isHttps ? https.request(options, resolveWith) : http.request(options, resolveWith);

    req.on('error', err => {
        // call destroy on the socket so we don't run into EADDRNOTAVAIL
        req.socket.destroy();
        cb({ valid: false, err });
    });

    req.end();

};

module.exports = checkUrl;
