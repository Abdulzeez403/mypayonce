"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getServiceVariations,
  purchaseData,
} from "@/redux/features/services/serviceThunk";
import GlobalModal from "@/components/modal/globalModal";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { ApButton } from "@/components/button/button";
import ApHeader from "@/components/Apheader";

const networks = [
  { name: "MTN", image: "/images/mtn.png" },
  { name: "Glo", image: "/images/glo.jpg" },
  { name: "Airtel", image: "/images/airtel.png" },
  { name: "etisalat", image: "/images/9mobile.jpeg" },
];

export default function BuyData() {
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const validationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
    variation_code: Yup.string().required("Select a data plan"),
    network: Yup.string().required("Select a network provider"),
    amount: Yup.number()
      .min(50, "Minimum amount is ₦50")
      .required("Amount is required"),
  });

  const handleVariation = async (network: string) => {
    setSelectedNetwork(network);
    setIsModalOpen(true);

    const resultAction = await dispatch(
      getServiceVariations({
        serviceType: network.toLowerCase(),
        useDataSuffix: true,
      })
    );

    if (getServiceVariations.fulfilled.match(resultAction)) {
      const variations = resultAction.payload?.data?.content?.variations || [];
      setVariations(variations);
    } else {
      toast.error("❌ Failed to fetch variations.");
    }
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      phone: Number(values.phone),
      variation_code: values.variation_code,
      network: `${values.network.toLowerCase()}-data`,
      amount: Number(values.amount),
      dataName: values.dataName,
    };

    setLoading(true);
    const resultAction = await dispatch(purchaseData({ payload }));
    setLoading(false);

    if (purchaseData.fulfilled.match(resultAction)) {
      const { request_id } = resultAction.payload;
      toast.success("✅ Data purchase successful!");
      router.push(`/dashboard/transaction?request_id=${request_id}`);
    } else {
      toast.error(`❌ ${resultAction.payload || "Data purchase failed!"}`);
    }
  };

  return (
    <div>
      <ApHeader title="Buy Data" />
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <p className="text-sm text-gray-600 text-center py-2 mb-4">
            Select your network, enter your number, and get data in seconds.
          </p>

          {/* Network Selection */}
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
                onClick={() => handleVariation(network.name)}
              >
                <img
                  src={network.image}
                  alt={network.name}
                  className="w-12 h-12"
                />
              </button>
            ))}
          </div>

          {/* Form */}
          <Formik
            initialValues={{
              phone: "",
              dataPlan: "",
              network: "",
              amount: "",
              dataName: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <ApTextInput
                  label="Phone Number"
                  name="phone"
                  type="text"
                  placeHolder="Enter phone number"
                />
                <ApTextInput
                  label="Network Provider"
                  name="network"
                  type="text"
                  placeHolder="Auto-filled"
                  value={selectedNetwork}
                />
                <ApTextInput
                  label="Data Plan"
                  name="variation_code"
                  type="text"
                  placeHolder="Auto-filled"
                />
                <ApTextInput
                  label="Amount (₦)"
                  name="amount"
                  type="text"
                  placeHolder="Auto-filled"
                />

                <ApButton
                  type="submit"
                  className="w-full mt-4"
                  onClick={() => handleSubmit}
                  disabled={loading || !selectedNetwork}
                  title={loading ? "Processing..." : "Buy Data"}
                />

                {/* Data Plan Selection Modal */}
                <GlobalModal
                  title={`Data Plans for ${selectedNetwork}`}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div className="space-y-3">
                    {variations.map((plan) => (
                      <button
                        key={plan.variation_code}
                        className="p-3 border rounded-lg w-full text-left"
                        onClick={() => {
                          setFieldValue("variation_code", plan.variation_code);
                          setFieldValue("dataName", plan.name);
                          setFieldValue("amount", plan.variation_amount);
                          setFieldValue("network", selectedNetwork);
                          setIsModalOpen(false);
                        }}
                      >
                        <p className="text-sm font-medium">{plan.name}</p>
                        <p className="text-xs text-gray-600">
                          ₦{plan.variation_amount}
                        </p>
                      </button>
                    ))}
                  </div>
                </GlobalModal>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
