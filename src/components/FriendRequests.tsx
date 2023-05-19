'use client';

import { IncomingFriendRequestType } from '@/types/pusher';
import { Check, UserPlus, X } from 'lucide-react';
import { FC, useState } from 'react';

type IncomingFriendRequestsProps = {
  incomingFriendRequests: IncomingFriendRequestType[];
  sessionId: string;
};

const FriendRequests: FC<IncomingFriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<
    IncomingFriendRequestType[]
  >(incomingFriendRequests);

  return (
    <div>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>No new friend requests</p>
      ) : (
        friendRequests.map((req) => {
          return (
            <div key={req.senderId} className='flex gap-4 items-center'>
              <UserPlus className='text-black' />
              <p className='font-medium text-lg'>{req.senderEmail}</p>
              <button
                aria-label='accept friend'
                className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
              >
                <Check className='font-semibold text-white w-3/4 h-/4' />
              </button>
              <button
                aria-label='deny friend'
                className='w-8 h-8 bg-red-700 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
              >
                <X className='font-semibold text-white w-3/4 h-/4' />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FriendRequests;
