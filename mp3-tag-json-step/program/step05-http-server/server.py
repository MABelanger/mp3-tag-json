import os
import sys
import http.server
import socketserver

# Specify the desired folder path here
# Use an absolute path for reliability, e.g., "/Users/YourName/Desktop/my_website_files"
directory_to_serve = sys.argv[1]
port = 8000

# Change the current working directory
os.chdir(directory_to_serve)

Handler = http.server.SimpleHTTPRequestHandler

# Start the server
with socketserver.TCPServer(("", port), Handler) as httpd:
    print(f"Serving directory: {directory_to_serve}")
    print(f"Serving at port: {port}")
    httpd.serve_forever()