from flask import Flask, request, send_from_directory
from flask_cors import CORS
import json
import base64
from PIL import Image
from io import BytesIO
import numpy as np
import cv2

app = Flask(__name__, static_folder="static")
CORS(app)

@app.route("/", methods=["POST"])
def home():
    req = json.loads(request.data)

    encoded_image = req['img'].split(",")[1]
    decoded_image = base64.b64decode(encoded_image)

    img = Image.open(BytesIO(decoded_image))
    img = img.resize((300, 300), Image.ANTIALIAS)
    img = np.asarray(img, dtype='uint8')    
    img = img[:,:,:3]

    return "success"

@app.route("/api/<path:filename>", methods=["GET"])
def files(filename):
    return send_from_directory(directory='static', filename=filename)

if __name__ == "__main__":
    app.run(debug=True)