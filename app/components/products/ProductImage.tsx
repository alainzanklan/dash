'use client';

import {
  CartProductType,
  SelectedImgType,
} from '@/app/product/[productId]/ProductDetails';
import Image from 'next/image';

interface ProductImageProps {
  cartProduct: CartProductType;
  product: any;
  handleColorSelect: (value: SelectedImgType) => void;
  // Extra selected state for additional images
  selectedAdditional: string | null;
  onAdditionalSelect: (url: string) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  cartProduct,
  product,
  handleColorSelect,
  selectedAdditional,
  onAdditionalSelect,
}) => {
  const allThumbs = [
    // Color images
    ...product.images.map((img: SelectedImgType) => ({
      url: img.image,
      label: img.color,
      isColor: true,
      data: img,
    })),
    // Additional images
    ...(product.additionalImages ?? []).map((url: string, i: number) => ({
      url,
      label: `Photo ${i + 1}`,
      isColor: false,
      data: null,
    })),
  ];

  const activeUrl = selectedAdditional ?? cartProduct.selectedImg.image;

  return (
    <div className='grid grid-cols-6 gap-2 w-full max-h-[500px] min-h-[300px]'>
      {/* Thumbnail strip */}
      <div className='flex flex-col items-center gap-2 overflow-y-auto max-h-[500px] pr-1'>
        {allThumbs.map((thumb, i) => (
          <div
            key={i}
            onClick={() => {
              if (thumb.isColor) {
                handleColorSelect(thumb.data);
                onAdditionalSelect(''); // clear additional selection
              } else {
                onAdditionalSelect(thumb.url);
              }
            }}
            className={`relative w-full aspect-square rounded cursor-pointer border flex-shrink-0 ${
              activeUrl === thumb.url
                ? 'border-teal-400 border-[1.5px]'
                : 'border-slate-200'
            }`}
          >
            <Image
              src={thumb.url}
              alt={thumb.label}
              fill
              className='object-contain rounded'
            />
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className='col-span-5 relative aspect-square'>
        <Image
          fill
          src={activeUrl}
          alt={cartProduct.name}
          className='object-contain max-h-[500px]'
        />
      </div>
    </div>
  );
};

export default ProductImage;
