from fastapi import FastAPI

app = FastAPI(title="Arena3Dweb API", version="3.0.0")


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
