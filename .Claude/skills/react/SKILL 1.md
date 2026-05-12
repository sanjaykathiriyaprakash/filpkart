---
name: react-typescript-trustudio
description: >
  React + TypeScript development patterns and best practices for the TruStudio project.
  Use this skill whenever writing, editing, or reviewing any frontend code in the TruStudio
  client/ package — including new components, hooks, RTK Query slices, Redux slices, form
  logic, routing, or anything in client/src/. Also trigger for architecture questions about
  the frontend, adding new pages or features, or when the user asks how something should be
  structured on the client side. Always consult this skill before generating or modifying
  any .tsx or .ts file inside client/.
---
 
# React + TypeScript – TruStudio Client
 
> **Scope:** `client/` package only. The server is NestJS (see `nestjs-typescript-sequelize` skill). Never import server code from the client or vice versa.
 
---
 
## 1. Stack at a Glance
 
| Concern | Technology |
|---|---|
| Framework | React 18 + TypeScript (TSX) |
| Build | Vite |
| Styling | Tailwind CSS |
| Global state | Redux Toolkit (6 slices) |
| Server state / fetching | RTK Query via `services/api.ts` |
| HTTP layer | Axios interceptor (auth token injection, error normalization) |
| Forms | react-hook-form + Yup schemas (`schemas/`) |
| Routing | React Router v6 — `PrivateRoutes` / `PublicRoutes` |
| Linting | ESLint + Prettier |
 
---
 
## 2. Folder Structure
 
```
client/src/
├── App.tsx                        # Entry point – conditionally renders private/public routes
├── routes/
│   ├── PrivateRoutes.tsx          # Authenticated routes (lazy-loaded)
│   └── PublicRoutes.tsx           # Public routes (lazy-loaded)
├── components/
│   ├── Common/                    # Purely presentational, no API calls
│   ├── Form/                      # Reusable form primitives (InputField, SelectField…)
│   ├── Layouts/                   # Layout.tsx, Sidebar.tsx
│   ├── Modal/                     # Modal wrappers
│   └── VideoEditor/               # Complex editor with Timeline, Overlays, Templates
├── constants/                     # Static data: route paths, AI models, banner types…
│   └── path.ts                    # ← ALL route strings live here, never hardcode URLs
├── hooks/                         # Custom hooks (no API calls in Common components)
├── interfaces/                    # Shared TS types (see §4)
├── pages/                         # Route-level components + co-located hooks
├── schemas/                       # Yup validation schemas
├── services/                      # RTK Query slices (all server state)
│   ├── api.ts                     # createApi() base config
│   └── baseQuery.ts               # fetchBaseQuery + auth header
├── store/
│   ├── slices/                    # 6 Redux slices (see §6)
│   ├── rootReducer.ts
│   └── store.ts
├── theme/
├── utils/                         # Pure TS utility functions
└── contexts/                      # React Context (non-global, app-specific state)
```
 
---
 
## 3. Component Anatomy (required section order)
 
Every functional component must follow this internal ordering:
 
```tsx
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Component state
  const [isOpen, setIsOpen] = useState(false);
 
  // 2. Custom hooks
  const { page, setPage } = usePagination();
 
  // 3. Redux state & dispatch
  const dispatch = useDispatch();           // via useRedux hook (see §5)
  const user = useSelector(selectUser);     // via useRedux hook
 
  // 4. RTK Query / side effects
  const { data, isLoading } = useGetVideosQuery({ page });
  useEffect(() => { /* ... */ }, [data]);
 
  // 5. JSX return
  return <div>…</div>;
};
```
 
---
 
## 4. TypeScript & Type Safety
 
- **Strong typing everywhere** — all props, API payloads, Redux state, hook return values.
- **Interface files** are named `{module-name}.interface.ts` and colocated with their module.
  - Shared cross-module types → `interfaces/types.ts`
  - Route shapes → `interfaces/routes.interface.ts`
- Prefer `interface` over `type` for object shapes; use `type` for unions/intersections.
- Never use `any`. Use `unknown` + type guards where the shape is truly dynamic.
```ts
// Good
interface VideoJob {
  videoId: string;
  model: 'veo3' | 'sora2';
  prompt: string;
  imageKeys: string[];
}
 
// Bad
const handleJob = (job: any) => { … }
```
 
---
 
## 5. State Management Rules
 
### Redux Toolkit (global UI state)
 
Use only the typed wrappers — **never** import `useDispatch` / `useSelector` directly:
 
```ts
// hooks/useRedux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
 
**Existing slices** (do not duplicate; extend when needed):
 
| Slice | Owns |
|---|---|
| `userSlice` | Logged-in profile, auth token |
| `settingsSlice` | User app settings |
| `videoGeneratorSlice` | Generator form state, model selection, filters |
| `videoProgressSlice` | AI video job polling state |
| `personalizedVideoProgressSlice` | Personalisation job polling state |
| `videoEditorSlice` | Timeline, overlays, template config, layers |
 
### RTK Query (server state)
 
- **All** server data goes through RTK Query — never use raw `fetch` or `axios` in components.
- Mutations (create/update/delete) must `invalidatesTags` to keep the cache coherent.
- API base URL comes from `VITE_API_BASE_URL`; never hardcode.
```ts
// services/videoApi.ts pattern
export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: fetchBaseQuery({ … }),
  tagTypes: ['Video'],
  endpoints: (builder) => ({
    getVideos: builder.query<VideoListResponse, PaginationParams>({
      query: ({ page, limit }) => `/videos?page=${page}&limit=${limit}`,
      providesTags: ['Video'],
    }),
    generateVideo: builder.mutation<VideoResponse, GenerateVideoDto>({
      query: (body) => ({ url: '/agent/generate-video', method: 'POST', body }),
      invalidatesTags: ['Video'],
    }),
  }),
});
```
 
---
 
## 6. Routing
 
- All route path strings → `constants/path.ts`. **Never** hardcode `/videos`, `/editor`, etc.
- Routes are **lazy-loaded** via `React.lazy` + `<Suspense>` in `PrivateRoutes.tsx` / `PublicRoutes.tsx`.
- Protected routes wrap with the auth guard inside `PrivateRoutes.tsx`.
```tsx
// routes/PrivateRoutes.tsx
const VideoGenerator = React.lazy(() => import('../pages/VideoGenerator'));
const VideoEditorPage = React.lazy(() => import('../pages/VideoEditorPage'));
 
const PrivateRoutes: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path={PATHS.VIDEO_GENERATOR} element={<VideoGenerator />} />
      <Route path={PATHS.EDITOR} element={<VideoEditorPage />} />
    </Routes>
  </Suspense>
);
```
 
---
 
## 7. Forms
 
- Use **react-hook-form** for all forms; co-locate the Yup schema in `schemas/`.
- Never manage form field state with `useState` — let react-hook-form own it.
- Use the pre-built `Form/` components (`InputField`, `SelectField`, `TextAreaField`) for consistent styling.
```tsx
// Example — schemas/videoGenerator.ts
export const videoGeneratorSchema = yup.object({
  prompt: yup.string().required('Prompt is required').min(10),
  model: yup.mixed<'veo3' | 'sora2'>().oneOf(['veo3', 'sora2']).required(),
});
 
// Component
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(videoGeneratorSchema),
});
```
 
---
 
## 8. Error Handling
 
- Wrap top-level routes (and any large independently-renderable subtrees) in an **Error Boundary** component.
- Use RTK Query's `isError` / `error` from query hooks for API error display — don't use `try/catch` inside components.
- Log unhandled errors to the console (or a future observability service) inside the Error Boundary's `componentDidCatch`.
---
 
## 9. Custom Hooks (hooks/)
 
- A hook lives in `hooks/` when it's reused by 2+ components, or when it contains non-trivial logic that would clutter the component.
- Page-specific hooks (used by one page) live in `pages/{PageName}/hooks/`.
- Hooks must not make direct API calls — use RTK Query hooks internally.
**Existing hooks to reuse** (check before creating new ones):
 
| Hook | Purpose |
|---|---|
| `useAppDispatch` / `useAppSelector` | Typed Redux wrappers |
| `useDebounce` | Debounce a value |
| `useVideoProgressPolling` | Poll AI video job until done/failed |
| `usePersonalizedVideoProgressPolling` | Poll personalisation job |
| `useTimelineAudioSync` | Sync audio with Timeline scrubber |
| `useVariableAutocomplete` | Template variable placeholder autocomplete |
 
---
 
## 10. Constants
 
- Route paths → `constants/path.ts`
- AI model definitions → `constants/aiModels.tsx`
- Banner types → `constants/bannerType.ts`
- Film types → `constants/filmType.ts`
- Font constants → `constants/font.constants.ts`
- Scene locations → `constants/sceneLocation.ts`
- Industry types → `constants/industryType.ts`
When adding new static lists or label/value maps, add to the relevant constant file (or create a new one following the `{concept}.constants.ts` naming pattern). **Never inline magic strings in components.**
 
---
 
## 11. Environment Variables
 
Client env vars are prefixed `VITE_` and accessed via `import.meta.env.VITE_*`:
 
```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const bulkLimit = Number(import.meta.env.VITE_BULK_VIDEO_LIMIT ?? 10000);
```
 
Key vars:
 
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (`http://localhost:3001/api`) |
| `VITE_APP_TITLE` | App title |
| `VITE_MAX_UPLOAD_MB` | Max file upload size |
| `VITE_BULK_VIDEO_LIMIT` | Max bulk personalisation videos (default 10,000) |
 
---
 
## 12. Video Editor Specifics
 
The `VideoEditor` is a complex stateful component. Always use `videoEditorSlice` for cross-editor state (Timeline, overlays, template config). Each overlay type has a matching overlay component in `VideoEditor/components/overlays/` and a properties panel in `VideoEditor/components/properties/`.
 
When adding a new **overlay template**:
1. Add the HTML to `server/src/templates/` (see NestJS skill).
2. Add a React preview component under `VideoEditor/components/templates/`.
3. Register variable placeholders in `template-processor.util.ts` (server-side).
---
 
## 13. Naming Conventions
 
| Entity | Convention | Example |
|---|---|---|
| Files | kebab-case | `video-card.tsx`, `use-video-actions.ts` |
| Components / Classes | PascalCase | `VideoCard`, `BannerOverlay` |
| Variables / functions | camelCase | `handleGenerate`, `videoList` |
| Constants / env keys | SCREAMING_SNAKE_CASE | `VITE_API_BASE_URL` |
| Interface files | `{module}.interface.ts` | `video-job.interface.ts` |
| Yup schema files | `{form}.ts` in `schemas/` | `videoGenerator.ts` |
 
---
 
## 14. Checklist Before Writing Any Component
 
- [ ] Does a similar component already exist in `Common/`, `Form/`, or `VideoEditor/components/`?
- [ ] Are all route strings sourced from `constants/path.ts`?
- [ ] Is server state fetched via RTK Query (not `fetch`/`axios`)?
- [ ] Is form state managed by react-hook-form + a Yup schema in `schemas/`?
- [ ] Are Redux reads/writes going through `useAppSelector` / `useAppDispatch`?
- [ ] Is the component section order followed (state → hooks → redux → effects → JSX)?
- [ ] Are all types defined with proper interfaces (no `any`)?
- [ ] Is a new hook needed, or does an existing one in `hooks/` cover the use case?