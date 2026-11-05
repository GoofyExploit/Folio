"use client";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdCheckmarkCircle,
} from "react-icons/io";
import fileIcons from "./fileIcons";

function ProgressIndicator({
  uploads,
  setUploads,
}: ProgressIndicatorProps) {
  const [minimize, setMinimize] = useState(false);
  const activeUploads = uploads.filter((upload) => upload.progress < 100);
  const isUploading = activeUploads.length > 0;

  // show all file name and progress
  const fileNames = uploads.map((upload) => {
    const fileExtension = upload.name.split(".").pop();
    const isReady = upload.progress >= 100 && Boolean(upload.fileLink);
    return (
      <div
        key={upload.id}
        onClick={() => {
          if (!isReady || !upload.fileLink) return;
          window.open(upload.fileLink, "_blank", "noopener,noreferrer");
        }}
        className={`flex items-center justify-between gap-3 bg-white py-2.5 pl-4 pr-3 ${
          isReady ? "cursor-pointer hover:bg-[#FFF7ED]" : "cursor-default"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center space-x-3">
          <div className="h-5 w-5 shrink-0 sm:h-6 sm:w-6">
            {fileExtension && fileIcons[fileExtension]
              ? fileIcons[fileExtension]
              : fileIcons["any"]}
          </div>
          <span className="truncate text-xs font-medium text-[#111827] sm:text-sm">
            {upload.name}
          </span>
        </div>
        {upload.progress < 100 ? (
          <span className="shrink-0 text-xs font-semibold text-[#EA580C] sm:text-sm">
            {upload.progress}%
          </span>
        ) : (
          <IoMdCheckmarkCircle className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" />
        )}
      </div>
    );
  });

  return (
    uploads.length > 0 && (
      <div className="pointer-events-none fixed bottom-4 left-3 right-3 z-30 sm:left-auto sm:right-6 sm:w-[23rem]">
        <div className="pointer-events-auto overflow-hidden rounded-2xl border border-[#F0EEEB] bg-white shadow-xl shadow-black/10">
          <div className="flex items-center justify-between bg-[#FAFAF9] py-2.5 pl-4 pr-2">
            {isUploading ? (
              <h3 className="flex items-center gap-2 text-xs font-semibold text-[#111827] sm:text-sm">
                <span className="animate-pulse">
                  Uploading {activeUploads.length} item{activeUploads.length > 1 && "s"}
                </span>
                <AiOutlineLoading3Quarters className="h-3.5 w-3.5 animate-spin text-[#EA580C]" />
              </h3>
            ) : (
              <h3 className="text-xs font-semibold text-[#111827] sm:text-sm">
                {uploads.length} upload{uploads.length > 1 && "s"} complete
              </h3>
            )}
            <div className="flex items-center">
              <div>
                {minimize ? (
                  <IoIosArrowUp
                    onClick={() => setMinimize(!minimize)}
                    className="h-8 w-8 cursor-pointer rounded-full p-1.5 text-[#6B7280] transition hover:bg-[#F3F4F6]"
                  />
                ) : (
                  <IoIosArrowDown
                    onClick={() => setMinimize(!minimize)}
                    className="h-8 w-8 cursor-pointer rounded-full p-1.5 text-[#6B7280] transition hover:bg-[#F3F4F6]"
                  />
                )}
              </div>
              <AiOutlineClose
                onClick={() => setUploads([])}
                className="h-8 w-8 cursor-pointer rounded-full p-1.5 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              />
            </div>
          </div>
          {!minimize && (
            <div className="flex max-h-56 flex-col divide-y divide-[#F0EEEB] overflow-y-auto sm:max-h-60">
              {fileNames}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default ProgressIndicator;
