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
            <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, f.id)}`}>
              Hello
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
