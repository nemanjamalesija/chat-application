'use client';

import { IncomingFriendRequestType } from '@/types/pusher';
import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

  const router = useRouter();
  const acceptFriend = async (senderId: string) => {
    await axios.post('/api/friends/accept', {
      id: senderId,
    });

    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );

    router.refresh();
  };

  const dennyFriend = async (senderId: string) => {
    await axios.post('/api/requests/deny', {
      id: senderId,
    });

    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );

    router.refresh();
  };

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
                onClick={() => acceptFriend(req.senderId)}
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
