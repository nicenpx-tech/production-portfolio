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