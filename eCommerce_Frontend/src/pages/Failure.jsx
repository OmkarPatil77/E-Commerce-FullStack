// src/pages/cancel.jsx
export default function PaymentFailure() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600">Payment Cancelled</h1>
      <p className="mt-2 text-gray-700">Your payment was not completed.</p>
      <a
        href="/home"
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try After Some Time
      </a>
    </div>
  );
}
