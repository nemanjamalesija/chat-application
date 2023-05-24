import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageValidator, validMessageType } from '@/lib/validations/message';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response('Unathorized', { status: 401 });

    // Verify the user
    const [userId1, userId2] = chatId.split('--');

    if (session.user.id !== userId1 && session.user.id !== userId2)
      return new Response('Unathorized', { status: 401 });

    const chatParntnerId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[];

    const isFriend = friendList.includes(chatParntnerId);

    if (!isFriend) return new Response('Unathorized', { status: 401 });

    const sender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string;

    const parsedSender = JSON.parse(sender);

    // All valid. Send message
    const timestamp = Date.now();

    const messageData: validMessageType = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 500 });

    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    else return new Response('Something went wrong', { status: 500 });
  }
}
