# production-portfolio

### Project Structure
```
portfolio/

apps/
├── web/                            Next.js
└── api/                            Go API

packages/
├── ui/                             Shared UI Components
    ├── src/
    │   ├── button/
    │   ├── card/
    │   ├── input/
    │   ├── modal/
    │   ├── typography/
    │   └── ...
    │
    ├── stories/
    │   ├── button.stories.tsx
    │   ├── input.stories.tsx
    │   └── ...
    │
    ├── package.json
    └── .storybook/                 
├── config/                         Shared Config
├── types/                          Shared Types
├── shared/                         Shared SDK / Utils (ใช้ข้าม app)
```
------------------------------------------------------------------------

### Dependency Diagram (Production)
```
                           ┌─────────────────────────────┐
                           │         Next.js App         │
                           │      app/(routes)/...       │
                           └──────────────┬──────────────┘
                                          │
                                          ▼
                              ┌────────────────────┐
                              │      Features      │
                              │ auth / blog / etc. │
                              └─────────┬──────────┘
                                        │
                  ┌─────────────────────┼─────────────────────┐
                  ▼                     ▼                     ▼
          shared/api            shared/hooks         shared/validation
                  │                     │                     │
                  ├──────────────┬──────┴──────────────┐
                  ▼              ▼                     ▼
            shared/lib     shared/utils      shared/constants/config
                  │
                  ▼
        Third-party Libraries
 (Axios, TanStack Query, Zod, Dayjs, next-intl, etc.)
                  │
                  ▼
         Next.js BFF (/api/*)
                  │
                  ▼
             Go Backend API
                  │
                  ▼
           Neon PostgreSQL
```
----------------------------------------------------------------------------------

### Architecture
```
                  Browser
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
  Server Components          Client Components
          │                           │
          │                    TanStack Query
          │                           │
          └─────────────┬─────────────┘
                        ▼
             shared/api (Request Wrapper)
                        │
                        ▼
         app/api/* (Route Handlers / BFF)
                        │
                        ▼
                  Go Backend API
                        │
                        ▼
                 Neon PostgreSQL
```
