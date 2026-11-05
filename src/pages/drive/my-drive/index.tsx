import Head from "next/head";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";
import FileHeader from "@/components/FileHeader";
import EmptyState from "@/components/EmptyState";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFetchFiles } from "@/hooks/fetchFiles";
import { useDrive } from "@/components/DriveProvider";
import { DotLoader } from "react-spinners";
import { FiPlus } from "react-icons/fi";

export default function Home() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const { openNewFolder } = useDrive();

  const list = useFetchFiles(
    "",
    session?.user.id ?? "",
    session?.user.email ?? undefined,
  );

  useEffect(() => {
    const hasFolders = list.some((item) => item.isFolder && !item.isTrashed);
    const hasFiles = list.some((item) => !item.isFolder && !item.isTrashed);

    setIsFolder(hasFolders);
    setIsFile(hasFiles);

    setTimeout(() => {
      setIsLoading(false);
    }, 2200);
  }, [list]);

  return (
    <>
      <Head>
        <title>My Drive - Folio</title>
        <meta name="description" content="Folio, a place for all of your files." />
        <link rel="icon" href="/folio-icon.svg" />
      </Head>
      <div className="flex h-full flex-col">
        <FileHeader headerName={"My Drive"} />
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
                      <h2 className="text-sm font-semibold text-[#6B7280]">Folders</h2>
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
                        <GetFolders folderId="" select="" />
                      </div>
                    ) : (
                      <p className="text-xs text-[#9CA3AF]">No folders yet. Click New folder to create one.</p>
                    )}
                  </div>
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-3">
                      <h2 className="text-sm font-semibold text-[#6B7280]">Files</h2>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <GetFiles folderId="" select="" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="Drop files here to start your Folio"
                  subtitle="Documents, photos, folders, anything. Drag them in, or pick them from your device."
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
