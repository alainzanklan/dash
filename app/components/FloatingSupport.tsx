'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

// ── Config — update these ─────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '233245022140'; // international format, no + or spaces
const PHONE_NUMBER = '+233245022140';
const WHATSAPP_MESSAGE = 'Hello! I need help with my order on Emart GH.';
// ─────────────────────────────────────────────────────────────────────────────

const FloatingSupport = () => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
      }}
    >
      {/* Options panel */}
      {isOpen && (
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid #f1f5f9',
            padding: '16px',
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            Need help?
          </p>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#25D366',
              color: 'white',
              borderRadius: '12px',
              padding: '12px 14px',
              textDecoration: 'none',
            }}
          >
            <FaWhatsapp size={20} />
            <div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                WhatsApp Us
              </p>
              <p style={{ fontSize: '11px', opacity: 0.85, margin: '3px 0 0' }}>
                Chat with us
              </p>
            </div>
          </a>

          {/* Call */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#14b8a6',
              color: 'white',
              borderRadius: '12px',
              padding: '12px 14px',
              textDecoration: 'none',
            }}
          >
            <FaPhone size={16} />
            <div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                Call Us
              </p>
              <p style={{ fontSize: '11px', opacity: 0.85, margin: '3px 0 0' }}>
                {PHONE_NUMBER}
              </p>
            </div>
          </a>

          <p
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Mon – Sat, 8am – 6pm
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close support' : 'Contact support'}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: isOpen ? '#334155' : '#25D366',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          transition: 'background 0.2s',
        }}
      >
        {isOpen ? <IoClose size={24} /> : <FaWhatsapp size={26} />}
      </button>
    </div>
  );
};

export default FloatingSupport;
