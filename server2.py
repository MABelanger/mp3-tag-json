import json
import os
import platform
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8000

# Get the absolute directory where server.py is saved
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def reveal_in_file_manager(incoming_path):
    # 1. If it's a relative path, combine it with the location of server.py
    if not os.path.isabs(incoming_path):
        resolved_path = os.path.join(SCRIPT_DIR, incoming_path)
    else:
        resolved_path = incoming_path
        
    # 2. Fully normalize the path (resolves any '..' or mixed slashes)
    resolved_path = os.path.abspath(resolved_path)
    
    current_os = platform.system()
    print(f"[OS: {current_os}] Base Dir: {SCRIPT_DIR}")
    print(f"[OS: {current_os}] Incoming: {incoming_path} -> Resolved: {resolved_path}")
    
    # 3. Check if the file actually exists before trying to open it
    if not os.path.exists(resolved_path):
        raise FileNotFoundError(f"Path does not exist: {resolved_path}")

    # 4. Trigger the native file managers
    if current_os == "Windows":
        clean_path = resolved_path.replace('/', '\\')
        subprocess.Popen(f'explorer /select,"{clean_path}"')
        
    elif current_os == "Darwin":  # macOS
        subprocess.call(["open", "-R", resolved_path])
        
    elif current_os == "Linux":
        try:
            # Try D-Bus first (Modern standard across GNOME, KDE, etc.)
            file_url = f"file://{resolved_path}"
            dbus_cmd = [
                "dbus-send", "--print-reply", "--dest=org.freedesktop.FileManager1",
                "/org/freedesktop/FileManager1", 
                "org.freedesktop.FileManager1.ShowItems", 
                f"array:string:{file_url}", "string:"
            ]
            subprocess.run(dbus_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except (subprocess.CalledProcessError, FileNotFoundError):
            try:
                # Fallback to Nautilus (Ubuntu default)
                subprocess.run(["nautilus", "--select", resolved_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except (subprocess.CalledProcessError, FileNotFoundError):
                # Ultimate fallback: Just open the folder
                parent_dir = os.path.dirname(resolved_path)
                subprocess.run(["xdg-open", parent_dir])

class FileOpenerHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/reveal':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                file_path = data.get('path')
                
                if file_path:
                    # Let the function handle relative vs absolute mapping
                    reveal_in_file_manager(file_path)
                    
                    self.send_response(200)
                    self._set_cors_headers()
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "success", "message": "File revealed."}).encode('utf-8'))
                else:
                    self.send_response(400)
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "No path provided in payload."}).encode('utf-8'))
                    
            except FileNotFoundError as fnf:
                self.send_response(404)
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(fnf)}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, FileOpenerHandler)
    print(f"🚀 Local file helper running on http://localhost:{PORT}")
    print(f"📂 Root relative directory is: {SCRIPT_DIR}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()

