from flask import Flask, request, send_from_directory
from flask_cors import CORS
import json
import base64
from PIL import Image
from io import BytesIO
import numpy as np
import cv2

import time

app = Flask(__name__, static_folder="static")
CORS(app)

model = ""

# Load Model
@app.route("/loadmodel/<path:modelname>", methods=["GET"])
def loadmodel(modelname):
    print(modelname)
    return f"{modelname} Model Loaded"

# Make a Classification and do jobs
@app.route("/predict", methods=["POST"])
def predict():
    start = time.time()
    req = json.loads(request.data)

    encoded_image = req['img'].split(",")[1]
    decoded_image = base64.b64decode(encoded_image)

    img = Image.open(BytesIO(decoded_image))
    img = img.resize((300, 300), Image.ANTIALIAS)
    img = np.asarray(img, dtype='uint8')    
    img = img[:,:,:3]

    # Classification

    # Calculate Size and Color disturibution

    # Dobot Control

    return "success"

# Yolo Model API
@app.route("/api/<path:filename>", methods=["GET"])
def files(filename):
    return send_from_directory(directory='static', filename=filename)

if __name__ == "__main__":
    app.run(debug=True)