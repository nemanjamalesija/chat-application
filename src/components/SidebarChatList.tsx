import React from 'react';

type PageProps = {
  friends: User[];
};

const SidebarChatList = ({ friends }: PageProps) => {
  return (
    <ul role='list' className='max-h-[25] overflow-y-auto -mx-2 space-y-1'></ul>
  );
};

export default SidebarChatList;
