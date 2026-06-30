'use client';

import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Heading from '../components/Heading';
import { usePaystackPayment } from 'react-paystack';
import { Banknote, CreditCard } from 'lucide-react';
import { MdHome, MdWork, MdLocationOn, MdAdd, MdCheck } from 'react-icons/md';
import Link from 'next/link';

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
const DELIVERY_FEE = 0;

type PaymentMethod = 'cash' | 'paystack';

type SavedAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
};

const labelIcons: Record<string, any> = {
  Home: MdHome,
  Office: MdWork,
  Other: MdLocationOn,
};

// Inline spinner used on the button
const ButtonSpinner = () => (
  <span className='w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block' />
);

const CheckoutForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartTotalAmount, cartProducts } = useCart();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  // Single loading state — shared between cash and paystack flows.
  // Once set to true, all submit buttons are disabled until redirect completes.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = session?.user?.email || '';
  const total = cartTotalAmount + DELIVERY_FEE;
  const paystackAmount = Math.round(total * 100);
  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? null;
  const isFormValid = !!selectedAddress;

  useEffect(() => {
    fetch('/api/profile/addresses')
      .then((r) => r.json())
      .then((data) => {
        const addrs: SavedAddress[] = data.addresses || [];
        setAddresses(addrs);
        const def = addrs.find((a) => a.isDefault) ?? addrs[0] ?? null;
        if (def) setSelectedAddressId(def.id);
      })
      .catch(() => toast.error('Could not load addresses'))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const createOrder = async (method: PaymentMethod) => {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartProducts,
        savedAddressId: selectedAddressId,
        paymentMethod: method,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order creation failed');
    return data.newOrder;
  };

  // ── Cash on delivery ──────────────────────────────────────────────────────
  const handleCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    if (!isFormValid) return toast.error('Please select a delivery address');

    setIsSubmitting(true); // lock immediately — no further clicks possible
    try {
      const order = await createOrder('cash');
      router.push(`/order-confirmation/${order.id}`);
      // Note: don't setIsSubmitting(false) — keep button locked until redirect completes
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
      setIsSubmitting(false); // only unlock on error so user can retry
    }
  };

  // ── Paystack ──────────────────────────────────────────────────────────────
  const paystackConfig = {
    email,
    amount: paystackAmount,
    currency: 'GHS',
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: 'Name',
          variable_name: 'name',
          value: selectedAddress?.name || '',
        },
        {
          display_name: 'Phone',
          variable_name: 'phone',
          value: selectedAddress?.phone || '',
        },
        {
          display_name: 'City',
          variable_name: 'city',
          value: selectedAddress?.city || '',
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePaystackPay = () => {
    if (!isFormValid || isSubmitting) return;
    if (!isFormValid) return toast.error('Please select a delivery address');

    initializePayment({
      onSuccess: async () => {
        setIsSubmitting(true); // lock after payment confirmed
        try {
          const order = await createOrder('paystack');
          router.push(`/order-confirmation/${order.id}`);
        } catch (err: any) {
          toast.error(err.message || 'Order creation failed after payment');
          setIsSubmitting(false);
        }
      },
      onClose: () => toast('Payment cancelled'),
    });
  };

  return (
    <div>
      {/* Full-page overlay while submitting */}
      {isSubmitting && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'>
          <div className='w-12 h-12 rounded-full border-4 border-slate-200 border-t-teal-500 animate-spin mb-4' />
          <p className='text-sm text-slate-500 font-medium'>
            Placing your order…
          </p>
        </div>
      )}

      <div className='mb-6'>
        <Heading title='Checkout' />
      </div>

      <form onSubmit={handleCashSubmit} id='checkout-form'>
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6'>
          {/* Left column */}
          <div className='flex flex-col gap-4'>
            {/* Delivery address */}
            <div className='border border-slate-200 rounded-xl p-5 shadow-sm bg-white'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='font-semibold text-slate-800'>
                  Delivery Address
                </h2>
                <Link
                  href='/addresses?from=checkout'
                  className='text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium'
                >
                  <MdAdd size={14} /> Manage addresses
                </Link>
              </div>

              {loadingAddresses ? (
                <div className='h-24 rounded-xl bg-slate-100 animate-pulse' />
              ) : addresses.length === 0 ? (
                <div className='text-center py-8 border-2 border-dashed border-slate-200 rounded-xl'>
                  <MdLocationOn
                    size={28}
                    className='mx-auto text-slate-300 mb-2'
                  />
                  <p className='text-sm text-slate-500 mb-1'>
                    No saved addresses yet
                  </p>
                  <p className='text-xs text-slate-400 mb-4'>
                    Add an address and you'll be brought right back here
                  </p>
                  <Link
                    href='/addresses?from=checkout'
                    className='inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors'
                  >
                    <MdAdd size={16} /> Add a delivery address
                  </Link>
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  {selectedAddress && !showPicker && (
                    <div className='border-2 border-teal-400 bg-teal-50 rounded-xl p-4'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-start gap-3'>
                          {(() => {
                            const Icon =
                              labelIcons[selectedAddress.label] ?? MdLocationOn;
                            return (
                              <Icon
                                size={20}
                                className='text-teal-600 flex-shrink-0 mt-0.5'
                              />
                            );
                          })()}
                          <div>
                            <div className='flex items-center gap-2 mb-0.5'>
                              <span className='font-semibold text-slate-800 text-sm'>
                                {selectedAddress.label}
                              </span>
                              {selectedAddress.isDefault && (
                                <span className='text-xs bg-teal-200 text-teal-700 px-2 py-0.5 rounded-full font-medium'>
                                  Default
                                </span>
                              )}
                            </div>
                            <p className='text-sm text-slate-700'>
                              {selectedAddress.name}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {selectedAddress.phone}
                            </p>
                            <p className='text-xs text-slate-500 mt-0.5'>
                              {selectedAddress.line1}
                              {selectedAddress.line2
                                ? `, ${selectedAddress.line2}`
                                : ''}
                              <br />
                              {selectedAddress.city}, {selectedAddress.state}
                            </p>
                          </div>
                        </div>
                        {addresses.length > 1 && (
                          <button
                            type='button'
                            onClick={() => setShowPicker(true)}
                            className='text-xs text-teal-600 hover:text-teal-700 font-medium flex-shrink-0 underline'
                          >
                            Change
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {showPicker && (
                    <div className='flex flex-col gap-2'>
                      {addresses.map((addr) => {
                        const Icon = labelIcons[addr.label] ?? MdLocationOn;
                        const isSelected = addr.id === selectedAddressId;
                        return (
                          <button
                            key={addr.id}
                            type='button'
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setShowPicker(false);
                            }}
                            className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                              isSelected
                                ? 'border-teal-400 bg-teal-50'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className='flex items-center gap-3'>
                              <Icon
                                size={18}
                                className={
                                  isSelected
                                    ? 'text-teal-600'
                                    : 'text-slate-400'
                                }
                              />
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium text-sm text-slate-800'>
                                    {addr.label}
                                  </span>
                                  {addr.isDefault && (
                                    <span className='text-xs text-teal-600'>
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className='text-xs text-slate-500 truncate'>
                                  {addr.name} · {addr.line1}, {addr.city}
                                </p>
                              </div>
                              {isSelected && (
                                <MdCheck
                                  size={18}
                                  className='text-teal-500 flex-shrink-0'
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                      <button
                        type='button'
                        onClick={() => setShowPicker(false)}
                        className='text-sm text-slate-400 hover:text-slate-600 py-1 text-center'
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className='border border-slate-200 rounded-xl p-5 shadow-sm bg-white'>
              <h2 className='font-semibold text-slate-800 mb-4'>
                Payment Method
              </h2>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  type='button'
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 flex items-center gap-3 border-2 rounded-xl p-4 transition-all text-left ${
                    paymentMethod === 'cash'
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote
                    className='text-slate-600 flex-shrink-0'
                    size={22}
                  />
                  <div>
                    <p className='font-medium text-sm text-slate-800'>
                      Cash on Delivery
                    </p>
                    <p className='text-xs text-slate-400'>
                      Pay when your order arrives
                    </p>
                  </div>
                </button>
                <button
                  type='button'
                  onClick={() => setPaymentMethod('paystack')}
                  className={`flex-1 flex items-center gap-3 border-2 rounded-xl p-4 transition-all text-left ${
                    paymentMethod === 'paystack'
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard
                    className='text-slate-600 flex-shrink-0'
                    size={22}
                  />
                  <div>
                    <p className='font-medium text-sm text-slate-800'>
                      Paystack
                    </p>
                    <p className='text-xs text-slate-400'>
                      Card, Mobile Money & more
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Order summary */}
          <aside>
            <div className='sticky top-28 border border-slate-200 rounded-xl p-5 shadow-sm bg-white flex flex-col gap-4'>
              <h2 className='font-semibold text-slate-800'>Order Summary</h2>
              <div className='flex flex-col gap-2 text-sm text-slate-600'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotalAmount)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery Fee</span>
                  <span>
                    {DELIVERY_FEE === 0 ? 'Free' : formatPrice(DELIVERY_FEE)}
                  </span>
                </div>
                <div className='h-px bg-slate-100 my-1' />
                <div className='flex justify-between font-bold text-base text-slate-800'>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <button
                  type='submit'
                  form='checkout-form'
                  disabled={isSubmitting || !isFormValid}
                  className='w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-colors'
                >
                  {isSubmitting ? (
                    <>
                      <ButtonSpinner />
                      Placing order…
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
              )}

              {paymentMethod === 'paystack' && (
                <button
                  type='button'
                  onClick={handlePaystackPay}
                  disabled={isSubmitting || !isFormValid}
                  className='w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-colors'
                >
                  {isSubmitting ? (
                    <>
                      <ButtonSpinner />
                      Processing…
                    </>
                  ) : (
                    `Pay ${formatPrice(total)}`
                  )}
                </button>
              )}

              {!isFormValid && !loadingAddresses && (
                <p className='text-xs text-slate-400 text-center'>
                  {addresses.length === 0
                    ? 'Add a delivery address to continue'
                    : 'Select a delivery address to continue'}
                </p>
              )}
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
