import Image from "next/image";

// Logo program (segel UCR × PKUMI-06) — ditaruh di samping wordmark "Kuy, UCR!"
// di setiap header. Sumbernya public/logo.png; favicon & ikon PWA di
// public/icons/ dibuat dari gambar yang sama.
export default function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      className={`shrink-0 ${className}`}
    />
  );
}
