# Review Widget

> Embeddable review-showcase widget for small businesses. Three steps
> to up-and-running: connect your reviews, customize the widget, drop
> the embed snippet on your site.

```mermaid
flowchart LR
    USER[("👤 business owner")]
    LANDING["🌐 / · landing<br/>+ live demo"]
    AUTH{{"🔐 /auth<br/>Supabase Auth"}}
    DASH["📊 /dashboard<br/>configure widget"]
    API["⚙ /api<br/>reviews · widget JSON"]
    EMBED[/"📦 <script> embed<br/>on customer site"/]
    SITE[("🌍 customer's site<br/>renders widget")]
    PRICING[/"💳 /pricing"/]
    DB[("🗄 Supabase")]

    USER --> LANDING --> AUTH --> DASH --> API --> DB
    DASH --> EMBED --> SITE --> API
    LANDING --> PRICING

    classDef io fill:#0e1116,stroke:#2f81f7,stroke-width:1.5px,color:#e6edf3;
    classDef tool fill:#161b22,stroke:#3fb950,stroke-width:1.5px,color:#e6edf3;
    classDef brain fill:#161b22,stroke:#d29922,stroke-width:1.5px,color:#e6edf3;
    classDef out fill:#0e1116,stroke:#a371f7,stroke-width:1.5px,color:#e6edf3;
    class USER,SITE,DB io;
    class API,LANDING,DASH tool;
    class AUTH brain;
    class EMBED,PRICING out;
```

## Table of contents

- [Stack](#stack)
- [Architecture](#architecture)
- [Embed flow (sequence)](#embed-flow-sequence)
- [Setup steps](#setup-steps)
- [Getting Started](#getting-started)

## Embed flow (sequence)

```mermaid
sequenceDiagram
    participant O as owner
    participant DASH as /dashboard
    participant DB as Supabase
    participant API as /api/widget
    participant SITE as customer site
    participant V as visitor

    O->>DASH: connect reviews source
    DASH->>DB: store config + reviews
    DASH-->>O: copy <script> embed
    O->>SITE: paste embed in HTML
    V->>SITE: page load
    SITE->>API: GET /api/widget?id=XYZ
    API->>DB: fetch reviews
    DB-->>API: latest N
    API-->>SITE: JSON + JS
    SITE-->>V: rendered widget
```

## Setup steps

```mermaid
flowchart LR
    A([sign up])
    B([connect reviews source])
    C([customize widget look])
    D([copy embed snippet])
    E([paste into site])
    Z([live])
    A --> B --> C --> D --> E --> Z
```

## Stack

- Next.js 16 + React 19 + Tailwind CSS 4
- Supabase (auth + database)
- Vercel deployment
- TypeScript strict mode
- Bun package manager

## Architecture

- `/` — Landing page (DemoWidget, PricingSection)
- `/auth` — Supabase auth flows
- `/dashboard` — Configure the widget
- `/pricing` — Plans
- `/api/*` — Widget JSON, reviews ingestion

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).
