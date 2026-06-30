'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatPrice } from '@/utils/formatPrice';
import Status from '@/app/components/Status';
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdMonetizationOn,
  MdRemoveRedEye,
} from 'react-icons/md';
import ActionBtn from '@/app/components/ActionBtn';
import { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { ExtendedOrder } from '@/actions/getOrders';

interface ManageOrdersClientsProps {
  orders: ExtendedOrder[];
}

const ManageOrdersClients: React.FC<ManageOrdersClientsProps> = ({
  orders,
}) => {
  const router = useRouter();

  const rows = orders.map((order) => ({
    id: order.id,
    customer: order.user.name,
    amount: formatPrice(order.amount),
    status: order.status,
    date: moment(order.createDate).fromNow(),
    deliveryStatus: order.deliveryStatus,
    address: order.address,
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'customer', headerName: 'Customer', width: 140 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 110,
      renderCell: (p) => (
        <span className='font-semibold text-slate-800'>{p.row.amount}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Payment',
      width: 130,
      renderCell: (p) =>
        p.row.status === 'pending' ? (
          <Status
            text='Pending'
            icon={MdAccessTimeFilled}
            bg='bg-slate-100'
            color='text-slate-600'
          />
        ) : (
          <Status
            text='Completed'
            icon={MdDone}
            bg='bg-green-100'
            color='text-green-700'
          />
        ),
    },
    {
      field: 'deliveryStatus',
      headerName: 'Delivery',
      width: 130,
      renderCell: (p) =>
        p.row.deliveryStatus === 'pending' ? (
          <Status
            text='Pending'
            icon={MdAccessTimeFilled}
            bg='bg-slate-100'
            color='text-slate-600'
          />
        ) : p.row.deliveryStatus === 'dispatched' ? (
          <Status
            text='Dispatched'
            icon={MdDeliveryDining}
            bg='bg-purple-100'
            color='text-purple-700'
          />
        ) : (
          <Status
            text='Delivered'
            icon={MdDone}
            bg='bg-green-100'
            color='text-green-700'
          />
        ),
    },
    { field: 'date', headerName: 'Date', width: 130 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 180,
      renderCell: (p) => (
        <div className='flex items-center gap-2'>
          <ActionBtn
            icon={MdDeliveryDining}
            onClick={() => handleDispatch(p.row.id)}
          />
          <ActionBtn icon={MdDone} onClick={() => handleDeliver(p.row.id)} />
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => router.push(`/order/${p.row.id}`)}
          />
          <ActionBtn
            icon={MdMonetizationOn}
            onClick={() => handlePayment(p.row.id)}
          />
        </div>
      ),
    },
  ];

  const handlePayment = useCallback(
    (id: string) => {
      axios
        .put('/api/order', { id, status: 'complete' })
        .then(() => {
          toast.success('Marked as paid');
          router.refresh();
        })
        .catch(() => toast.error('Something went wrong'));
    },
    [router],
  );

  const handleDispatch = useCallback(
    (id: string) => {
      axios
        .put('/api/order', { id, deliveryStatus: 'dispatched' })
        .then(() => {
          toast.success('Order dispatched');
          router.refresh();
        })
        .catch(() => toast.error('Something went wrong'));
    },
    [router],
  );

  const handleDeliver = useCallback(
    (id: string) => {
      axios
        .put('/api/order', { id, deliveryStatus: 'delivered' })
        .then(() => {
          toast.success('Order delivered');
          router.refresh();
        })
        .catch(() => toast.error('Something went wrong'));
    },
    [router],
  );

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-800'>Manage Orders</h2>
        <p className='text-sm text-slate-400'>{orders.length} total orders</p>
      </div>
      <div className='bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden'>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                fontSize: 13,
                color: '#64748b',
              },
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f8fafc' },
              '& .MuiDataGrid-cell': { fontSize: 13, color: '#1e293b' },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersClients;
