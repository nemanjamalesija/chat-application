import { fetchRedis } from './redis';

export default async function getFriendsByUserId(userId: string) {
  // retriever friends for current user

  const friendsIds = (await fetchRedis(
    'smembers',
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendsIds.map(async (fId) => {
      const friend = (await fetchRedis('get', `user:${fId}`)) as User;
      return friend;
    })
  );

  return friends;
}
