'use strict';

exports.simple = `# HELP net_agg_packets_in Aggregate inbound packets
# TYPE net_agg_packets_in counter
net_agg_packets_in 153
# HELP net_agg_packets_out Aggregate outbound packets
# TYPE net_agg_packets_out counter
net_agg_packets_out 53
# HELP net_agg_bytes_in Aggregate inbound bytes
# TYPE net_agg_bytes_in counter
net_agg_bytes_in 11417
# HELP net_agg_bytes_out Aggregate outbound bytes
# TYPE net_agg_bytes_out counter
net_agg_bytes_out 4226
# HELP mem_agg_usage Aggregate memory usage in bytes
# TYPE mem_agg_usage gauge
mem_agg_usage 29487104
# HELP mem_limit Memory limit in bytes
# TYPE mem_limit gauge
mem_limit 1073741824
# HELP mem_swap Swap in bytes
# TYPE mem_swap gauge
mem_swap 11182080
# HELP mem_swap_limit Swap limit in bytes
# TYPE mem_swap_limit gauge
mem_swap_limit 4294967296
# HELP cpu_user_usage User CPU utilization in nanoseconds
# TYPE cpu_user_usage counter
cpu_user_usage 312698285
# HELP cpu_sys_usage System CPU usage in nanoseconds
# TYPE cpu_sys_usage counter
cpu_sys_usage 501252185
# HELP cpu_wait_time CPU wait time in nanoseconds
# TYPE cpu_wait_time counter
cpu_wait_time 47205227
# HELP load_average Load average
# TYPE load_average gauge
load_average 0.00390625
# HELP zfs_used zfs space used in bytes
# TYPE zfs_used gauge
zfs_used 297472
# HELP zfs_available zfs space available in bytes
# TYPE zfs_available gauge
zfs_available 26843248128
# HELP time_of_day System time in seconds since epoch
# TYPE time_of_day counter
time_of_day 1492802236082`;


exports.complex = `# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{method="post",code="200"} 1027 1395066363000
http_requests_total{method="post",code="400"}    3 1395066363000

# Escaping in label values:
msdos_file_access_time_seconds{path="C:\\DIR\\FILE.TXT",error="Cannot find file:\n\"FILE.TXT\""} 1.458255915e9

# Minimalistic line:
metric_without_timestamp_and_labels 12.47

# A weird metric from before the epoch:
something_weird{problem="division by zero"} +Inf -3982045

# A histogram, which has a pretty complex representation in the text format:
# HELP http_request_duration_seconds A histogram of the request duration.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05"} 24054
http_request_duration_seconds_bucket{le="0.1"} 33444
http_request_duration_seconds_bucket{le="0.2"} 100392
http_request_duration_seconds_bucket{le="0.5"} 129389
http_request_duration_seconds_bucket{le="1"} 133988
http_request_duration_seconds_bucket{le="+Inf"} 144320
http_request_duration_seconds_sum 53423
http_request_duration_seconds_count 144320

# Finally a summary, which has a complex representation, too:
# HELP rpc_duration_seconds A summary of the RPC duration in seconds.
# TYPE rpc_duration_seconds summary
rpc_duration_seconds{quantile="0.01"} 3102
rpc_duration_seconds{quantile="0.05"} 3272
rpc_duration_seconds{quantile="0.5"} 4773
rpc_duration_seconds{quantile="0.9"} 9001
rpc_duration_seconds{quantile="0.99"} 76656
rpc_duration_seconds_sum 1.7560473e+07
rpc_duration_seconds_count 2693`;
