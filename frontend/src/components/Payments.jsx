import React, { useEffect, useState } from "react";
import api from "../api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/api/payments/pay");
        setPayments(response.data.payment);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Payment Records</h1>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-bold">Payment ID</th>
                <th className="px-4 py-2 text-left font-bold">Project ID</th>
                <th className="px-4 py-2 text-left font-bold">Date</th>
                <th className="px-4 py-2 text-left font-bold">Amount</th>
                <th className="px-4 py-2 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-gray-100 border-t"
                  >
                    <td className="px-4 py-2">{payment._id}</td>
                    <td className="px-4 py-2">{payment.projectId}</td>
                    <td className="px-4 py-2">
                      {new Date(payment.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2">
                      {payment.amount
                        ? `₹${payment.amount.toLocaleString()}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded text-white ${
                          payment.status === "paid"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500 italic"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Payments;
