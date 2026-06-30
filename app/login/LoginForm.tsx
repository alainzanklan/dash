'use client';

import { useEffect, useState } from 'react';
import Heading from '../components/Heading';
import Inputs from '../components/inputs/Inputs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '../components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '@/types';

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (currentUser) {
      router.refresh();
      router.push('/cart');
    }
  }, [currentUser, router]);

  // Show friendly error for OAuth issues
  useEffect(() => {
    const error = searchParams?.get('error');
    if (error === 'OAuthAccountNotLinked') {
      toast.error(
        'This email is registered with a password. Sign in with your password instead.',
        { duration: 5000 },
      );
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn('credentials', { ...data, redirect: false }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        toast.success('Logged in');
        router.refresh();
        router.push('/cart');
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/cart' });
    } catch {
      toast.error('Google sign in failed');
      setIsGoogleLoading(false);
    }
  };

  if (currentUser) {
    return <p className='text-center'>Logged in. Redirecting...</p>;
  }

  return (
    <>
      <Heading title='Sign in to Dash' />
      <Button
        outline
        label={isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}
        icon={AiOutlineGoogle}
        onClick={handleGoogleSignIn}
      />
      <hr className='bg-slate-300 w-full h-px' />
      <Inputs
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Inputs
        id='password'
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='password'
      />
      <Button
        label={isLoading ? 'Loading...' : 'Login'}
        onClick={handleSubmit(onSubmit)}
      />
      <p className='text-sm'>
        Don't have an account?{' '}
        <Link className='underline' href='/register'>
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
