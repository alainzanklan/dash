'use client';

import Button from '@/app/components/Button';
import SetQuantity from '@/app/components/products/SetQuantity';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent as RMouseEvent,
  TouchEvent as RTouchEvent,
} from 'react';
import { TbShoppingBag } from 'react-icons/tb';
import {
  MdCheckCircle,
  MdExpandMore,
  MdExpandLess,
  MdStore,
} from 'react-icons/md';
import { TbTruckDelivery, TbShield, TbStar } from 'react-icons/tb';
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

const badges = [
  { icon: TbTruckDelivery, label: 'Fast Shipping' },
  { icon: TbShield, label: 'Secure Checkout' },
  { icon: TbStar, label: 'Satisfaction Guarantee' },
];

const Divider = () => <hr className='border-t border-zinc-100 my-4' />;

// ─── Zoom image ───────────────────────────────────────────────────────────────
// Full-screen immersive zoom: click to enter, drag to pan, click again to exit.
// Zero visible UI — all interaction is implicit.

const ZoomImage = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const startDrag = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const SCALE_STEP = 0.8;
  const MAX_SCALE = 4;
  const MIN_SCALE = 1;

  const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

  const maxPan = (s: number) => ((s - 1) / s) * 50;

  const handleClick = (e: RMouseEvent) => {
    // If not dragging, cycle zoom levels
    if (dragging.current) return;
    if (scale < MAX_SCALE) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const ox = ((e.clientX - rect.left) / rect.width - 0.5) * -100;
      const oy = ((e.clientY - rect.top) / rect.height - 0.5) * -100;
      const ns = Math.min(scale + SCALE_STEP, MAX_SCALE);
      const mp = maxPan(ns);
      setScale(ns);
      setPos({ x: clamp(ox, mp), y: clamp(oy, mp) });
    } else {
      setScale(MIN_SCALE);
      setPos({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: RMouseEvent) => {
    if (scale <= 1) return;
    dragging.current = false;
    startDrag.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    const onMove = (ev: MouseEvent) => {
      const dx =
        ((ev.clientX - startDrag.current.mx) / window.innerWidth) * 100;
      const dy =
        ((ev.clientY - startDrag.current.my) / window.innerHeight) * 100;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragging.current = true;
      const mp = maxPan(scale);
      setPos({
        x: clamp(startDrag.current.px + dx * scale, mp),
        y: clamp(startDrag.current.py + dy * scale, mp),
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTimeout(() => {
        dragging.current = false;
      }, 0);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className='fixed inset-0 z-[200] bg-black/95 flex items-center justify-center'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full h-full overflow-hidden ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${pos.x}%), calc(-50% + ${pos.y}%)) scale(${scale})`,
            transformOrigin: 'center center',
            transition: dragging.current ? 'none' : 'transform 0.25s ease',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            userSelect: 'none',
          }}
        />
        {/* Subtle close hint top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className='absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'
        >
          <span className='text-white text-lg leading-none'>×</span>
        </button>
      </div>
    </div>
  );
};

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
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const idx = items.findIndex((i) => i.url === selectedUrl);
    if (idx !== -1) setActiveIndex(idx);
  }, [selectedUrl, items]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    onSelect(items[idx]);
  };

  const onTouchStart = (e: RTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: RTouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0 && activeIndex < items.length - 1) goTo(activeIndex + 1);
    if (dx > 0 && activeIndex > 0) goTo(activeIndex - 1);
  };

  const currentItem = items[activeIndex];

  return (
    <>
      {zoomSrc && (
        <ZoomImage
          src={zoomSrc}
          alt={currentItem?.label ?? ''}
          onClose={() => setZoomSrc(null)}
        />
      )}

      <div className='flex flex-col gap-3'>
        {/* Main image */}
        <div
          className='relative w-full overflow-hidden bg-zinc-50 cursor-zoom-in rounded-xl'
          style={{ aspectRatio: '2 / 3' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setZoomSrc(currentItem?.url ?? null)}
        >
          <img
            src={currentItem?.url}
            alt={currentItem?.label}
            draggable={false}
            className='w-full h-full object-cover'
          />

          {/* Mobile dot indicators */}
          {items.length > 1 && (
            <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden'>
              {items.map((_, i) => (
                <button
                  key={i}
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(i);
                  }}
                  className={`rounded-full transition-all ${
                    i === activeIndex
                      ? 'w-4 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop thumbnail strip */}
        {items.length > 1 && (
          <div className='hidden md:flex gap-2 overflow-x-auto pb-1'>
            {items.map((item, i) => (
              <button
                key={i}
                type='button'
                onClick={() => goTo(i)}
                title={item.label}
                style={{ aspectRatio: '2 / 3' }}
                className={`flex-shrink-0 w-20 overflow-hidden transition-all ${
                  i === activeIndex
                    ? 'ring-2 ring-zinc-900 ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
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
    </>
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
        className={`rich-content text-zinc-500 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${
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
          className='mt-2 flex items-center gap-1 text-zinc-700 text-sm underline underline-offset-2 hover:text-zinc-900 transition-colors'
        >
          {expanded ? (
            <>
              <MdExpandLess size={16} /> Show less
            </>
          ) : (
            <>
              <MdExpandMore size={16} /> Show more
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
    <div className='max-w-7xl mx-auto px-3 py-4 md:py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-20'>
        {/* Gallery — full bleed on mobile */}
        <div className='-mx-3 md:mx-0'>
          <ImageGallery
            items={galleryItems}
            selectedUrl={selectedUrl}
            onSelect={handleGallerySelect}
          />
        </div>

        {/* Details */}
        <div className='flex flex-col gap-4 md:pt-4'>
          {/* Category */}
          <p className='text-xs uppercase tracking-widest text-zinc-400'>
            {product.category}
          </p>

          {/* Name */}
          <h1 className='text-2xl sm:text-3xl font-light text-zinc-900 leading-snug'>
            {product.name}
          </h1>

          {/* Sold by */}
          {product.partner && (
            <div className='flex items-center gap-1.5 text-sm text-zinc-400'>
              <MdStore size={14} />
              <span>by</span>
              <Link
                href={`/partners/${product.partner.slug}`}
                className='text-zinc-700 hover:text-zinc-900 underline underline-offset-2 transition-colors'
              >
                {product.partner.name}
              </Link>
            </div>
          )}

          {/* Price */}
          <div className='flex items-center gap-3 mt-1'>
            <span className='text-xl font-medium text-zinc-900'>
              {formatPrice(product.price)}
            </span>
            {!product.inStock && (
              <span className='text-xs text-rose-500 uppercase tracking-wider'>
                Sold out
              </span>
            )}
          </div>

          <Divider />

          {/* Color swatches */}
          {product.images.length > 1 && (
            <div className='flex flex-col gap-2'>
              <p className='text-xs text-zinc-400 uppercase tracking-wide'>
                Colour —{' '}
                <span className='text-zinc-700 normal-case'>
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
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      cartProduct.selectedImg.colorCode === img.colorCode
                        ? 'border-zinc-900 scale-110'
                        : 'border-zinc-200 hover:border-zinc-500'
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
              <p className='flex items-center gap-2 text-sm text-zinc-500'>
                <MdCheckCircle className='text-zinc-700' size={18} />
                Added to bag
              </p>
              <Button
                label='View bag'
                outline
                onClick={() => router.push('/cart')}
              />
            </div>
          ) : (
            <>
              {/* Mobile */}
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
                    label='Add to bag'
                    onClick={() => handleAddProductToCart(cartProduct)}
                    icon={TbShoppingBag}
                  />
                </div>
              </div>
              {/* Desktop */}
              <div className='hidden md:flex flex-col gap-3'>
                <SetQuantity
                  cartProduct={cartProduct}
                  handleQtyIncrease={handleQtyIncrease}
                  handleQtyDecrease={handleQtyDecrease}
                />
                <Button
                  label='Add to bag'
                  onClick={() => handleAddProductToCart(cartProduct)}
                  icon={TbShoppingBag}
                />
              </div>
            </>
          )}

          <Divider />

          {/* Trust badges — minimal, no background */}
          <div className='flex flex-col gap-2'>
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className='flex items-center gap-2.5 text-sm text-zinc-500'
              >
                <Icon size={16} className='text-zinc-400 flex-shrink-0' />
                {label}
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className='mt-2'>
              <Divider />
              <ExpandableDescription html={product.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
