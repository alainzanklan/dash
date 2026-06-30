'use client';

import Button from '@/app/components/Button';
import Heading from '@/app/components/Heading';
import CategoryInput from '@/app/components/inputs/CategoryInput';
import CustomCheckbox from '@/app/components/inputs/CustomCheckbox';
import Input from '@/app/components/inputs/Inputs';
import SelectColor from '@/app/components/inputs/SelectColor';
import { categories } from '@/utils/Categories';
import { colors } from '@/utils/Colors';
import { useCallback, useEffect, useState } from 'react';
import {
  FieldValues,
  SubmitHandler,
  useForm,
  Controller,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import WysiwygEditor from '@/app/components/WysiwygEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ImageType, UploadedImageType } from '@/types/product';
import PartnerSelect from '@/app/components/partner/Partnerselect';

const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset!);
  formData.append('folder', 'products');
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  );
  if (!response.ok) throw new Error('Failed to upload image to Cloudinary');
  const data = await response.json();
  return data.secure_url as string;
};

interface EditProductFormProps {
  product: any;
}

const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [existingImages, setExistingImages] = useState<UploadedImageType[]>(
    product.images ?? [],
  );
  const [isProductUpdated, setIsProductUpdated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      inStock: product.inStock,
      images: product.images ?? [],
      price: product.price,
      partnerId: product.partnerId ?? null, // ← pre-fill existing partner
    },
  });

  const category = watch('category');
  const partnerId = watch('partnerId'); // ← watch so PartnerSelect shows current value

  useEffect(() => {
    setCustomValue('images', [...existingImages, ...(images ?? [])]);
  }, [images, existingImages]);

  useEffect(() => {
    if (isProductUpdated) {
      reset();
      setImages(null);
      setIsProductUpdated(false);
    }
  }, [isProductUpdated]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!data.category) {
      setIsLoading(false);
      return toast.error('Category is not selected');
    }
    if (!existingImages.length && (!data.images || data.images.length === 0)) {
      setIsLoading(false);
      return toast.error('No selected image');
    }

    let uploadedImages: UploadedImageType[] = [...existingImages];

    toast('Updating product, please wait...');

    try {
      if (images && images.length > 0) {
        for (const item of images) {
          if (item.image) {
            const downloadURL = await uploadToCloudinary(item.image);
            uploadedImages.push({
              color: item.color,
              colorCode: item.colorCode,
              image: downloadURL,
            });
          }
        }
      }
    } catch {
      setIsLoading(false);
      return toast.error('Error uploading images to Cloudinary');
    }

    axios
      .put(`/api/product/${product.id}`, {
        name: data.name,
        description: data.description,
        brand: data.brand,
        category: data.category,
        inStock: data.inStock,
        price: parseFloat(data.price),
        images: uploadedImages,
        partnerId: data.partnerId ?? null, // ← send partnerId to API
      })
      .then(() => {
        toast.success('Product updated');
        setIsProductUpdated(true);
        router.push('/admin/manage-products');
        router.refresh();
      })
      .catch(() => toast.error('Something went wrong when updating product'))
      .finally(() => setIsLoading(false));
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => (!prev ? [value] : [...prev, value]));
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) return prev.filter((item) => item.color !== value.color);
      return null;
    });
  }, []);

  return (
    <>
      <Heading title='Edit Product' center />

      <Input
        id='name'
        label='Name'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='price'
        label='Price'
        disabled={isLoading}
        register={register}
        errors={errors}
        type='number'
        required
      />
      <Input
        id='brand'
        label='Brand'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Controller
        name='description'
        control={control}
        render={({ field }) => <WysiwygEditor field={field} />}
      />

      <CustomCheckbox
        id='inStock'
        register={register}
        label='This Product is in Stock'
      />

      <div className='w-full font-medium'>
        <div className='mb-2 font-semibold'>Select a Category</div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto'>
          {categories.map((item) => {
            if (item.label === 'All') return null;
            return (
              <div key={item.label} className='col-span'>
                <CategoryInput
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* PartnerSelect — value pre-filled from existing product.partnerId */}
      <PartnerSelect
        value={partnerId ?? null}
        onChange={(id) => setCustomValue('partnerId', id)}
      />

      {/* Existing images preview */}
      {existingImages.length > 0 && (
        <div className='w-full'>
          <div className='mb-2 font-semibold'>Current Images</div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {existingImages.map((img) => (
              <div
                key={img.colorCode}
                className='relative group rounded-lg overflow-hidden border border-slate-200'
              >
                <img
                  src={img.image}
                  alt={img.color}
                  className='w-full h-28 object-cover'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <button
                    type='button'
                    onClick={() =>
                      setExistingImages((prev) =>
                        prev.filter((i) => i.colorCode !== img.colorCode),
                      )
                    }
                    className='text-white text-xs bg-rose-500 px-3 py-1 rounded-full'
                  >
                    Remove
                  </button>
                </div>
                <p className='text-xs text-center text-slate-500 py-1.5 bg-white'>
                  {img.color}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new color images */}
      <div className='w-full flex flex-col flex-wrap gap-4'>
        <div>
          <div className='font-bold'>Add new color images</div>
          <div className='text-sm'>
            Upload images for additional color variants.
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {colors.map((item, index) => (
            <SelectColor
              key={index}
              item={item}
              addImageToState={addImageToState}
              removeImageFromState={removeImageFromState}
              isProductCreated={isProductUpdated}
            />
          ))}
        </div>
      </div>

      <Button
        label={isLoading ? 'Loading...' : 'Update Product'}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default EditProductForm;
