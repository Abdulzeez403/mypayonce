"use client";

import { ErrorMessage, useField } from "formik";
import React, { forwardRef, useRef, useState } from "react";
import { ApText } from "../typograph/text";
import { Eye, EyeOff } from "lucide-react";

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
  maxlength?: number;
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
      value = "",
      onChange,
      inputClassName = "",
      placeHolder = "",
      containerClassName = "",
      disabled = false,
      ignoreFormik = false,
      maxlength,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    let formikField: any = null;
    if (name && !ignoreFormik) {
      formikField = useField(name);
    }

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (!ignoreFormik) formikField?.[2].setValue(e.target.value);
      onChange?.(e.target.value);
    };

    return (
      <div className={`flex flex-col ${containerClassName}`}>
        {label && (
          <ApText className="mb-1 text-sm font-medium text-gray-700">
            {label}
          </ApText>
        )}
        {type === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={`w-full rounded-md border border-gray-300 p-3 text-sm focus:border-purple-600 focus:outline-none disabled:opacity-50 ${inputClassName}`}
            placeholder={placeHolder}
            disabled={disabled}
            name={name}
            rows={5}
            {...(!ignoreFormik ? formikField[0] : {})}
            onChange={handleChange}
          />
        ) : (
          <div className="relative">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type === "password" && !showPassword ? "password" : "text"}
              className={`w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:border-black focus:outline-none disabled:opacity-50 ${inputClassName}`}
              placeholder={placeHolder}
              disabled={disabled}
              name={name}
              {...(!ignoreFormik ? formikField[0] : {})}
              onChange={handleChange}
              maxLength={maxlength}
            />

            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}
        {!ignoreFormik && (
          <ErrorMessage
            name={name}
            component="div"
            className="mt-1 text-xs text-red-500"
          />
        )}
      </div>
    );
  }
);
