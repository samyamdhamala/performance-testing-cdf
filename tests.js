import http from 'k6/http';
import { sleep, check, group } from 'k6';

const scenarios = {
  low: [
    { duration: '30s', target: 5  },
    { duration: '1m',  target: 5  },
    { duration: '30s', target: 0  },
  ],
  medium: [
    { duration: '30s', target: 20 },
    { duration: '1m',  target: 20 },
    { duration: '30s', target: 0  },
  ],
  stress: [
    { duration: '1m',  target: 50  },
    { duration: '2m',  target: 50  },
    { duration: '1m',  target: 100 },
    { duration: '2m',  target: 100 },
    { duration: '1m',  target: 0   },
  ],
};

export const options = {
  stages: scenarios[__ENV.SCENARIO] || scenarios.low,
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
};


export default function () {
  group('Browse posts', () => {
    const listRes = http.get('https://jsonplaceholder.typicode.com/posts');
    check(listRes, { 'list status 200': (r) => r.status === 200 });
    sleep(1);

    const id = Math.floor(Math.random() * 100) + 1;
    const postRes = http.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    check(postRes, { 'post status 200': (r) => r.status === 200 });
    sleep(2);
  });

  group('Submit a post', () => {
    const payload = JSON.stringify({ title: 'test', body: 'hello', userId: 1 });
    const headers = { 'Content-Type': 'application/json' };
    const postRes = http.post('https://jsonplaceholder.typicode.com/posts', payload, { headers });
    check(postRes, { 'create status 201': (r) => r.status === 201 });
    sleep(1);
  });
}
