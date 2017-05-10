'use strict';


const internals = {};


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

    return internals.parseMetric(normalized, results);
  });

  return results;
};


internals.parseType = function (line, results) {
  const tokens = line.split(' ');

  // # TYPE name counter
  if (tokens.length < 3) {
    return;
  }

  const name = tokens[2];
  const type = tokens.length === 4 ? tokens[3] : 'untyped';
  const resultIndex = results.findIndex((entry) => {
    return (entry.name === name);
  });

  const result = (resultIndex !== -1) ? results[resultIndex] : { name, metrics: [] };
  result.type = type;

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
  const tokens = line.split(' ');
  if (tokens.length < 2) {
    return;
  }

  const name = tokens[0];
  const value = tokens.slice(1).join(' ');

  const resultIndex = results.findIndex((entry) => {
    return (entry.name === name);
  });

  const result = (resultIndex !== -1) ? results[resultIndex] : { name, metrics: [] };
  result.metrics.push({ value });

  if (resultIndex === -1) {
    results.push(result);
  }
};
