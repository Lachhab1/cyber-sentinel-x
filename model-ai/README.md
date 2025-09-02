# Model-AI (FastAPI)

FastAPI microservice providing AI security analysis: chat, log analysis, and Loki-powered queries.

## Endpoints
- GET /health: Service status
- POST /chat: { message } -> { reply, mitre_techniques?, recommendations? }
- POST /analyze/logs: { lines[] } -> findings, summary, recommendations
- POST /analyze/file: multipart file upload -> same as analyze/logs
- POST /analyze/loki: { query, limit?, start_ns?, end_ns? } -> analyze logs pulled from Loki

## Local Run
```bash
cd model-ai
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export LOKI_URL=http://localhost:3100
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Docker
```bash
cd backend
docker compose up -d --build model-ai
# Or bring up the whole stack
docker compose up -d --build
```

## Frontend Integration
Set `VITE_AI_API_URL` to the AI service URL (defaults to `http://localhost:8000`). The frontend uses `api.ai.chat()` and `api.ai.analyzeFile()`.

## Notes
- CORS enabled for rapid local iteration.
- Loki integration requires Loki reachable at `LOKI_URL`.