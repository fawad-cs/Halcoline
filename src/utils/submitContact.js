// Contact submission hook.
// Put a real endpoint here (e.g. Formspree: 'https://formspree.io/f/xxxxxxx').
// While it is empty the form runs in DEMO mode: nothing is actually sent.
const ENDPOINT = '';

export default async function submitContact(values) {
  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.info('[HALOCLINE] Demo mode, message not sent:', values);
    return { ok: true, simulated: true };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return { ok: true, simulated: false };
}