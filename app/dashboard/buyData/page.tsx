"use client";
import React from "react";
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

type Plan = {
  name: string;
  variation_code: string;
  variation_amount: number;
  category: string;
};

export default function BuyData() {
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("daily");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [formData, setFormData] = useState<any | null>(null);
  const [pinCode, setPinCode] = useState("");

  // Initialize variations with the correct structure
  const [variations, setVariations] = useState<{
    daily: Plan[];
    weekly: Plan[];
    monthly: Plan[];
    "multi-month": Plan[];
    unknown: Plan[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
    "multi-month": [],
    unknown: [],
  });

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

      // Classify each plan with a category
      const classified = variations.map((plan: any) => {
        const name = plan.name.toLowerCase();

        if (
          name.includes("1 day") ||
          name.includes("2 days") ||
          name.includes("daily") ||
          name.includes("Oneoff")
        ) {
          return { ...plan, category: "daily" };
        } else if (
          name.includes("weekly") ||
          name.includes("7 days") ||
          name.includes("14 days")
        ) {
          return { ...plan, category: "weekly" };
        } else if (
          name.includes("monthly") ||
          name.includes("30 days") ||
          name.includes("1 month")
        ) {
          return { ...plan, category: "monthly" };
        } else if (name.includes("2-month") || name.includes("3-month")) {
          return { ...plan, category: "multi-month" };
        } else {
          return { ...plan, category: "all" }; // Default to "all" if no other category matches
        }
      });

      // Group the classified plans by their category
      const groupedVariations = classified.reduce(
        (acc: any, plan: Plan) => {
          acc[plan.category].push(plan);
          return acc;
        },
        {
          daily: [],
          weekly: [],
          monthly: [],
          "multi-month": [],
          all: [],
        }
      );

      setVariations(groupedVariations);
    } else {
      toast.error("❌ Failed to fetch variations.");
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (!pinCode || pinCode.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      const payload = {
        phone: Number(values.phone),
        variation_code: values.variation_code,
        network: `${values.network.toLowerCase()}-data`,
        amount: Number(values.amount),
        dataName: values.dataName,
        pinCode,
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
            onSubmit={() => {}}
          >
            {({ values, setFieldValue, isValid, dirty }) => (
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
                <div className="hidden">
                  <ApTextInput
                    label="Data Plan"
                    name="variation_code"
                    type="text"
                    placeHolder="Auto-filled"
                  />
                </div>

                <ApTextInput
                  label="Amount (₦)"
                  name="amount"
                  type="text"
                  placeHolder="Auto-filled"
                  // editable={false}
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

                {/* Data Plan Selection Modal */}
                <GlobalModal
                  title={`Data Plans for ${selectedNetwork}`}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div>
                    <div>
                      {/* Category Buttons */}
                      <div className="flex justify-start space-x-4 mb-4 overflow-x-auto custom-scrollbar">
                        {[
                          "all",
                          "daily",
                          "weekly",
                          "monthly",
                          "multi-month",
                        ].map((category) => (
                          <button
                            key={category}
                            className={`px-4  rounded-lg border ${
                              selectedCategory === category
                                ? "border-blue-500 bg-blue-100"
                                : "border-gray-300"
                            }`}
                            onClick={() => setSelectedCategory(category)} // Set selected category
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Display Plans for the Selected Category */}
                    {["all", "daily", "weekly", "monthly", "multi-month"].map(
                      (category) => {
                        const group =
                          variations?.[category as keyof typeof variations];
                        return (
                          selectedCategory === category && // Show plans only for the selected category
                          group.length > 0 && (
                            <div key={category}>
                              <h3 className="capitalize font-semibold mb-2">
                                {category} Plans
                              </h3>
                              {group.map((plan: any) => (
                                <button
                                  key={plan.variation_code}
                                  onClick={() => {
                                    setFieldValue(
                                      "variation_code",
                                      plan.variation_code
                                    );
                                    setFieldValue("dataName", plan.name);
                                    setFieldValue(
                                      "amount",
                                      plan.variation_amount
                                    );
                                    setFieldValue("network", selectedNetwork);
                                    setIsModalOpen(false);
                                  }}
                                  className="w-full p-3 border rounded-lg mb-2 text-left"
                                >
                                  <p className="text-sm font-medium">
                                    {plan.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    ₦{plan.variation_amount}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )
                        );
                      }
                    )}
                  </div>
                </GlobalModal>
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
