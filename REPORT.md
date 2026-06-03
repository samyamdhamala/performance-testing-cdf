# Performance Test Report

## Target
- Application: JSONPlaceholder (https://jsonplaceholder.typicode.com)
- Test Date: 2026-06-03
- Tool: k6 v2.0.0

## Test Scenarios
| Scenario | Duration | Peak VUs | Stages |
|---|---|---|---|
| Low    | 2m | 5   | ramp 30s / hold 1m / down 30s |
| Medium | 2m | 20  | ramp 30s / hold 1m / down 30s |
| Stress | 7m | 100 | ramp 1m / hold 2m / ramp 1m / hold 2m / down 1m |

## Results Summary
| Scenario | Avg Response | p95 Response | Throughput (req/s) | Error Rate |
|---|---|---|---|---|
| Low    | 45.95ms | 66.6ms  | 2.84  | 0% |
| Medium | 41.9ms  | 63.8ms  | 10.89 | 0% |
| Stress | 42.23ms | 64.48ms | 46.79 | 0% |

## Observations
- p95 response time remained stable across all load levels (~64-67ms),
  indicating no degradation under increased concurrency.
- Throughput scaled near-linearly with VU count.
- One spike to 2.23s at 100 VUs — isolated outlier, did not affect p95.
- All thresholds passed across all scenarios.

## Conclusion
JSONPlaceholder handled up to 100 concurrent users without degradation.
For a real production system, the next step would be to push beyond 100 VUs
until thresholds fail to find the saturation point, and to test with a 
larger variety of endpoints and payload sizes.

## How to Run
1. Install k6: `winget install k6 --source winget`
2. Clone this repo and cd into it
3. Run a scenario:
   - Low:    `k6 run --out json=results-low.json --env SCENARIO=low tests.js`
   - Medium: `k6 run --out json=results-medium.json --env SCENARIO=medium tests.js`
   - Stress: `k6 run --out json=results-stress.json --env SCENARIO=stress tests.js`
