"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getServiceVariations,
  handleVerifySmartcard,
  subscribeCable,
} from "@/redux/features/services/serviceThunk";
import GlobalModal from "@/components/modal/globalModal";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { ApButton } from "@/components/button/button";
import ApHeader from "@/components/Apheader";

interface CableSubscriptionFormValues {
  smartcard_number: string;
  provider: string;
  variation_code: string;
  phone: string;
  amount: string;
  subscription_type: string;
  quantity: number;
}

interface Provider {
  name: string;
  image: string;
  variation: string;
}

interface Variation {
  variation_code: string;
  name: string;
  variation_amount: string;
}

interface CustomerDetails {
  name?: string;
  dueDate?: string;
}

const providers: Provider[] = [
  { name: "DStv", image: "/images/dstv.jpeg", variation: "dstv" },
  { name: "GOtv", image: "/images/gotv.png", variation: "gotv" },
  { name: "Startimes", image: "/images/startime.jpeg", variation: "startimes" },
  { name: "Showmax", image: "/images/showmax.jpg", variation: "showmax" },
];

export default function BuyCableTv() {
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({});
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [formData, setFormData] = useState<any | null>(null);
  const [pinCode, setPinCode] = useState("");

  const validationSchema = Yup.object({
    smartcard_number: Yup.string()
      .required("Enter your Smartcard Number")
      .length(10, "Smartcard number must be 10 digits"),
    provider: Yup.string().required("Select a Provider"),
    variation_code: Yup.string().required("Select a Package"),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
    amount: Yup.number()
      .min(1, "Amount must be greater than 0")
      .required("Amount is required"),
    subscription_type: Yup.string().required("Select Subscription Type"),
    quantity: Yup.number()
      .min(1, "Minimum quantity is 1")
      .required("Quantity is required"),
  });

  const handleVariation = async (provider: string) => {
    setSelectedProvider(provider);
    try {
      const resultAction = await dispatch(
        getServiceVariations({ serviceType: provider })
      );

      if (getServiceVariations.fulfilled.match(resultAction)) {
        setVariations(resultAction.payload?.data?.content?.variations || []);
        setIsModalOpen(true);
      } else {
        toast.error("❌ Failed to fetch variations.");
      }
    } catch (error) {
      toast.error("❌ An error occurred while fetching variations.");
    }
  };

  const handleVerify = async (smartcardNumber: string) => {
    if (!selectedProvider) return;

    try {
      const resultAction = await dispatch(
        handleVerifySmartcard({
          payload: {
            smartcard_number: smartcardNumber,
            provider: selectedProvider,
          },
        })
      );

      if (handleVerifySmartcard.fulfilled.match(resultAction)) {
        const { Customer_Name, Due_Date } = resultAction.payload.data.content;
        setCustomerDetails({
          name: Customer_Name || "N/A",
          dueDate: Due_Date || "N/A",
        });
        setIsVerified(true);
        toast.success("✅ Smart Card number verified successfully!");
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      setCustomerDetails({});
      setIsVerified(false);
      toast.error("❌ Smartcard verification failed.");
    }
  };

  const handleFormSubmit = async (values: CableSubscriptionFormValues) => {
    if (!isVerified) {
      toast.error("❌ Please verify your smartcard first!");
      return;
    }

    if (!pinCode || pinCode.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    const payload = {
      smartcard_number: values.smartcard_number,
      provider: selectedProvider,
      variation_code: values.variation_code,
      phone: values.phone,
      subscription_type: values.subscription_type,
      amount: Number(values.amount),
      quantity: values.quantity,
      pinCode,
    };

    try {
      setLoading(true);
      const resultAction = await dispatch(subscribeCable({ payload }));

      if (subscribeCable.fulfilled.match(resultAction)) {
        const { request_id } = resultAction.payload;

        toast.success("✅ Cable TV subscription successful!");
        router.push(`/dashboard/transaction?request_id=${request_id}`);
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      toast.error("❌ Subscription failed! Please try again.");
    } finally {
      setLoading(false);
      setPinModalOpen(false);
      setPinCode("");
    }
  };

  return (
    <div>
      <ApHeader title="Buy Cable TV Subscription" />
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <p className="text-sm text-gray-600 text-center py-2 mb-4">
            Select a provider and enter details to subscribe.
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            {providers.map((provider) => (
              <button
                key={provider.name}
                type="button"
                className={`p-2 rounded-lg border ${
                  selectedProvider === provider.variation
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                } hover:border-blue-500 transition-colors`}
                onClick={() => handleVariation(provider.variation)}
              >
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-12 h-12 object-contain"
                />
              </button>
            ))}
          </div>
          <Formik
            initialValues={{
              smartcard_number: "",
              provider: "",
              variation_code: "",
              phone: "",
              amount: "",
              subscription_type: "change",
              quantity: 1,
            }}
            validationSchema={validationSchema}
            onSubmit={() => {}}
          >
            {({ setFieldValue, values, isValid, dirty }) => (
              <Form>
                <ApTextInput
                  label="Smartcard Number"
                  name="smartcard_number"
                  type="text"
                  placeHolder="Enter 10-digit Smartcard Number"
                  onChange={(value: string) => {
                    setFieldValue("smartcard_number", value);
                    if (value.length === 10 && selectedProvider) {
                      handleVerify(value);
                    }
                  }}
                />

                {customerDetails.name && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-md space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {customerDetails.name}
                    </p>
                    {customerDetails.dueDate && (
                      <p className="text-sm">
                        <span className="font-medium">Due Date:</span>{" "}
                        {customerDetails.dueDate}
                      </p>
                    )}
                  </div>
                )}

                <ApTextInput
                  label="Phone Number"
                  name="phone"
                  placeHolder="Enter 11-digit phone number"
                />

                <ApTextInput
                  label="Amount (₦)"
                  name="amount"
                  placeHolder="Enter Amount"
                  disabled={true} // Amount is set by package selection
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
                <GlobalModal
                  title={`${selectedProvider.toUpperCase()} TV Plans`}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div className="space-y-3">
                    {variations.length > 0 ? (
                      variations.map((plan) => (
                        <button
                          key={plan.variation_code}
                          type="button"
                          className="p-3 border rounded-lg w-full text-left hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setFieldValue(
                              "variation_code",
                              plan.variation_code
                            );
                            setFieldValue("amount", plan.variation_amount);
                            setFieldValue("provider", selectedProvider);
                            setIsModalOpen(false);
                          }}
                        >
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-600">
                            ₦{plan.variation_amount}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        No packages available
                      </p>
                    )}
                  </div>
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
