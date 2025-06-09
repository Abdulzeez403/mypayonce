"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  payElectricity,
  handleVerifyMeter,
} from "@/redux/features/services/serviceThunk";
import GlobalModal from "@/components/modal/globalModal";
import { electricityProviders } from "@/constants/data";
import { ApButton } from "@/components/button/button";
import ApHeader from "@/components/Apheader";

interface CustomerDetails {
  name?: string;
  address?: string;
}

interface FormValues {
  meter_number: string;
  provider: string;
  type: string;
  amount: string;
  phone: string;
}

export default function BuyElectricity() {
  const [loading, setLoading] = useState(false);
  const [isMeterVerified, setIsMeterVerified] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({});
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [formData, setFormData] = useState<any | null>(null);
  const [pinCode, setPinCode] = useState("");

  const validationSchema = Yup.object({
    meter_number: Yup.string().required("Enter your meter number"),
    provider: Yup.string().required("Provider is required"),
    type: Yup.string()
      .oneOf(["prepaid", "postpaid"], "Invalid type")
      .required("Select meter type"),
    amount: Yup.number()
      .min(50, "Minimum amount is ₦50")
      .required("Amount is required"),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
  });

  const formatProviderName = (provider: string) =>
    provider.trim().toLowerCase().replace(/\s+/g, "-");

  const verifyMeter = async (
    meter_number: string,
    provider: string,
    type: string
  ) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        handleVerifyMeter({ meter_number, provider, type })
      );

      if (handleVerifyMeter.fulfilled.match(resultAction)) {
        const { Customer_Name, Address } = resultAction.payload.data;
        setCustomerDetails({ name: Customer_Name, address: Address });
        toast.success("✅ Meter number verified successfully!");
        setIsMeterVerified(true);
      } else {
        throw new Error(resultAction.error.message || "Verification failed");
      }
    } catch (error) {
      toast.error("❌ Invalid meter number!");
      setCustomerDetails({});
      setIsMeterVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvider = (
    provider: string,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setSelectedProvider(provider);
    setFieldValue("provider", provider);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (values: FormValues) => {
    if (!isMeterVerified) {
      toast.error("❌ Please verify your meter number first!");
      return;
    }

    if (!pinCode || pinCode.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    const payload = {
      meter_number: values.meter_number,
      type: values.type,
      provider: formatProviderName(selectedProvider),
      amount: Number(values.amount),
      phone: values.phone,
      pinCode,
    };

    setLoading(true);
    try {
      const resultAction = await dispatch(payElectricity({ payload }));

      if (payElectricity.fulfilled.match(resultAction)) {
        const { request_id } = resultAction.payload;
        toast.success("✅ Electricity purchase successful!");
        router.push(`/dashboard/transaction?request_id=${request_id}`);
      } else {
        throw new Error(resultAction.error.message || "Payment failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
      setPinModalOpen(false);
      setPinCode("");
    }
  };

  const handleTypeChange = (
    type: string,
    values: FormValues,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue("type", type);
    if (values.meter_number && selectedProvider) {
      verifyMeter(
        values.meter_number,
        formatProviderName(selectedProvider),
        type
      );
    }
  };

  return (
    <div>
      <ApHeader title="Buy Electricity" />
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <Formik
            initialValues={{
              meter_number: "",
              provider: "",
              type: "",
              amount: "",
              phone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={() => {}}
          >
            {({ values, setFieldValue, isValid, dirty }) => (
              <Form>
                {/* Meter Number Input */}
                <ApTextInput
                  label="Meter Number"
                  name="meter_number"
                  type="text"
                  placeHolder="Enter your meter number"
                />

                {/* Provider Selection Dropdown */}
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Select Provider
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full p-2 border border-gray-300 rounded-md text-left bg-white"
                >
                  {selectedProvider || "Select Provider"}
                </button>

                {/* Meter Type Selection (Radio Buttons) */}
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Select Meter Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="prepaid"
                      checked={values.type === "prepaid"}
                      onChange={() =>
                        handleTypeChange("prepaid", values, setFieldValue)
                      }
                      className="mr-2"
                    />
                    Prepaid
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="postpaid"
                      checked={values.type === "postpaid"}
                      onChange={() =>
                        handleTypeChange("postpaid", values, setFieldValue)
                      }
                      className="mr-2"
                    />
                    Postpaid
                  </label>
                </div>

                {/* Customer Details Display */}
                {isMeterVerified && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {customerDetails.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Address:</strong>{" "}
                      {customerDetails.address || "N/A"}
                    </p>
                  </div>
                )}

                {/* Amount Input */}
                <ApTextInput
                  label="Amount (₦)"
                  name="amount"
                  placeHolder="Enter Amount"
                />

                {/* Phone Number Input */}
                <ApTextInput
                  label="Phone Number"
                  name="phone"
                  placeHolder="Enter phone number"
                />

                {/* Buy Electricity Button */}

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

                <GlobalModal
                  title="Select Electricity Provider"
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <ul className="space-y-2">
                    {electricityProviders.map((provider) => (
                      <li
                        key={provider.id}
                        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer flex justify-between items-center"
                        onClick={() =>
                          handleSelectProvider(provider.name, setFieldValue)
                        }
                      >
                        <span className="capitalize">{provider.name}</span>
                      </li>
                    ))}
                  </ul>
                </GlobalModal>
              </Form>
            )}
          </Formik>
        </div>
      </div>
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
