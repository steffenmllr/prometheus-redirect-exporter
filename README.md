# prometheus-uptime-exporter

![https://cloud.docker.com/u/steffenmllr/repository/docker/steffenmllr/prometheus-uptime-exporter](https://img.shields.io/docker/automated/steffenmllr/prometheus-uptime-exporter.svg)

### Request
```
http://localhost:3000/probe?url=https://www.google.com
```

Check out the [prometheus-sample.yaml](prometheus-sample.yaml) for a sample config

### Return values

```
# HELP probe_dns_lookup_time_seconds Returns the time taken for probe dns lookup in seconds
# TYPE probe_dns_lookup_time_seconds gauge
probe_dns_lookup_time_seconds 0.012105415999999878
# HELP probe_duration_seconds Returns how long the probe took to complete in seconds
# TYPE probe_duration_seconds gauge
probe_duration_seconds 0.2619368119999999
# HELP probe_http_content_length Length of http content response
# TYPE probe_http_content_length gauge
probe_http_content_length 54846
# HELP probe_http_redirects The number of redirects
# TYPE probe_http_redirects gauge
probe_http_redirects 1
# HELP probe_http_ssl Indicates if SSL was used for the final redirect
# TYPE probe_http_ssl gauge
probe_http_ssl true
# HELP probe_http_status_code Response HTTP status code
# TYPE probe_http_status_code gauge
probe_http_status_code 200
# HELP probe_success Displays whether or not the probe was a success
# TYPE probe_success gauge
probe_success 1
```
