This is a multilingual [Next.js](https://nextjs.org) application for tailoring resumes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application uses locale-prefixed routes:

- `/en`
- `/fr`
- `/de`

Requests without a locale are redirected to the saved preference or the browser's preferred supported language, with English as the fallback.

## Internationalization

Translations are grouped by feature namespace in `src/i18n/messages`. The `Messages` schema in `src/i18n/messages/types.ts` is the source of truth, and every locale must satisfy it at build time.

Use the following conventions when adding translated content:

- Add semantic keys to the relevant namespace in `Messages`.
- Add the English source text in `en.ts`.
- Add the matching French and German translations in `fr.ts` and `de.ts`.
- Load dictionaries only in Server Components through `getDictionary(locale)`.
- Keep locale-independent labels and routing behavior in `src/i18n`.

The locale switcher preserves the current route and persists the selected locale in a cookie.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
