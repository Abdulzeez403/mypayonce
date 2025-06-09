"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPasswordReset,
  verifyEmail,
} from "@/redux/features/user/userThunk";
import { useRouter } from "next/navigation";
import { ApButton } from "@/components/button/button";
import logo from "@/public/images/logo.png";
import Image from "next/image";

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Form Submission Handler
  const handleSubmit = async (values: any) => {
    const resultAction = await dispatch(requestPasswordReset(values));
    if (requestPasswordReset.fulfilled.match(resultAction)) {
      toast.success("✅ Email verified successfully");
      router.push(`/auth/verify?email=${values.email}`);
    } else {
      toast.error(`❌ ${resultAction.payload || "Email verification failed"}`);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white/40 p-6 rounded-lg  w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="PayOnce logo" width={50} height={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your registered email!.
        </p>

        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ApTextInput
                label="Email Address"
                name="email"
                placeHolder="Enter your email"
              />

              <ApButton
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </ApButton>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-2 text-sm">
          Wrong email?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up Again
          </a>
        </p>
      </div>
    </div>
  );
}
