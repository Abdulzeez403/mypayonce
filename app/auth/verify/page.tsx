"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "@/redux/features/user/userThunk";
import { useRouter } from "next/navigation";
import { ApButton } from "@/components/button/button";

export default function VerifyEmail() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);

  const router = useRouter();

  // Validation Schema
  const validationSchema = Yup.object({
    emaiil: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    otp: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Verification code is required"),
  });

  // Form Submission Handler
  const handleSubmit = async (values: any) => {
    const resultAction = await dispatch(verifyEmail(values));
    if (verifyEmail.fulfilled.match(resultAction)) {
      toast.success("✅ Email verified successfully");
      router.push("/dashboard");
    } else {
      toast.error(`❌ ${resultAction.payload || "Email verification failed"}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="text-gray-600">
          A 6-digit verification code has been sent to your email. Please enter
          the code below.
        </p>

        <Formik
          initialValues={{ email: user?.email, verificationCode: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ApTextInput
                label="Verification Code"
                name="verificationCode"
                placeHolder="Enter 6-digit code"
              />

              <ApButton
                type="submit"
                className="w-full mt-4"
                disabled={loading}
                onClick={() => handleSubmit}
              >
                {loading ? "Verifying..." : "Verify"}
              </ApButton>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-4 text-sm">
          Didn't receive the code?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => alert("Resending verification code...")}
          >
            Resend Code
          </button>
        </p>

        <p className="text-center mt-2 text-sm">
          Wrong email?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up Again
          </a>
        </p>
      </div>
    </div>
  );
}
