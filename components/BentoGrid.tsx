import clsx from "clsx";

interface BentoTileProps {
  className?: string;
  children: React.ReactNode;
}

export function BentoTile({ className, children }: BentoTileProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-surface-dark",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-3 lg:gap-6">
      {children}
    </div>
  );
}
