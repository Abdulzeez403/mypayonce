"use client";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTransactionById } from "@/redux/features/transaction/transactionSlice";
import ApHeader from "../../../components/Apheader";
import { CheckCircle, Clock, Download, XCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ApLoader from "@/components/loader";

function TransactionContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const dispatch = useDispatch<AppDispatch>();
  const { transaction, loading } = useSelector(
    (state: RootState) => state.transactions
  );
  const receiptRef = useRef(null);

  useEffect(() => {
    if (requestId) {
      dispatch(fetchTransactionById({ request_id: requestId }));
    }
  }, [dispatch, requestId]);

  const RenderTrans = ({ title, name }: { title: string; name: string }) => (
    <div className="flex justify-between">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{name}</p>
    </div>
  );

  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current);
        const imgData = canvas.toDataURL("image/png");

        // Check if the canvas is generated correctly
        console.log("Canvas generated:", canvas);

        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Adding image to PDF
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("transaction-receipt.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
      console.log("Receipt ref is not set.");
    }
  };

  if (loading) {
    return <ApLoader />;
  }

  return (
    <div>
      <ApHeader title="Transaction Details" />

      <div
        className="mt-6 bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto"
        ref={receiptRef}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Status Display */}
          <div className="flex items-center space-x-2">
            {transaction?.status === "delivered" && (
              <>
                <CheckCircle size={40} className="text-green-600" />
                <p className="font-semibold text-xl text-green-700">
                  Transaction Successful
                </p>
              </>
            )}

            {transaction?.status === "pending" && (
              <>
                <Clock size={40} className="text-yellow-600" />
                <p className="font-semibold text-xl text-yellow-700">
                  Transaction Pending
                </p>
              </>
            )}

            {transaction?.status === "failed" && (
              <>
                <XCircle size={40} className="text-red-600" />
                <p className="font-semibold text-xl text-red-700">
                  Transaction Failed
                </p>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-center text-sm text-gray-600">
            Thank you for choosing our service! We appreciate your trust and
            look forward to serving you again.
          </p>

          {/* Transaction Details */}
          <div className="w-full mt-4 space-y-4">
            <RenderTrans
              title="Transaction ID:"
              name={transaction?.request_id || "N/A"}
            />
            <RenderTrans
              title="Product Name:"
              name={transaction?.product_name || "N/A"}
            />
            <RenderTrans title="Phone:" name={transaction?.phone || "N/A"} />
            <RenderTrans
              title="Amount:"
              name={transaction?.amount?.toString() || "N/A"}
            />
            {transaction?.dataName && (
              <RenderTrans title="Data Plan:" name={transaction.dataName} />
            )}
            {transaction?.token && (
              <RenderTrans title="Token:" name={transaction.token} />
            )}
            <RenderTrans
              title="Date:"
              name={
                transaction?.transaction_date
                  ? new Date(transaction.transaction_date).toLocaleString()
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Download size={18} /> Download PDF
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default function TransactionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <p>Loading transaction details...</p>
        </div>
      }
    >
      <TransactionContent />
    </Suspense>
  );
}
