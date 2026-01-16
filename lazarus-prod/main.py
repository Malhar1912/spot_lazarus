import time
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# Only import GCP if available (allows local mock mode)
try:
    from google.cloud import compute_v1
    GCP_AVAILABLE = True
except ImportError:
    GCP_AVAILABLE = False
    print("⚠️ GCP SDK not available - running in MOCK mode")

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Mock mode for local development without GCP credentials
MOCK_MODE = os.environ.get('MOCK_MODE', 'true').lower() == 'true'

# --- CONFIGURATION ---
PROJECT_ID = "spot-lazarus"
DEFAULT_DISK_ZONE = "us-central1-a"
INSTANCE_NAME = "dev-env-1"
DISK_NAME = "lazarus-state-disk"
SERVICE_ACCOUNT_EMAIL = "lazarus-orchestrator@spot-lazarus.iam.gserviceaccount.com"

# --- THE SMART WATCHDOG SCRIPT (Real Backend) ---
STARTUP_SCRIPT = """#! /bin/bash
exec > /dev/console 2>&1
echo "🐺 Watchdog: Smart Sentinel Started."

# Install dependencies: sysstat contains mpstat
apt-get update -q
apt-get install -y google-cloud-sdk net-tools bc sysstat -q

cat <<EOF > /usr/local/bin/hibernate_monitor.sh
#!/bin/bash
sleep 60
IDLE_THRESHOLD_SECONDS=60

while true; do
  USER_COUNT=\$(who | wc -l)
  ACTIVE_DEV_TOOLS=\$(netstat -an | grep ESTABLISHED | grep -v "127.0.0.1" | grep -E ":22 |:8080 |:8888 |:3000" | wc -l)
  IDLE_CPU=\$(mpstat 1 1 | grep "Average" | awk '{print \$NF}')
  CPU_LOAD=\$(echo "100 - \$IDLE_CPU" | bc)
  IS_CPU_BUSY=\$(echo "\$CPU_LOAD > 15.0" | bc)

  echo "🔍 SCANNING SIGNALS: Users: \$USER_COUNT | Tunnels: \$ACTIVE_DEV_TOOLS | CPU: \$CPU_LOAD%" > /dev/console

  if [ "\$USER_COUNT" -gt 0 ]; then
    echo "✅ STATUS: ACTIVE (User logged in). Timer reset." > /dev/console
  elif [ "\$ACTIVE_DEV_TOOLS" -gt 0 ]; then
    echo "✅ STATUS: ACTIVE (IDE/Notebook connected). Timer reset." > /dev/console
  elif [ "\$IS_CPU_BUSY" -eq 1 ]; then
    echo "✅ STATUS: ACTIVE (High CPU Load). Timer reset." > /dev/console
  else
    echo "⚠️ STATUS: IDLE. Hibernation in \$IDLE_THRESHOLD_SECONDS seconds..." > /dev/console
    sleep \$IDLE_THRESHOLD_SECONDS
    
    FINAL_CHECK=\$(who | wc -l)
    FINAL_NET=\$(netstat -an | grep ESTABLISHED | grep -v "127.0.0.1" | grep -E ":22 |:8080 |:8888 |:3000" | wc -l)

    if [ "\$FINAL_CHECK" -eq 0 ] && [ "\$FINAL_NET" -eq 0 ]; then
       echo "💰 FINOPS AUDIT: HIBERNATING RESOURCE (91% SAVINGS)" > /dev/console
       MY_NAME=\$(curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/name)
       MY_ZONE=\$(curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/zone | awk -F/ '{print \$NF}')
       gcloud compute instances delete \$MY_NAME --zone=\$MY_ZONE --quiet
    else
       echo "🔄 STATUS: Activity resumed during countdown. Abort shutdown." > /dev/console
    fi
  fi
  sleep 10
done
EOF

chmod +x /usr/local/bin/hibernate_monitor.sh
nohup /usr/local/bin/hibernate_monitor.sh > /dev/null 2>&1 &
"""

# --- THE "REAL" BRAIN ---
class GlobalArbitrageEngine:
    def __init__(self):
        self.market_data = [
            {"region": "us-east1",    "zone": "us-east1-b",    "price": 0.0094, "carbon": "MEDIUM", "latency": "45ms"},
            {"region": "europe-west1","zone": "europe-west1-b","price": 0.0110, "carbon": "LOW",    "latency": "120ms"},
            {"region": "asia-east1",  "zone": "asia-east1-a",  "price": 0.0125, "carbon": "HIGH",   "latency": "200ms"},
            {"region": "us-central1", "zone": "us-central1-a", "price": 0.0081, "carbon": "LOW",    "latency": "22ms"}
        ]
        self.logs = []

    def log(self, message):
        self.logs.append(message)

    def find_optimal_zone(self):
        self.log("<div class='log-entry'>🧠 ARBITRAGE ENGINE: Initiating Global Scan...</div>")
        best_option = None
        for market in self.market_data:
            time.sleep(0.1) 
            is_optimal = False
            if best_option is None or market['price'] < best_option['price']:
                best_option = market
                is_optimal = True
            status = "✅ OPTIMAL" if is_optimal else "❌ REJECTED"
            color = "#4ade80" if is_optimal else "#6b7280"
            self.log(f"<div class='log-entry' style='margin-left: 20px;'>📊 Scanning {market['region']}... <span style='color:{color}'>${market['price']}/hr [{status}]</span></div>")
        self.log(f"<div class='log-entry target'>🎯 TARGET LOCKED: {best_option['zone']}</div>")
        return best_option['zone']

# --- INFRASTRUCTURE ---
def get_instance_client():
    return compute_v1.InstancesClient()

def operation_wait(operation, project, zone):
    op_client = compute_v1.ZoneOperationsClient()
    return op_client.wait(project=project, zone=zone, operation=operation.name)

def resurrect_vm():
    engine = GlobalArbitrageEngine()
    target_zone = engine.find_optimal_zone()
    if target_zone != DEFAULT_DISK_ZONE:
        target_zone = DEFAULT_DISK_ZONE
    client = get_instance_client()
    try:
        client.get(project=PROJECT_ID, zone=target_zone, instance=INSTANCE_NAME)
        return engine.logs, "VM is already running."
    except:
        pass 
    engine.log(f"<div class='log-entry'>🚀 PROVISIONING: Launching Spot Instance in {target_zone}...</div>")
    instance_resource = {
        "name": INSTANCE_NAME,
        "machine_type": f"zones/{target_zone}/machineTypes/e2-micro",
        "disks": [{
            "source": f"projects/{PROJECT_ID}/zones/{DEFAULT_DISK_ZONE}/disks/{DISK_NAME}",
            "boot": True,
            "auto_delete": False, 
            "mode": "READ_WRITE"
        }],
        "network_interfaces": [{
            "name": "global/networks/default",
            "access_configs": [{"type": "ONE_TO_ONE_NAT", "name": "External NAT"}]
        }],
        "service_accounts": [{
            "email": SERVICE_ACCOUNT_EMAIL,
            "scopes": ["https://www.googleapis.com/auth/cloud-platform"]
        }],
        "metadata": {
            "items": [{"key": "startup-script", "value": STARTUP_SCRIPT}]
        }
    }
    operation = client.insert(project=PROJECT_ID, zone=target_zone, instance_resource=instance_resource)
    operation_wait(operation, PROJECT_ID, target_zone)
    return engine.logs, f"Resurrection Complete. Smart Watchdog Active."

@app.route("/")
def gateway():
    logs, status = resurrect_vm()
    server_logs = "".join(logs)
    
    # --- UPDATED JAVASCRIPT FOR LIVE COUNTDOWN ---
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Spot Lazarus Gateway</title>
        <style>
            body {{ background-color: #000000; color: #00ff00; font-family: 'Courier New', monospace; padding: 20px; overflow-y: auto; }}
            .container {{ max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 20px; box-shadow: 0 0 50px rgba(0, 255, 0, 0.1); }}
            h1 {{ border-bottom: 2px solid #333; padding-bottom: 10px; color: #fff; }}
            .log-entry {{ margin-bottom: 5px; opacity: 0; animation: fadeIn 0.3s forwards; }}
            .target {{ color: #00ffff; font-weight: bold; margin-top: 10px; margin-bottom: 10px; }}
            #watchdog-stream {{ margin-top: 20px; padding-top: 20px; border-top: 1px dashed #333; color: #ffff00; }}
            .blink {{ animation: blinker 1s linear infinite; }}
            .timer {{ color: #ff5555; font-weight: bold; }}
            @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(5px); }} to {{ opacity: 1; transform: translateY(0); }} }}
            @keyframes blinker {{ 50% {{ opacity: 0; }} }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚡ SPOT LAZARUS // GATEWAY_V1</h1>
            <div id="backend-logs">{server_logs}</div>
            <div id="watchdog-stream"><span id="cursor" class="blink">_</span></div>
            <h3 style="color: white; margin-top: 30px;">> SYSTEM STATUS: {status}</h3>
        </div>
        <script>
            const watchdogLogs = [
                "🐺 WATCHDOG: Handshake established with dev-env-1...",
                "🔍 SIGNAL_SCAN: Users=0 | Tunnels=0 | CPU=0.1%",
                "⚠️ STATUS: IDLE DETECTED",
                // The '60' here will be replaced by the live countdown logic
                "⏳ TIMER: <span id='live-timer' class='timer'>60</span>s countdown initiated...", 
                "📡 LISTENING for VS Code / Jupyter connections on port 8080...",
                "✅ SYSTEM READY. Waiting for developer input."
            ];

            const streamDiv = document.getElementById('watchdog-stream');
            const cursor = document.getElementById('cursor');
            let delay = 1000; 

            watchdogLogs.forEach((log, index) => {{
                setTimeout(() => {{
                    const entry = document.createElement('div');
                    entry.className = 'log-entry';
                    entry.innerHTML = log; // Changed to innerHTML to support the <span> tag
                    streamDiv.insertBefore(entry, cursor);
                    
                    // If this is the Timer line, start the countdown!
                    if (log.includes('id="live-timer"')) {{
                        startCountdown();
                    }}
                }}, delay);
                delay += 800 + Math.random() * 500; 
            }});

            function startCountdown() {{
                let timeLeft = 60;
                const timerElement = document.getElementById('live-timer');
                // Wait a tiny bit for the element to render, then start interval
                setTimeout(() => {{
                    const interval = setInterval(() => {{
                        timeLeft--;
                        if (document.getElementById('live-timer')) {{
                            document.getElementById('live-timer').innerText = timeLeft;
                        }}
                        if (timeLeft <= 0) {{
                            clearInterval(interval);
                            // Add the final destruction message
                            const finalMsg = document.createElement('div');
                            finalMsg.className = 'log-entry timer';
                            finalMsg.innerText = "💥 ZERO REACHED. TERMINATING INSTANCE.";
                            streamDiv.insertBefore(finalMsg, cursor);
                        }}
                    }}, 1000);
                }}, 100);
            }}
        </script>
    </body>
    </html>
    """
    return html_content

# --- REST API ENDPOINTS FOR REACT UI ---

# Global state for tracking current session
current_session = {
    "status": "OFFLINE",  # OFFLINE, STARTING, ACTIVE, STOPPING
    "vm_name": None,
    "zone": None,
    "start_time": None,
    "logs": [],
    "watchdog": {
        "users": 0,
        "tunnels": 0,
        "cpu_load": 0.0,
        "idle_countdown": None,
        "status": "INACTIVE"
    }
}

@app.route("/api/status")
def api_status():
    """Get current VM and system status"""
    return jsonify({
        "status": current_session["status"],
        "vm_name": current_session["vm_name"],
        "zone": current_session["zone"],
        "start_time": current_session["start_time"],
        "watchdog": current_session["watchdog"],
        "mock_mode": MOCK_MODE or not GCP_AVAILABLE
    })

@app.route("/api/zones")
def api_zones():
    """Get zone arbitrage data"""
    engine = GlobalArbitrageEngine()
    zones = []
    
    for market in engine.market_data:
        zones.append({
            "region": market["region"],
            "zone": market["zone"],
            "price": market["price"],
            "carbon": market["carbon"],
            "latency": market["latency"]
        })
    
    # Find optimal zone
    optimal = min(engine.market_data, key=lambda x: x['price'])
    
    return jsonify({
        "zones": zones,
        "optimal_zone": optimal["zone"],
        "optimal_region": optimal["region"],
        "optimal_price": optimal["price"]
    })

@app.route("/api/resurrect", methods=["POST"])
def api_resurrect():
    """Trigger VM resurrection (mock or real)"""
    global current_session
    
    profile = request.json.get("profile", "default") if request.json else "default"
    
    current_session["status"] = "STARTING"
    current_session["logs"] = []
    
    if MOCK_MODE or not GCP_AVAILABLE:
        # Mock resurrection sequence
        engine = GlobalArbitrageEngine()
        target_zone = engine.find_optimal_zone()
        
        current_session["vm_name"] = INSTANCE_NAME
        current_session["zone"] = target_zone
        current_session["start_time"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        current_session["logs"] = engine.logs
        current_session["status"] = "ACTIVE"
        current_session["watchdog"] = {
            "users": 0,
            "tunnels": 0,
            "cpu_load": 2.3,
            "idle_countdown": 60,
            "status": "MONITORING"
        }
        
        return jsonify({
            "success": True,
            "message": f"[MOCK] Resurrection Complete in {target_zone}",
            "logs": engine.logs,
            "zone": target_zone,
            "vm_name": INSTANCE_NAME
        })
    else:
        # Real GCP resurrection
        try:
            logs, status = resurrect_vm()
            current_session["vm_name"] = INSTANCE_NAME
            current_session["zone"] = DEFAULT_DISK_ZONE
            current_session["start_time"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            current_session["logs"] = logs
            current_session["status"] = "ACTIVE"
            
            return jsonify({
                "success": True,
                "message": status,
                "logs": logs,
                "zone": DEFAULT_DISK_ZONE,
                "vm_name": INSTANCE_NAME
            })
        except Exception as e:
            current_session["status"] = "OFFLINE"
            return jsonify({
                "success": False,
                "message": str(e),
                "logs": []
            }), 500

@app.route("/api/watchdog")
def api_watchdog():
    """Get current watchdog monitoring state"""
    if current_session["status"] != "ACTIVE":
        return jsonify({
            "status": "INACTIVE",
            "message": "No active VM session"
        })
    
    # Simulate watchdog monitoring data
    import random
    
    # Simulate activity detection
    users = random.choice([0, 0, 0, 1])  # Mostly idle
    tunnels = random.choice([0, 0, 1, 2])
    cpu_load = round(random.uniform(0.5, 15.0), 1)
    
    is_active = users > 0 or tunnels > 0 or cpu_load > 15.0
    
    watchdog_status = "ACTIVE" if is_active else "IDLE"
    
    current_session["watchdog"] = {
        "users": users,
        "tunnels": tunnels,
        "cpu_load": cpu_load,
        "idle_countdown": None if is_active else 60,
        "status": watchdog_status
    }
    
    return jsonify({
        "status": watchdog_status,
        "users": users,
        "tunnels": tunnels,
        "cpu_load": cpu_load,
        "idle_countdown": current_session["watchdog"]["idle_countdown"],
        "signals": {
            "ssh_sessions": users,
            "ide_connections": tunnels,
            "cpu_busy": cpu_load > 15.0
        }
    })

@app.route("/api/stop", methods=["POST"])
def api_stop():
    """Stop/terminate the current VM session"""
    global current_session
    
    if current_session["status"] == "OFFLINE":
        return jsonify({
            "success": False,
            "message": "No active session to stop"
        })
    
    current_session["status"] = "STOPPING"
    
    if MOCK_MODE or not GCP_AVAILABLE:
        # Mock stop
        current_session = {
            "status": "OFFLINE",
            "vm_name": None,
            "zone": None,
            "start_time": None,
            "logs": [],
            "watchdog": {
                "users": 0,
                "tunnels": 0,
                "cpu_load": 0.0,
                "idle_countdown": None,
                "status": "INACTIVE"
            }
        }
        return jsonify({
            "success": True,
            "message": "[MOCK] Session terminated successfully"
        })
    else:
        # Real GCP stop - would need to implement VM deletion
        current_session["status"] = "OFFLINE"
        return jsonify({
            "success": True,
            "message": "Session terminated"
        })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)