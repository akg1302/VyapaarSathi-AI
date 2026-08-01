# API reference

All APIs are scoped to the current user. Until Supabase Auth is wired to the UI, use the `x-user-id` request header or set `DEV_USER_ID` locally. IDs are UUIDs and timestamps must use ISO 8601 format.

## Resource endpoints

For `products`, `customers`, `invoices`, `sales`, `expenses`, `reminders`, and `agent-logs`:

- `GET /api/{resource}?limit=50&offset=0` — list
- `POST /api/{resource}` — create
- `GET /api/{resource}/{id}` — retrieve
- `PATCH /api/{resource}/{id}` — partial update
- `DELETE /api/{resource}/{id}` — delete

`/api/users/me` supports `GET`, `POST`, `PATCH`, and `DELETE` for the authenticated user profile.

## Example

```json
POST /api/products
{
  "name": "Basmati Rice",
  "unit": "bag",
  "quantity": 20,
  "reorder_level": 8,
  "cost_price": 900,
  "selling_price": 1200
}
```

Errors use `{"error":{"message":"…","details":{}}}`. Validation errors return HTTP 400; absent records return 404; missing user identity returns 401.

## Business agent workflow

`POST /api/run-business` has no request body. It runs the inventory, finance, customer, reminder, and analytics agents sequentially through the manager agent. The response contains a `BusinessReport` with specialist outputs, merged recommendations, confidence, and deterministic metrics. Six agent-log entries are written per successful run: five specialist outputs and one consolidated report.

When `OPENAI_API_KEY` is set, the Manager Agent uses the Responses API to produce the structured CEO brief: CEO brief, health explanation, five priorities, risks, growth opportunities, and suggested next actions. A missing key, malformed response, timeout, or exhausted retries returns the deterministic version instead. Final briefs are stored in `ceo_briefs`.

## Growth Advisor

- `POST /api/growth-advisor` runs deterministic sales, customer, inventory, and profit analysis. It persists the generated recommendations and records an agent log.
- `GET /api/growth-advisor` returns persisted growth recommendations for the current user.

Each recommendation includes its category, estimated revenue increase, confidence, priority, related product IDs, and lifecycle status.

## AI Action Center

- `GET /api/action-center` lists the current user's actionable AI tasks.
- `POST /api/action-center` creates a validated action task.
- `POST /api/action-center/{id}/execute` marks an action as completed, generates a simulated result, and persists an execution audit entry in `agent_logs`.

Supported actions are supplier purchase orders, WhatsApp reminders, customer follow-ups, inventory restock plans, weekly sales reports, and GST checklists.
