import React from 'react'
import Container from '../components/Container'
import Link from 'next/link'

const page = () => {
  return (
    <Container>
<div className='py-12 md:py-20'>
    <div>
    <h1 className='text-center font-bold text-2xl mb-12'> Frequently Asked Question (FAQ)</h1>
    </div>
    <div>
        <h2 className='text-xl font-bold mb-2'> 1. How do I place an order on your website?</h2>
        <p> Shopping with us is simple: </p>
        <ul className='list-decimal list-inside flex flex-col gap-2 py-2 px-2'>
            <li>Browse and select your desired product(s).</li>
            <li>Click <strong>“Add to Cart”.</strong></li>
            <li>Go to your cart and click <strong>“Checkout”.</strong></li>
            <li>Fill in your delivery details and choose your payment method.</li>
            <li>Confirm your order. 
            <br/> You’ll receive an order confirmation email/SMS once it’s placed successfully.</li>
        </ul>
    </div>
    <div className='pt-2'>
    <h2 className='text-xl font-bold mb-2'> 2. What payment methods do you accept?</h2>
    <p>We accept various secure payment options, including:</p>
    <ul className='list-disc list-inside flex flex-col gap-2 py-2 px-2'>
        <li> Mobile Money (MTN, Vodafone Cash, AirtelTigo)</li>
        <li>Bank transfer</li>
        <li>Cash on delivery (in select areas)</li>
        <li>Debit/Credit cards (Visa, MasterCard)</li>
    </ul>
    </div>
    <div className='pt-2'>
    <h2 className='text-xl font-bold mb-2'> 3. How long does delivery take?</h2>
    <p>Delivery times depend on your location:</p>
    <ul className='list-disc list-inside flex flex-col gap-2 py-2 px-2'>
        <li><strong>Accra & major cities:</strong> 1–2 working days</li>
        <li><strong>Other regions in Ghana:</strong> 2–4 working days</li>
        <li><strong>Rural or remote areas:</strong> up to 5 working days</li>
            </ul>
    <p>We aim to deliver as fast as possible and will notify you once your package is on its way.</p>
    </div>
    <div className='py-2'>
    <h2 className='text-xl font-bold mb-2'> 4. Can I return or exchange a product?</h2>
    <p>Yes. If you receive a defective or wrong item, you can return it within 7 days of delivery. The item must be unused and in its original packaging. Contact our customer support to start the return process. Please note: some items like screen protectors or opened earphones may not be eligible for return.</p>
    </div>
    <div className='pt-2'>
    <h2 className='text-xl font-bold mb-2'> 5.  How do I contact customer support?</h2>
    <p>You can reach us easily via:</p>
    <ul className='list-disc list-inside flex flex-col gap-2 py-2 px-2'>
       <li><strong>Phone/WhatsApp:</strong> <Link className="text-blue-600" href="tel:00233245022140">0245022140</Link></li> 
       <li><strong>Email:</strong>: <Link href="mailto:info@emartgh.com">info@emartgh.com</Link></li> 
           </ul>

    </div>
    </div>


    </Container>
  )
}

export default page
