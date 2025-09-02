from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import httpx
import uvicorn


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    reply: str
    mitre_techniques: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None


class LogAnalysisRequest(BaseModel):
    lines: List[str]
    source: Optional[str] = None


class LogFinding(BaseModel):
    severity: str
    title: str
    description: str
    mitre_technique: Optional[str] = None
    iocs: Optional[List[str]] = None


class LogAnalysisResponse(BaseModel):
    findings: List[LogFinding]
    summary: str
    recommendations: List[str]


app = FastAPI(title="Cyber Sentinel X - AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    text = req.message.lower()
    mitre: List[str] = []
    recs: List[str] = []
    reply = "I can help analyze your security question."

    if "sql injection" in text or "sqli" in text:
        mitre = ["T1190"]
        recs = [
            "Implement parameterized queries",
            "Deploy WAF rules for SQLi",
            "Sanitize and validate all inputs",
        ]
        reply = (
            "Detected SQL Injection context. Technique T1190 likely. "
            "I recommend parameterized queries, WAF rules, and input validation."
        )
    elif "threat hunt" in text or "hunting" in text:
        recs = [
            "Search authentication logs for multiple failures from same IP",
            "Look for impossible travel logins",
            "Detect lateral movement via unusual workstation pivots",
        ]
        reply = (
            "Generated threat hunting guidance. I can also produce example queries for your SIEM."
        )
    else:
        recs = [
            "Enable centralized logging and monitoring",
            "Review IAM policies and least privilege",
            "Keep dependencies patched",
        ]

    return ChatResponse(reply=reply, mitre_techniques=mitre or None, recommendations=recs)


@app.post("/analyze/logs", response_model=LogAnalysisResponse)
async def analyze_logs(req: LogAnalysisRequest):
    findings: List[LogFinding] = []
    iocs: List[str] = []

    for line in req.lines:
        normalized = line.lower()
        if "union select" in normalized or " or 1=1" in normalized:
            findings.append(
                LogFinding(
                    severity="high",
                    title="Possible SQL injection",
                    description=f"Suspicious SQL pattern detected in line: {line[:200]}",
                    mitre_technique="T1190",
                )
            )
        if "failed login" in normalized or "authentication failure" in normalized:
            findings.append(
                LogFinding(
                    severity="medium",
                    title="Multiple failed logins",
                    description=f"Potential brute force or credential stuffing in line: {line[:200]}",
                    mitre_technique="T1110",
                )
            )
        # naive IOC extraction for IPs
        import re

        for match in re.findall(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", line):
            iocs.append(match)

    summary = (
        f"Analyzed {len(req.lines)} lines. Found {len(findings)} notable events."
    )
    recommendations = [
        "Block malicious IPs at the edge if confirmed",
        "Apply WAF rules for injection patterns",
        "Enable account lockout after repeated failures",
    ]

    return LogAnalysisResponse(findings=findings, summary=summary, recommendations=recommendations)


@app.post("/analyze/file", response_model=LogAnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    content_bytes = await file.read()
    try:
        content = content_bytes.decode("utf-8", errors="ignore")
    finally:
        await file.close()
    lines = content.splitlines()
    return await analyze_logs(LogAnalysisRequest(lines=lines, source=file.filename))


class LokiAnalysisRequest(BaseModel):
    query: str
    limit: Optional[int] = 500
    start_ns: Optional[int] = None  # nanoseconds epoch
    end_ns: Optional[int] = None


@app.post("/analyze/loki", response_model=LogAnalysisResponse)
async def analyze_loki(req: LokiAnalysisRequest):
    loki_url = os.getenv("LOKI_URL", "http://localhost:3100")
    api_url = f"{loki_url.rstrip('/')}/loki/api/v1/query_range"

    params: Dict[str, Any] = {"query": req.query, "limit": req.limit or 500}
    if req.start_ns is not None:
        params["start"] = str(req.start_ns)
    if req.end_ns is not None:
        params["end"] = str(req.end_ns)

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(api_url, params=params)
            r.raise_for_status()
            data = r.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Loki request failed: {e}")

    # Extract log lines from Loki matrix/streams
    lines: List[str] = []
    result_type = data.get("data", {}).get("resultType")
    results = data.get("data", {}).get("result", [])
    if result_type == "streams":
        for stream in results:
            for ts, line in stream.get("values", []):
                lines.append(line)
    elif result_type == "matrix":
        for series in results:
            for ts, value in series.get("values", []):
                lines.append(str(value))
    else:
        # try instant vector or scalar fallbacks
        for item in results:
            v = item.get("value")
            if isinstance(v, list) and len(v) == 2:
                lines.append(str(v[1]))

    return await analyze_logs(LogAnalysisRequest(lines=lines, source="loki"))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

