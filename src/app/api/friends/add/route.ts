import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getServerSession } from 'next-auth';
import { ZodError, z } from 'zod';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const { email: inputEmail } = addFriendValidator.parse(body.email);

    const APIResponse = await fetch(
      `${process.env.UPSTASH_REST_URL}/get/user:email:${inputEmail}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: 'no-store',
      }
    );

    const data = (await APIResponse.json()) as { result: string | null };

    const idToAdd = data.result;

    if (!idToAdd) {
      return new Response('This user does not exist', { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unathorized', { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response('You cannot add yourself as a friend', {
        status: 401,
      });
    }

    // check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      'sismbember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (!isAlreadyAdded) {
      return new Response('Already added this user', { status: 400 });
    }

    // check if a friend already exists
    const isAlreadyFriends = (await fetchRedis(
      'sismbember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (!isAlreadyFriends) {
      return new Response('This user is already in your friends list', {
        status: 400,
      });
    }

    // valid request, send friend request
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalud request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
    console.log(error);
  }
}
