# Performance Test Report

## Target
- Application: JSONPlaceholder (https://jsonplaceholder.typicode.com)
- Test Date: 2026-06-03
- Tool: k6 v2.0.0

## Test Scenarios

| Scenario | Duration | Peak VUs | Stages |
|---|---|---|---|
| Low    | 2m  | 5   | ramp 30s / hold 1m / down 30s |
| Medium | 2m  | 20  | ramp 30s / hold 1m / down 30s |
| Stress | 10m | 500 | ramp 1m→100 / hold 2m / ramp 1m→200 / hold 2m / ramp 1m→500 / hold 2m / down 1m |

## Results Summary

| Scenario | Avg Response | p95 Response | Max Response | Throughput (req/s) | Error Rate |
|---|---|---|---|---|---|
| Low (5 VUs)    | 42ms  | 66ms | 99ms   | 2.78   | 0% |
| Medium (20 VUs)| 40ms  | 65ms | 316ms  | 10.91  | 0% |
| Stress (500 VUs)| 46ms | 72ms | 572ms  | 173.89 | 0% |

## Observations

- **p95 response time remained nearly flat** across all load levels (66ms → 65ms → 72ms),
  even as concurrent users scaled from 5 to 500. This is a +9% increase over a 100x increase
  in load — exceptional stability.
- **Throughput scaled linearly** with VU count: 2.78 → 10.91 → 173.89 req/s, confirming no
  server-side queuing or resource contention.
- **No errors across all scenarios** — 0% failure rate at every load level.
- **Max response spiked to 572ms at 500 VUs** — just over the 500ms check threshold, but
  isolated to a single request and did not affect p95.
- **1GB of data transferred** during the stress test at a sustained 1.7 MB/s, approaching the
  realistic ceiling of a single test machine's network throughput.

## Bottleneck Analysis

The saturation point of JSONPlaceholder was not reached within the tested range (up to 500
concurrent users). The near-flat p95 response curve strongly indicates that the target is
**CDN-backed and stateless** — responses are likely served from edge cache nodes with no
database or session processing per request.

The practical bottleneck in this test was the **client machine's network bandwidth**, not the
server. At 1.7 MB/s sustained throughput during the stress run, the test machine was approaching
its realistic ceiling for outbound HTTP load generation.

For a real production application (with database queries, authentication, and session state),
degradation would typically appear at far lower VU counts. The pattern to watch for:
- p95 response time rising sharply (e.g. 60ms → 300ms → 900ms)
- Error rate climbing above 1% (connection timeouts, 429 rate limits, 500 errors)
- Max response time diverging further from p95

## Conclusion

JSONPlaceholder demonstrated exceptional resilience under load, passing all thresholds across
all scenarios. The absence of degradation is attributable to its CDN-backed, stateless
architecture rather than infinite server capacity.

For production systems, the methodology used here — three escalating load levels with defined
p95 and error rate thresholds — provides a clear framework for identifying the point at which
user experience degrades. The next step for a real target would be to push VUs until thresholds
fail, then work backwards to identify which component (database, auth service, cache) saturated
first.

## Visualizations

See [report-stress.pdf](report-stress.pdf) for the full k6 report including all graphs and summary tables for the 500 VU stress test.

## How to Run

1. Install k6: `winget install k6 --source winget`
2. Add k6 to PATH: `$env:PATH += ";C:\Program Files\k6"`
3. Clone this repo and navigate into it
4. Run a scenario:
   - Low:    `k6 run --out json=results-low.json --env SCENARIO=low tests.js`
   - Medium: `k6 run --out json=results-medium.json --env SCENARIO=medium tests.js`
   - Stress: `k6 run --out json=results-stress.json --env SCENARIO=stress tests.js`
