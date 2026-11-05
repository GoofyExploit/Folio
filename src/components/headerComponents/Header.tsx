"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiUpload, FiPlus } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import { IoChevronDown } from "react-icons/io5";
import UserInfo from "./UserInfo";
import Search from "./Search";
import { useDrive } from "../DriveProvider";

function Header() {
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { openFilePicker, openFolderPicker, openNewFolder } = useDrive();

  return (
    <header className="relative flex h-14 items-center gap-2 px-3 sm:h-[4.25rem] sm:gap-4 sm:px-6">
      {/* Logo */}
      <Link href="/drive/my-drive" className="flex shrink-0 items-center gap-2">
        <img
          src="/folio-icon.svg"
          alt=""
          className="h-7 w-7 sm:h-9 sm:w-9"
          draggable={false}
        />
        <span className="hidden text-[1.4rem] font-bold tracking-tight text-[#111827] sm:block sm:text-[1.65rem]">
          Folio
        </span>
      </Link>

      {/* Search — grows to fill available space */}
      <div className="min-w-0 flex-1 sm:mx-auto sm:max-w-xl">
        <Search />
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Plus / New folder button */}
        <button
          type="button"
          onClick={openNewFolder}
          title="Create new folder"
          aria-label="Create new folder"
          className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-2.5 py-2 text-sm font-semibold text-[#111827] shadow-sm transition hover:border-[#EA580C] hover:bg-[#FFF7ED] hover:text-[#EA580C] sm:px-3.5"
        >
          <FiPlus className="h-4 w-4 text-[#EA580C]" strokeWidth={2.5} />
          <span className="hidden md:inline">New folder</span>
        </button>

        {/* Upload button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-full bg-[#EA580C] py-2 pl-3 pr-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C2410C] sm:gap-2 sm:pl-4 sm:pr-3"
          >
            <FiUpload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
            <IoChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-[#F0EEEB] bg-white py-1.5 text-sm shadow-lg shadow-black/5 sm:w-48">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); openFilePicker(); }}
                className="block w-full px-4 py-2.5 text-left font-medium text-[#111827] hover:bg-[#FFF7ED]"
              >
                Upload files
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); openFolderPicker(); }}
                className="block w-full px-4 py-2.5 text-left font-medium text-[#111827] hover:bg-[#FFF7ED]"
              >
                Upload folder
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); openNewFolder(); }}
                className="block w-full px-4 py-2.5 text-left font-medium text-[#111827] hover:bg-[#FFF7ED]"
              >
                New folder
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          type="button"
          onClick={() => {
            if (status === "authenticated") {
              setDisplayUserInfo((prev) => !prev);
              return;
            }
            void signIn("google");
          }}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#F6E7D8] text-[#9A6B45] sm:h-10 sm:w-10"
          aria-label="Account"
        >
          {session?.user.image ? (
            <Image
              src={session.user.image}
              className="h-full w-full object-cover"
              height={80}
              width={80}
              draggable={false}
              alt=""
            />
          ) : (
            <HiOutlineUser className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>

      {/* User info dropdown */}
      <div className="absolute right-3 top-14 z-40 sm:right-5 sm:top-16">
        {session && displayUserInfo && (
          <UserInfo setDisplayUserInfo={setDisplayUserInfo} />
        )}
      </div>
    </header>
  );
}

export default Header;
