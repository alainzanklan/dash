'use client';

import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { MdSearch, MdClose } from 'react-icons/md';

const SearchBar = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, watch } = useForm<FieldValues>({
    defaultValues: { searchTerm: '' },
  });

  const searchTerm = watch('searchTerm');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!data.searchTerm) return router.push('/');
    const url = queryString.stringifyUrl(
      { url: '/', query: { searchTerm: data.searchTerm } },
      { skipNull: true },
    );
    router.push(url);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex items-center w-full max-w-md'
    >
      <div className='relative flex items-center w-full'>
        <MdSearch
          size={20}
          className='absolute left-3 text-slate-400 pointer-events-none'
        />
        <input
          {...register('searchTerm')}
          autoComplete='off'
          type='text'
          placeholder='Search products…'
          className='w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-l-xl outline-none focus:bg-white focus:border-sky-400 transition-all'
        />
        {searchTerm && (
          <button
            type='button'
            onClick={() => reset()}
            className='absolute right-3 text-slate-400 hover:text-slate-600'
          >
            <MdClose size={16} />
          </button>
        )}
      </div>
      <button
        type='submit'
        className='bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2.5 rounded-r-xl transition-colors whitespace-nowrap'
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
