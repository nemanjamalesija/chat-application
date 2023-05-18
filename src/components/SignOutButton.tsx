'use client';

import { signOut } from 'next-auth/react';
import { ButtonHTMLAttributes, FC, useState } from 'react';
import Button from './ui/Button';
import { Loader2, LogOut } from 'lucide-react';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      console.error('There was a problem signing out');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button {...props} variant='ghost' onClick={handleSignOut}>
      {isSigningOut ? (
        <Loader2 className='animate-spin h-4 w-4' />
      ) : (
        <LogOut className='w-4 h-4' />
      )}
    </Button>
  );
};

export default SignOutButton;
