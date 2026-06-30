'use client'

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const FacebookPixel = () => {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if(typeof window != "undefined" && window.fbq) {
            window.fbq('init', '729575650037941');
            window.fbq('track', 'PageView')
        }
    }, [pathName, searchParams])
    return (
        <>
        <Script
        id="facebook-pixel"
        strategy="afterInteractive" // Load after the page is interactive
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '729575650037941');
fbq('track', 'PageView');
          `,
        }}
      />
      </>
    )
}

export default FacebookPixel