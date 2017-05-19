'use strict';


const internals = {
  metricMatch: /^([\w_]+)(\{[^]+\})?\s(.+)$/,
  nameMatch: /^([\w_]+)_([\w]+)$/,
  leMatch: /^le="(.+)$/,
  quantileMatch: /^quantile="(.+)$/
};


exports.parse = function (input) {
  const results = [];

  if (!input) {
    return results;
  }

  const lines = input.split('\n');

  lines.forEach((line) => {
    const normalized = line.trim().replace(/\s+/g, ' ');  // trim and convert all whitespace to sinple space
    if (/^#\sHELP/.test(normalized)) {
      return internals.parseHelp(normalized, results);
    }

    if (/^#\sTYPE/.test(normalized)) {
      return internals.parseType(normalized, results);
    }

    // if this is not a comment, then it must be a metric
    if (/^[^#]/.test(normalized)) {
      return internals.parseMetric(normalized, results);
    }
  });

  return results;
};


exports.stringify = function (input) {
  let result = '';

  input.forEach((item) => {
    result += `# HELP ${item.name} ${item.help}\n`;
    result += `# TYPE ${item.name} ${item.type.toLowerCase()}\n`;

    item.metrics.forEach((metric) => {
      if (metric.buckets) {
        const bucketKeys = Object.keys(metric.buckets);
        bucketKeys.forEach((bucketKey) => {
          result += `${item.name}_bucket{le="${bucketKey}"} ${metric.buckets[bucketKey]}\n`;
        });
      }

      if (metric.quantiles) {
        const quantileKeys = Object.keys(metric.quantiles);
        quantileKeys.forEach((quantileKey) => {
          result += `${item.name}{quantile="${quantileKey}"} ${metric.quantiles[quantileKey]}\n`;
        });
      }

      if (metric.labels) {
        const labelKeys = Object.keys(metric.labels);
        const formattedLabels = [];
        labelKeys.forEach((labelKey) => {
          formattedLabels.push(`${labelKey}="${metric.labels[labelKey]}"`);
        });

        result += `${item.name}{${formattedLabels.join(',')}} ${metric.value}`;

        if (metric.timestamp) {
          result += ` ${metric.timestamp}`;
        }

        result += '\n';
      } else if (metric.value !== undefined) {
        result += `${item.name} ${metric.value}`;

        if (metric.timestamp) {
          result += ` ${metric.timestamp}`;
        }

        result += '\n';
      }

      if (metric.sum !== undefined) {
        result += `${item.name}_sum ${metric.sum}\n`;
      }

      if (metric.count !== undefined) {
        result += `${item.name}_count ${metric.count}\n`;
      }
    });
  });

  return result;
};


internals.parseType = function (line, results) {
  const tokens = line.split(' ');

  // # TYPE name counter
  if (tokens.length < 3) {
    return;
  }

  const name = tokens[2];
  const type = tokens.length === 4 ? tokens[3] : 'UNTYPED';
  const resultIndex = results.findIndex((entry) => {
    return (entry.name === name);
  });

  const result = (resultIndex !== -1) ? results[resultIndex] : { name, metrics: [] };
  result.type = type.toUpperCase();

  if (resultIndex === -1) {
    results.push(result);
  }
};

internals.parseHelp = function (line, results) {
  const tokens = line.split(' ');

  // # HELP name my message
  if (tokens.length < 4) {
    return;
  }

  const name = tokens[2];
  const message = tokens.slice(3).join(' ');
  const resultIndex = results.findIndex((entry) => {
    return (entry.name === name);
  });

  const result = (resultIndex !== -1) ? results[resultIndex] : { name, metrics: [] };
  result.help = message;

  if (resultIndex === -1) {
    results.push(result);
  }
};

internals.parseMetric = function (line, results) {
  const tokens = line.match(internals.metricMatch);
  if (!tokens || tokens.length < 2) {
    return;
  }

  let name = tokens[1];
  const labels = tokens[2] ? tokens[2].slice(1, tokens[2].length - 2) : '';
  const value = tokens[3] || '';
  let sumOrCount = '';
  let isBucket = false;
  const isQuantile = internals.quantileMatch.test(labels);

  // check if the name ends in _sum or _count
  const nameParts = name.match(internals.nameMatch);
  if (nameParts && nameParts.length === 3) {
    const nameType = nameParts[2].toLowerCase();
    if (['sum', 'count'].indexOf(nameType) !== -1) {
      sumOrCount = nameType;
      name = nameParts[1];
    } else if (nameType === 'bucket') {
      isBucket = true;
      name = nameParts[1];
    }
  }

  const resultIndex = results.findIndex((entry) => {
    return (entry.name === name);
  });

  const result = (resultIndex !== -1) ? results[resultIndex] : { name, metrics: [], type: 'UNTYPED', help: '' };
  const metric = result.metrics.length ? result.metrics[result.metrics.length - 1] : {};

  if (sumOrCount) {
    metric[sumOrCount] = value;
  } else if (isBucket) {
    metric.buckets = metric.buckets || {};

    const le = labels.match(internals.leMatch);
    if (le && le.length) {
      metric.buckets[le[1]] = value;
    }
  } else if (isQuantile) {
    const quantile = labels.match(internals.quantileMatch)[1];
    metric.quantiles = metric.quantiles || {};
    metric.quantiles[quantile] = value;
  } else {
    const newMetric = {};
    const labelParts = labels.split(/="|",/);

    if (labelParts.length > 1) {
      newMetric.labels = {};
      for (let i = 0; i < labelParts.length; i += 2) {
        const labelName = labelParts[i];
        const labelValue = labelParts[i + 1];
        newMetric.labels[labelName] = labelValue;
      }
    }

    const valueParts = value.split(' ');
    newMetric.value = valueParts[0];

    if (valueParts.length === 2) {
      newMetric.timestamp = valueParts[1];
    }

    result.metrics.push(newMetric);
  }

  if ((sumOrCount || isBucket || isQuantile) && !result.metrics.length) {
    result.metrics.push(metric);
  }

  if (resultIndex === -1) {
    results.push(result);
  }
};
