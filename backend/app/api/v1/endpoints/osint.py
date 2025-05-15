from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Optional
from pydantic import BaseModel, EmailStr
from ....modules.osint.scanner import OSINTScanner
from datetime import datetime
import asyncio

router = APIRouter()
scanner = OSINTScanner()

class ScanRequest(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    domain: Optional[str] = None

class ScanResponse(BaseModel):
    scan_id: str
    status: str
    message: str
    timestamp: str

class ScanResult(BaseModel):
    scan_id: str
    status: str
    results: Dict
    timestamp: str

# Store scan results in memory (in production, use a proper database)
scan_results = {}

async def run_scan(scan_id: str, data: Dict):
    """Background task to run the OSINT scan."""
    try:
        results = await scanner.scan_user_data(data)
        scan_results[scan_id] = {
            "scan_id": scan_id,
            "status": "completed",
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        scan_results[scan_id] = {
            "scan_id": scan_id,
            "status": "error",
            "results": {"error": str(e)},
            "timestamp": datetime.now().isoformat()
        }

@router.post("/scan-user-data", response_model=ScanResponse)
async def scan_user_data(
    data: ScanRequest,
    background_tasks: BackgroundTasks
):
    """
    Initiate an OSINT scan for the provided user data.
    At least one of email, username, or domain must be provided.
    """
    if not any([data.email, data.username, data.domain]):
        raise HTTPException(
            status_code=400,
            detail="At least one of email, username, or domain must be provided"
        )

    # Generate a unique scan ID
    scan_id = f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{id(data)}"
    
    # Initialize scan status
    scan_results[scan_id] = {
        "scan_id": scan_id,
        "status": "pending",
        "results": {},
        "timestamp": datetime.now().isoformat()
    }
    
    # Start the scan in the background
    background_tasks.add_task(
        run_scan,
        scan_id,
        data.dict(exclude_none=True)
    )
    
    return {
        "scan_id": scan_id,
        "status": "pending",
        "message": "Scan initiated successfully",
        "timestamp": datetime.now().isoformat()
    }

@router.get("/scan-results/{scan_id}", response_model=ScanResult)
async def get_scan_results(scan_id: str):
    """
    Retrieve the results of a previously initiated scan.
    """
    if scan_id not in scan_results:
        raise HTTPException(
            status_code=404,
            detail="Scan ID not found"
        )
    
    return scan_results[scan_id]

@router.delete("/scan-results/{scan_id}")
async def delete_scan_results(scan_id: str):
    """
    Delete the results of a completed scan.
    """
    if scan_id not in scan_results:
        raise HTTPException(
            status_code=404,
            detail="Scan ID not found"
        )
    
    del scan_results[scan_id]
    return {"message": "Scan results deleted successfully"} 