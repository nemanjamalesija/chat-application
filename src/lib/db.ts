import { Redis } from '@upstash/redis';

export const db = new Redis({
  url: 'https://eu1-useful-shiner-39455.upstash.io',
  token:
    'AZofASQgZWYzNzM0ZDgtOTllMy00N2ZhLWEwNjUtZDUyNzIyMzFkZWRkNzVjNWI1YzM3MDAzNDA0MjhjYTg3OWE1NjFiYzI3MDk=',
});
