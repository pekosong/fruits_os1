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

    # 박스 처리
    box = req['box']
    left = box['left']
    right = box['right']
    bottom = box['bottom']
    top = box['top']
    width = box['width']

    left = int(left)
    right = int(right)
    bottom = int(bottom)
    top = int(top)

    margin = int(width * 0.2)

    left = left - margin
    right = right + margin

    top = top - margin
    bottom = bottom + margin    

    # 이미지 처리
    encoded_image = req['img'].split(",")[1]
    decoded_image = base64.b64decode(encoded_image)
    img = Image.open(BytesIO(decoded_image))
    img = img.resize((1024, 768), Image.ANTIALIAS)
    img = np.asarray(img, dtype='uint8')    
    img = img[:,:,:3]
    
    roi = img[top:bottom, left:right]
    roi = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
    print(roi.shape)

    # Classification

    # Calculate Size and Color disturibution

    # Dobot Control

    return "success"

# Yolo Model API
@app.route("/api/<path:filename>", methods=["GET"])
def files(filename):
    return send_from_directory(directory='static', filename=filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)