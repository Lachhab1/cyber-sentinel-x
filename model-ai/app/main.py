from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import httpx
import uvicorn
from datetime import datetime, timedelta
import re


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


class ThreatAnalysisRequest(BaseModel):
    threats: List[Dict[str, Any]]
    incidents: List[Dict[str, Any]]
    timeframe: str = "24h"


class ThreatAnalysisResponse(BaseModel):
    analysis: Dict[str, Any]
    recommendations: List[str]
    patterns: List[str]
    risk_score: float
    mitre_techniques: List[str]


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


@app.post("/analyze/threats", response_model=ThreatAnalysisResponse)
async def analyze_threats(req: ThreatAnalysisRequest):
    """Analyze threats and incidents to provide AI-powered insights"""
    
    # Extract patterns from threats and incidents
    patterns = []
    mitre_techniques = set()
    risk_indicators = []
    
    # Analyze threats
    for threat in req.threats:
        if threat.get('category'):
            patterns.append(f"{threat['category']} threats detected")
        
        if threat.get('severity') == 'critical':
            risk_indicators.append(10)
        elif threat.get('severity') == 'high':
            risk_indicators.append(7)
        elif threat.get('severity') == 'medium':
            risk_indicators.append(4)
        else:
            risk_indicators.append(1)
    
    # Analyze incidents
    for incident in req.incidents:
        if incident.get('type'):
            patterns.append(f"{incident['type']} incidents occurring")
        
        if incident.get('status') == 'open':
            risk_indicators.append(5)
    
    # Calculate risk score (0-100)
    risk_score = min(100, sum(risk_indicators) / len(risk_indicators) * 10) if risk_indicators else 0
    
    # Generate AI recommendations based on patterns
    recommendations = []
    if any('sql' in p.lower() for p in patterns):
        recommendations.extend([
            "Implement WAF rules for SQL injection protection",
            "Enable input validation and sanitization",
            "Use parameterized queries in all database operations"
        ])
        mitre_techniques.add("T1190")
    
    if any('phishing' in p.lower() for p in patterns):
        recommendations.extend([
            "Deploy email security gateways",
            "Implement user awareness training",
            "Enable URL reputation checking"
        ])
        mitre_techniques.add("T1566")
    
    if any('malware' in p.lower() for p in patterns):
        recommendations.extend([
            "Deploy endpoint detection and response (EDR)",
            "Implement application whitelisting",
            "Enable real-time malware scanning"
        ])
        mitre_techniques.add("T1204")
    
    if any('brute force' in p.lower() for p in patterns):
        recommendations.extend([
            "Implement account lockout policies",
            "Enable multi-factor authentication",
            "Deploy rate limiting on authentication endpoints"
        ])
        mitre_techniques.add("T1110")
    
    # Add general recommendations
    if risk_score > 70:
        recommendations.extend([
            "Immediate incident response team activation required",
            "Implement emergency security controls",
            "Conduct threat hunting across all systems"
        ])
    elif risk_score > 40:
        recommendations.extend([
            "Increase monitoring and alerting",
            "Review and update security policies",
            "Conduct security awareness training"
        ])
    else:
        recommendations.extend([
            "Continue routine security monitoring",
            "Update threat intelligence feeds",
            "Conduct regular security assessments"
        ])
    
    return ThreatAnalysisResponse(
        analysis={
            "total_threats": len(req.threats),
            "total_incidents": len(req.incidents),
            "patterns_detected": len(patterns),
            "risk_level": "high" if risk_score > 70 else "medium" if risk_score > 40 else "low"
        },
        recommendations=recommendations,
        patterns=patterns,
        risk_score=risk_score,
        mitre_techniques=list(mitre_techniques)
    )


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

