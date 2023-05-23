import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth';
import { messageArrayValidator } from '@/lib/validations/message';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Messages from '@/components/Messages';
import ChatInput from '@/components/ChatInput';

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

  // link: /dashboard/chat/chat1--chat2
  const [userId1, userId2] = chatId.split('--');

  if (user.id !== userId1 && user.id !== userId2) return notFound();

  const chatParntnerId = user.id == userId1 ? userId2 : userId1;
  const chatPartner = (await fetchRedis(
    'get',
    `user:${chatParntnerId}`
  )) as string;
  const chatPartnerParsed = JSON.parse(chatPartner) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4 '>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                src={chatPartnerParsed.image}
                alt={`${chatPartnerParsed.name} profile picture`}
                fill
                referrerPolicy='no-referrer'
                className='rounded-full'
              />
            </div>
          </div>
          <div className='flex-flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartnerParsed.name}
              </span>
            </div>
            <span className='text-sm text-gray-600'>
              {chatPartnerParsed.email}
            </span>
          </div>
        </div>
      </div>
      <Messages sessionId={session.user.id} initialMessages={initialMessages} />
      <ChatInput chatPartner={chatPartnerParsed} chatId={chatId} />
    </div>
  );
};

export default Page;
