'use strict';

const Code = require('code');
const Lab = require('lab');
const Exposition = require('../');


const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('parse()', () => {
  it('can parse a valid input into an object', (done) => {
    const parsed = Exposition.parse(internals.valid);
    expect(parsed[0]).to.equal({
      name: 'net_agg_packets_in',
      metrics: [
        {
          value: '153'
        }
      ],
      help: 'Aggregate inbound packets',
      type: 'counter'
    });
    done();
  });
});


internals.valid = `# HELP net_agg_packets_in Aggregate inbound packets
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
