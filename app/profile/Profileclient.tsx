'use client';

import { SafeUser } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Heading from '../components/Heading';
import { useSession } from 'next-auth/react';
import { MdPerson, MdLock } from 'react-icons/md';

interface ProfileClientProps {
  currentUser: SafeUser;
}

const inputClass =
  'w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-400 transition bg-white disabled:bg-slate-50 disabled:text-slate-400';
const labelClass = 'text-sm font-medium text-slate-600';

const ProfileClient: React.FC<ProfileClientProps> = ({ currentUser }) => {
  const router = useRouter();

  // useSession gives us the live image from Google OAuth
  // which may differ from what's stored in currentUser (server prop)
  const { data: session } = useSession();

  // Prefer session image (always fresh from token) over server prop
  const displayImage = session?.user?.image ?? currentUser.image;
  const displayName = session?.user?.name ?? currentUser.name;

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        toast.success('Profile updated');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Update failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error('Passwords do not match');
    if (newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');
    setIsLoadingPassword(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.success('Password updated');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Update failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8'>
        <Heading
          title='My Profile'
          subtitle='Manage your account information'
        />
      </div>

      <div className='flex flex-col gap-6'>
        {/* Avatar + name header */}
        <div className='bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm'>
          <div className='w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-slate-200'>
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName ?? 'avatar'}
                className='w-full h-full object-cover'
                referrerPolicy='no-referrer' // required for Google images
              />
            ) : (
              <MdPerson size={32} className='text-slate-400' />
            )}
          </div>
          <div>
            <p className='font-semibold text-slate-800 text-lg'>
              {displayName || 'User'}
            </p>
            <p className='text-sm text-slate-400'>{currentUser.email}</p>
            <span
              className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                currentUser.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-sky-100 text-sky-600'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Profile info form */}
        <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
          <h2 className='font-semibold text-slate-800 mb-4 flex items-center gap-2'>
            <MdPerson className='text-sky-700' size={18} />
            Personal Information
          </h2>
          <form onSubmit={handleUpdateProfile} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>Full Name</label>
              <input
                type='text'
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your full name'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>Email</label>
              <input
                type='email'
                className={inputClass}
                value={currentUser.email || ''}
                disabled
              />
              <p className='text-xs text-slate-400'>Email cannot be changed</p>
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>Phone Number</label>
              <input
                type='tel'
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='e.g. 024 000 0000'
              />
            </div>
            <button
              type='submit'
              disabled={isLoadingProfile}
              className='w-full sm:w-auto sm:self-end bg-sky-700 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors'
            >
              {isLoadingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password form — only for credentials users */}
        {currentUser.hashedPassword && (
          <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
            <h2 className='font-semibold text-slate-800 mb-4 flex items-center gap-2'>
              <MdLock className='text-teal-500' size={18} />
              Change Password
            </h2>
            <form
              onSubmit={handleUpdatePassword}
              className='flex flex-col gap-4'
            >
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Current Password</label>
                <input
                  type='password'
                  className={inputClass}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder='Enter current password'
                  required
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>New Password</label>
                <input
                  type='password'
                  className={inputClass}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='At least 6 characters'
                  required
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type='password'
                  className={inputClass}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Repeat new password'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={isLoadingPassword}
                className='w-full sm:w-auto sm:self-end bg-sky-700 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors'
              >
                {isLoadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileClient;
