# exposition
Prometheus text-based exposition parse and stringify

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
    "type": "counter",
    "help": "Aggregate inbound packets",
    "metrics": [
      {
        "value": "153"
      }
    ]
  }
]
```
