"use client";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTransactionById } from "@/redux/features/transaction/transactionSlice";
import ApHeader from "../../../components/Apheader";
import { CheckCircle, Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function TransactionContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const dispatch = useDispatch<AppDispatch>();
  const { transaction } = useSelector((state: RootState) => state.transactions);
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
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("transaction-receipt.pdf");
    }
  };

  const handleShare = async () => {
    if (navigator.share && transaction) {
      try {
        await navigator.share({
          title: "Transaction Receipt",
          text: `Transaction ID: ${transaction.request_id}\nAmount: ${transaction.amount}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Share not supported on this device.");
    }
  };

  return (
    <div>
      <ApHeader title="Transaction Detail" />
      <div className="mt-4 bg-green-100 p-4 rounded shadow-md" ref={receiptRef}>
        <div className="flex-row justify-center items-center">
          <div className="flex justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <p className="text-center font-extrabold">Transaction Successful</p>
        </div>

        <p className="text-center py-2 pb-10 text-sm">
          Thank you for choosing our service! We appreciate your trust and look
          forward to serving you again
        </p>

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
          <RenderTrans title="Token" name={transaction.token} />
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

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Download size={18} /> Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          <Share2 size={18} /> Share
        </button>
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
