# Performance Testing with k6

Performance test scripts targeting [JSONPlaceholder](https://jsonplaceholder.typicode.com), 
simulating up to 500 concurrent users across three load scenarios.

## How to Run

1. Install k6: `winget install k6 --source winget`
2. Add k6 to PATH: `$env:PATH += ";C:\Program Files\k6"`
3. Run a scenario:
   - Low:    `k6 run --out json=results-low.json --env SCENARIO=low tests.js`
   - Medium: `k6 run --out json=results-medium.json --env SCENARIO=medium tests.js`
   - Stress: `k6 run --out json=results-stress.json --env SCENARIO=stress tests.js`

## Results

See [REPORT.md](REPORT.md) for the full analysis and [report-stress.pdf](report-stress.pdf) 
for graphs and visualizations.
