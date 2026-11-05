import React from "react";
import { PiSignOutBold } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

function UserInfo({ setDisplayUserInfo }: UserInfoProps) {
  const { data: session } = useSession();
  return (
    <div className="relative z-10 flex w-72 flex-col items-center justify-center space-y-3 rounded-3xl border border-[#F0EEEB] bg-white px-5 py-5 text-sm text-[#111827] shadow-xl shadow-black/10">
      <button
        onClick={() => setDisplayUserInfo(false)}
        className="absolute right-3 top-3 rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6]"
        aria-label="Close"
      >
        <AiOutlineClose className="h-4 w-4" />
      </button>
      <div className="h-16 w-16 overflow-hidden rounded-full bg-[#F6E7D8]">
        {session?.user.image ? (
          <Image
            src={session.user.image}
            className="h-full w-full object-cover"
            height={128}
            width={128}
            draggable={false}
            alt=""
          />
        ) : null}
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Hi, {session?.user.name}</h2>
        <p className="mt-1 text-xs text-[#6B7280]">{session?.user.email}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E5E7EB] py-2.5 font-medium hover:bg-[#FFF7ED]"
      >
        <PiSignOutBold className="h-4 w-4" />
        <span>Sign out</span>
      </button>
    </div>
  );
}

export default UserInfo;
