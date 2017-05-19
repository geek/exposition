'use strict';

const Code = require('code');
const Lab = require('lab');
const Exposition = require('../');
const Inputs = require('./text_inputs');


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('parse()', () => {
  it('can parse a simple input into an object', (done) => {
    const parsed = Exposition.parse(Inputs.simple);
    expect(parsed[0]).to.equal({
      name: 'net_agg_packets_in',
      help: 'Aggregate inbound packets',
      type: 'COUNTER',
      metrics: [
        {
          value: '153'
        }
      ]
    });
    done();
  });

  it('can parse a complex input into an object', (done) => {
    const parsed = Exposition.parse(Inputs.complex);
    expect(parsed[0]).to.equal({
      name: 'http_requests_total',
      metrics: [
        {
          labels: {
            method: 'post',
            code: '200'
          },
          value: '1027',
          timestamp: '1395066363000'
        },
        {
          labels: {
            method: 'post',
            code: '400'
          },
          value: '3',
          timestamp: '1395066363000'
        }
      ],
      help: 'The total number of HTTP requests.',
      type: 'COUNTER'
    });
    done();
  });
});


describe('stringify()', () => {
  it('will return a string from an object with labels', (done) => {
    const input = [{
      name: 'http_requests_total',
      metrics: [
        {
          labels: {
            method: 'post',
            code: '200'
          },
          value: '1027',
          timestamp: '1395066363000'
        },
        {
          labels: {
            method: 'post',
            code: '400'
          },
          value: '3',
          timestamp: '1395066363000'
        }
      ],
      help: 'The total number of HTTP requests.',
      type: 'COUNTER'
    }];

    const result = Exposition.stringify(input);
    expect(result).to.contain('# HELP http_requests_total The total number of HTTP requests.');
    expect(result).to.contain('http_requests_total{method="post",code="200"} 1027 1395066363000');
    expect(result).to.contain('http_requests_total{method="post",code="400"} 3 1395066363000');
    done();
  });

  it('will return a string from an object with buckets', (done) => {
    const input = [{
      name: 'http_request_duration_seconds',
      metrics: [
        {
          buckets: {
            '1': '133988',
            '0.05': '24054',
            '0.1': '33444',
            '0.2': '100392',
            '0.5': '129389',
            '+Inf': '144320'
          },
          sum: '53423',
          count: '144320'
        }
      ],
      help: 'A histogram of the request duration.',
      type: 'HISTOGRAM'
    }];

    const result = Exposition.stringify(input);
    expect(result).to.contain('# HELP http_request_duration_seconds A histogram of the request duration.');
    expect(result).to.contain('# TYPE http_request_duration_seconds histogram');
    expect(result).to.contain('http_request_duration_seconds_bucket{le="1"} 133988');
    expect(result).to.contain('http_request_duration_seconds_bucket{le="+Inf"} 144320');
    expect(result).to.contain('http_request_duration_seconds_sum 53423');
    expect(result).to.contain('http_request_duration_seconds_count 144320');
    done();
  });

  it('will stringify a simple counter', (done) => {
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

    const result = Exposition.stringify(input);
    expect(result).to.equal(Inputs.simple);
    done();
  });
});

describe('parse and stringify', () => {
  it('are compatible', (done) => {
    const parsed = Exposition.parse(Inputs.simple);
    const stringified = Exposition.stringify(parsed);
    const parsedAgain = Exposition.parse(stringified);

    expect(stringified).to.equal(Inputs.simple);
    expect(parsed).to.equal(parsedAgain);
    done();
  });
});
