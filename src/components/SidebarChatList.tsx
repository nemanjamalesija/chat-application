'use client';
import { chatHrefConstructor } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type SidebarChatListProps = {
  friends: User[];
  sessionId: string;
};

const SidebarChatList = ({ friends, sessionId }: SidebarChatListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [useenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role='list' className='max-h-[25] overflow-y-auto -mx-2 space-y-1'>
      {friends.sort().map((f) => {
        const unseenMessagesCount = useenMessages.filter((m) => {
          return m.senderId === f.id;
        }).length;

        return (
          <li key={f.id} className=''>
            <a
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 font-semibold'
              href={`/dashboard/chat/${chatHrefConstructor(sessionId, f.id)}`}
            >
              {f.name}
              {unseenMessagesCount && (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenMessagesCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
