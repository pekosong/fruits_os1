<template>
  <div class="start">
    <div class="wrapper">
      <div class="top">
        <div>
          <h1>{{status}} : {{selectedname}}</h1>
        </div>
      </div>
      <div class="main">
        <div class="left">
          <div>
            <div>
              <h3>딥러닝 기반 과일 선별중 by OS1</h3>
            </div>
            <video ref="video" id="video" width="1024px" height="768px" autoplay v-show="false"></video>
            <canvas
              style="border-radius: 10px;"
              ref="canvas"
              id="canvas"
              width="1024px"
              height="768px"
              v-show="true"
            ></canvas>
            <canvas ref="canvas1" id="canvas1" width="1024px" height="768px" v-show="false"></canvas>
          </div>
        </div>
        <div class="right">
          <div class="right-top">
            <div>
              <h4>선별결과 : {{result}}급 {{parseInt(prob * 100)}}%</h4>
            </div>

            <div style="text-align:center">
              <canvas
                style="border-radius: 10px;"
                ref="canvas2"
                id="canvas2"
                width="400px"
                height="400px"
                v-show="true"
              ></canvas>
            </div>
          </div>
          <div class="right-bot">
            <div>
              <h4>등급별 선별 현황</h4>
            </div>
            <div v-for="n in numbers" :key="n" class="container" v-show="show">
              <img
                :src="selectedimg"
                :style="{filter:'grayscale(' + (100 - (100 / n)) + '%)'}"
                style="width: 80px"
              >
              <h4 class="ml-2">{{ classes[numbers][n-1] }} 등급 : {{ count[numbers][n-1]}} 개</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="bot center">
        <div>
          <b-button size="lg" class="mr-2" variant="success" @click="detection">시작하기</b-button>
          <b-button size="lg" @click="backtohome">나가기</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import yolo, { downloadModel } from "tfjs-yolo-tiny";
import { setInterval, setTimeout } from "timers";

export default {
  name: "classification",
  props: ["selectedimg", "numbers", "selectedname", "selectedename"],
  data() {
    return {
      status: "선별 중",
      mobilenet: undefined,
      yolomodel: undefined,
      classes: {
        2: ["상", "하"],
        3: ["상", "중", "하"],
        4: ["상", "중", "하", "최하"]
      },
      real_classes: ["하", "상", "중"],
      result: "",
      prob: 0,
      count: {
        2: [0, 0],
        3: [0, 0, 0],
        4: [0, 0, 0, 0]
      },
      show: true,
      select: "orange",
      width: 1024,
      height: 768
    };
  },
  mounted() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.$refs.video.srcObject = stream;
          this.$refs.video.play();
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.loadyolomodel();
    this.loadmobilenet();
    setInterval(() => {
      this.play();
    }, 1000);
  },
  methods: {
    async loadyolomodel() {
      this.yolomodel = await downloadModel();
      await yolo(tf.zeros([1, 416, 416, 3]), this.yolomodel);
      console.log("yolo model 로딩 완료");
    },
    async loadmobilenet() {
      this.mobilenet = await tf.loadLayersModel(
        `https://raw.githubusercontent.com/pekosong/models/master/${
          this.select
        }/model.json`
      );
      this.mobilenet.predict(tf.zeros([1, 224, 224, 3])).dispose();
      console.log(this.select, "model 로딩완료");
    },

    // Loop 시작
    play() {
      try {
        this.$refs.canvas1
          .getContext("2d")
          .drawImage(this.$refs.video, 0, 0, this.width, this.height);

        this.detection();
      } catch (err) {}
    },

    // 과일 Detecting
    async detection() {
      let inputImage = tf.browser
        .fromPixels(this.$refs.canvas1)
        .resizeNearestNeighbor([416, 416])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();
      const boxes = await yolo(inputImage, this.yolomodel);
      console.log(boxes);
      let song = 0;
      boxes.forEach(box => {
        const { className } = box;

        if (className === this.selectedename) {
          this.status = "판별 중";
          console.log(this.selectedname);
          this.draw(box);
          this.classification();
          song += 1;
        }
      });
      if (song === 0) {
        this.$refs.canvas
          .getContext("2d")
          .drawImage(this.$refs.canvas1, 0, 0, this.width, this.height);
        this.status = `${this.selectedname} 감지 안 됨`;
        console.log(`${this.selectedname} 없음`);
      }
    },

    // Canvas의 Detecting된 과일에 Rectangle과 Label
    draw(box) {
      const { top, left, bottom, right, classProb, className } = box;
      const x = parseInt((left / 416) * this.width);
      const y = parseInt((top / 416) * this.height);
      const width = parseInt(((right - left) / 416) * this.width);
      const height = parseInt(((bottom - top) / 416) * this.height);

      this.$refs.canvas2
        .getContext("2d")
        .drawImage(this.$refs.canvas1, x, y, width, height, 0, 0, 400, 400);
      this.$refs.canvas
        .getContext("2d")
        .drawImage(this.$refs.canvas1, 0, 0, this.width, this.height);
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.font = "40px Arial";
      ctx.fillText(className, x, y - 10);
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.strokeRect(x, y, width, height);
    },

    // Canvas2에 Detecting된 과일 분류
    async classification() {
      let inputImage = tf.browser
        .fromPixels(this.$refs.canvas2)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();
      let predictions = await this.mobilenet.predict(inputImage);
      let results = Array.from(predictions.dataSync());
      this.result = this.real_classes[results.indexOf(Math.max(...results))];
      this.prob = Math.max(...results);

      if (this.numbers == 2) {
        if (this.result === "상") {
          this.count[this.numbers][0] += 1;
        } else {
          this.count[this.numbers][1] += 1;
        }
      } else if (this.numbers == 3) {
        if (this.result === "상") {
          this.count[this.numbers][0] += 1;
        } else if (this.result === "중") {
          this.count[this.numbers][1] += 1;
        } else {
          this.count[this.numbers][2] += 1;
        }
      } else {
        if (this.result === "상") {
          this.count[this.numbers][0] += 1;
        } else if (this.result === "중") {
          this.count[this.numbers][1] += 1;
        } else if (this.result === "하") {
          this.count[this.numbers][2] += 1;
        } else {
          this.count[this.numbers][3] += 1;
        }
      }

      this.show = false;
      this.show = true;
    },
    backtohome() {
      this.$emit("backto-home");
      this.yolomodel = null;
      this.mobilenet = null;
    }
  }
};
</script>

<style scoped>
.start {
  position: fixed;
  margin: 0 0 0 10vw;
  width: 90vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #dfe6e9;
}

.top {
  margin-bottom: 10px;
}
.main {
  display: flex;
}

.left {
  width: 70%;
  height: 82vh;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
}

.right {
  width: 30%;
  height: 82vh;
  margin-left: 20px;
}

.right-top {
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
}

.right-bot {
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
}

.bot {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.container {
  display: flex;
  align-items: center;
}

.wrapper {
  margin: 30px;
}
</style>
