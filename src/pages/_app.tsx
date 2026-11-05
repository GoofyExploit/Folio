import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { type ReactNode } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/headerComponents/Header";
import Navbar from "@/components/Navbar";
import { DriveProvider } from "@/components/DriveProvider";

const inter = Inter({ subsets: ["latin"] });

function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn("google", {
        callbackUrl: router.asPath,
      });
    },
  });

  if (status !== "authenticated") {
    return (
      <main
        className={`${inter.className} flex min-h-screen flex-col items-center justify-center bg-white`}
      >
        <img src="/folio-logo-horizontal.svg" alt="Folio" className="mb-6 h-12" />
        <p className="text-sm text-[#6B7280]">Redirecting to login...</p>
      </main>
    );
  }

  return <>{children}</>;
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const isSharePage = router.pathname.startsWith("/share/");

  const page = isSharePage ? (
    <main className={`${inter.className} min-h-screen bg-[#FAFAF9]`}>
      <Component {...pageProps} />
    </main>
  ) : (
    <AuthGate>
      <DriveProvider>
        <main
          className={`${inter.className} flex h-screen flex-col overflow-hidden bg-white text-[#111827]`}
        >
          <Header />
          <Navbar />
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Component {...pageProps} />
          </section>
        </main>
      </DriveProvider>
    </AuthGate>
  );

  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/folio-icon.svg" type="image/svg+xml" />
      </Head>
      {page}
    </SessionProvider>
  );
};

export default MyApp;
