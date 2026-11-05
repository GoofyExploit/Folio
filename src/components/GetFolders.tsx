import { useFetchFiles } from "@/hooks/fetchFiles";
import React, { useState } from "react";
import { AiFillFolder } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import FileDropDown from "./FileDropDown";
import Rename from "./Rename";

function GetFolders({
  folderId,
  select,
}: {
  folderId: string;
  select: string;
}) {
  const [openMenu, setOpenMenu] = useState("");
  const [renameToggle, setRenameToggle] = useState("");

  const { data: session } = useSession();

  const router = useRouter();
  const userId = session?.user.id ?? "";
  const userEmail = session?.user.email ?? undefined;
  const folderFiles = useFetchFiles(folderId, userId, userEmail);
  const allFiles = useFetchAllFiles(userId, userEmail);
  const folderList = select ? allFiles : folderFiles;

  const handleMenuToggle = (fileId: string) => {
    setRenameToggle("");
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === fileId ? "" : fileId));
    window.dispatchEvent(
      new CustomEvent("drive-menu-open", {
        detail: { fileId, source: "folders" },
      }),
    );
  };

  React.useEffect(() => {
    const handleCloseOtherMenus = (event: Event) => {
      const customEvent = event as CustomEvent<{
        fileId: string;
        source: string;
      }>;
      if (customEvent.detail?.source !== "folders") {
        setOpenMenu("");
        setRenameToggle("");
      }
    };

    window.addEventListener(
      "drive-menu-open",
      handleCloseOtherMenus as EventListener,
    );
    return () => {
      window.removeEventListener(
        "drive-menu-open",
        handleCloseOtherMenus as EventListener,
      );
    };
  }, []);

  const folders = folderList.map((folder) => {
    let condition = folder?.isFolder && !folder?.isTrashed;
    if (select === "starred")
      condition = folder?.isFolder && folder?.isStarred && !folder?.isTrashed;
    else if (select === "trashed")
      condition = folder?.isFolder && folder?.isTrashed;

    return (
      condition && (
        <div
          key={folder.id}
          onDoubleClick={() => {
            if (select !== "trashed") {
              void router.push("/drive/folders/" + folder.id);
            }
          }}
          className="relative flex w-full cursor-alias items-center justify-between rounded-2xl border border-[#F0EEEB] bg-white p-3 shadow-sm shadow-black/[0.03] transition hover:border-[#FDBA74]"
        >
          <div className="flex min-w-0 items-center gap-2">
            <AiFillFolder className="h-5 w-5 shrink-0 text-[#EA580C] sm:h-6 sm:w-6" />
            <span className="truncate text-sm font-medium text-[#111827]">
              {folder.folderName}
            </span>
          </div>
          <BsThreeDotsVertical
            onClick={(event: React.MouseEvent<SVGElement>) => {
              event.stopPropagation();
              if (folder.id) {
                handleMenuToggle(folder.id);
              }
            }}
            className="h-6 w-6 shrink-0 cursor-pointer rounded-full p-1 hover:bg-[#ccc]"
          />
          {openMenu === folder.id && (
            <FileDropDown
              file={{
                ...folder,
                folderName: folder.folderName ?? "",
                isFolder: folder.isFolder ?? true,
                isStarred: folder.isStarred ?? false,
                isTrashed: folder.isTrashed ?? false,
                id: folder.id ?? "",
                fileLink: folder.fileLink ?? "",
                fileName: folder.fileName ?? "",
                fileExtension: folder.fileExtension ?? "",
                folderId: folder.folderId ?? "",
              }}
              setOpenMenu={setOpenMenu}
              isFolderComp={true}
              select={select}
              folderId={folder.id}
              setRenameToggle={setRenameToggle}
            />
          )}
          {renameToggle === folder.id && (
            <Rename
              setRenameToggle={setRenameToggle}
              fileId={folder.id}
              fileName={folder.folderName ?? ""}
              isFolder={folder.isFolder ?? true}
              fileExtension=""
            />
          )}
        </div>
      )
    );
  });

  return folders;
}

export default GetFolders;
