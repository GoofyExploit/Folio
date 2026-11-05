import { useRouter } from "next/router";
import React from "react";
import { formatBytes } from "@/utils/formatBytes";
import { useDrive } from "./DriveProvider";

type BreadcrumbItem = {
  id: string;
  label: string;
};

function StorageMeter() {
  const { usageBytes, limitBytes } = useDrive();
  const percent = Math.min(100, (usageBytes / limitBytes) * 100);
  const nearLimit = usageBytes >= limitBytes / 1.25;

  return (
    <div className="w-full shrink-0 sm:w-64 lg:w-72">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[#6B7280]">
        <span className="font-medium text-[#4B5563]">Storage</span>
        <span className="tabular-nums whitespace-nowrap">
          <strong className="font-semibold text-[#111827]">
            {formatBytes(usageBytes)}
          </strong>{" "}
          of {formatBytes(limitBytes)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            nearLimit ? "bg-red-500" : "bg-[#EA580C]"
          }`}
          style={{ width: `${percent > 0 ? Math.max(percent, 0.75) : 0}%` }}
        />
      </div>
    </div>
  );
}

function FileHeader({
  headerName,
  breadcrumbs,
}: {
  headerName: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const router = useRouter();
  const breadcrumbTrail =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [{ id: "", label: headerName }];

  return (
    <div className="px-4 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {breadcrumbTrail.map((item, index) => {
            const isLast = index === breadcrumbTrail.length - 1;
            const route = item.id
              ? `/drive/folders/${item.id}`
              : "/drive/my-drive";

            return (
              <React.Fragment key={`${item.id}-${item.label}`}>
                {index > 0 && (
                  <span className="text-xl font-light text-[#D1D5DB] sm:text-2xl">
                    /
                  </span>
                )}
                {isLast ? (
                  <h1 className="truncate text-2xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                    {item.label}
                  </h1>
                ) : (
                  <button
                    onClick={() => router.push(route)}
                    className="text-base font-medium text-[#6B7280] transition hover:text-[#EA580C] sm:text-lg"
                  >
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="w-full sm:w-auto">
          <StorageMeter />
        </div>
      </div>
    </div>
  );
}

export default FileHeader;
