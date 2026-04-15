import { useEffect, useState } from 'react';

const GA_ID = 'G-L2KN5H42NG';

function loadGA() {
  if ((window as any).__gaLoaded) return;
  (window as any).__gaLoaded = true;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
  gtag('js', new Date());
  gtag('config', GA_ID);
  (window as any).gtag = gtag;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      loadGA();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGA();
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'hsl(220,14%,12%)',
        borderTop: '1px solid hsl(220,10%,22%)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ margin: 0, fontSize: '13px', color: 'hsl(220,10%,65%)', flex: 1, minWidth: '200px' }}>
        We use cookies to understand how visitors use GigFlow Pro.{' '}
        <a
          href="https://app.gigflowpro.com/cookies"
          style={{ color: 'hsl(40,90%,60%)', textDecoration: 'underline' }}
        >
          Cookie Policy
        </a>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid hsl(220,10%,30%)',
            background: 'transparent',
            color: 'hsl(220,10%,60%)',
            cursor: 'pointer',
          }}
        >
          Reject
        </button>
        <button
          onClick={accept}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            borderRadius: '8px',
            border: 'none',
            background: 'hsl(40,90%,55%)',
            color: 'hsl(220,15%,10%)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
