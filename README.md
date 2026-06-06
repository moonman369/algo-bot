# AlgoBot

AlgoBot uses a source-agnostic ingestion boundary. Every supported URL, bare
problem number, raw statement, or mixed message is converted to a
`NormalizedProblem` before it reaches the AI layer.

## Architecture

- `src/problem-ingestion`: detects URLs and sources, classifies input, and
  normalizes problems.
- `src/session`: stores the current normalized problem and interaction state per
  user.
- `src/ai`: builds platform-neutral DSA mentor prompts using only a
  `NormalizedProblem`.

Image, OCR, and PDF ingestion can be registered with
`ContentAdapterRegistryService` behind `ProblemContentAdapter` without changing
the ingestion workflow, normalized model, or AI services.

## Docker

```bash
docker build -t algobot:latest .
docker run --detach --name algobot --publish 3000:3000 --restart unless-stopped algobot:latest
curl http://localhost:3000/health
```
