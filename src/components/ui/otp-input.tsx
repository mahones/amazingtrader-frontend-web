"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
};

function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  autoFocus,
  className,
  containerClassName,
  id,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = React.useMemo(() => {
    const chars = value.split("").slice(0, length);
    return Array.from({ length }, (_, i) => chars[i] ?? "");
  }, [value, length]);

  function setDigitAt(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").replace(/\s+$/, ""));
  }

  function focusIndex(index: number) {
    inputRefs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  }

  function handleChange(index: number, raw: string) {
    const incoming = raw.replace(/\D/g, "");
    if (!incoming) {
      setDigitAt(index, "");
      return;
    }

    if (incoming.length > 1) {
      const chars = incoming.split("");
      const next = digits.slice();
      let cursor = index;
      for (const char of chars) {
        if (cursor >= length) break;
        next[cursor] = char;
        cursor += 1;
      }
      onChange(next.join("").replace(/\s+$/, ""));
      focusIndex(Math.min(cursor, length - 1));
      return;
    }

    setDigitAt(index, incoming);
    if (index < length - 1) focusIndex(index + 1);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigitAt(index, "");
      } else if (index > 0) {
        setDigitAt(index - 1, "");
        focusIndex(index - 1);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      focusIndex(index - 1);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      focusIndex(index + 1);
      e.preventDefault();
    }
  }

  function handlePaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    handleChange(index, pasted);
  }

  return (
    <div className={cn("flex justify-center gap-2", containerClassName)} id={id} role="group">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Chiffre ${index + 1} sur ${length}`}
          className={cn(
            "h-12 w-10 rounded-lg border border-input bg-transparent text-center text-lg font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80",
            className
          )}
        />
      ))}
    </div>
  );
}

export { OtpInput };
