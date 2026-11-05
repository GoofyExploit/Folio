"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
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
    <header className="relative flex h-[4.25rem] items-center gap-4 px-5 sm:px-6">
      <Link href="/drive/my-drive" className="flex shrink-0 items-center gap-2.5">
        <img
          src="/folio-icon.svg"
          alt=""
          className="h-9 w-9"
          draggable={false}
        />
        <span className="text-[1.65rem] font-bold tracking-tight text-[#111827]">
          Folio
        </span>
      </Link>

      <div className="min-w-0 flex-1 md:mx-auto md:max-w-xl">
        <Search />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full bg-[#EA580C] py-2 pl-4 pr-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C2410C]"
          >
            <FiUpload className="h-4 w-4" />
            <span>Upload</span>
            <IoChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-[#F0EEEB] bg-white py-1.5 text-sm shadow-lg shadow-black/5">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openFilePicker();
                }}
                className="block w-full px-4 py-2.5 text-left font-medium text-[#111827] hover:bg-[#FFF7ED]"
              >
                Upload files
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openFolderPicker();
                }}
                className="block w-full px-4 py-2.5 text-left font-medium text-[#111827] hover:bg-[#FFF7ED]"
              >
                Upload folder
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openNewFolder();
                }}
                className="block w-full px-4 py-2.5 text-left font-medium text-[#111827] hover:bg-[#FFF7ED]"
              >
                New folder
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (status === "authenticated") {
              setDisplayUserInfo((prev) => !prev);
              return;
            }
            void signIn("google");
          }}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F6E7D8] text-[#9A6B45]"
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
            <HiOutlineUser className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="absolute right-5 top-16 z-40">
        {session && displayUserInfo && (
          <UserInfo setDisplayUserInfo={setDisplayUserInfo} />
        )}
      </div>
    </header>
  );
}

export default Header;
