'use client';
import React, { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import { toast } from 'react-hot-toast';

type ChatInputProps = {
  chatPartner: User;
  chatId: string;
};

const ChatInput = ({ chatPartner, chatId }: ChatInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function sendMessage() {
    setIsLoading(true);
    try {
      await axios.post('/api/message/send', { text: input, chatId });
      setInput('');
      textAreaRef.current?.focus();
    } catch (error) {
      toast.error('Something went wrong. Please try again later');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='border-t border-gray-200  px-4 pt-4 mb-2 sm:mb-0'>
      <div className='h-full relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus:within:ring-2 focus:within:ring-indigo-600'>
        <TextareaAutosize
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={1}
          placeholder={`Message ${chatPartner.name}`}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholer:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />
      </div>
      <div
        className='py-2'
        aria-hidden='true'
        onClick={() => textAreaRef.current?.focus()}
      >
        <div className='py-px'>
          <div className='h-9'></div>
        </div>
        <div className='absolute right-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrink-0'>
            <Button isLoading={isLoading} type='submit' onClick={sendMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
