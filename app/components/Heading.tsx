interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <h1 className='font-bold text-2xl text-slate-800'>{title}</h1>
      {subtitle && <p className='text-sm text-slate-400 mt-1'>{subtitle}</p>}
    </div>
  );
};

export default Heading;
