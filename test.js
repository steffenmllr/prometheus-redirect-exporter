const test = require('tape');
const checkUrl = require('./lib/check');

test('should test a https website', function (t) {
    t.plan(5);

    checkUrl('https://www.google.de', (res) => {
        t.equal(res.has_https, true);
        t.equal(res.valid, true);
        // let's assue google has a 14 days valid cert
        t.equal(res.ssl_valid_hours > 14 * 24, true);
        t.equal(res.redirects_no, 2);
        t.equal(res.redirect_target, 'https://google.de');
    });
});

test('should test a http website', function (t) {
    t.plan(4);

    checkUrl('http://www.google.de', (res) => {
        t.equal(res.valid, true);
        t.equal(res.has_https, false);
        t.equal(res.redirects_no, 2);
        t.equal(res.redirect_target, 'http://google.de');
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
