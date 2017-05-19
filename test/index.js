'use strict';

const Code = require('code');
const Lab = require('lab');
const Exposition = require('../');
const Inputs = require('./text_inputs');


const internals = {};


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
