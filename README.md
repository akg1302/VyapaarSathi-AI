# VyapaarSathi AI

> The AI Business Command Center for Indian MSMEs.

VyapaarSathi AI helps Kirana stores and other small businesses turn everyday operations into clear decisions. It brings sales, inventory, customers, invoices, expenses, reminders, business health, and AI-led action plans into one premium workspace.

## Why it matters

Indian MSMEs often manage their business through scattered notebooks, WhatsApp messages, and spreadsheets. That creates blind spots: stockouts, delayed collections, unclear profitability, and missed growth opportunities. VyapaarSathi AI makes those signals visible and actionable.

## Highlights

- AI Business Command Center with health score, CEO brief, alerts, and opportunities
- Deterministic specialist agents for inventory, finance, customers, reminders, analytics, and growth
- AI Action Center for reviewable, one-click business workflows
- Growth Advisor for cross-sell, upsell, bundle, seasonal, and product-movement ideas
- Demo Mode with a complete Indian Kirana Store scenario
- Presentation Mode for a polished hackathon walkthrough
- PDF AI Business Report export
- Supabase-ready clean backend architecture with mock mode for demos

## Tech stack

Next.js · TypeScript · Tailwind CSS · Supabase · OpenAI Responses API · Recharts · React Hook Form · Zod · Lucide · jsPDF

## Quick start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000` and select **Load Demo Business** on the dashboard for an instant Kirana Store demonstration.

### Environment

```env
USE_MOCK_DATA=true
DEV_USER_ID=00000000-0000-4000-8000-000000000001

# Optional: enables Manager Agent synthesis through OpenAI
OPENAI_API_KEY=
OPENAI_MANAGER_MODEL=gpt-5.6
OPENAI_MANAGER_TIMEOUT_MS=15000
```

When no API key is configured, the system uses deterministic, business-aware reasoning so every demo remains reliable.

## Documentation

The complete hackathon pack—including architecture, demo flow, two-minute pitch, innovation, future scope, and 20 judge questions—is in [docs/HACKATHON_SUBMISSION.md](docs/HACKATHON_SUBMISSION.md).

API reference: [docs/api.md](docs/api.md).

## License

Released under the [MIT License](LICENSE).
