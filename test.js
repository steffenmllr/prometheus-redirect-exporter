const test = require('tape');
const checkUrl = require('./lib/check');
const {generateGauge} = require('./lib/prometheus');

test('should generate gauges', function (t) {
    t.plan(3);

    const result = generateGauge({
        name: 'http_check_valid',
        help: 'If the site could be reached',
        value: 1,
        labels: {
            has_https: true
        }
    });

    t.equal(result[0], "# HELP http_check_valid If the site could be reached");
    t.equal(result[1], "# TYPE http_check_valid gauge");
    t.equal(result[2], 'http_check_valid{has_https="true"} 1');
});

test('should generate gauges and convert true to 1', function (t) {
    t.plan(2);

    const result = generateGauge({
        name: 'http_check_valid',
        value: true
    });

    t.equal(result[0], "# TYPE http_check_valid gauge");
    t.equal(result[1], 'http_check_valid 1');
});

test('should default the value to 0', function (t) {
    t.plan(2);

    const result = generateGauge({
        name: 'http_check_valid'
    });

    t.equal(result[0], "# TYPE http_check_valid gauge");
    t.equal(result[1], 'http_check_valid 0');
});

test('should set invalid values to 0', function (t) {
    t.plan(2);

    const result = generateGauge({
        name: 'http_check_valid',
        value: 'invalid'
    });

    t.equal(result[0], "# TYPE http_check_valid gauge");
    t.equal(result[1], 'http_check_valid 0');
});


test('should test a https website', function (t) {
    t.plan(5);

    checkUrl('https://www.google.de', (res) => {
        t.equal(res.has_https, true);
        t.equal(res.valid, true);

        // let's assue google has a 14 days valid cert
        t.equal(res.ssl_valid_hours > 14 * 24, true);
        t.equal(res.redirects_no, 0);
        t.equal(res.url, 'https://www.google.de');
    });
});

test('should test a http website', function (t) {
    t.plan(4);

    checkUrl('http://www.google.de', (res) => {
        t.equal(res.valid, true);
        t.equal(res.has_https, false);
        t.equal(res.redirects_no, 0);
        t.equal(res.redirect_target, 'http://www.google.de');
    });
});

test('should be invalid for expired SSL certificates (with / without redirect)', function (t) {
    t.plan(2);

    checkUrl('https://expired.badssl.com', (res) => {
        t.equal(res.valid, false);
    });

    checkUrl('http://expired.badssl.com', (res) => {
        t.equal(res.valid, false);
    });
});

test('should be invalid for incomplete chain SSL certificates (with / without redirect)', function (t) {
    t.plan(2);

    checkUrl('https://incomplete-chain.badssl.com', (res) => {
        t.equal(res.valid, false);
    });
    checkUrl('http://incomplete-chain.badssl.com', (res) => {
        t.equal(res.valid, false);
    });
});


test('should be invalid for a non-existing url', function (t) {
    t.plan(2);

    checkUrl('http://fkldsjfkldönskföndsjkanfjkdsnafjkdsnafjkdlnsajkfndjksanlfj.com', (res) => {
        t.equal(res.valid, false);
    });
    checkUrl('http://fkldsjfkldönskföndsjkanfjkdsnafjkdsnafjkdlnsajkfndjksanlfj.com', (res) => {
        t.equal(res.valid, false);
    });
});

test('should be invalid for a invalid url', function (t) {
    t.plan(1);

    checkUrl('kdlnsajkfndjksanlf', (res) => {
        t.equal(res.valid, false);
    });
});


test('should have the correct redirect number', function (t) {
    t.plan(4);

    checkUrl('https://google.de', (res) => {
        t.equal(res.valid, true);
        t.equal(res.has_https, true);
        t.equal(res.redirects_no, 1);
        t.equal(res.redirect_target, 'https://www.google.de/');
    });
});
