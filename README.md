# exposition
Prometheus text-based exposition parse and stringify

[![Build Status](https://secure.travis-ci.org/geek/exposition.svg)](http://travis-ci.org/geek/exposition)


## Usage

```javascript
const parsed = Exposition.parse(strProm);
```

## API

### `parse(str)`

Parse a Prometheus text-formatted exposition string and return as an object representation. For example, the following entry is parsed as the below object.


```
# HELP net_agg_packets_in Aggregate inbound packets
# TYPE net_agg_packets_in counter
net_agg_packets_in 153
```

```json
[
  {
    "name": "net_agg_packets_in",
    "type": "COUNTER",
    "help": "Aggregate inbound packets",
    "metrics": [
      {
        "value": "153"
      }
    ]
  }
]
```

Exposition will also parse more complex structures, for example:

```
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
```

is represented as

```json
[{
    "name": "http_request_duration_seconds",
    "metrics": [
       {
          "buckets": {
             "1": "133988",
             "0.05": "24054",
             "0.1": "33444",
             "0.2": "100392",
             "0.5": "129389",
             "+Inf": "144320"
          },
          "sum": "53423",
          "count": "144320"
       }
    ],
    "help": "A histogram of the request duration.",
    "type": "HISTOGRAM"
}]
```


### `stringify(array)`

Returns an exposition text-formatted representation of the array of objects.

Example:

```js
const Exposition = require('exposition');

const input = [{
  name: 'net_agg_packets_in',
  help: 'Aggregate inbound packets',
  type: 'COUNTER',
  metrics: [
    {
      value: '153'
    }
  ]
}];

console.log(Exposition.stringify(input));
```

result:
```
# HELP net_agg_packets_in Aggregate inbound packets
# TYPE net_agg_packets_in counter
net_agg_packets_in 153
```
