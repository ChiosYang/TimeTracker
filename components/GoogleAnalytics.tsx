import Script from 'next/script';

const GoogleAnalytics = () => {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // 仅在生产环境中并且配置了ID时才渲染GA脚本
  if (process.env.NODE_ENV !== 'production' || !gaMeasurementId) {
    return null;
  }

  return (
    <>
      {/* <!-- Google Analytics: Global Site Tag (gtag.js) --> */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
