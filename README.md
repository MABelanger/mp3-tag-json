# Setup

1. put your mp3 inside the data/mp3 folder (with or without subdirectory)

2. Start the main.sh
   ./main.sh

3. Press enter to continue or q to quit

Choose between step :

- Step1 : create a list of all mp3 inside of mp3 folder
- Step2 : Form the list of all mp3 keep or left (k/l) the mp3 to create a list of keep mp3
- Step3 : Tag the mp3

xfce4-keyboard-settings

```py
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class JsonHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1. Filter by path
        if self.path == '/send':
            # 2. Get the size of the data
            content_length = int(self.headers['Content-Length'])

            # 3. Read and decode the raw bytes to string
            post_data = self.rfile.read(content_length).decode('utf-8')

            try:
                # 4. Parse string into a Python dictionary
                data = json.loads(post_data)
                print(f"Decoded JSON: {data}")

                # 5. Send successful response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()

                response = {"status": "received", "your_data": data}
                self.wfile.write(json.dumps(response).encode('utf-8'))

            except json.JSONDecodeError:
                self.send_error(400, "Invalid JSON received")
        else:
            # Handle other paths with a 404
            self.send_error(404, "Endpoint not found")

# Run the server
server = HTTPServer(('', 8000), JsonHandler)
print("Listening on /send at port 8000...")
server.serve_forever()

```
