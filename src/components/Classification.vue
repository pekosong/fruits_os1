<template>
  <div class="start">
    <div class="wrapper">
      <!-- Top -->
      <div class="top">
        <div>
          <h1>{{status}} : {{selectedname}}</h1>
        </div>
      </div>
      <!-- Top-end -->

      <!-- Main -->
      <div class="main">
        <!-- Left -->
        <div class="left">
          <div class="center">
            <div>
              <h1>딥러닝 기반 과일 선별중 by OS1</h1>
            </div>
            <div class="center">
              <video ref="video" id="video" width="800px" height="600px" autoplay v-show="false"></video>
              <canvas
                style="border-radius: 10px;"
                ref="canvas"
                id="canvas"
                width="800px"
                height="600px"
                v-show="true"
              ></canvas>
              <canvas ref="canvas1" id="canvas1" width="800px" height="600px" v-show="false"></canvas>
            </div>
          </div>
        </div>
        <!-- Left-End -->

        <!-- Right -->
        <div class="right">
          <!-- Right-Top -->
          <div class="right-top">
            <div>
              <h4>선별결과 : {{result}} {{parseInt(prob * 100)}}%</h4>
            </div>

            <div style="text-align:center">
              <canvas
                style="border-radius: 10px;"
                ref="canvas2"
                id="canvas2"
                width="300px"
                height="300px"
                v-show="true"
              ></canvas>
            </div>
          </div>
          <!-- Right-Top-End -->

          <!-- Right-Bot -->
          <div>
            <h4>등급 선별 결과</h4>
          </div>

          <b-container class="right-bot">
            <b-row style="width:100%">
              <b-col class="quality text-center">
                <div>
                  <h3>흠집</h3>
                </div>
                <div>
                  <img
                    :src="selectedimg"
                    :style="{filter:'grayscale(' + (100 - (100 / 1 * quality)) + '%)'}"
                    style="width: 80px"
                  >
                  <div>
                    <b-button v-if="quality" variant="info" size="lg">정상</b-button>
                    <b-button v-else variant="danger" size="lg">비정상</b-button>
                  </div>
                </div>
              </b-col>
              <b-col class="color text-center">
                <div>
                  <h3>색깔</h3>
                </div>
                <div>
                  <img
                    :src="selectedimg"
                    :style="{filter:'grayscale(' + (100 - (100 / 1 * color)) + '%)'}"
                    style="width: 80px"
                  >
                  <div>
                    <b-button v-if="color" variant="info" size="lg">정상</b-button>
                    <b-button v-else variant="danger" size="lg">비정상</b-button>
                  </div>
                </div>
              </b-col>
              <b-col class="size text-center">
                <div>
                  <h3>크기</h3>
                </div>
                <div>
                  <img
                    :src="selectedimg"
                    :style="{filter:'grayscale(' + 0 + '%)'}"
                    style="width: 80px"
                  >
                  <div>
                    <b-button variant="info" size="lg">{{size}}cm</b-button>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-container>
          <!-- Right-Bot-End -->

          <div>
            <h4>등급별 선별 현황</h4>
          </div>
          <b-container class="right-bot">
            <b-row class="results">
              <b-col v-for="n in numbers" :key="n" v-show="show" class="center">
                <img
                  :src="selectedimg"
                  :style="{filter:'grayscale(' + (100 - (100 / n)) + '%)'}"
                  style="width: 80px;"
                >
                <b-button
                  size="lg"
                  block
                  variant="dark"
                >{{ classes[numbers][n-1] }} - {{ count[numbers][n-1]}} 개</b-button>
              </b-col>
            </b-row>
          </b-container>
        </div>
        <!-- Right End -->
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
import { setInterval, setTimeout } from "timers";
import yolo from "tfjs-yolo";

export default {
  name: "classification",
  props: ["selectedimg", "numbers", "selectedname", "selectedename"],
  data() {
    return {
      status: "선별 중",
      mobilenet: undefined,
      yolomodel: undefined,
      classes: {
        2: ["A급", "B급"],
        3: ["A급", "B급", "C급"],
        4: ["A급", "B급", "C급", "D급"]
      },
      count: {
        2: [0, 0],
        3: [0, 0, 0],
        4: [0, 0, 0, 0]
      },
      result: "",
      prob: 0,
      show: true,
      width: 800,
      height: 600,
      size: 0,
      quality: 1,
      color: 1
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
    this.loadyolomodel1();
    this.loadmobilenet();
    setInterval(() => {
      this.play();
    }, 500);
  },
  methods: {
    async loadyolomodel1() {
      this.yolomodel = await yolo.v3tiny(
        "https://raw.githubusercontent.com/pekosong/models/master/three/model.json"
      );
      console.log("yolo model 로딩 완료");
    },
    async loadmobilenet() {
      const modelname = `https://raw.githubusercontent.com/pekosong/models/master/${
        this.selectedename
      }${this.numbers}/model.json`;
      console.log(modelname, "로딩시작");
      this.mobilenet = await tf.loadLayersModel(modelname, false);
      this.mobilenet.predict(tf.zeros([1, 224, 224, 3])).dispose();
      console.log(this.selectedename, "model 로딩완료");
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
      const boxes = await this.yolomodel.predict(this.$refs.canvas1, {
        maxBoxes: 5,
        scoreThreshold: 0.2,
        iouThreshold: 0.5,
        numClasses: 3,
        classNames: ["orange", "apple", "tomato"],
        inputSize: 416
      });

      let song = 0;
      this.makecanvas();

      // Detecting
      boxes.forEach(box => {
        const className = box.class;

        if (this.selectedename == "fruits") {
          this.draw(box);
          this.status = "분류 중";
          song += 1;
        }

        if (className === this.selectedename) {
          this.status = "선별 중";
          console.log(this.selectedname);

          this.draw(box);
          this.classification();
          song += 1;
        }
      });

      // Not Detecting
      if (song === 0) {
        this.status = `${this.selectedname} 감지 안 됨`;
        console.log(`${this.selectedname} 없음`);
      }
    },
    makecanvas() {
      this.$refs.canvas
        .getContext("2d")
        .drawImage(this.$refs.canvas1, 0, 0, this.width, this.height);
    },

    // Canvas의 Detecting된 과일에 Rectangle과 Label
    draw(box) {
      const x = parseInt(box.left);
      const y = parseInt(box.top);
      const width = parseInt(box.width);
      const height = parseInt(box.height);      
      this.size = parseInt(Math.min(width, height) / 20);

      this.$refs.canvas2
        .getContext("2d")
        .drawImage(this.$refs.canvas1, x, y, width, height, 0, 0, 300, 300);

      const ctx = this.$refs.canvas.getContext("2d");
      ctx.font = "40px Arial";
      ctx.fillText(box.class, x, y - 10);
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.strokeRect(x, y, width, height);
    },

    // Canvas2에 Detecting된 과일 분류
    async classification() {
      try {
        const inputImage = tf.browser
        .fromPixels(this.$refs.canvas2)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();

      const predictions = await this.mobilenet.predict(inputImage);
      const results = Array.from(predictions.dataSync());
      this.result = this.classes[this.numbers][
        results.indexOf(Math.max(...results))
      ];
      console.log(this.result)
      this.quality = this.result == "A급" ? 1 : 0;
      this.prob = Math.max(...results);

      if (this.numbers == 2) {
        if (this.result === "A급") {
          this.count[this.numbers][0] += 1;
        } else {
          this.count[this.numbers][1] += 1;
        }
      } else if (this.numbers == 3) {
        if (this.result === "A급") {
          this.count[this.numbers][0] += 1;
        } else if (this.result === "B급") {
          this.count[this.numbers][1] += 1;
        } else {
          this.count[this.numbers][2] += 1;
        }
      } else {
        if (this.result === "A급") {
          this.count[this.numbers][0] += 1;
        } else if (this.result === "B급") {
          this.count[this.numbers][1] += 1;
        } else if (this.result === "C급") {
          this.count[this.numbers][2] += 1;
        } else {
          this.count[this.numbers][3] += 1;
        }
      }
      }
    catch (err) {}

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
  width: 60%;
  height: 82vh;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
}

.right {
  width: 40%;
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
  margin-bottom: 20px;
}

.bot {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.results {
  width: 100%;
  height: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;
}

.wrapper {
  margin: 30px;
}
</style>
