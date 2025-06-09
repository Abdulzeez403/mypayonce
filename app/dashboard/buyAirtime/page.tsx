"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { purchaseAirtime } from "@/redux/features/services/serviceThunk";
import { useRouter } from "next/navigation";
import { ApButton } from "@/components/button/button";
import ApHeader from "@/components/Apheader";

interface FormValues {
  phone: string;
  amount: string;
  network: string;
}

const networks = [
  { name: "MTN", image: "/images/mtn.png" },
  { name: "Glo", image: "/images/glo.jpg" },
  { name: "Airtel", image: "/images/airtel.png" },
  { name: "etisalat", image: "/images/9mobile.jpeg" },
];

const validationSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("Phone number is required"),
  amount: Yup.number()
    .min(50, "Minimum amount is ₦50")
    .max(50000, "Maximum amount is ₦50,000")
    .required("Amount is required"),
  network: Yup.string().required("Network is required"),
});

export default function BuyAirtime() {
  const [loading, setLoading] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [pinCode, setPinCode] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleFormSubmit = async (values: FormValues) => {
    if (!pinCode || pinCode.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    const payload = {
      ...values,
      amount: Number(values.amount),
      pinCode,
    };

    setLoading(true);
    try {
      const resultAction = await dispatch(purchaseAirtime({ payload }));
      if (purchaseAirtime.fulfilled.match(resultAction)) {
        const { request_id } = resultAction.payload;
        toast.success("✅ Airtime purchase successful!");
        router.push(`/dashboard/transaction?request_id=${request_id}`);
      } else {
        toast.error(`❌ ${resultAction.payload || "Airtime purchase failed!"}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
      setPinModalOpen(false);
      setPinCode("");
    }
  };

  return (
    <div>
      <ApHeader title="Buy Airtime" />
      <div className="flex bg-gray-100 ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-sm text-gray-600 text-center py-2 mb-4">
            Select your network, enter your number and amount, and complete with
            your PIN.
          </p>

          <Formik
            initialValues={{ phone: "", amount: "", network: "" }}
            validationSchema={validationSchema}
            onSubmit={() => {}} // Empty handler since we're using custom submission
          >
            {({ values, setFieldValue, isValid, dirty }) => (
              <Form>
                {/* Network Logos */}
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  {networks.map((network) => (
                    <button
                      key={network.name}
                      type="button"
                      aria-label={`Select ${network.name} network`}
                      className={`p-1 rounded-lg border-2 transition-all ${
                        values.network === network.name
                          ? "border-blue-500 scale-105"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                      onClick={() => setFieldValue("network", network.name)}
                    >
                      <img
                        src={network.image}
                        alt={`${network.name} logo`}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>

                <ApTextInput
                  label="Phone Number"
                  name="phone"
                  placeHolder="Enter 11-digit phone number"
                />
                <ApTextInput
                  label="Amount (₦)"
                  name="amount"
                  placeHolder="Enter amount between ₦50 - ₦50,000"
                />

                <ApButton
                  type="button"
                  className="w-full mt-4"
                  disabled={loading || !isValid || !dirty}
                  onClick={() => {
                    setFormData(values);
                    setPinModalOpen(true);
                  }}
                  title="Continue"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* PIN Modal */}
      {pinModalOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setPinModalOpen(false)
          }
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Enter Transaction PIN
            </h2>
            <input
              type="password"
              value={pinCode}
              onChange={(e) => {
                if (/^\d{0,4}$/.test(e.target.value)) {
                  setPinCode(e.target.value);
                }
              }}
              maxLength={4}
              className="w-full p-2 border-2 border-gray-300 rounded-lg mb-4 text-center text-xl tracking-widest focus:border-blue-500 focus:outline-none"
              placeholder="••••"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />
            <div className="flex gap-3 justify-between">
              <ApButton
                title="Cancel"
                className="w-1/2"
                onClick={() => {
                  setPinModalOpen(false);
                  setPinCode("");
                }}
                disabled={loading}
              />
              <ApButton
                title={loading ? "Processing..." : "Submit"}
                className="w-1/2 bg-blue-600 hover:bg-blue-700"
                disabled={loading || pinCode.length !== 4}
                onClick={() => formData && handleFormSubmit(formData)}
                type="button"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
