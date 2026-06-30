const LoadingSpinner = ({ fullPage = false }: { fullPage?: boolean }) => {
  if (fullPage) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm'>
        <Spinner />
      </div>
    );
  }
  return (
    <div className='flex items-center justify-center py-16'>
      <Spinner />
    </div>
  );
};

const Spinner = () => (
  <div className='flex flex-col items-center gap-3'>
    <div className='w-10 h-10 rounded-full border-4 border-slate-200 border-t-sky-700 animate-spin' />
  </div>
);

export default LoadingSpinner;
