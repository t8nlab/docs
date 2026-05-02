import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";

type Variant = "info" | "warning" | "success";

type NoticeProps = {
  title?: string;
  variant?: Variant;
  children: React.ReactNode;
};

const VARIANT_STYLES: Record<
  Variant,
  {
    icon: React.ReactNode;
    container: string;
    iconWrap: string;
    iconColor: string;
  }
> = {
  info: {
    icon: <Info size={14} />,
    container:
      "border border-blue-200 bg-blue-50 text-blue-900 " +
      "dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100",
    iconWrap:
      "bg-blue-100 dark:bg-blue-500/10",
    iconColor:
      "text-blue-600 dark:text-blue-400",
  },

  warning: {
    icon: <AlertTriangle size={14} />,
    container:
      "border border-amber-300 bg-amber-700 text-amber-900 " +
      "dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-zinc-100",
    iconWrap:
      "bg-amber-200 dark:bg-amber-500/10",
    iconColor:
      "text-amber-600 dark:text-amber-400",
  },

  success: {
    icon: <CheckCircle2 size={14} />,
    container:
      "border border-emerald-300 bg-emerald-800 text-emerald-900 " +
      "dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-zinc-100",
    iconWrap:
      "bg-emerald-200 dark:bg-emerald-500/10",
    iconColor:
      "text-emerald-600 dark:text-emerald-400",
  },
};

export default function Notice({
  title,
  variant = "info",
  children,
}: NoticeProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`w-full flex justify-center border px-4 py-3 ${styles.container}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${styles.iconWrap} ${styles.iconColor}`}
        >
          {styles.icon}
        </div>

        <div className="min-w-0 flex-1 space-y-1 text-sm text-zinc-300">
          {title && (
            <p className="font-medium text-zinc-100 wrap-break-word">
              {title}
            </p>
          )}
          <div className="wrap-break-word">{children}</div>
        </div>
      </div>
    </div>
  );
}
