import Image from "next/image";

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

type LogoDimensions = Readonly<{
  icon: number;
  wordmark: number;
}>;

const logoDimensions: Record<LogoSize, LogoDimensions> = {
  xs: { icon: 20, wordmark: 14 },
  sm: { icon: 28, wordmark: 16 },
  md: { icon: 36, wordmark: 20 },
  lg: { icon: 48, wordmark: 24 },
  xl: { icon: 64, wordmark: 30 },
};

export type LogoProps = Readonly<{
  name?: string;
  size?: LogoSize | number;
  showName?: boolean;
  preload?: boolean;
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
}>;

function getDimensions(size: LogoSize | number): LogoDimensions {
  if (typeof size === "number") {
    const icon = Math.max(1, size);

    return {
      icon,
      wordmark: Math.max(12, Math.round(icon * 0.56)),
    };
  }

  return logoDimensions[size];
}


export function Logo({
  name = "Resume Tailor",
  size = "md",
  showName = true,
  preload = false,
  className,
  iconClassName,
  nameClassName,
}: LogoProps) {
  const dimensions = getDimensions(size);

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center font-semibold tracking-tight text-ink",
        showName ? "gap-2" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/logo.png"
        alt={showName ? "" : name}
        width={1254}
        height={1254}
        sizes={`${dimensions.icon}px`}
        preload={preload}
        className={["shrink-0 object-contain", iconClassName]
          .filter(Boolean)
          .join(" ")}
        style={{ width: dimensions.icon, height: dimensions.icon }}
      />
      {showName ? (
        <span
          className={["whitespace-nowrap", nameClassName]
            .filter(Boolean)
            .join(" ")}
          style={{ fontSize: dimensions.wordmark, lineHeight: 1.1 }}
        >
          {name}
        </span>
      ) : null}
    </span>
  );
}
