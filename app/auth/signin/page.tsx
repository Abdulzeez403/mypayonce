"use client";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApTextInput } from "@/components/input/textInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/features/user/userThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ApButton } from "@/components/button/button";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(" Login successful");
      router.push("/dashboard");
    } else {
      toast.error(`❌ ${resultAction.payload || "Login failed"}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({}) => (
            <Form>
              <ApTextInput
                label="Email"
                name="email"
                placeHolder="Enter your email"
              />
              <ApTextInput
                label="Password"
                name="password"
                type="password"
                placeHolder="Enter your password"
              />

              <ApButton
                type="submit"
                className="w-full mt--4"
                disabled={loading}
                loading={loading}
                title={loading ? "Processing..." : "Sign In"}
              />
            </Form>
          )}
        </Formik>

        <p className="text-center mt-4 text-sm">
          Don't have an account ?
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
