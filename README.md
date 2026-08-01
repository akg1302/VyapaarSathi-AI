# VyapaarSathi AI

A premium Next.js UI for an Indian MSME business assistant. This release intentionally uses realistic mock data; AI and Supabase workflows are not connected yet.

## Run locally

1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` when you are ready to connect Supabase.
4. Run `npm run dev`.

## Backend architecture

All endpoint responses use `{ data }` for success and `{ error: { message } }` for failures. During development, `USE_MOCK_DATA=true` uses an in-memory repository; it needs an `x-user-id` header (or `DEV_USER_ID`) to scope data.

| Resource | Collection | Item |
| --- | --- | --- |
| User profile | `GET/POST/PATCH/DELETE /api/users/me` | — |
| Products, customers, invoices, sales, expenses, reminders, logs | `GET/POST /api/{resource}` | `GET/PATCH/DELETE /api/{resource}/:id` |

The Supabase schema, enums, indexes, RLS policies, and relationships are in `supabase/migrations/20260731_initial_schema.sql`. Apply it in the Supabase SQL editor or through the Supabase CLI before setting `USE_MOCK_DATA=false`.

## Agent engine

`POST /api/run-business` runs inventory, finance, customer, reminder, and analytics agents sequentially through the manager agent. The response is a deterministic business report and each specialist result plus the consolidated report is persisted to `agent_logs`. The engine makes no OpenAI calls.

`POST /api/growth-advisor` runs a separate deterministic Growth Advisor. It identifies revenue opportunities, cross-sell and upsell ideas, bundles, seasonal suggestions, plus fast- and slow-moving products; recommendations are persisted in `growth_recommendations`.

The **AI Action Center** turns those signals into persistent, reviewable work. It supports one-click simulated execution of purchase orders, follow-ups, reminders, restock plans, reports, and GST checklists; every completion is recorded in `agent_logs`.

When `OPENAI_API_KEY` is configured, only the Manager Agent calls the OpenAI Responses API to turn completed specialist outputs into the CEO Brief. Responses use strict JSON-schema output, timeout and retry handling, and deterministic fallback. Every final brief is persisted in `ceo_briefs`.

## Included

- Next.js 15 App Router + TypeScript
- Responsive dashboard navigation and dark mode
- Landing, authentication, inventory, invoice, customer, report and agent-log screens
- Recharts sales/inventory visualizations and React Hook Form + Zod authentication forms
- A small Supabase client factory prepared for future auth/data integration
- Clean API → service → repository layers with Zod contracts and mock repositories
