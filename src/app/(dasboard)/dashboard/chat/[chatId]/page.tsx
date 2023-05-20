import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth';
import { messageArrayValidator } from '@/lib/validations/message';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    chatId: string;
  };
};

async function getChatMessages(chatId: string) {
  try {
    // fetch messages
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    // parse messages
    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    // sort messages (to display them later in reverse order)
    const reversedDbMessages = dbMessages.reverse();

    //validate messages
    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = params;

  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const { user } = session;

  // /dashboard/chat/
  const [userId1, userId2] = chatId.split('--');

  if (user.id !== userId1 && user.id !== userId2) return notFound();

  const chatParntnerId = user.id == userId1 ? userId2 : userId1;
  const chatPartner = (await fetchRedis(
    'get',
    `user:${chatParntnerId}`
  )) as User;

  const initialMessages = await getChatMessages(chatId);

  return <div>{params.chatId}</div>;
};

export default Page;
