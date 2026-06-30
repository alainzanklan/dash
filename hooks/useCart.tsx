import { CartProductType } from '@/app/product/[productId]/ProductDetails';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null,
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const cartItems: any = localStorage.getItem('emartCartItems');
    const cProducts: CartProductType[] | null = JSON.parse(cartItems);
    const emartPaymentIntent: any = localStorage.getItem('emartPaymentIntent');
    const paymentIntent: string | null = JSON.parse(emartPaymentIntent);
    setCartProducts(cProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    if (cartProducts) {
      const { total, qty } = cartProducts.reduce(
        (acc, item) => {
          acc.total += item.price * item.quantity;
          acc.qty += item.quantity;
          return acc;
        },
        { total: 0, qty: 0 },
      );
      setCartTotalQty(qty);
      setCartTotalAmount(total);
    }
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      // ── Partner conflict check ──────────────────────────────────────────
      // If the cart already has items and the incoming product has a partnerId,
      // check whether it matches the partnerId of existing items.
      if (prev && prev.length > 0 && product.partnerId) {
        const existingPartnerId = prev.find((p) => p.partnerId)?.partnerId;

        if (existingPartnerId && existingPartnerId !== product.partnerId) {
          const existingPartnerName =
            prev.find((p) => p.partnerName)?.partnerName || 'another partner';

          toast.error(
            `You already have items from ${existingPartnerName} in your cart. Please complete that order or clear your cart before adding items from ${product.partnerName || 'this partner'}.`,
            {
              duration: 5000,
              style: {
                maxWidth: '380px',
                fontSize: '13px',
              },
            },
          );

          return prev; // don't modify cart
        }
      }

      // ── Normal add logic ────────────────────────────────────────────────
      let updatedCart: CartProductType[];

      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }

      toast.success('Product added to cart');
      localStorage.setItem('emartCartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter(
          (item) => item.id !== product.id,
        );
        setCartProducts(filteredProducts);
        toast.success('Product removed');
        localStorage.setItem(
          'emartCartItems',
          JSON.stringify(filteredProducts),
        );
      }
    },
    [cartProducts],
  );

  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      if (product.quantity === 99) {
        return toast.error('Ooop! Maximum reached');
      }
      if (cartProducts) {
        const updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id,
        );
        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = ++updatedCart[existingIndex]
            .quantity;
        }
        setCartProducts(updatedCart);
        localStorage.setItem('emartCartItems', JSON.stringify(updatedCart));
      }
    },
    [cartProducts],
  );

  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      if (product.quantity === 1) {
        return toast.error('Ooop! Minimum reached');
      }
      if (cartProducts) {
        const updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id,
        );
        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = --updatedCart[existingIndex]
            .quantity;
        }
        setCartProducts(updatedCart);
        localStorage.setItem('emartCartItems', JSON.stringify(updatedCart));
      }
    },
    [cartProducts],
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem('emartCartItems', JSON.stringify(null));
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem('emartPaymentIntent', JSON.stringify(val));
  }, []);

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};
