# prometheus-uptime-exporter

![https://cloud.docker.com/u/steffenmllr/repository/docker/steffenmllr/prometheus-uptime-exporter]
(https://img.shields.io/docker/automated/steffenmllr/prometheus-uptime-exporter.svg)

### Request
```
http://localhost:3000/probe?url=https://www.google.de
```

Check out the [prometheus-sample.yaml](prometheus-sample.yaml) for a sample config

### Return values

```
# HELP http_check_valid If the site could be reached
# TYPE http_check_valid gauge
http_check_valid{has_https="true"} 1

# HELP https_check_valid If the site has a valid ssl certificate
# TYPE https_check_valid gauge
https_check_valid{ssl_valid_hours="1364"} 1

# HELP http_has_redirects If the site has redirects
# TYPE http_has_redirects gauge
http_has_redirects{redirect_target="https://google.de", redirects_codes="301,200", redirects_no="2"} 1
```
