import Summary from './Summary';
import getProducts from '@/actions/getProducts';
import getOrders from '@/actions/getOrders';
import getUsers from '@/actions/getUsers';
import getGraphData from '@/actions/getGraphData';
import BarGraph from './manage-products/BarGraph';
import { Suspense } from 'react';

const Admin = async () => {
  const [products, orders, users, graphData] = await Promise.all([
    getProducts({ category: null }),
    getOrders(),
    getUsers(),
    getGraphData(),
  ]);

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8'>
      {/* Stats */}
      <Suspense
        fallback={
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='h-24 rounded-xl bg-slate-100 animate-pulse'
              />
            ))}
          </div>
        }
      >
        <Summary products={products} orders={orders} users={users} />
      </Suspense>

      {/* Revenue chart */}
      <div className='bg-white rounded-xl border border-slate-100 shadow-sm p-6'>
        <div className='mb-4'>
          <h2 className='text-base font-semibold text-slate-800'>
            Revenue – Last 7 Days
          </h2>
          <p className='text-sm text-slate-400'>Daily sales totals</p>
        </div>
        <Suspense
          fallback={
            <div className='h-64 bg-slate-50 rounded-xl animate-pulse' />
          }
        >
          <BarGraph data={graphData} />
        </Suspense>
      </div>
    </div>
  );
};

export default Admin;
