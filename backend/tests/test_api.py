import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "pranshu-portfolio-api"

def test_api_v1_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_candidate_profile_endpoint(client):
    response = client.get("/api/v1/candidate")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Pranshu Rajan"
    assert "skills_categories" in data or "skills" in data

def test_chat_endpoint_fallback(client):
    response = client.post("/api/v1/chat", json={"question": "Why should we hire you?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "Pranshu" in data["answer"]
    assert len(data.get("suggested_follow_ups", [])) > 0

def test_inquiry_submission(client):
    payload = {
        "from_email": "recruiter@techcorp.com",
        "subject": "Interview Request",
        "message": "We would love to discuss a Full Stack Developer role with you."
    }
    response = client.post("/api/v1/inquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["from_email"] == "recruiter@techcorp.com"
    assert data["status"] == "received"

def test_projects_endpoint(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert "total" in data
    assert data["total"] == 7
    assert len(data["projects"]) == 7

def test_projects_featured(client):
    response = client.get("/api/v1/projects?featured=true")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert data["total"] == 4
    for p in data["projects"]:
        assert p.get("featured") is True
