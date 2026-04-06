# Arena3Dweb v3 — Implementation Plan

Tracks migration from R/Shiny to FastAPI + Vite + TypeScript + Three.js (npm).
See `SPEC.md` for architecture decisions and rationale.
See `MIGRATION.md` for the old-file → new-file deletion checklist.

**Rule:** Each phase must be independently runnable and tested before the next begins.
**Done signal:** Old source files are deleted only after their replacement is tested.

---

## Phase 1 — Scaffolding & Tooling

- [ ] Create `v3` branch from `main`
- [ ] Tag current `main` as `v2-legacy`
- [ ] Scaffold `backend/` directory structure
- [ ] Scaffold `frontend/` directory structure
- [ ] Set up `backend/pyproject.toml` — Ruff + mypy config
- [ ] Set up `frontend/package.json` — Vite + TypeScript + ESLint + Prettier + Vitest
- [ ] Set up `frontend/vite.config.ts` — proxy `/api` to `localhost:8000` in dev
- [ ] Set up `frontend/tsconfig.json`
- [ ] Set up `docker-compose.yml` — hot-reload frontend + backend
- [ ] Set up `Dockerfile` — production single image (nginx + uvicorn)
- [ ] Set up `nginx/nginx.conf` — serve static build, proxy `/api`
- [ ] Set up `.github/workflows/ci.yml` — lint → typecheck → unit tests → E2E
- [ ] Set up `.pre-commit-config.yaml` — Ruff + ESLint/Prettier hooks
- [ ] Create `MIGRATION.md` with full old-file → new-file checklist

---

## Phase 2 — Backend: Config Endpoint

- [ ] Implement `backend/app/config.py` — port constants from `config/server_variables.R`
- [ ] Implement `GET /api/config` router
- [ ] Write pytest tests for `/api/config`
- [ ] Verify frontend can fetch and parse config response
- [ ] Delete `config/server_variables.R`

---

## Phase 3 — Backend: Network Parsing

- [ ] Implement Pydantic models — `NodeModel`, `EdgeModel`, `NetworkModel` (`models/network.py`)
- [ ] Implement `services/parser.py` — port TSV parsing and validation from `functions/input.R`
- [ ] Implement `POST /api/network` router
- [ ] Write pytest tests using `www/data/` TSV files as fixtures
- [ ] Verify validation errors match current behaviour (missing columns, non-numeric weights, empty channels)
- [ ] Delete `functions/input.R`

---

## Phase 4 — Backend: Layout Algorithms

- [ ] Implement abstract `LayoutStrategy` base class (`services/algorithms/base.py`)
- [ ] Implement `ForceDirectedLayout` — port `igraph::layout_with_fr()`
- [ ] Implement `CircularLayout` — port `igraph::layout_in_circle()`
- [ ] Implement `GridLayout`
- [ ] Implement `RandomLayout`
- [ ] Implement algorithm registry (`services/algorithms/registry.py`)
- [ ] Implement `services/graph.py` — `nx.Graph` construction helpers (port `functions/igraph/general.R`)
- [ ] Implement `POST /api/layout` router
- [ ] Write pytest tests for each layout strategy with fixture graphs
- [ ] Delete `functions/igraph/layout.R`, `functions/igraph/general.R`

---

## Phase 5 — Backend: Clustering Algorithms

- [ ] Implement `LouvainClustering` strategy — port `igraph::cluster_louvain()`
- [ ] Implement `WalktrapClustering` strategy — LPA approximation; note in MIGRATION.md if behaviour differs
- [ ] Implement `POST /api/cluster` router
- [ ] Write pytest tests for each clustering strategy
- [ ] Delete `functions/igraph/cluster.R`

---

## Phase 6 — Backend: Topology Metrics

- [ ] Implement `DegreeStrategy` — port `igraph::degree()`
- [ ] Implement `BetweennessStrategy` — port `igraph::betweenness()`
- [ ] Implement `ClusteringCoefficientStrategy` — port `igraph::transitivity()`
- [ ] Implement `POST /api/topology` router
- [ ] Write pytest tests for each metric with known fixture graphs
- [ ] Delete `functions/igraph/topology.R`

---

## Phase 7 — Backend: Session & External API

- [ ] Implement Pydantic models for session (`models/session.py`)
- [ ] Implement `POST /api/session/import` router — port `importNetwork()`
- [ ] Implement `POST /api/session/export` router — port `convertSessionToJSON()`
- [ ] Implement `POST /api/external` + `GET /api/external/<token>` — port `resolveAPI()`; token = base64-encoded compressed session JSON
- [ ] Write pytest tests for all session and external endpoints using `www/data/*.json` as fixtures
- [ ] Delete `functions/init.R`, `functions/general.R`, `functions/reset.R`, `functions/vr.R`, `functions/edges.R`, `functions/render.R`, `functions/js_handling.R`

---

## Phase 8 — Frontend: Foundation

- [ ] Install Three.js via npm, configure `@types/three`
- [ ] Implement `EventBus` singleton (`src/bus/index.ts`)
- [ ] Implement `AppState` store singleton (`src/store/index.ts`)
- [ ] Implement `Command` interface + `CommandHistory` singleton (`src/commands/base.ts`)
- [ ] Generate typed API client from FastAPI OpenAPI spec (`src/api/client.ts`)
- [ ] Verify API client can call all Phase 2–7 endpoints

---

## Phase 9 — Frontend: Three.js Classes

- [ ] Identify all manual patches in `www/js/three/three.js` — document each one
- [ ] Migrate `Scene.js` → `Scene.ts` — reimplement patches as subclasses in `src/three/`
- [ ] Migrate `Layer.js` → `Layer.ts`
- [ ] Migrate `Node.js` → `Node.ts`
- [ ] Migrate `Edge.js` → `Edge.ts`
- [ ] Write Vitest unit tests for all four classes
- [ ] Delete `www/js/classes/`, `www/js/three/`

---

## Phase 10 — Frontend: Commands

- [ ] Implement `LoadNetworkCommand`
- [ ] Implement `ApplyLayoutCommand` — captures node positions before/after
- [ ] Implement `ApplyClusteringCommand` — captures node colors/cluster IDs before/after
- [ ] Implement `ApplyTopologyCommand` — captures node scale values before/after
- [ ] Implement `MoveLayerCommand` — captures layer transform before/after
- [ ] Implement `ChangeNodeColorCommand`
- [ ] Implement `ChangeNodeSizeCommand`
- [ ] Implement `ChangeEdgeColorCommand`
- [ ] Implement `ChangeThemeCommand`
- [ ] Write Vitest tests for execute/undo/redo on each command

---

## Phase 11 — Frontend: Object Actions

- [ ] Migrate `canvas_controls.js` → `src/actions/canvas_controls.ts`
- [ ] Migrate `layout.js` → `src/actions/layout.ts`
- [ ] Migrate `node.js` → `src/actions/node.ts`
- [ ] Migrate `edge.js` → `src/actions/edge.ts`
- [ ] Migrate `layer.js` → `src/actions/layer.ts`
- [ ] Migrate `network.js` → `src/actions/network.ts`
- [ ] Migrate `screen.js` → `src/actions/screen.ts`
- [ ] Migrate `themes.js` → `src/actions/themes.ts`
- [ ] Migrate `labels.js` → `src/actions/labels.ts`
- [ ] Migrate `right_click_menu.js` → `src/actions/right_click_menu.ts`
- [ ] Delete `www/js/object_actions/`

---

## Phase 12 — Frontend: Event Handling & Main Loop

- [ ] Migrate `general.js` → `src/utils.ts`
- [ ] Migrate `event_listeners.js` → `src/event_listeners.ts` — add `Ctrl+Z` / `Ctrl+Shift+Z` undo/redo
- [ ] Migrate `on_page_load.js` → `src/main.ts` — Three.js canvas setup, calls `GET /api/config` on load
- [ ] Replace `rshiny_handlers.js` + `rshiny_update.js` with typed EventBus + API client calls
- [ ] Delete `www/js/event_listeners.js`, `www/js/on_page_load.js`, `www/js/general.js`
- [ ] Delete `www/js/rshiny_handlers.js`, `www/js/rshiny_update.js`
- [ ] Delete `www/js/config/`

---

## Phase 13 — Frontend: UI Panels

- [ ] Build `frontend/index.html` — Bootstrap 5 navbar structure matching current tab layout
- [ ] Migrate Home panel (`views/home.R` → `src/ui/home.ts`)
- [ ] Migrate File panel (`views/file.R` → `src/ui/file.ts`)
- [ ] Migrate Layer Selection & Layouts panel (`views/layouts.R` → `src/ui/layouts.ts`)
- [ ] Migrate Scene Actions panel (`views/scene.R` → `src/ui/scene.ts`)
- [ ] Migrate Layer Actions panel (`views/layer.R` → `src/ui/layer.ts`)
- [ ] Migrate Node Actions panel (`views/node.R` → `src/ui/node.ts`)
- [ ] Migrate Edge Actions panel (`views/edge.R` → `src/ui/edge.ts`)
- [ ] Migrate View Data panel (`views/data.R` → `src/ui/data.ts`)
- [ ] Migrate Help panel (`views/help.R` → `src/ui/help.ts`)
- [ ] Add Undo/Redo buttons wired to `CommandHistory`
- [ ] Delete `views/`, `ui.R`, `server.R`, `global.R`, `www/arena3dweb.css`

---

## Phase 14 — Final Cleanup & Production

- [ ] Delete remaining `www/`, `functions/`, `config/` (R) directories
- [ ] Delete `Arena3Dweb.Rproj`, `Rprofile.site`, `global.R`
- [ ] Full Docker production build test — `docker build` + `docker run`
- [ ] Full Playwright E2E test suite pass — upload fixture network, apply layout, clustering, export session
- [ ] Update `CLAUDE.md` for new stack
- [ ] Update `README.md` for new stack and Docker instructions
- [ ] Swap `v3` → `main`
- [ ] Update Docker Hub build to point to new `main`
