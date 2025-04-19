"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getServiceVariations,
  payExam,
} from "@/redux/features/services/serviceThunk";
import GlobalModal from "@/components/modal/globalModal";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { ApButton } from "@/components/button/button";
import ApHeader from "@/components/Apheader";

const networks = [
  { name: "Waec", image: "/images/weac.jpg", variation: "waec-registration" },
  { name: "Neco", image: "/images/neco.jpg", variation: "neco-registration" },
  {
    name: "Nabteb",
    image: "/images/nabteb.png",
    variation: "nabteb-registration",
  },
];

export default function BuyExam() {
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const validationSchema = Yup.object({
    pin_type: Yup.string().required("Select a Exam Type"),
    quantity: Yup.string().required("Enter quantity"),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
    amount: Yup.number()
      .min(50, "Minimum amount is ₦50")
      .required("Amount is required"),
  });

  const handleVariation = async (network: string) => {
    setSelectedNetwork(network);
    console.log(network, "the network!");
    setIsModalOpen(true);

    const resultAction = await dispatch(
      getServiceVariations({ serviceType: network.toLowerCase() })
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
      pin_type: values.pin_type, // Ensure this is set correctly
      quantity: values.quantity,
      variation_code: values.variation_code, // Ensure this is set correctly
      amount: Number(values.amount),
      phone: values.phone,
    };

    setLoading(true);
    const resultAction = await dispatch(payExam({ payload }));
    setLoading(false);

    if (payExam.fulfilled.match(resultAction)) {
      const { request_id } = resultAction.payload;
      toast.success("✅ Exam purchase successful!");
      router.push(`/dashboard/transaction?request_id=${request_id}`);
    } else {
      toast.error(`❌ ${resultAction.payload || "Exam purchase failed!"}`);
    }
  };

  return (
    <div>
      <ApHeader title="Buy Exam Card" />
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
                onClick={() => handleVariation(network.variation)}
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
              pin_type: "",
              quantity: "",
              variation_code: "",
              amount: "",
              phone: " ",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <ApTextInput
                  label="Exam Type"
                  name="pin_type"
                  type="text"
                  value={selectedNetwork}
                  placeHolder="Enter Exam Type"
                />
                <ApTextInput
                  label="Quantity"
                  name="quantity"
                  type="text"
                  placeHolder="Select Data Plan"
                />

                <ApTextInput
                  label="Phone Number"
                  name="phone"
                  type="text"
                  placeHolder="Enter phone number"
                />

                <ApTextInput
                  label="Amount"
                  name="amount"
                  type="text"
                  placeHolder="Enter Amount"
                />

                <ApButton
                  type="submit"
                  className="w-full mt-4"
                  onClick={() => handleSubmit}
                  disabled={loading || !selectedNetwork}
                  title={loading ? "Processing..." : "Buy Exam"}
                />

                {/* Data Plan Selection Modal */}
                <GlobalModal
                  title={`Exam Plans for ${selectedNetwork}`}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div className="space-y-3">
                    {variations.map((plan) => (
                      <button
                        key={plan.variation_code}
                        className="p-3 border rounded-lg w-full text-left"
                        onClick={() => {
                          setFieldValue("pin_type", selectedNetwork);
                          setFieldValue("amount", plan.variation_amount);
                          setFieldValue("variation_code", plan.variation_code);
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
