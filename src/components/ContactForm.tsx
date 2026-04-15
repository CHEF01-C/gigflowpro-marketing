import { useState } from 'react';

const BORDER = 'hsl(220,10%,22%)';
const MUTED = 'hsl(220,10%,58%)';
const INPUT_BG = 'hsl(220,14%,15%)';
const INPUT_TEXT = 'hsl(40,20%,90%)';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-xl border p-6 text-center space-y-2" style={{ borderColor: BORDER }}>
        <p className="font-medium">Message sent!</p>
        <p className="text-sm" style={{ color: MUTED }}>We'll get back to you at {email}.</p>
      </div>
    );
  }

  const inputStyle = {
    borderColor: BORDER,
    background: INPUT_BG,
    color: INPUT_TEXT,
    '--tw-ring-color': 'hsl(40,90%,55%)',
  } as React.CSSProperties;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <input
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:opacity-40"
        style={inputStyle}
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:opacity-40"
        style={inputStyle}
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:opacity-40"
        style={inputStyle}
        placeholder="Your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        required
      />
      {status === 'error' && (
        <p className="text-xs" style={{ color: 'hsl(0,65%,60%)' }}>Something went wrong — try emailing us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg py-3 text-sm font-semibold transition-colors disabled:opacity-60"
        style={{ backgroundColor: 'hsl(40,90%,55%)', color: 'hsl(220,15%,10%)' }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
