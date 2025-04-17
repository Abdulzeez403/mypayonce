"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ApTextInput } from "@/components/input/textInput";
import { ApButton } from "@/components/button/button";

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Form Submission Handler
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    console.log("Reset Password Request:", values);

    // Simulate API call
    setTimeout(() => {
      alert("Password reset link sent to your email!");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ApTextInput
                label="Email"
                name="email"
                placeHolder="Enter your email"
              />

              <ApButton
                type="submit"
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </ApButton>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-4 text-sm">
          Remember your password?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
