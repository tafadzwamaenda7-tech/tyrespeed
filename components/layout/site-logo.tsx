import Image from "next/image";

export function SiteLogo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/ts-logo (1).png"
      alt="tyrespeed"
      width={1858}
      height={859}
      priority={priority}
      className={`site-logo${className ? ` ${className}` : ""}`}
    />
  );
}
