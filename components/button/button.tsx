"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import classNames from "classnames";

interface IProps {
  title?: string | React.ReactNode;
  btnType?: "primary" | "outline" | "danger";
  loading?: boolean;
  type?: "submit" | "button";
  className?: string;
  disabled?: boolean;
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ApButton: React.FC<IProps> = ({
  title,
  type = "button",
  className = "",
  loading = false,
  onClick,
  disabled = false,
  btnType = "primary",
  children,
}) => {
  const btnClassName = classNames(
    "flex items-center justify-center gap-2 text-sm rounded-lg py-3 px-5 font-light transition-all",
    {
      "bg-primary text-white hover:bg-primary/80": btnType === "primary",
      "bg-white border border-primary text-primary hover:bg-primary/10":
        btnType === "outline",
      "bg-red-500 text-white hover:bg-red-600": btnType === "danger",
      "cursor-not-allowed bg-gray-400": disabled && btnType !== "outline",
    },
    className
  );

  return (
    <button
      type={type}
      className={btnClassName}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="animate-spin text-2xl" />
      ) : (
        title || children
      )}
    </button>
  );
};
