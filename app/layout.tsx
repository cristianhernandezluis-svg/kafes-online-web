import "./globals.css";

import Script from "next/script";
import { Poppins } from "next/font/google";

import prisma from "@/lib/prisma";

import ActualizadorPWA from "./ActualizadorPWA";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "KAFES ONLINE",
    template: "%s | KAFES ONLINE",
  },

  description: "Herramientas profesionales",

  manifest: "/manifest.json",

  applicationName: "Kafes Admin",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
    title: "Kafes Admin",
  },

  formatDetection: {
    telephone: false,
  },

  icons: {
    icon: [
      {
        url: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};

function validarMetaPixelId(
  valor: string | null | undefined
) {
  const id = valor?.trim() ?? "";

  return /^\d{5,30}$/.test(id)
    ? id
    : "";
}

function validarTikTokPixelId(
  valor: string | null | undefined
) {
  const id = valor?.trim() ?? "";

  return /^[A-Za-z0-9]{8,40}$/.test(id)
    ? id
    : "";
}

function validarGoogleAnalyticsId(
  valor: string | null | undefined
) {
  const id =
    valor?.trim().toUpperCase() ?? "";

  return /^G-[A-Z0-9]{4,20}$/.test(id)
    ? id
    : "";
}

function validarGoogleTagManagerId(
  valor: string | null | undefined
) {
  const id =
    valor?.trim().toUpperCase() ?? "";

  return /^GTM-[A-Z0-9]{4,20}$/.test(id)
    ? id
    : "";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configuracion =
    await prisma.configuracionTienda.findUnique({
      where: {
        id: 1,
      },

      select: {
        metaPixelId: true,
        metaPixelActivo: true,

        tiktokPixelId: true,
        tiktokPixelActivo: true,

        googleAnalyticsId: true,
        googleAnalyticsActivo: true,

        googleTagManagerId: true,
        googleTagManagerActivo: true,
      },
    });

  const metaPixelId =
    configuracion?.metaPixelActivo ?? true
      ? validarMetaPixelId(
          configuracion?.metaPixelId ??
            "1247868925891875"
        )
      : "";

  const tiktokPixelId =
    configuracion?.tiktokPixelActivo ?? true
      ? validarTikTokPixelId(
          configuracion?.tiktokPixelId ??
            "D8D21TBC77UFK9KDRPDG"
        )
      : "";

  const googleAnalyticsId =
    configuracion?.googleAnalyticsActivo
      ? validarGoogleAnalyticsId(
          configuracion.googleAnalyticsId
        )
      : "";

  const googleTagManagerId =
    configuracion?.googleTagManagerActivo
      ? validarGoogleTagManagerId(
          configuracion.googleTagManagerId
        )
      : "";

  return (
    <html lang="es">
      <body className={poppins.className}>
        {metaPixelId && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
          >
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];
              t=b.createElement(e);
              t.async=!0;
              t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}
              (window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {tiktokPixelId && (
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
          >
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;

                var ttq=w[t]=w[t]||[];

                ttq.methods=[
                  "page",
                  "track",
                  "identify",
                  "instances",
                  "debug",
                  "on",
                  "off",
                  "once",
                  "ready",
                  "alias",
                  "group",
                  "enableCookie",
                  "disableCookie"
                ];

                ttq.setAndDefer=function(t,e){
                  t[e]=function(){
                    t.push([
                      e
                    ].concat(
                      Array.prototype.slice.call(
                        arguments,
                        0
                      )
                    ))
                  }
                };

                for(
                  var i=0;
                  i<ttq.methods.length;
                  i++
                ){
                  ttq.setAndDefer(
                    ttq,
                    ttq.methods[i]
                  )
                }

                ttq.load=function(e,n){
                  var r=
                    "https://analytics.tiktok.com/i18n/pixel/events.js";

                  ttq._i=ttq._i||{};
                  ttq._i[e]=[];
                  ttq._i[e]._u=r;

                  ttq._t=ttq._t||{};
                  ttq._t[e]=+new Date;

                  ttq._o=ttq._o||{};
                  ttq._o[e]=n||{};

                  n=document.createElement(
                    "script"
                  );

                  n.type="text/javascript";
                  n.async=!0;

                  n.src=
                    r+
                    "?sdkid="+
                    e+
                    "&lib="+
                    t;

                  e=document
                    .getElementsByTagName(
                      "script"
                    )[0];

                  e.parentNode.insertBefore(
                    n,
                    e
                  )
                };

                ttq.load('${tiktokPixelId}');
                ttq.page();

              }(
                window,
                document,
                'ttq'
              );
            `}
          </Script>
        )}

        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />

            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer =
                  window.dataLayer || [];

                function gtag(){
                  dataLayer.push(arguments);
                }

                gtag('js', new Date());

                gtag(
                  'config',
                  '${googleAnalyticsId}'
                );
              `}
            </Script>
          </>
        )}

        {googleTagManagerId && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
          >
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];

                w[l].push({
                  'gtm.start':
                    new Date().getTime(),
                  event:'gtm.js'
                });

                var f=
                  d.getElementsByTagName(s)[0];

                var j=
                  d.createElement(s);

                var dl=
                  l!='dataLayer'
                    ? '&l='+l
                    : '';

                j.async=true;

                j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+
                  i+
                  dl;

                f.parentNode.insertBefore(
                  j,
                  f
                );

              })(
                window,
                document,
                'script',
                'dataLayer',
                '${googleTagManagerId}'
              );
            `}
          </Script>
        )}

        {googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{
                display: "none",
                visibility: "hidden",
              }}
              title="Google Tag Manager"
            />
          </noscript>
        )}

        <ActualizadorPWA />

        {children}
      </body>
    </html>
  );
}