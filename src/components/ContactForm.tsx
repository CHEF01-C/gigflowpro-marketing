import { useState } from 'react';

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
      <div className="rounded-xl border p-6 text-center space-y-2" style={{ borderColor: 'hsl(220,10%,90%)' }}>
        <p className="font-medium">Message sent!</p>
        <p className="text-sm text-gray-500">We'll get back to you at {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <input
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        style={{ borderColor: 'hsl(220,10%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties}
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        style={{ borderColor: 'hsl(220,10%,90%)' } as React.CSSProperties}
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        style={{ borderColor: 'hsl(220,10%,90%)' } as React.CSSProperties}
        placeholder="Your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        required
      />
      {status === 'error' && (
        <p className="text-xs text-red-500">Something went wrong — try emailing us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        style={{ backgroundColor: 'hsl(40,90%,55%)', color: 'hsl(220,15%,10%)' }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
