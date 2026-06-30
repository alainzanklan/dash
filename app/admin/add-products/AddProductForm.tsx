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

const AddProductForm = () => {
  const router = useRouter();
  const [IsLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

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
      name: '',
      description: '',
      brand: '',
      category: '',
      inStock: false,
      images: [],
      price: '',
      partnerId: null, // ← store the id, not the whole object
    },
  });

  // Watch partnerId so PartnerSelect shows the selected value
  const partnerId = watch('partnerId');
  const category = watch('category');

  useEffect(() => {
    setCustomValue('images', images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setAdditionalFiles([]);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error('Category is not selected');
    }
    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error('No selected image');
    }

    toast('Creating product, please wait...');

    try {
      for (const item of data.images) {
        if (item.image) {
          const downloadURL = await uploadToCloudinary(item.image);
          uploadedImages.push({ ...item, image: downloadURL });
        }
      }
    } catch {
      setIsLoading(false);
      return toast.error('Error uploading images to Cloudinary');
    }

    const uploadedAdditional: string[] = await Promise.all(
      additionalFiles.map((file) => uploadToCloudinary(file)),
    );

    const productData = {
      name: data.name,
      description: data.description,
      brand: data.brand,
      category: data.category,
      inStock: data.inStock,
      price: parseFloat(data.price),
      images: uploadedImages,
      additionalImages: uploadedAdditional,
      partnerId: data.partnerId ?? null, // ← send partnerId to API
    };

    axios
      .post('/api/product', productData)
      .then(() => {
        toast.success('Product created');
        setIsProductCreated(true);
        router.refresh();
      })
      .catch(() =>
        toast.error('Something went wrong when saving product to DB'),
      )
      .finally(() => setIsLoading(false));
  };

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
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
      <Heading title='Add a Product' center />
      <Input
        id='name'
        label='Name'
        disabled={IsLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='price'
        label='Price'
        disabled={IsLoading}
        register={register}
        errors={errors}
        type='number'
        required
      />
      <Input
        id='brand'
        label='Brand'
        disabled={IsLoading}
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

      {/* PartnerSelect — value + onChange both wired */}
      <PartnerSelect
        value={partnerId ?? null}
        onChange={(id) => setCustomValue('partnerId', id)}
      />

      <div className='w-full flex flex-col flex-wrap gap-4'>
        <div>
          <div className='font-bold'>
            Select the available product colors and upload their images.
          </div>
          <div className='text-sm'>
            You must upload an image for each color selected.
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {colors.map((item, index) => (
            <SelectColor
              key={index}
              item={item}
              addImageToState={addImageToState}
              removeImageFromState={removeImageFromState}
              isProductCreated={isProductCreated}
            />
          ))}
        </div>
      </div>

      {/* Additional images */}
      <div className='w-full flex flex-col gap-3'>
        <div>
          <div className='font-bold'>Additional Images (optional)</div>
          <div className='text-sm text-slate-500'>
            Extra product photos not tied to a specific color.
          </div>
        </div>
        <label className='flex items-center gap-2 cursor-pointer w-fit'>
          <div className='px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-teal-400 hover:text-teal-500 transition-colors'>
            + Add images
          </div>
          <input
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setAdditionalFiles((prev) => [...prev, ...files]);
            }}
          />
        </label>
        {additionalFiles.length > 0 && (
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
            {additionalFiles.map((file, i) => (
              <div
                key={i}
                className='relative group rounded-lg overflow-hidden border border-slate-200 aspect-square'
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`additional-${i}`}
                  className='w-full h-full object-cover'
                />
                <button
                  type='button'
                  onClick={() =>
                    setAdditionalFiles((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    )
                  }
                  className='absolute top-1 right-1 bg-rose-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        label={IsLoading ? 'Loading...' : 'Add Product'}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AddProductForm;
