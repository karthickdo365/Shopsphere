import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkout, verifyPayment } from '../api/orders';
import { tokenStore } from '../api/axios';

const emptyAddress = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function Checkout() {
  const [address, setAddress] = useState(emptyAddress);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const { orderId, razorpayOrderId, amount, currency, keyId } = await checkout(address);

      const options = {
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'ShopSphere',
        description: 'Order payment',
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: '#2F4B7C' },
        handler: async (response) => {
          try {
            await verifyPayment({ ...response, orderId });
            navigate('/orders');
          } catch {
            setError('Payment verification failed. If money was deducted, it will be refunded — contact support with your order ID.');
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setError('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start checkout. Please try again.');
      setPlacing(false);
    }
  };

  const isTokenMissing = !tokenStore.accessToken;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl tracking-tightest mb-6">CHECKOUT</h1>
      {isTokenMissing && (
        <p className="text-sm text-rust mb-4">Please log in to continue to checkout.</p>
      )}
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <Field label="Full Name" value={address.fullName} onChange={update('fullName')} required />
        <Field label="Phone" value={address.phone} onChange={update('phone')} required />
        <Field label="Address Line 1" value={address.line1} onChange={update('line1')} required />
        <Field label="Address Line 2 (optional)" value={address.line2} onChange={update('line2')} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" value={address.city} onChange={update('city')} required />
          <Field label="State" value={address.state} onChange={update('state')} required />
        </div>
        <Field label="Pincode" value={address.pincode} onChange={update('pincode')} required />

        {error && <p className="text-sm text-rust">{error}</p>}

        <button
          type="submit"
          disabled={placing || isTokenMissing}
          className="w-full bg-denim text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim-deep disabled:opacity-50"
        >
          {placing ? 'Opening payment…' : 'Pay with Razorpay'}
        </button>
        <p className="text-xs text-ink/40 text-center">Secured by Razorpay. Card, UPI and net banking accepted.</p>
      </form>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</span>
      <input
        {...props}
        className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus-visible:outline-denim"
      />
    </label>
  );
}
