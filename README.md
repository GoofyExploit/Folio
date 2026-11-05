# Folio — Cloud Storage

A cloud-based file manager built with Next.js, NextAuth, PostgreSQL, Prisma, and Cloudinary.

## Features

- Google sign-in via NextAuth
- File and folder creation, rename, move, copy, trash, and restore
- Cloudinary-backed file uploads and delivery
- Nested folders with breadcrumbs
- Folder upload support
- Storage usage tracking with a `200 MB` per-user limit
- Starred items and trash views
- Public file sharing with `Only you` or `Anyone with the link`
- Responsive UI for desktop and mobile

## Tech Stack

**Next.js** | **TypeScript** | **React** | **Tailwind CSS** | **NextAuth.js** | **Prisma** | **PostgreSQL** | **Cloudinary**

## Local Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in the required values.
4. Push the Prisma schema:

```bash
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Use [`.env.example`](./.env.example) as the template.

Required variables:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Architecture

- **PostgreSQL** (via Prisma) stores accounts, sessions, and file/folder metadata.
- **Cloudinary** stores uploaded file assets under `folio/{userId}/...`.
- Public share links are backed by PostgreSQL metadata and served through `/share/[token]`.

## Deployment

Before deploying:

1. Set all environment variables in your hosting provider.
2. Use a production-ready PostgreSQL `DATABASE_URL`.
3. Run `npx prisma db push`.
4. Verify your Google OAuth app includes the correct callback URL: `/api/auth/callback/google`.
5. Ensure Cloudinary credentials are valid and server-side secrets are not exposed as `NEXT_PUBLIC_*`.

Build and start:

```bash
npm run build
npm run start
```

## License

MIT License.
