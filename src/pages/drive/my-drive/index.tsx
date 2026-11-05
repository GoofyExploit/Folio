import Head from "next/head";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";
import FileHeader from "@/components/FileHeader";
import EmptyState from "@/components/EmptyState";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFetchFiles } from "@/hooks/fetchFiles";
import { DotLoader } from "react-spinners";

export default function Home() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pb-8 pt-4">
          {!isFile && !isFolder && isLoading ? (
            <div className="flex h-full items-center justify-center">
              <DotLoader color="#EA580C" size={48} />
            </div>
          ) : (
            <>
              {isFile || isFolder ? (
                <>
                  {isFolder && (
                    <div className="mb-8 flex flex-col space-y-4">
                      <h2 className="text-sm font-semibold text-[#6B7280]">
                        Folders
                      </h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-4">
                        <GetFolders folderId="" select="" />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2 className="text-sm font-semibold text-[#6B7280]">
                        Files
                      </h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-4">
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
