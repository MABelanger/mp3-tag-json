from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class CommandHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/run-my-command':
            # Put your Mac terminal command here
            os.system('open -a "Safari" https://google.com') 
            self.send_response(200)
            self.end_headers()

HTTPServer(('localhost', 8000), CommandHandler).serve_forever()