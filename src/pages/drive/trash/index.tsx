import Head from "next/head";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";
import FileHeader from "@/components/FileHeader";
import EmptyState from "@/components/EmptyState";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import { DotLoader } from "react-spinners";

export default function Index() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  const list = useFetchAllFiles(
    session?.user.id ?? "",
    session?.user.email ?? undefined,
  );

  useEffect(() => {
    const hasFolders = list.some((item) => item.isFolder && item.isTrashed);
    const hasFiles = list.some((item) => !item.isFolder && item.isTrashed);
    setIsFolder(hasFolders);
    setIsFile(hasFiles);

    setTimeout(() => {
      setIsLoading(false);
    }, 2200);
  }, [list]);

  return (
    <>
      <Head>
        <title>Bin - Folio</title>
        <meta name="description" content="Deleted files in Folio." />
        <link rel="icon" href="/folio-icon.svg" />
      </Head>
      <div className="flex h-full flex-col">
        <FileHeader headerName={"Bin"} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-4 sm:px-8">
          {!isFile && !isFolder && isLoading ? (
            <div className="flex h-full items-center justify-center">
              <DotLoader color="#EA580C" size={48} />
            </div>
          ) : (
            <>
              {isFile || isFolder ? (
                <>
                  {isFolder && (
                    <div className="mb-8 flex flex-col space-y-3">
                      <h2 className="text-sm font-semibold text-[#6B7280]">
                        Folders
                      </h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <GetFolders folderId="" select="trashed" />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-3">
                      <h2 className="text-sm font-semibold text-[#6B7280]">
                        Files
                      </h2>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <GetFiles folderId="" select="trashed" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="Bin is empty"
                  subtitle="Items you move here stay until you delete them for good."
                  showActions={false}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
