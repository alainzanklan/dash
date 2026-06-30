import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  selectedImg?: { image: string; color: string };
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
  };
  paymentMethod: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(
    amount,
  );

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  orderDate,
  items,
  total,
  address,
  paymentMethod,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Your Emart GH order #{orderId.slice(-8).toUpperCase()} is confirmed
    </Preview>
    <Body
      style={{
        backgroundColor: '#f8fafc',
        fontFamily: 'sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      <Container
        style={{
          maxWidth: 560,
          margin: '32px auto',
          backgroundColor: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <Section style={{ backgroundColor: '#0d9488', padding: '28px 32px' }}>
          <Heading style={{ color: '#fff', fontSize: 22, margin: 0 }}>
            Emart GH
          </Heading>
          <Text style={{ color: '#99f6e4', fontSize: 13, margin: '4px 0 0' }}>
            Order Confirmation
          </Text>
        </Section>

        {/* Body */}
        <Section style={{ padding: '28px 32px' }}>
          <Text style={{ fontSize: 15, color: '#334155', margin: '0 0 4px' }}>
            Hi <strong>{customerName}</strong>,
          </Text>
          <Text style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px' }}>
            Thanks for your order! We've received it and will get it to you
            soon.
          </Text>

          {/* Order meta */}
          <Section
            style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 24,
            }}
          >
            <Row>
              <Column>
                <Text
                  style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 2px' }}
                >
                  ORDER ID
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#1e293b',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  #{orderId.slice(-8).toUpperCase()}
                </Text>
              </Column>
              <Column>
                <Text
                  style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 2px' }}
                >
                  DATE
                </Text>
                <Text style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>
                  {orderDate}
                </Text>
              </Column>
              <Column>
                <Text
                  style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 2px' }}
                >
                  PAYMENT
                </Text>
                <Text style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>
                  {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Paystack'}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Items */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: '#334155',
              margin: '0 0 12px',
            }}
          >
            Items Ordered
          </Text>

          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: 10 }}>
              {item.selectedImg?.image && (
                <Column style={{ width: 48 }}>
                  <Img
                    src={item.selectedImg.image}
                    width={44}
                    height={44}
                    alt={item.name}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                </Column>
              )}
              <Column style={{ paddingLeft: 10 }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#1e293b',
                    margin: '0 0 2px',
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </Text>
                {item.selectedImg?.color && (
                  <Text style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                    Color: {item.selectedImg.color}
                  </Text>
                )}
                <Text style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  Qty: {item.quantity}
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#1e293b',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </Column>
            </Row>
          ))}

          <Hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

          <Row>
            <Column>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                Total
              </Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#0d9488',
                  margin: 0,
                }}
              >
                {formatPrice(total)}
              </Text>
            </Column>
          </Row>

          <Hr style={{ borderColor: '#e2e8f0', margin: '20px 0' }} />

          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: '#334155',
              margin: '0 0 8px',
            }}
          >
            Delivery Address
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#64748b',
              margin: 0,
              lineHeight: '1.6',
            }}
          >
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ''}
            {'\n'}
            {address.city}, {address.state}
            {'\n'}
            {address.country}
          </Text>
        </Section>

        {/* Footer */}
        <Section
          style={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '16px 32px',
            textAlign: 'center',
          }}
        >
          <Text style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
            Questions? Contact us at support@emartgh.com
          </Text>
          <Text style={{ fontSize: 11, color: '#cbd5e1', margin: '4px 0 0' }}>
            © {new Date().getFullYear()} Emart GH. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;
