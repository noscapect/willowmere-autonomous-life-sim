# Willowmere

Willowmere is a persistent, observer-first life simulation. The physical simulation is deterministic and authoritative; minds only propose legal high-level decisions.

## Run

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. `start-and-test.cmd` installs, validates, and starts the project on Windows.

## Ollama setup

1. Install and start [Ollama](https://ollama.com/).
2. Pull or create any model you want to use; no particular model tag is required.
3. Copy `.env.example` to `.env` if you want to customize the local endpoint or defaults.
4. Start Willowmere, select **Ollama** in **Mind**, refresh, and choose a discovered installed model.

Ollama remains local at `127.0.0.1` by default. Browser code calls Willowmere's local backend only; it never calls Ollama directly. If it is offline or a decision fails, residents keep running via deterministic rules and critical survival reflexes.

## Validation

```powershell
npm run test
npm run lint
npm run build
```
