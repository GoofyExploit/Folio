"use client";

import { useState } from "react";
import { useDrive } from "./DriveProvider";

function EmptyState({
  title,
  subtitle,
  showActions = true,
}: {
  title: string;
  subtitle: string;
  showActions?: boolean;
}) {
  const { openFilePicker, openNewFolder, uploadDroppedFiles } = useDrive();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        if (!showActions) return;
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        if (!showActions) return;
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files.length > 0) {
          void uploadDroppedFiles(event.dataTransfer.files);
        }
      }}
      className={`flex min-h-[26rem] flex-1 flex-col items-center justify-center rounded-[1.75rem] border border-dashed px-6 py-16 text-center transition ${
        isDragging
          ? "border-[#EA580C] bg-[#FFF7ED]"
          : "border-[#D6D3D1] bg-[#FCFCFB]"
      }`}
    >
      <img
        src="/folio-icon.svg"
        alt=""
        className="mb-6 h-16 w-16"
        draggable={false}
      />
      <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#6B7280]">{subtitle}</p>
      {showActions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={openFilePicker}
            className="rounded-full bg-[#EA580C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C2410C]"
          >
            Upload files
          </button>
          <button
            type="button"
            onClick={openNewFolder}
            className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]"
          >
            New folder
          </button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
