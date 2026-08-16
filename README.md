# Resume Tailor

[Resume Tailor](https://github.com/Edwinfom00/resume-tailor) is a multilingual workspace for adapting a CV to a specific job opportunity. Upload a PDF or DOCX resume, provide a job description or URL, review the matching analysis, apply only the changes you approve, and export a polished PDF.

The project is free and open source. It is designed around a privacy-first workflow: the application has no database or server-side document store, while the working session is kept in the browser through local storage.

## Highlights

- Parse resumes from PDF and DOCX files up to 10 MB.
- Extract structured requirements from pasted job descriptions or job URLs.
- Compare a CV against a job opportunity with deterministic matching, then optionally enrich the result with AI.
- Generate actionable, evidence-based recommendations for the profile, experience, projects, and skills sections.
- Apply, edit, ignore, undo, and redo resume changes before exporting.
- Use the AI copilot to propose changes without inventing qualifications or modifying the CV automatically.
- Export an ATS-friendly PDF from the edited resume.
- Work in English, French, or German with locale-prefixed URLs.

## Stack

- [Next.js 16](https://nextjs.org/) with the App Router and React 19
- TypeScript with strict compiler settings
- Tailwind CSS 4 and design tokens
- Zustand for persisted browser-side session state
- Zod for request and domain validation
- Vercel AI SDK with DeepSeek for optional AI enrichment
- `unpdf` and `mammoth` for document text extraction
- `jspdf` and `html2canvas` for PDF export

## Prerequisites

- A current Node.js LTS release
- npm
- A DeepSeek API key only when AI-powered structuring, semantic enrichment, or the copilot is required

## Getting started

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Edwinfom00/resume-tailor.git
cd resume-tailor
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

On PowerShell:

```powershell
Copy-Item .env.example .env
```

Set `DEEPSEEK_API_KEY` in `.env` when you want to enable AI features, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requests without a locale redirect to the preferred supported language. The supported routes are:

| Route | Purpose |
| --- | --- |
| `/en`, `/fr`, `/de` | Landing page |
| `/:locale/upload` | Upload a CV and add a job opportunity |
| `/:locale/studio` | Review the match, edit the CV, and export it |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | Optional | Enables DeepSeek-backed resume and job structuring, semantic comparison, suggestion enrichment, and the copilot. |

Without `DEEPSEEK_API_KEY`, the upload and analysis workflow uses its deterministic parsers and matching engine. The AI copilot requires the key.

Never commit `.env` files or API keys. Use `.env.example` as the safe template for local setup.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the production build. |
| `npm run start` | Run the production server after building. |
| `npm run lint` | Run ESLint. |
| `npx tsc --noEmit` | Type-check the project. |

## Application workflow

1. Upload a PDF or DOCX CV.
2. Paste a job description or enter a job posting URL.
3. Review extracted job requirements and run the analysis.
4. Inspect the overall score, requirement matches, and section-level recommendations.
5. Apply or edit the suggestions you want. Each change can be undone or redone.
6. Use the copilot for additional proposals when AI is configured.
7. Export the finished CV as a PDF.

## Architecture

```text
src/
├── app/                  # Locale routes, API routes, metadata, global styles
├── components/           # Shared branding, navigation, and internationalization UI
├── i18n/                 # Locales, dictionary loading, and message schema
├── modules/
│   ├── resume/           # Parsing, normalization, validation, editing, and PDF export
│   ├── job/              # Job URL/text extraction and requirement structuring
│   ├── analysis/         # Deterministic matching, scoring, and suggestions
│   ├── ai/               # DeepSeek model integration and structured generation
│   ├── copilot/          # Safe proposal validation and conversation context
│   ├── session/          # Zustand session store, history, and API client
│   ├── upload/           # CV and job-input workflow
│   ├── studio/           # Analysis workspace and recommendation UI
│   └── landing/          # Marketing site sections and landing preview
├── styles/               # Shared design tokens
└── @types/               # Cross-module application types
```

The browser-side session is persisted under the `resume-tailor-session` local-storage key. There is no application database or server-side file storage layer.

## API routes

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/resume/extract` | `POST` | Validates and extracts a PDF or DOCX resume. |
| `/api/job/extract` | `POST` | Extracts a job offer from pasted text or a URL. |
| `/api/analysis/run` | `POST` | Runs CV-to-job matching and produces suggestions. |
| `/api/copilot` | `POST` | Produces validated copilot responses and proposed resume actions. |
| `/api/locale?locale=:locale` | `POST` | Persists the selected locale in a cookie. |

## AI safety model

The copilot proposes actions; it never edits the resume silently. Proposed changes are validated against the resume evidence and are constrained not to invent employers, dates, technologies, metrics, qualifications, or achievements. The user must explicitly apply every change.

## Internationalization

The application supports `en`, `fr`, and `de`.

- Locale routing and fallback behavior live in `src/i18n/locales.ts` and `src/proxy.ts`.
- Dictionaries are loaded server-side through `getDictionary(locale)`.
- `src/i18n/messages/types.ts` is the shared contract for every message.
- When adding UI copy, add the semantic key to the schema and translate it in all three locale files.

## Contributing

1. Create a focused branch from the current default branch.
2. Keep modules small and preserve the existing domain boundaries.
3. Use the tokens in `src/styles/tokens.css` for interface styling.
4. Add translations for every user-facing string.
5. Run the checks before opening a pull request:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## License

This repository does not currently include a license file. Add an explicit license before distributing or reusing the code outside the project.
