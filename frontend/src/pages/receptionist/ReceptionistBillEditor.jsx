import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const createEmptyItem = () => ({
  description: "",
  quantity: "1",
  unitPrice: "",
});

function ReceptionistBillEditor() {
  const { appointmentId, billId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(state?.appointment || null);
  const [bill, setBill] = useState(state?.bill || null);
  const [items, setItems] = useState(() => {
    const initialItems = state?.bill?.items;
    return initialItems?.length
      ? initialItems.map((item) => ({
          description: item.description || "",
          quantity: String(item.quantity || 1),
          unitPrice: String(item.unitPrice ?? ""),
        }))
        : [];
  });
      const [draftItem, setDraftItem] = useState(createEmptyItem);
      const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadBillContext = async () => {
      try {
        const [appointmentResponse, billResponse] = await Promise.all([
          api.get("/appointments"),
          billId ? api.get("/bills") : Promise.resolve({ data: { bills: [] } }),
        ]);
        const appointments = appointmentResponse.data.appointments || [];
        const selectedAppointment = appointments.find((item) => item._id === appointmentId)
          || state?.appointment
          || null;
        const selectedBill = billId
          ? (billResponse.data.bills || []).find((item) => item._id === billId) || state?.bill || null
          : null;

        setAppointment(selectedAppointment);
        if (selectedBill) {
          setBill(selectedBill);
          if (selectedBill.items?.length) {
            setItems(selectedBill.items.map((item) => ({
              description: item.description || "",
              quantity: String(item.quantity || 1),
              unitPrice: String(item.unitPrice ?? ""),
            })));
          } else {
            setItems([{
              description: selectedBill.description || "Healthcare services",
              quantity: "1",
              unitPrice: String(selectedBill.amount ?? ""),
            }]);
          }
        }

        if (!selectedAppointment) {
          setErrorMessage("Appointment not found.");
        } else if (billId && !selectedBill) {
          setErrorMessage("Bill not found.");
        } else if (selectedBill?.status !== "pending") {
          setErrorMessage("Only pending bills can be edited.");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setErrorMessage(error.response?.data?.message || "Unable to load bill information.");
      } finally {
        setLoading(false);
      }
    };

    loadBillContext();
  }, [appointmentId, billId, navigate, state?.appointment, state?.bill]);

  const saveItem = () => {
    const item = {
      description: draftItem.description.trim(),
      quantity: Number(draftItem.quantity),
      unitPrice: Number(draftItem.unitPrice),
    };

    if (!item.description || !Number.isFinite(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      setErrorMessage("Enter a description, positive quantity, and valid unit price.");
      return;
    }

    setItems((currentItems) => editingItemIndex === null
      ? [...currentItems, item]
      : currentItems.map((currentItem, index) => index === editingItemIndex ? item : currentItem)
    );
    setDraftItem(createEmptyItem());
    setEditingItemIndex(null);
    setErrorMessage("");
  };

  const editItem = (index) => {
    const item = items[index];
    setDraftItem({
      description: item.description,
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
    });
    setEditingItemIndex(index);
    setErrorMessage("");
  };

  const cancelItemEdit = () => {
    setDraftItem(createEmptyItem());
    setEditingItemIndex(null);
    setErrorMessage("");
  };

  const deleteItem = (index) => {
    setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index));
    if (editingItemIndex === index) {
      cancelItemEdit();
    } else if (editingItemIndex !== null && editingItemIndex > index) {
      setEditingItemIndex(editingItemIndex - 1);
    }
  };

  const total = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return sum + quantity * unitPrice;
  }, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const hasDraftContent = draftItem.description.trim() || draftItem.unitPrice !== "" || draftItem.quantity !== "1";
    if (editingItemIndex !== null || hasDraftContent) {
      setErrorMessage("Save or cancel the current entry before saving the bill.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Add at least one bill entry before saving.");
      return;
    }

    const completeItems = items.map((item) => ({
      description: item.description.trim(),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    }));
    const hasInvalidItem = completeItems.some((item) =>
      !item.description ||
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0 ||
      !Number.isFinite(item.unitPrice) ||
      item.unitPrice < 0
    );

    if (hasInvalidItem) {
      setErrorMessage("Complete every bill entry with a description, quantity, and valid unit price.");
      return;
    }

    setSaving(true);
    try {
      const payload = { appointment: appointment._id, items: completeItems };
      if (billId) {
        await api.put(`/bills/${billId}`, payload);
      } else {
        await api.post("/bills", payload);
      }

      navigate("/receptionist-dashboard", {
        replace: true,
        state: {
          activeView: "billing",
          message: billId ? "Bill updated successfully." : "Bill created successfully.",
        },
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to save bill.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50 px-5 pt-20">
        <p className="font-semibold text-teal-700">Loading bill information...</p>
      </main>
    );
  }

  if (!appointment || (billId && (!bill || bill.status !== "pending"))) {
    return (
      <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Bill unavailable</h1>
          <p role="alert" className="mt-2 text-gray-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => navigate("/receptionist-dashboard", { replace: true, state: { activeView: "billing" } })}
            className="mt-6 rounded-lg bg-teal-800 px-4 py-2.5 font-semibold text-white"
          >
            Back to Billing
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-800">MediCare Billing</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{billId ? "Edit Bill" : "Create Appointment Bill"}</h1>
            <p className="mt-2 text-gray-600">{billId ? "Update the pending invoice entries." : "Add one or more entries to this invoice."}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/receptionist-dashboard", { replace: true, state: { activeView: "billing" } })}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Billing
          </button>
        </header>

        {errorMessage && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-900">Appointment details</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Patient</dt>
              <dd className="mt-1 font-semibold text-gray-900">{appointment.patient?.name || "Patient"}</dd>
              <dd className="text-sm text-gray-600">{appointment.patient?.email}</dd>
              <dd className="text-sm text-gray-600">{appointment.patient?.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Doctor</dt>
              <dd className="mt-1 font-semibold text-gray-900">{appointment.doctor?.name || "Doctor"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Appointment</dt>
              <dd className="mt-1 font-medium text-gray-800">{new Date(appointment.appointmentDate).toLocaleString("en-IN")}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Reason for visit</dt>
              <dd className="mt-1 font-medium text-gray-800">{appointment.reason}</dd>
            </div>
          </dl>
        </section>

        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Invoice entries</h2>
              <p className="mt-1 text-sm text-gray-500">Add each service or charge as a separate line.</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_110px_140px_auto]">
              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="bill-draft-description" className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
                <input
                  id="bill-draft-description"
                  value={draftItem.description}
                  onChange={(event) => setDraftItem((draft) => ({ ...draft, description: event.target.value }))}
                  placeholder="Consultation, test, medicine..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label htmlFor="bill-draft-quantity" className="mb-2 block text-sm font-semibold text-gray-700">Quantity</label>
                <input
                  id="bill-draft-quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={draftItem.quantity}
                  onChange={(event) => setDraftItem((draft) => ({ ...draft, quantity: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label htmlFor="bill-draft-price" className="mb-2 block text-sm font-semibold text-gray-700">Unit price (₹)</label>
                <input
                  id="bill-draft-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftItem.unitPrice}
                  onChange={(event) => setDraftItem((draft) => ({ ...draft, unitPrice: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1 lg:justify-end">
                <button
                  type="button"
                  onClick={saveItem}
                  className="flex-1 rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 sm:flex-none"
                >
                  {editingItemIndex === null ? "Save" : "Update"}
                </button>
                {editingItemIndex !== null && (
                  <button
                    type="button"
                    onClick={cancelItemEdit}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:flex-none"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 hidden overflow-x-auto rounded-lg border border-gray-200 lg:block">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-600">
                  <th className="px-3 py-3 font-semibold">#</th>
                  <th className="px-3 py-3 font-semibold">Description</th>
                  <th className="px-3 py-3 text-right font-semibold">Quantity</th>
                  <th className="px-3 py-3 text-right font-semibold">Unit price (₹)</th>
                  <th className="px-3 py-3 text-right font-semibold">Line total (₹)</th>
                  <th className="px-3 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className="border-t border-gray-200">
                    <td colSpan="6" className="px-4 py-5 text-sm text-gray-500">No entries added yet.</td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={`${item.description}-${index}`} className="border-t border-gray-200 text-sm">
                    <td className="px-3 py-3">{index + 1}</td>
                    <td className="px-3 py-3 font-medium text-gray-900">{item.description}</td>
                    <td className="px-3 py-3 text-right">{item.quantity}</td>
                    <td className="px-3 py-3 text-right">₹{Number(item.unitPrice).toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-semibold">₹{(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => editItem(index)} className="font-semibold text-teal-800 hover:underline">Edit</button>
                        <button type="button" onClick={() => deleteItem(index)} className="font-semibold text-red-700 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-3 lg:hidden">
            {items.length === 0 ? (
              <p className="rounded-lg border border-gray-200 bg-white px-4 py-5 text-sm text-gray-500">No entries added yet.</p>
            ) : items.map((item, index) => (
              <article key={`${item.description}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Entry {index + 1}</p>
                    <p className="mt-1 break-words font-semibold text-gray-900">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button type="button" onClick={() => editItem(index)} className="font-semibold text-teal-800">Edit</button>
                    <button type="button" onClick={() => deleteItem(index)} className="font-semibold text-red-700">Delete</button>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-gray-500">Quantity</dt><dd className="mt-0.5 font-medium text-gray-900">{item.quantity}</dd></div>
                  <div><dt className="text-gray-500">Unit price</dt><dd className="mt-0.5 font-medium text-gray-900">₹{Number(item.unitPrice).toFixed(2)}</dd></div>
                  <div className="col-span-2 border-t border-gray-100 pt-2"><dt className="text-gray-500">Line total</dt><dd className="mt-0.5 font-semibold text-gray-900">₹{(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}</dd></div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">Total is calculated from all invoice entries.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <p className="text-lg font-bold text-gray-900">Total ₹{total.toFixed(2)}</p>
              <button
                type="submit"
                disabled={saving || total <= 0}
                className="w-full rounded-lg bg-teal-800 px-5 py-3 font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving bill..." : billId ? "Save Changes" : "Create Bill"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ReceptionistBillEditor;
