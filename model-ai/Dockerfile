FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY app /app/app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python - <<'PY' || exit 1
import json, sys, urllib.request
try:
    with urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=3) as r:
        data = json.load(r)
        sys.exit(0 if data.get('status') == 'ok' else 1)
except Exception:
    sys.exit(1)
PY

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

