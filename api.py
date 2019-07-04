from flask import Flask, request, send_from_directory
from flask_cors import CORS
from keras.models import load_model

from PIL import Image
from io import BytesIO

import keras.applications as models
import tensorflow as tf

import json
import base64

import numpy as np
import cv2
import io
import time

app = Flask(__name__, static_folder="static")
CORS(app)

model = ""

def makePredict(img):
    global model
    img = cv2.resize(img, (224, 224))
    img = img.astype(np.float32)
    img = models.resnet50.preprocess_input(img)    
    img = np.expand_dims(img, axis=0)
    result = model.predict(img)
    return result

# Load Model
@app.route("/loadmodel/<path:modelname>", methods=["GET"])
def loadmodel(modelname):
    global model
    model = load_model("static/apple/apple_soft.hdf5")
    model._make_predict_function()
    model.predict(np.zeros((1, 224, 224, 3)))
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

    # margin = int(width * 0.05)
    # left = left - margin
    # right = right + margin

    # top = top - margin
    # bottom = bottom + margin    

    # 이미지 처리
    encoded_image = req['img'].split(",")[1]
    decoded_image = base64.b64decode(encoded_image)
    img = Image.open(BytesIO(decoded_image))
    img = img.resize((1024, 768), Image.ANTIALIAS)
    img = np.asarray(img, dtype='uint8')    
    img = img[:,:,:3]
    
    # 1) Fault Classification
    pred = makePredict(img[top:bottom, left:right])
    print(pred)
    # pred = "0" if pred[0] > 0.95 else "1"
    pred = np.argmax(pred[0])    
    pred = "1" if pred == 0 else "0"

    # 2) Calculate Size

    size = max(box["height"], box["width"])
    distance = 30 # from Object to Camera
    rescale = 1
    size = "{:.1f}".format(float((size * rescale) / distance))

    # 3) Color distribution

    # 4) Image 
    resized = cv2.resize(img[top:bottom, left:right], (300, 300))
    im = Image.fromarray(resized.astype("uint8"))
    rawBytes = io.BytesIO()
    im.save(rawBytes, "PNG")
    rawBytes.seek(0)
    img = base64.b64encode(rawBytes.read()).decode("utf-8")

    # Dobot Control


    result = {
        "size": size,
        "fault": pred,
        "color":"0",
        "img": img
    }
    return json.dumps(result)

# Yolo Model API
@app.route("/api/<path:filename>", methods=["GET"])
def files(filename):
    return send_from_directory(directory='static', filename=filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)