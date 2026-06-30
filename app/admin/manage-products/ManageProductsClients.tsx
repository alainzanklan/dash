'use client';

import { Product } from '@/prisma/generated/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatPrice } from '@/utils/formatPrice';
import Status from '@/app/components/Status';
import ActionBtn from '@/app/components/ActionBtn';
import { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdEdit,
  MdRemoveRedEye,
} from 'react-icons/md';

interface ManageProductsClientsProps {
  products: Product[];
}

const ManageProductsClients: React.FC<ManageProductsClientsProps> = ({
  products,
}) => {
  const router = useRouter();

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: formatPrice(p.price),
    category: p.category,
    brand: p.brand,
    inStock: p.inStock,
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      renderCell: (p) => (
        <span className='font-semibold text-slate-800'>{p.row.price}</span>
      ),
    },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'brand', headerName: 'Brand', width: 110 },
    {
      field: 'inStock',
      headerName: 'Stock',
      width: 120,
      renderCell: (p) =>
        p.row.inStock ? (
          <Status
            text='In stock'
            icon={MdDone}
            bg='bg-teal-100'
            color='text-teal-700'
          />
        ) : (
          <Status
            text='Out of stock'
            icon={MdClose}
            bg='bg-rose-100'
            color='text-rose-700'
          />
        ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 180,
      renderCell: (p) => (
        <div className='flex items-center gap-2'>
          <ActionBtn
            icon={MdCached}
            onClick={() => handleToggleStock(p.row.id, p.row.inStock)}
          />
          <ActionBtn
            icon={MdEdit}
            onClick={() => router.push(`/admin/edit-product/${p.row.id}`)}
          />
          <ActionBtn icon={MdDelete} onClick={() => handleDelete(p.row.id)} />
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => router.push(`/product/${p.row.id}`)}
          />
        </div>
      ),
    },
  ];

  const handleToggleStock = useCallback(
    (id: string, inStock: boolean) => {
      axios
        .put('/api/product', { id, inStock: !inStock })
        .then(() => {
          toast.success('Stock updated');
          router.refresh();
        })
        .catch(() => toast.error('Failed to update stock'));
    },
    [router],
  );

  const handleDelete = useCallback(
    (id: string) => {
      toast('Deleting…');
      axios
        .delete(`/api/product/${id}`)
        .then(() => {
          toast.success('Product deleted');
          router.refresh();
        })
        .catch(() => toast.error('Failed to delete'));
    },
    [router],
  );

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-800'>
          Manage Products
        </h2>
        <p className='text-sm text-slate-400'>
          {products.length} total products
        </p>
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

export default ManageProductsClients;
