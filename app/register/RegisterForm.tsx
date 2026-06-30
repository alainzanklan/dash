'use client';

import { useEffect, useState } from 'react';
import Heading from '../components/Heading';
import Inputs from '../components/inputs/Inputs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '../components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/types';

interface RegisterFormProps {
  currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    if (currentUser) {
      router.push('/');
      router.refresh();
    }
  }, [currentUser, router]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('/api/register', data);
      toast.success('Account created');

      const callback = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (callback?.ok) {
        router.refresh();
        router.push('/');
        toast.success('Welcome to Emart!');
      } else if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Google sign in will create account automatically via PrismaAdapter
      await signIn('google', { callbackUrl: '/' });
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
      <Heading title='Sign up for Emart' />
      <Button
        outline
        label={isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}
        icon={AiOutlineGoogle}
        onClick={handleGoogleSignIn}
      />
      <hr className='bg-slate-300 w-full h-px' />
      <Inputs
        id='name'
        label='Name'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
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
        label={isLoading ? 'Loading...' : 'Sign Up'}
        onClick={handleSubmit(onSubmit)}
      />
      <p className='text-sm'>
        Already have an account?{' '}
        <Link className='underline' href='/login'>
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
