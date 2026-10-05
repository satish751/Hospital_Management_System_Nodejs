import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await api.get(`/bills/${id}`);
        setBill(response.data.bill);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }
        setErrorMessage(
          error.response?.data?.message || "Unable to load this bill."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);

  const formatDate = (value) => {
    if (!value) return "Not recorded";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50 px-5 pt-20">
        <p className="font-semibold text-teal-700">Loading bill...</p>
      </main>
    );
  }

  if (errorMessage || !bill) {
    return (
      <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Bill unavailable</h1>
          <p role="alert" className="mt-2 text-gray-600">
            {errorMessage || "This bill could not be found."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/patient-dashboard", { replace: true })}
            className="mt-6 rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const appointment = bill.appointment;
  const billItems = bill.items?.length
    ? bill.items
    : [{
        description: bill.description || appointment?.reason || "Healthcare services",
        quantity: 1,
        unitPrice: Number(bill.amount) || 0,
        lineTotal: Number(bill.amount) || 0,
      }];
  const statusColor = bill.status === "paid"
    ? "text-green-700 bg-green-50 border-green-200"
    : bill.status === "cancelled"
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-amber-700 bg-amber-50 border-amber-200";

  return (
    <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28 sm:px-8 print:bg-white print:px-0 print:py-0">
      <article className="mx-auto max-w-4xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10 print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-teal-800 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-800">MediCare</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Patient Billing Department</h1>
            <p className="mt-1 text-sm text-gray-500">Healthcare services invoice</p>
          </div>
          <div className="text-left text-sm text-gray-600 sm:text-right">
            <p className="font-bold uppercase tracking-wide text-gray-900">Invoice</p>
            <p className="mt-1">Invoice No: <span className="font-semibold">{bill.billNumber}</span></p>
            <p>Date: {formatDate(bill.createdAt)}</p>
          </div>
        </header>

        <section className="grid gap-6 border-b border-gray-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Billed To</p>
            <p className="mt-2 font-semibold text-gray-900">{bill.patient?.name || "Patient"}</p>
            <p className="text-sm text-gray-600">{bill.patient?.email}</p>
            <p className="text-sm text-gray-600">{bill.patient?.phone}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase text-gray-500">Appointment</p>
            <p className="mt-2 font-semibold text-gray-900">{formatDate(appointment?.appointmentDate)}</p>
            <p className="text-sm text-gray-600">{appointment?.reason || "Healthcare service"}</p>
            <p className="mt-3 text-xs font-semibold uppercase text-gray-500">Doctor</p>
            <p className="mt-1 font-medium text-gray-800">{appointment?.doctor?.name || "Not recorded"}</p>
          </div>
        </section>

        <section className="py-6">
          <h2 className="text-lg font-bold text-gray-900">Invoice Details</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr className="border-y border-gray-300 bg-gray-50 text-left text-sm text-gray-600">
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-right font-semibold">Unit Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => (
                  <tr key={`${item.description}-${index}`} className="border-b border-gray-200">
                    <td className="px-4 py-4 text-gray-800">{item.description}</td>
                    <td className="px-4 py-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900">
                      {formatCurrency(item.lineTotal ?? item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col items-stretch gap-5 border-t border-gray-200 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Payment Status</p>
            <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-bold uppercase ${statusColor}`}>
              {bill.status}
            </span>
          </div>
          <div className="flex items-center justify-between gap-8 border-t border-gray-300 pt-4 text-lg sm:min-w-64 sm:justify-end">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="font-bold text-gray-900">{formatCurrency(bill.amount)}</span>
          </div>
        </section>

        <footer className="mt-12 flex items-end justify-between gap-8 border-t border-gray-300 pt-6 text-sm text-gray-600">
          <p>Thank you for choosing MediCare.</p>
          <div className="w-52 border-t border-gray-500 pt-2 text-center">
            <p className="font-semibold text-gray-800">Authorized Signature</p>
          </div>
        </footer>

        <div className="mt-8 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={() => navigate("/patient-dashboard")}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Print Bill
          </button>
        </div>
      </article>
    </main>
  );
}

export default BillDetails;
