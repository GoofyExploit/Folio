import React from "react";
import { FiShare2 } from "react-icons/fi";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MdContentCopy,
  MdDriveFileRenameOutline,
  MdDriveFileMove,
  MdOutlineRestore,
  MdStarBorder,
  MdStarRate,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbDownload } from "react-icons/tb";
import {
  deleteFile,
  moveEntry,
  copyEntry,
  starFile,
  trashFile,
} from "@/API/Files";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TransferDialog from "./TransferDialog";
import ShareDialog from "./ShareDialog";

function FileDropDown({
  file,
  setOpenMenu,
  select,
  isFolderComp,
  folderId,
  setRenameToggle,
}: FileDropDownProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [transferMode, setTransferMode] = React.useState<"move" | "copy" | "">(
    "",
  );
  const [shareOpen, setShareOpen] = React.useState(false);
  const closeMenu = () => setOpenMenu("");

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const downloadFile = async (fileLink: string, downloadName: string) => {
    try {
      const response = await fetch(fileLink);
      if (!response.ok) {
        throw new Error("Unable to download file.");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = downloadName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Unable to download file.",
      );
    }
  };

  return (
    <>
      <section
        onClick={(event) => event.stopPropagation()}
        className="absolute right-0 top-9 z-20 max-h-80 w-48 overflow-y-auto rounded-2xl border border-[#F0EEEB] bg-white py-1.5 text-sm shadow-xl shadow-black/10"
      >
        {select !== "trashed" ? (
          <>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                isFolderComp
                  ? void router.push("/drive/folders/" + folderId)
                  : openFile(file.fileLink);
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
            >
              <HiOutlineArrowsExpand className="h-4 w-4 text-[#6B7280]" />
              <span>Open</span>
            </button>
            {!isFolderComp && (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  void downloadFile(file.fileLink, file.fileName);
                }}
                className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
              >
                <TbDownload className="h-4 w-4 text-[#6B7280]" />
                <span>Download</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                closeMenu();
                setRenameToggle(file.id);
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
            >
              <MdDriveFileRenameOutline className="h-4 w-4 text-[#6B7280]" />
              <span>Rename</span>
            </button>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                void starFile(file.id, !file.isStarred);
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
            >
              {!file.isStarred ? (
                <MdStarBorder className="h-4 w-4 text-[#6B7280]" />
              ) : (
                <MdStarRate className="h-4 w-4 text-[#EA580C]" />
              )}
              <span>{file.isStarred ? "Starred" : "Add star"}</span>
            </button>
            <button
              type="button"
              onClick={() => setTransferMode("move")}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
            >
              <MdDriveFileMove className="h-4 w-4 text-[#6B7280]" />
              <span>Move to</span>
            </button>
            <button
              type="button"
              onClick={() => setTransferMode("copy")}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
            >
              <MdContentCopy className="h-4 w-4 text-[#6B7280]" />
              <span>Make a copy</span>
            </button>
            {!isFolderComp && (
              <button
                type="button"
                onClick={() => {
                  setShareOpen(true);
                }}
                className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
              >
                <FiShare2 className="h-4 w-4 text-[#6B7280]" />
                <span>Share link</span>
              </button>
            )}
            <div className="my-1 border-t border-[#F0EEEB]" />
            <button
              type="button"
              onClick={() => {
                closeMenu();
                void trashFile(file.id, true);
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-red-600 transition hover:bg-red-50"
            >
              <RiDeleteBin6Line className="h-4 w-4" />
              <span>Move to bin</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                void trashFile(file.id, false);
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-[#111827] transition hover:bg-[#FFF7ED]"
            >
              <MdOutlineRestore className="h-4 w-4 text-[#6B7280]" />
              <span>Restore</span>
            </button>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                void deleteFile(
                  file.id,
                  file.isFolder,
                  file.publicId,
                  file.resourceType,
                );
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left font-medium text-red-600 transition hover:bg-red-50"
            >
              <RiDeleteBin6Line className="h-4 w-4" />
              <span>Delete forever</span>
            </button>
          </>
        )}
      </section>
      {transferMode && session?.user.id && (
        <TransferDialog
          item={file}
          mode={transferMode}
          onClose={() => {
            setTransferMode("");
            closeMenu();
          }}
          onConfirm={async (destinationId) => {
            if (transferMode === "move") {
              await moveEntry(
                file,
                destinationId,
                session.user.id,
                session.user.email ?? undefined,
              );
              return;
            }

            await copyEntry(
              file,
              destinationId,
              session.user.id,
              session.user.email ?? undefined,
            );
          }}
        />
      )}
      {shareOpen && !isFolderComp && (
        <ShareDialog
          file={file}
          onClose={() => {
            setShareOpen(false);
            closeMenu();
          }}
        />
      )}
    </>
  );
}

export default FileDropDown;
