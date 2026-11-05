import React from "react";
import { useRouter } from "next/router";
import GetFolders from "@/components/GetFolders";
import GetFiles from "@/components/GetFiles";
import Head from "next/head";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import { useSession } from "next-auth/react";
import { useFetchFiles } from "@/hooks/fetchFiles";
import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import { useDrive } from "@/components/DriveProvider";
import { DotLoader } from "react-spinners";
import { FiPlus } from "react-icons/fi";

function Folder() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { Folder } = router.query;

  const { data: session } = useSession();
  const { openNewFolder } = useDrive();
  const currentFolderId = Folder?.[1] || "";

  // Fetch the list of files and folders
  const list = useFetchFiles(
    currentFolderId,
    session?.user.id ?? "",
    session?.user.email ?? undefined,
  );
  const allFiles = useFetchAllFiles(
    session?.user.id ?? "",
    session?.user.email ?? undefined,
  );
  const currentFolder = allFiles.find(
    (item) => item.id === currentFolderId && item.isFolder,
  );
  const headerName = currentFolder?.folderName || "Folder";
  const breadcrumbs = React.useMemo(() => {
    if (!currentFolderId) return [{ id: "", label: "My Drive" }];

    const folderMap = new Map(
      allFiles.filter((item) => item.isFolder).map((item) => [item.id, item]),
    );
    const trail = [];
    let pointer = folderMap.get(currentFolderId);

    while (pointer) {
      trail.unshift({
        id: pointer.id,
        label: pointer.folderName || "Folder",
      });

      if (!pointer.folderId) break;
      pointer = folderMap.get(pointer.folderId);
    }

    return [{ id: "", label: "My Drive" }, ...trail];
  }, [allFiles, currentFolderId]);

  useEffect(() => {
    const hasFolders = list.some((item) => item.isFolder);
    const hasFiles = list.some((item) => !item.isFolder);

    setIsFolder(hasFolders);
    setIsFile(hasFiles);

    setTimeout(() => {
      setIsLoading(false);
    }, 2200);
  }, [list]);

  return (
    <>
      <Head>
        <title>{`${headerName} - Folio`}</title>
        <meta name="description" content="A folder in Folio." />
        <link rel="icon" href="/folio-icon.svg" />
      </Head>
      <div className="flex h-full flex-col">
        <FileHeader headerName={headerName} breadcrumbs={breadcrumbs} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-4 sm:px-8">
          {!isFile && !isFolder && isLoading ? (
            <div className="flex h-full items-center justify-center">
              <DotLoader color="#EA580C" size={48} />
            </div>
          ) : (
            <>
              {isFile || isFolder ? (
                <>
                  <div className="mb-8 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-[#6B7280]">
                        Folders
                      </h2>
                      <button
                        type="button"
                        onClick={openNewFolder}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#EA580C] transition hover:bg-[#FFF7ED]"
                      >
                        <FiPlus className="h-3.5 w-3.5" strokeWidth={2.5} />
                        <span>New folder</span>
                      </button>
                    </div>
                    {isFolder ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <GetFolders folderId={currentFolderId} select={""} />
                      </div>
                    ) : (
                      <p className="text-xs text-[#9CA3AF]">No subfolders yet. Click New folder to create one.</p>
                    )}
                  </div>
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-3">
                      <h2 className="text-sm font-semibold text-[#6B7280]">
                        Files
                      </h2>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <GetFiles folderId={currentFolderId} select={""} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="This folder is empty"
                  subtitle="Drop files here, or create a new folder inside it."
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Folder;
