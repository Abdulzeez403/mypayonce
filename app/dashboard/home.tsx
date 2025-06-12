"use client";

import {
  Phone,
  Wifi,
  Bolt,
  TrendingUp,
  Grid,
  GraduationCap,
  Tv2,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ApHomeHeader from "../../components/homeHeader";
import TopSheetModal from "@/components/modal/topsheetModal";
import { useEffect, useState } from "react";
import { fetchUserTransactions } from "@/redux/features/transaction/transactionSlice";
import { NotificationModal } from "@/components/modal/notificationModal";
import { addPin, currentUser } from "@/redux/features/user/userThunk";
import { getLatestNotification } from "@/redux/features/notifications/notificationSlice";
import { ApTextInput } from "@/components/input/textInput";
import { Formik, Form } from "formik";
import { ApButton } from "@/components/button/button";
import { toast } from "react-toastify";

export const HomeDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const { notification } = useSelector(
    (state: RootState) => state.notifications
  );
  const dispatch = useDispatch<AppDispatch>();

  const { transactions, loading } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    dispatch(currentUser());
  }, []);

  useEffect(() => {
    dispatch(fetchUserTransactions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLatestNotification());
  }, [dispatch]);

  const [showBalance, setShowBalance] = useState(true);

  const toggleBalance = () => setShowBalance((prev) => !prev);

  const handleAddpin = async (values: any) => {
    try {
      const resultAction = await dispatch(addPin({ pin: values.pin }));
      if (addPin.fulfilled.match(resultAction)) {
        toast.success("PIN updated successfully");
        setPinModalOpen(false);
        //  resetForm();
      } else {
        toast.error(resultAction.payload as string);
      }
    } catch (err) {
      console.error("Error updating PIN:", err);
      toast.error("Unexpected error. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "failed":
        return <XCircle className="text-red-500 w-5 h-5" />;
      default:
        return <Clock className="text-yellow-500 w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-500 bg-green-100";
      case "failed":
        return "text-red-500 bg-red-100";
      default:
        return "text-yellow-500 bg-yellow-100";
    }
  };

  return (
    <div className=" ">
      <ApHomeHeader />
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm">Wallet Balance</p>
          <button onClick={toggleBalance}>
            {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="text-3xl font-bold mt-1">
          {showBalance
            ? `₦${Number(user?.balance ?? 0).toLocaleString()}`
            : "••••••"}
        </p>

        <div className="flex justify-between mt-4 gap-y-2 text-sm">
          <div className="bg-white/20 px-3 py-1 rounded-md flex items-center space-x-1">
            <TrendingUp size={14} />
            <span>Bonus: ₦{user?.bonus}</span>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-md flex items-center space-x-1">
            <TrendingUp size={14} />
            <span>Claim: ₦0.00</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          {
            id: 1,
            icon: <Phone size={24} className="text-blue-500" />,
            label: "Airtime",
            link: "/dashboard/buyAirtime",
          },
          {
            id: 2,
            icon: <Wifi size={24} className="text-green-500" />,
            label: "Data",
            link: "/dashboard/buyData",
          },
          {
            id: 3,
            icon: <Bolt size={24} className="text-yellow-500" />,
            label: "Electricity",
            link: "/dashboard/buyElectricity",
          },
          {
            id: 4,
            icon: <Grid size={24} className="text-gray-600" />,
            label: "More",
            action: () => setIsOpen(true),
          },
        ].map((action) => (
          <Link
            key={action.id}
            href={action.action ? "#" : action.link}
            onClick={action.action}
            className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-200"
          >
            {action.icon}
            <span className="mt-2 text-sm text-gray-700 font-medium">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Transactions
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
          </div>
        ) : transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.slice(-2).map((tx: any, index: number) => (
              <li key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      {getStatusIcon(tx?.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx?.product_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx?.transaction_date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-right font-bold">₦{tx?.amount}</p>
                  <p
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-right ${getStatusColor(
                      tx?.status
                    )}`}
                  >
                    {tx?.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Transactions Found!</p>
        )}
        <Link
          href="/dashboard/history"
          className="text-sm text-blue-600 mt-1 block text-center"
        >
          See all
        </Link>
      </div>

      {/* <PromoCarousel /> */}
      <TopSheetModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="More"
      >
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              id: 1,
              icon: <GraduationCap size={24} />,
              label: "Exam",
              link: "/dashboard/buyExam",
            },
            {
              id: 2,
              icon: <Tv2 size={24} />,
              label: "TV",
              link: "/dashboard/buyCableTv",
            },
          ].map((item) => (
            <Link
              key={item.id}
              href={item?.link}
              className="flex flex-col items-center"
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </TopSheetModal>

      {!user?.pinStatus && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setPinModalOpen(false)
          }
        >
          <div>
            <Formik
              initialValues={{ pin: "" }}
              // validationSchema={validationSchema}
              onSubmit={handleAddpin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                    <h4 className="text-center font-bold text-lg">
                      Add a Transaction Pin
                    </h4>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Please enter your transaction pin. The new PIN must be
                      exactly 4 digits.
                    </p>

                    <ApTextInput
                      label="New Pin"
                      name="pin" // 👈 This should match the backend (req.body.pin)
                      type="password"
                      maxlength={4}
                      placeHolder="Enter new PIN"
                    />

                    <ApButton
                      type="submit"
                      title={isSubmitting ? "Adding..." : "Add PIN"}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <NotificationModal notification={notification} />
    </div>
  );
};
