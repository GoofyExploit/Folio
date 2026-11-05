import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { AiFillFolder, AiOutlineSearch } from "react-icons/ai";
import fileIcons from "../fileIcons";
import { useRouter } from "next/router";

function Search() {
  const [searchTest, setSearchTest] = useState<string>("");
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: session } = useSession();
  const list = useFetchAllFiles(
    session?.user.id ?? "",
    session?.user.email ?? undefined,
  );

  const router = useRouter();

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const searchList = list.filter((item) => {
    return (
      (item.fileName?.toLowerCase().includes(searchTest.toLowerCase()) &&
        searchTest &&
        !item?.isTrashed) ||
      (item.folderName?.toLowerCase().includes(searchTest.toLowerCase()) &&
        searchTest &&
        !item?.isTrashed)
    );
  });

  const result = searchList.map((item) => {
    const icon =
      fileIcons[item.fileExtension as keyof typeof fileIcons] ??
      fileIcons["any"];
    return (
      <div
        key={item.id}
        onClick={() => {
          item.isFolder
            ? router.push("/drive/folders/" + item.id)
            : openFile(item.fileLink);
        }}
        className="flex w-full cursor-pointer items-center space-x-3.5 px-4 py-2.5 hover:bg-[#FFF7ED]"
      >
        <span className="h-6 w-6">
          {item.isFolder ? (
            <AiFillFolder className="h-full w-full text-[#EA580C]" />
          ) : (
            icon
          )}
        </span>
        <span className="w-full truncate text-sm">
          {item.fileName || item.folderName}
        </span>
      </div>
    );
  });

  const handleDocumentClick = (e: { target: EventTarget | null }) => {
    if (
      inputRef.current &&
      e.target &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setOnFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative w-full" onFocus={() => setOnFocus(true)}>
      <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 text-[#9CA3AF]">
        <AiOutlineSearch className="h-full w-full" />
      </span>
      <input
        ref={inputRef}
        onChange={(e) => setSearchTest(e.target.value)}
        type="text"
        placeholder="Search your files"
        className="w-full rounded-full border border-transparent bg-[#F3F4F6] py-2.5 pl-11 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#E5E7EB] focus:bg-white focus:shadow-sm"
      />
      {onFocus && searchTest && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-[#F0EEEB] bg-white py-2 shadow-lg shadow-black/5">
          {result.length < 1 ? (
            <div className="px-4 py-3 text-sm text-[#6B7280]">
              No results match your search.
            </div>
          ) : (
            result
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
