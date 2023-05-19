import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import z from 'zod';

export async function POST(res: Response) {
  try {
    const body = await res.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    // check if user is logged in
    if (!session) {
      return new Response('Unathorized', { status: 401 });
    }

    // verify users are not already friends
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response('You are already friends with this person', {
        status: 400,
      });
    }

    // check if friend request exist
    const doesFriendRequestExist = await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!doesFriendRequestExist) {
      return new Response(
        'You must send a friend request before adding someone as a friend',
        {
          status: 400,
        }
      );
    }

    // add request user to friends list
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);

    // add current user to the request user friends list
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    // clear friend request
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
