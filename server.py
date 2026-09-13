import json
import os
import platform
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8000

def reveal_in_file_manager(file_path):
    # Ensure we have the absolute, normalized path
    file_path = os.path.abspath(file_path)
    current_os = platform.system()
    
    print(f"[OS detected: {current_os}] Revealing: {file_path}")
    
    if current_os == "Windows":
        clean_path = file_path.replace('/', '\\')
        subprocess.Popen(f'explorer /select,"{clean_path}"')
        
    elif current_os == "Darwin":  # macOS
        subprocess.call(["open", "-R", file_path])
        
    elif current_os == "Linux":
        try:
            # Try D-Bus first (Modern standard across GNOME, KDE, etc.)
            file_url = f"file://{file_path}"
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
                subprocess.run(["nautilus", "--select", file_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except (subprocess.CalledProcessError, FileNotFoundError):
                # Ultimate fallback: Just open the folder
                parent_dir = os.path.dirname(file_path)
                subprocess.run(["xdg-open", parent_dir])

class FileOpenerHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        # Allows your web app frontend to make requests to this local server
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        # Handle browser preflight CORS checks
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
                
                if file_path and os.path.exists(file_path):
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
                    self.wfile.write(json.dumps({"status": "error", "message": "File path does not exist."}).encode('utf-8'))
                    
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
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()

