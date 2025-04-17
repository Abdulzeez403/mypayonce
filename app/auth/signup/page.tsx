"use client";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ApTextInput } from "@/components/input/textInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signUpUser } from "@/redux/features/user/userThunk";
import { ApButton } from "@/components/button/button";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    state: Yup.string().required("State is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // ✅ Form Submission Handler
  const handleSubmit = async (values: any) => {
    const resultAction = await dispatch(signUpUser(values));
    if (signUpUser.fulfilled.match(resultAction)) {
      toast.success("🎉 Sign-up successful! Redirecting...");
      router.push("/signup");
    } else {
      toast.error(`❌ ${resultAction.payload || "Signup failed"}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            state: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ApTextInput
                label="First Name"
                name="firstName"
                placeHolder="Enter your first name"
              />
              <ApTextInput
                label="Last Name"
                name="lastName"
                placeHolder="Enter your last name"
              />
              <ApTextInput
                label="Email"
                name="email"
                placeHolder="Enter your email"
              />
              <ApTextInput
                label="State"
                name="state"
                placeHolder="Enter your state"
              />
              <ApTextInput
                label="Phone"
                name="phone"
                placeHolder="Enter your phone number"
              />
              <ApTextInput
                label="Password"
                name="password"
                type="password"
                placeHolder="Enter your password"
              />
              <ApTextInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeHolder="Confirm your password"
              />

              <ApButton
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </ApButton>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
