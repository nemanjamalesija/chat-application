import Button from '@/components/ui/Button';
import { db } from '@/lib/db';

export default async function Home() {
  await db.set('hello', 'hello');

  return (
    <main className='text-red-600'>
      <Button variant='ghost'>Hello</Button>
    </main>
  );
}
