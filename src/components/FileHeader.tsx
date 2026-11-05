import { useRouter } from "next/router";
import React from "react";
import { IoChevronDown } from "react-icons/io5";
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
    <div className="w-36 shrink-0 sm:w-52 lg:w-64">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-[#6B7280]">
        <span>Storage</span>
        <span className="tabular-nums">
          {formatBytes(usageBytes)} of {formatBytes(limitBytes)}
        </span>
      </div>
      <div className="h-[3px] overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className={`h-full rounded-full ${nearLimit ? "bg-red-500" : "bg-[#EA580C]"}`}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:bg-[#F9FAFB] sm:px-3.5 sm:text-sm"
    >
      <span>{label}</span>
      <IoChevronDown className="h-3 w-3 text-[#6B7280] sm:h-3.5 sm:w-3.5" />
    </button>
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
    <div className="px-4 pb-2 pt-5 sm:px-8 sm:pt-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {breadcrumbTrail.map((item, index) => {
            const isLast = index === breadcrumbTrail.length - 1;
            const route = item.id
              ? `/drive/folders/${item.id}`
              : "/drive/my-drive";

            return (
              <React.Fragment key={`${item.id}-${item.label}`}>
                {index > 0 && (
                  <span className="text-xl font-light text-[#D1D5DB] sm:text-2xl">/</span>
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
        <StorageMeter />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6">
        <FilterChip label="Type" />
        <FilterChip label="People" />
        <FilterChip label="Modified" />
      </div>
    </div>
  );
}

export default FileHeader;
