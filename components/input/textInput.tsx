"use client";
import { ErrorMessage, useField } from "formik";
import React, { forwardRef, useRef, useState } from "react";
import { ApText } from "../typograph/text";
import { Eye, EyeOff } from "lucide-react"; // Icon for password visibility toggle

interface IProps {
  label?: string;
  type?: "text" | "password" | "textarea";
  name: string;
  value?: string;
  inputClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  ignoreFormik?: boolean;
  containerClassName?: string;
  onChange?: (val: string) => void;
}

export const ApTextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  IProps
>(
  (
    {
      label,
      type = "text",
      name,
      onChange,
      inputClassName,
      placeHolder,
      containerClassName,
      disabled,
      ignoreFormik,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    let formikField: any = null;
    if (name && !ignoreFormik) {
      formikField = useField(name);
    }

    // Expose a function to set cursor position externally
    // useImperativeHandle(ref, () => ({
    //   setCursorPosition: (start: number, end: number) => {
    //     if (inputRef.current && "setSelectionRange" in inputRef.current) {
    //       inputRef.current.setSelectionRange(start, end);
    //     }
    //   },
    // }));

    return (
      <div className={containerClassName}>
        {label && (
          <ApText className="cus-sm2:text-xs mb-2" size="sm">
            {label}
          </ApText>
        )}

        {type === "textarea" ? (
          <textarea
            className={`border p-3 text-[13px] outline-none w-full rounded-sm focus:border-gray-400 resize-none ${inputClassName}`}
            {...(!ignoreFormik ? formikField[0] : {})}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            name={name}
            rows={5}
            placeholder={placeHolder}
            onChange={(e) => {
              if (!ignoreFormik) formikField?.[2].setValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
          ></textarea>
        ) : (
          <div className="relative">
            <input
              type={type === "password" && !showPassword ? "password" : "text"}
              {...(!ignoreFormik ? formikField[0] : {})}
              ref={inputRef as React.RefObject<HTMLInputElement>}
              name={name}
              disabled={disabled || false}
              className={`border px-3 text-[13px] outline-none w-full h-[45px] rounded-sm focus:border-gray-400 ${inputClassName}`}
              placeholder={placeHolder}
              onChange={(e) => {
                if (!ignoreFormik) formikField?.[2].setValue(e.target.value);
                onChange && onChange(e.target.value);
              }}
            />

            {/* Show/Hide Password Icon */}
            {type === "password" && (
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        )}

        {/* Display Formik Error Messages */}
        {!ignoreFormik && (
          <ErrorMessage
            className="text-red-500 text-sm mt-1"
            name={name}
            component="div"
          />
        )}
      </div>
    );
  }
);
