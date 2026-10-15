export const THANKS = 'Thanks! Confirm your subscription via the email we just sent you.';

export async function subscribe(email: string, source: string) {
  if (!/.+@.+\..+/.test(email)) throw new Error('Please enter a valid email address.');
  const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source }) });
  if (!res.ok) throw new Error('Something went wrong. Please try again.');
}
