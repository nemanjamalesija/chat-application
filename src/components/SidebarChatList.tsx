'use client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type PageProps = {
  friends: User[];
};

const SidebarChatList = ({ friends }: PageProps) => {
  const router = useRouter();

  const [useenMessages, setUnseenMessages] = useState<Message[]>([]);

  return (
    <ul role='list' className='max-h-[25] overflow-y-auto -mx-2 space-y-1'>
      {friends.sort().map((f) => {
        return <div>ss</div>;
      })}
    </ul>
  );
};

export default SidebarChatList;
