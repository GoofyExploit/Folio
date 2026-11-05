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
        className={`flex items-center justify-between bg-white py-2.5 pl-4 pr-2 ${
          isReady ? "cursor-pointer hover:bg-darkC" : "cursor-default"
        }`}
      >
        <div className="flex items-center space-x-3">
          {fileExtension && fileIcons[fileExtension] ? (
            <div className="h-6 w-6">{fileIcons[fileExtension]}</div>
          ) : (
            <div className="h-6 w-6">{fileIcons["any"]}</div>
          )}
          <span className="w-60 truncate">{upload.name}</span>
        </div>
        {upload.progress < 100 ? (
          <span className="pr-2">{upload.progress}%</span>
        ) : (
          <IoMdCheckmarkCircle className="h-9 w-9 p-1.5 pr-2 text-green-600" />
        )}
      </div>
    );
  });

  return (
    uploads.length > 0 && (
      <div className="pointer-events-none fixed bottom-4 right-6 z-30 w-[23rem]">
        <div className="pointer-events-auto overflow-hidden rounded-2xl border border-[#F0EEEB] bg-white shadow-lg shadow-black/10">
          <div className="flex items-center justify-between bg-[#FAFAF9] py-2 pl-4 pr-2">
            {isUploading ? (
              <h3 className="flex items-center space-x-5 font-medium text-textC">
                <span className="animate-pulse">
                  Uploading {activeUploads.length} file{activeUploads.length > 1 && "s"}
                </span>
                <AiOutlineLoading3Quarters className="animate-spin text-green-600" />
              </h3>
            ) : (
              <h3 className="font-medium text-textC">
                {uploads.length} upload{uploads.length > 1 && "s"} complete
              </h3>
            )}
            <div className="flex items-center">
              <div>
                {minimize ? (
                  <IoIosArrowUp
                    onClick={() => setMinimize(!minimize)}
                    className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC"
                    stroke="2"
                  />
                ) : (
                  <IoIosArrowDown
                    onClick={() => setMinimize(!minimize)}
                    className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC"
                    stroke="2"
                  />
                )}
              </div>
              <AiOutlineClose
                onClick={() => setUploads([])}
                className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC"
              />
            </div>
            {/* uploaded files progress */}
          </div>
          {!minimize && (
            <div className="flex max-h-60 flex-col overflow-y-scroll">
              {fileNames}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default ProgressIndicator;
