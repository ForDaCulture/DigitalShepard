import asyncio
import json
import subprocess
from typing import Dict, List, Optional, Any
from pathlib import Path
import tempfile
import os
from datetime import datetime

class OSINTScanner:
    def __init__(self, output_dir: Optional[str] = None):
        self.output_dir = output_dir or tempfile.mkdtemp()
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)

    async def run_amass(self, domain: str) -> Dict[str, Any]:
        """Run Amass for domain enumeration."""
        try:
            output_file = os.path.join(self.output_dir, f"amass_{domain}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
            process = await asyncio.create_subprocess_exec(
                "amass", "enum", "-d", domain, "-o", output_file,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return {"status": "error", "message": stderr.decode()}
            
            with open(output_file, 'r') as f:
                subdomains = f.read().splitlines()
            
            return {
                "status": "success",
                "tool": "amass",
                "subdomains": subdomains,
                "count": len(subdomains)
            }
        except Exception as e:
            return {"status": "error", "tool": "amass", "message": str(e)}

    async def run_h8mail(self, email: str) -> Dict[str, Any]:
        """Run h8mail for email breach checking."""
        try:
            output_file = os.path.join(self.output_dir, f"h8mail_{email}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            process = await asyncio.create_subprocess_exec(
                "h8mail", "-t", email, "-j", output_file,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return {"status": "error", "message": stderr.decode()}
            
            with open(output_file, 'r') as f:
                results = json.load(f)
            
            return {
                "status": "success",
                "tool": "h8mail",
                "results": results
            }
        except Exception as e:
            return {"status": "error", "tool": "h8mail", "message": str(e)}

    async def run_sherlock(self, username: str) -> Dict[str, Any]:
        """Run Sherlock for username reconnaissance."""
        try:
            output_file = os.path.join(self.output_dir, f"sherlock_{username}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
            process = await asyncio.create_subprocess_exec(
                "sherlock", username, "--output", output_file,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return {"status": "error", "message": stderr.decode()}
            
            with open(output_file, 'r') as f:
                results = f.read().splitlines()
            
            return {
                "status": "success",
                "tool": "sherlock",
                "found_profiles": results,
                "count": len(results)
            }
        except Exception as e:
            return {"status": "error", "tool": "sherlock", "message": str(e)}

    async def scan_user_data(self, data: Dict[str, str]) -> Dict[str, Any]:
        """
        Comprehensive OSINT scan using multiple tools.
        """
        tasks = []
        results = {"timestamp": datetime.now().isoformat(), "results": {}}

        if "email" in data:
            tasks.append(self.run_h8mail(data["email"]))
            
        if "username" in data:
            tasks.append(self.run_sherlock(data["username"]))
            
        if "domain" in data:
            tasks.append(self.run_amass(data["domain"]))

        # Run all tools concurrently
        tool_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        for result in tool_results:
            if isinstance(result, Exception):
                results["results"][str(type(result).__name__)] = {
                    "status": "error",
                    "message": str(result)
                }
            else:
                tool_name = result.get("tool", "unknown")
                results["results"][tool_name] = result

        # Add summary
        results["summary"] = {
            "total_tools_run": len(tasks),
            "successful_scans": sum(1 for r in results["results"].values() if r.get("status") == "success"),
            "found_data": any(r.get("status") == "success" and len(r.get("results", [])) > 0 
                          for r in results["results"].values())
        }

        return results 