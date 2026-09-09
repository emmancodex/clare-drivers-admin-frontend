# Project Context

## Stack
- Vue 3 (Composition API + `<script setup>`)
- PrimeVue 5 (UI components)
- Vue Router
- Pinia (state management)
- Vite (build tool)
- Tailwind CSS v4
- Axios




## Code Style
- Always use ES Modules (`import`/`export`), never `require()`
- Always use `<script setup>` syntax in Vue SFCs
- Use `const` by default, `let` only when reassignment is needed
- Async/await over `.then()` chains
- Prefer composables (`useXxx.js`) for reusable logic
- Keep components focused — split if a component grows beyond ~150 lines
- always put the `script setup` block above the `template block`
- use (`skeleton-<componentName>`) prefix whenever creating a skeleton component wit primevue
- All store handler functions that make API requests must use the camelCase `<handlerName>Request` naming convention (e.g. `getUserDataRequest`, `signinRequest`)
- Whenever a component uses a ref/state or an action from a Pinia store, destructure it — never access via `store.someRef` or `store.someAction()`. Use `storeToRefs` to destructure reactive state/getters (e.g. `const { user } = storeToRefs(useAuthStore())`), and destructure actions directly off the store instance (e.g. `const { loginRequest } = useAuthStore()`)

## Backend API Reference
`C:\Users\MY PC\desktop\project\clare-drivers-admin\docs\api-reference.md` documents every
REST endpoint the backend exposes (auth, request/response shapes, error codes, side
effects). Check this file to know what API is available to call and how to shape
requests/responses when wiring up frontend features against the backend.

## API Requests (Axios)
Always import and use the pre-configured Axios instance for every API call — never use
`axios` directly or `fetch`. The instance lives at `@/api/http.js` (or wherever yours
is defined) and already has the base URL, default headers, and interceptors set up.

// ✅ Correct
import api from '@/api/http.js'
const { data } = await http.get('/users')

// ❌ Wrong — missing baseURL and interceptors
import axios from 'axios'
const { data } = await axios.get('http://localhost:5000/api/users')


## icon creation instuctions
When creating an SVG icon component, save it in src/components/icons/ as Icon<Name>.vue (always prefixed with "Icon", e.g. IconHouse.vue, IconBell.vue — never suffixed like HouseIcon.vue) using <script setup>, define props: size (Number, default 16), fill (String, default 'none'), stroke (String, default 'currentColor'), strokeWidth (Number, default 2), bind all props to the <svg> tag as :width="size" :height="size" :fill="fill" :stroke="stroke" :stroke-width="strokeWidth", keep viewBox="0 0 24 24" static, then export it from src/components/icons/index.js. When using inside PrimeVue components, always inject via the #icon slot using <template #icon>.


## File Structure
src/
  components/     # Reusable UI components
  views/          # Page-level components (tied to routes)
  composables/    # Shared logic (useAuth, useFetch, etc.)
  stores/         # Pinia stores
  router/         # Vue Router config
  assets/

## PrimeVue conventions
- Use PrimeVue components directly, don't wrap them unless adding real logic
- Use PrimeFlex or Tailwind for layout, not custom CSS grids where avoidable
- Prefer `severity` props and PrimeVue's built-in theming over manual color classes

## What I want from Claude Code
- Help with individual components or functions — not full rewrites
- Always explain what changed and why
- Don't modify files I haven't mentioned
- Ask before creating new files
- Keep changes minimal and reviewable
