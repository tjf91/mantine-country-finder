import { Input } from "@mantine/core";
import React, { useState } from "react";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  phone_length: number;
  phoneInputRef?: React.Ref<HTMLInputElement>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder = "(000)-000-0000",
  phone_length,
  phoneInputRef,
}) => {
  function formatPhoneNumber(raw: string, lastGroupLen: number): string {
    const digits = raw.replace(/\D/g, "");
    const len = digits.length;
    if (len === 0) return "";
    let result = "";
    if (len <= 3) {
      return `(${digits}`;
    }
    const first = digits.slice(0, 3);
    result = `(${first})`;
    if (len <= 6) {
      const second = digits.slice(3);

      return `${result} ${second}`;
    }
    const second = digits.slice(3, 6);
    result = `${result} ${second}`;
    const last = digits.slice(6, 6 + lastGroupLen);
    if (last.length > 0) {
      result = `${result}-${last}`;
    }

    return result;
  }
  let valueToFormat = value.replace(/\D/g, ""); // Remove non-digit characters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (val.length > phone_length) {
      val = val.slice(0, phone_length);
    }
    val = formatPhoneNumber(val, phone_length - 6);
    onChange(val);
  };
  // Format the input value as (XXX)-XXX-variable
  console.log(valueToFormat);
  if (valueToFormat.length > phone_length) {
    valueToFormat = valueToFormat.slice(0, phone_length);
  }
  console.log(valueToFormat);
  const group3Len = phone_length - 6;
  valueToFormat = formatPhoneNumber(valueToFormat, group3Len);
  console.log(valueToFormat);
  return (
    <Input
      value={valueToFormat}
      onChange={handleInputChange}
      placeholder={placeholder}
      className="mb-2"
      ref={phoneInputRef}
    />
  );
};

export default PhoneNumberInput;
