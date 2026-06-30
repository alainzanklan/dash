'use client';

import Button from '@/app/components/Button';
import SetQuantity from '@/app/components/products/SetQuantity';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { Rating } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import {
  MdCheckCircle,
  MdExpandMore,
  MdExpandLess,
  MdStore,
} from 'react-icons/md';
import { TbTruckDelivery, TbRefresh, TbCurrencyCent } from 'react-icons/tb';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectedImgType = {
  color: string;
  colorCode: string;
  image: string;
};

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType;
  quantity: number;
  price: number;
  partnerId?: string | null;
  partnerName?: string | null;
};

interface ProductDetailsProps {
  product: any;
}

type GalleryItem = {
  url: string;
  label: string;
  colorData?: SelectedImgType;
};

// ─── Trust badges ─────────────────────────────────────────────────────────────

const badges = [
  { icon: TbTruckDelivery, label: '24-hour delivery' },
  { icon: TbRefresh, label: 'Easy returns' },
  { icon: TbCurrencyCent, label: 'Pay on delivery' },
];

const Divider = () => <hr className='border-t border-slate-100 my-4' />;

// ─── Image gallery ────────────────────────────────────────────────────────────

const ImageGallery = ({
  items,
  selectedUrl,
  onSelect,
}: {
  items: GalleryItem[];
  selectedUrl: string;
  onSelect: (item: GalleryItem) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const idx = items.findIndex((i) => i.url === selectedUrl);
    if (idx !== -1) setActiveIndex(idx);
  }, [selectedUrl, items]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    onSelect(items[idx]);
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0 && activeIndex < items.length - 1) goTo(activeIndex + 1);
    if (dx > 0 && activeIndex > 0) goTo(activeIndex - 1);
  };

  return (
    <div className='flex flex-col gap-3'>
      <div
        className='relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50'
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={items[activeIndex]?.url}
          alt={items[activeIndex]?.label}
          draggable={false}
          className='w-full h-full object-contain'
        />
        {items.length > 1 && (
          <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden'>
            {items.map((_, i) => (
              <button
                key={i}
                type='button'
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${
                  i === activeIndex
                    ? 'w-4 h-2 bg-teal-500'
                    : 'w-2 h-2 bg-black/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 1 && (
        <div className='hidden md:flex gap-2 overflow-x-auto pb-1'>
          {items.map((item, i) => (
            <button
              key={i}
              type='button'
              onClick={() => goTo(i)}
              title={item.label}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-teal-400 scale-105'
                  : 'border-transparent hover:border-slate-200'
              }`}
            >
              <img
                src={item.url}
                alt={item.label}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Expandable description ───────────────────────────────────────────────────

const ExpandableDescription = ({ html }: { html: string }) => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textLength = html.replace(/<[^>]*>/g, '').length;
  const shouldTruncate = textLength > 300;

  const handleToggle = () => {
    if (expanded && containerRef.current) {
      const top =
        containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'instant' });
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div ref={containerRef}>
      <div
        className={`rich-content text-slate-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${
          !expanded && shouldTruncate ? 'max-h-32' : 'max-h-none'
        }`}
        style={
          !expanded && shouldTruncate
            ? {
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 60%, transparent 100%)',
                maskImage:
                  'linear-gradient(to bottom, black 60%, transparent 100%)',
              }
            : {}
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {shouldTruncate && (
        <button
          type='button'
          onClick={handleToggle}
          className='mt-2 flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors'
        >
          {expanded ? (
            <>
              <MdExpandLess size={18} /> Show less
            </>
          ) : (
            <>
              <MdExpandMore size={18} /> Show more
            </>
          )}
        </button>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter();
  const { handleAddProductToCart, cartProducts } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);

  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price,
    // ── Partner fields passed into every cart item ─────────────────────────
    partnerId: product.partner?.id ?? null,
    partnerName: product.partner?.name ?? null,
  });

  const galleryItems: GalleryItem[] = [
    ...product.images.map((img: SelectedImgType) => ({
      url: img.image,
      label: img.color,
      colorData: img,
    })),
    ...(product.additionalImages ?? []).map((url: string, i: number) => ({
      url,
      label: `Photo ${i + 1}`,
    })),
  ];

  const [selectedUrl, setSelectedUrl] = useState(galleryItems[0]?.url ?? '');

  useEffect(() => {
    if (cartProducts) {
      setIsProductInCart(cartProducts.some((item) => item.id === product.id));
    }
  }, [cartProducts, product.id]);

  const productRating =
    product.reviews.length > 0
      ? product.reviews.reduce(
          (acc: number, item: any) => acc + item.rating,
          0,
        ) / product.reviews.length
      : 0;

  const handleGallerySelect = useCallback((item: GalleryItem) => {
    setSelectedUrl(item.url);
    if (item.colorData) {
      setCartProduct((prev) => ({ ...prev, selectedImg: item.colorData! }));
    }
  }, []);

  const handleColorSelect = useCallback((img: SelectedImgType) => {
    setCartProduct((prev) => ({ ...prev, selectedImg: img }));
    setSelectedUrl(img.image);
  }, []);

  const handleQtyIncrease = useCallback(() => {
    setCartProduct((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  }, []);

  const handleQtyDecrease = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.quantity === 1) return prev;
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-2.5 py-4 md:py-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16'>
        {/* Gallery */}
        <ImageGallery
          items={galleryItems}
          selectedUrl={selectedUrl}
          onSelect={handleGallerySelect}
        />

        {/* Details */}
        <div className='flex flex-col gap-3 md:gap-4'>
          <div>
            <span className='inline-block text-xs font-medium uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full mb-2'>
              {product.category}
            </span>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 leading-snug'>
              {product.name}
            </h1>

            {/* ── Sold by badge ─────────────────────────────────────────── */}
            {product.partner && (
              <div className='flex items-center gap-1.5 mt-2 text-sm text-slate-500'>
                <MdStore size={15} className='text-slate-400' />
                <span>Sold by</span>
                <Link
                  href={`/partners/${product.partner.slug}`}
                  className='font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors'
                >
                  {product.partner.name}
                </Link>
              </div>
            )}
          </div>

          <div className='flex items-center gap-3 flex-wrap'>
            <span className='text-xl md:text-2xl font-semibold text-slate-800'>
              {formatPrice(product.price)}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                product.inStock
                  ? 'bg-teal-50 text-teal-600'
                  : 'bg-rose-50 text-rose-500'
              }`}
            >
              {product.inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <Rating
              value={productRating}
              readOnly
              precision={0.5}
              size='small'
            />
            <span className='text-xs md:text-sm text-slate-400'>
              {product.reviews.length === 0
                ? 'No reviews yet'
                : `${product.reviews.length} review${product.reviews.length > 1 ? 's' : ''}`}
            </span>
          </div>

          <Divider />

          {/* Color swatches */}
          {product.images.length > 1 && (
            <div className='flex flex-col gap-2'>
              <p className='text-xs md:text-sm text-slate-400'>
                Color:{' '}
                <span className='text-slate-600'>
                  {cartProduct.selectedImg.color}
                </span>
              </p>
              <div className='flex gap-2 flex-wrap'>
                {product.images.map((img: SelectedImgType, i: number) => (
                  <button
                    key={i}
                    type='button'
                    onClick={() => handleColorSelect(img)}
                    title={img.color}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      cartProduct.selectedImg.colorCode === img.colorCode
                        ? 'border-teal-400 scale-110'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: img.colorCode }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cart actions */}
          {isProductInCart ? (
            <div className='flex flex-col gap-3'>
              <p className='flex items-center gap-2 text-sm text-slate-500'>
                <MdCheckCircle className='text-teal-400' size={18} />
                Added to cart
              </p>
              <div className='max-w-xs'>
                <Button
                  label='View cart'
                  outline
                  onClick={() => router.push('/cart')}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Mobile: side by side */}
              <div className='flex md:hidden items-center gap-3'>
                <div className='flex-shrink-0'>
                  <SetQuantity
                    cartProduct={cartProduct}
                    handleQtyIncrease={handleQtyIncrease}
                    handleQtyDecrease={handleQtyDecrease}
                  />
                </div>
                <div className='flex-1'>
                  <Button
                    label='Add to cart'
                    onClick={() => handleAddProductToCart(cartProduct)}
                    icon={CiShoppingCart}
                  />
                </div>
              </div>
              {/* Desktop: stacked */}
              <div className='hidden md:flex flex-col gap-4'>
                <SetQuantity
                  cartProduct={cartProduct}
                  handleQtyIncrease={handleQtyIncrease}
                  handleQtyDecrease={handleQtyDecrease}
                />
                <div className='max-w-xs'>
                  <Button
                    label='Add to cart'
                    onClick={() => handleAddProductToCart(cartProduct)}
                    icon={CiShoppingCart}
                  />
                </div>
              </div>
            </>
          )}

          <Divider />

          {/* Trust badges */}
          <div className='grid grid-cols-3 gap-2 md:gap-3'>
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className='flex flex-col items-center gap-1 md:gap-1.5 p-2 md:p-3 rounded-xl bg-orange-50 text-center'
              >
                <Icon size={20} className='text-orange-400' />
                <span className='text-xs text-orange-500'>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className='mt-8 md:mt-12'>
          <h2 className='text-base md:text-lg font-semibold text-slate-800 mb-3'>
            Product Description
          </h2>
          <div className='h-px bg-slate-100 mb-4' />
          <ExpandableDescription html={product.description} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
