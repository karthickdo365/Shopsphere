import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/auth';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      });
  }, [token]);

  return (
    <div className="max-w-sm mx-auto px-4 py-20 text-center">
      {status === 'verifying' && (
        <>
          <h1 className="font-display text-2xl tracking-tightest mb-3">VERIFYING…</h1>
          <p className="text-sm text-ink/50">Just a moment.</p>
        </>
      )}
      {status === 'success' && (
        <>
          <h1 className="font-display text-2xl tracking-tightest mb-3 text-denim">EMAIL VERIFIED</h1>
          <p className="text-sm text-ink/60 mb-6">{message}</p>
          <Link to="/" className="inline-block bg-ink text-paper font-semibold uppercase tracking-wide px-6 py-3 hover:bg-denim">
            Continue Shopping
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="font-display text-2xl tracking-tightest mb-3 text-rust">VERIFICATION FAILED</h1>
          <p className="text-sm text-ink/60 mb-6">{message}</p>
          <Link to="/" className="inline-block text-sm font-semibold text-denim hover:underline">
            Go to homepage
          </Link>
        </>
      )}
    </div>
  );
}
