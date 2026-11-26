import Image from "next/image";

export function SiteLogo({
  className = "",
  priority = false,
  sizes = "104px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src="/images/ts-logo (1).png"
      alt="tyrespeed"
      width={1858}
      height={859}
      sizes={sizes}
      priority={priority}
      className={`site-logo${className ? ` ${className}` : ""}`}
    />
  );
}
