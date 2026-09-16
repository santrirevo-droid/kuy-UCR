"use client";

import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import Icon from "@/components/Icon";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

// Input password dengan tombol mata buat toggle tampil/sembunyi. `className`
// dioper langsung ke <input>-nya (dipakai persis seperti <input type="password">
// biasa) — cukup tambah padding-right lewat pr-10 di sini biar teksnya nggak
// ketiban ikon.
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input ref={ref} type={visible ? "text" : "password"} className={`${className} pr-11`} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-subtle transition hover:text-ink"
      >
        <Icon name={visible ? "eye-off" : "eye"} className="h-[1.1rem] w-[1.1rem]" />
      </button>
    </div>
  );
});

export default PasswordInput;
