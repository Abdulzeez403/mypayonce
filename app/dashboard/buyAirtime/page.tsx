"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { purchaseAirtime } from "@/redux/features/services/serviceThunk";
import { useRouter } from "next/navigation";
import { ApButton } from "@/components/button/button";
import ApHeader from "@/components/Apheader";

const networks = [
  { name: "MTN", image: "/images/mtn.png" },
  { name: "Glo", image: "/images/glo.jpg" },
  { name: "Airtel", image: "/images/airtel.png" },
  { name: "9mobile", image: "/images/9mobile.jpeg" },
];

export default function BuyAirtime() {
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const validationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
    amount: Yup.number()
      .min(50, "Minimum amount is ₦50")
      .max(50000, "Maximum amount is ₦50,000")
      .required("Amount is required"),
    // network: Yup.string().required("Select a network provider"),
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      phone: Number(values.phone),
      amount: Number(values.amount),
      network: selectedNetwork,
    };

    setLoading(true);
    const resultAction = await dispatch(purchaseAirtime({ payload }));
    setLoading(false);

    if (purchaseAirtime.fulfilled.match(resultAction)) {
      const { request_id } = resultAction.payload;
      toast.success("✅ Airtime purchase successful!");
      router.push(`/dashboard/transaction?request_id=${request_id}`);
    } else {
      toast.error(`❌ ${resultAction.payload || "Airtime purchase failed!"}`);
    }
  };

  return (
    <div>
      <ApHeader title="Buy Airtime" />
      <div className="flex   bg-gray-100">
        <div className="bg-white p-6 pb rounded-lg shadow-lg w-96">
          <div>
            <p className="text-sm text-gray-600 text-center py-2 mb-4">
              Select your network, enter your number, and get airtime in
              seconds.
            </p>
          </div>
          {/* Network Logos */}
          <div className="flex justify-center space-x-4 mb-4">
            {networks.map((network) => (
              <button
                key={network.name}
                type="button"
                className={`p-2 rounded-lg border ${
                  selectedNetwork === network.name
                    ? "border-blue-500"
                    : "border-gray-300"
                } hover:border-blue-500 transition`}
                onClick={() => {
                  setSelectedNetwork(network.name);
                }}
              >
                <img
                  src={network.image}
                  alt={network.name}
                  className="w-12 h-12"
                />
              </button>
            ))}
          </div>

          <Formik
            initialValues={{ phone: "", amount: "", network: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <ApTextInput
                  label="Phone Number"
                  name="phone"
                  type="text"
                  placeHolder="Enter phone number"
                />
                <ApTextInput
                  label="Amount (₦)"
                  name="amount"
                  placeHolder="Enter amount"
                />

                {/* Hidden Field for Network */}
                <input type="hidden" name="network" value={selectedNetwork} />

                <ApButton
                  type="submit"
                  className="w-full mt-4"
                  disabled={loading || !selectedNetwork}
                  title={loading ? "Processing..." : "Buy Airtime"}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
