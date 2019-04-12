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
        <b-container class="left">
          <b-row class="title">실시간 선별 영상 - Real Time</b-row>
          <b-row class="left-video">
            <video ref="video" id="video" width="1024px" height="768px" autoplay v-show="false"></video>
            <canvas ref="canvas" id="canvas" width="1024px" height="768px" v-show="true"></canvas>
            <canvas ref="canvas1" id="canvas1" width="1024px" height="768px" v-show="false"></canvas>
            <canvas
              style="border-radius: 10px;"
              ref="cropfruits"
              id="cropfruits"
              width="300px"
              height="300px"
              v-show="false"
            ></canvas>
          </b-row>
        </b-container>
        <!-- Left-End -->

        <!-- Right -->
        <div class="right">
          <!-- Right-Top -->

          <b-container class="right-top">
            <b-row class="title">과일 선별 집계 현황</b-row>
            <b-row class="text p-4">
              <b-col v-for="n in numbers" :key="n" v-show="show">
                <b-button
                  size="lg"
                  block
                  variant="warning"
                >{{ classes[numbers][n-1] }} - {{ count[numbers][n-1]}} 개</b-button>
              </b-col>
            </b-row>
          </b-container>

          <!-- Right-Top-End -->

          <!-- Right-Bot -->
          <b-container class="right-bot">
            <b-row class="title">과일 선별 결과 누적</b-row>
            <b-row class="text">
              <b-col v-show="show">
                <b-card
                  v-for="(item, index) in oldtracker.slice().reverse().slice(0,5)"
                  :key="index"
                  no-body
                  class="card"
                >
                  <b-row no-gutters class="p-1">
                    <b-col md="2">
                      <b-card-img :src="item['img']"></b-card-img>
                    </b-col>
                    <b-col md="10">
                      <b-row class="text-center">
                        <b-col style="margin-top:20px" md="3">
                          <div>
                            <h4>ID:{{item["id"]}}</h4>
                          </div>
                          <div>
                            <h4>{{item["grade"]}}</h4>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>흡집</div>
                          <img
                            :src="selectedimg"
                            :style="{filter:'grayscale(' + (100 - (100 / 1 * ((item['grade'] == 'A급') ? 1 : 0) )) + '%)'}"
                            style="width: 45px"
                          >
                          <div>
                            <b-button size="sm" v-if="item['grade'] == 'A급'" variant="info">정상</b-button>
                            <b-button size="sm" v-else variant="danger">비정상</b-button>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>색깔</div>
                          <img
                            :src="selectedimg"
                            :style="{filter:'grayscale(' + (100 - (100 / 1 * 1)) + '%)'}"
                            style="width: 45px"
                          >
                          <div>
                            <b-button size="sm" v-if="1" variant="info">정상</b-button>
                            <b-button size="sm" v-else variant="danger">비정상</b-button>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>크기</div>
                          <img :src="selectedimg" :width="'45px'">
                          <div>
                            <b-button size="sm" variant="info">{{item['size']}}cm</b-button>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
          </b-container>
          <!-- Right-Bot-End -->
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
      show: true,
      width: 1024,
      height: 768,
      tracker: [],
      oldtracker: [],
      idx: 1,
      show: true
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
    }, 100);
  },
  methods: {
    async loadyolomodel() {
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
      this.$refs.canvas1
        .getContext("2d")
        .drawImage(this.$refs.video, 0, 0, this.width, this.height);
      if (this.yolomodel && this.mobilenet) {
        this.detection();
      }
    },

    // 과일 Detecting
    async detection() {
      const boxes = await this.yolomodel.predict(this.$refs.canvas1, {
        maxBoxes: 5,
        scoreThreshold: 0.2,
        iouThreshold: 0.5,
        numClasses: 3,
        anchors: [10, 14, 23, 27, 37, 58, 81, 82, 135, 169, 344, 319],
        classNames: ["orange", "apple", "tomato"],
        inputSize: 416
      });

      let classes = [];
      this.makecanvas();

      boxes.forEach(el => classes.push(el.class));

      // Detecting
      if (this.selectedename == "fruits") {
        this.status = "분류 중";
        this.updateposition(boxes);
      } else if (classes.includes(this.selectedename)) {
        this.status = "선별 중";
        let filteredboxses = boxes.filter(
          box => box.class == this.selectedename
        );
        this.updateposition(filteredboxses);
      } else {
        this.updateposition();
        this.status = `${this.selectedname} 감지 안 됨`;
      }
    },
    makecanvas() {
      this.$refs.canvas
        .getContext("2d")
        .drawImage(this.$refs.canvas1, 0, 0, 1024, 768);
    },

    // Canvas2에 Detecting된 과일 분류
    classification(box) {
      try {
        this.$refs.cropfruits
          .getContext("2d")
          .drawImage(
            this.$refs.canvas1,
            box.left,
            box.top,
            box.width,
            box.height,
            0,
            0,
            300,
            300
          );
        const img = this.$refs.cropfruits.toDataURL("image/png");

        const inputImage = this.preProcess(this.$refs.cropfruits);
        const predictions = this.mobilenet.predict(inputImage);

        const results = Array.from(predictions.dataSync());
        const result = this.classes[this.numbers][
          results.indexOf(Math.max(...results))
        ];
        if (this.numbers == 2) {
          if (result === "A급") {
            this.count[this.numbers][0] += 1;
          } else {
            this.count[this.numbers][1] += 1;
          }
        } else if (this.numbers == 3) {
          if (result === "A급") {
            this.count[this.numbers][0] += 1;
          } else if (this.result === "B급") {
            this.count[this.numbers][1] += 1;
          } else {
            this.count[this.numbers][2] += 1;
          }
        }
        return [result, img];
      } catch (err) {
        console.log(err);
      }
      this.show = false;
      this.show = true;
    },

    preProcess(img) {
      let offset = tf.scalar(127.5);
      return tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .sub(offset)
        .div(offset)
        .expandDims();
    },

    backtohome() {
      this.$emit("backto-home");
      this.yolomodel = null;
      this.mobilenet = null;
    },

    maketracker(box, now) {
      const newtracker = {
        id: this.idx,
        date: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        hour: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        last_pos: { cx: box["cx"], cy: box["cy"] },
        pos: { now: { cx: box["cx"], cy: box["cy"] } },
        cls: box["class"],
        gone: false,
        updated: false,
        box: box,
        grade: "선별중",
        img: "",
        size: parseInt(Math.min(box.width, box.height) / 20),
        come: 0,
        dis: 0
      };
      console.log("등록 완료");
      this.tracker.push(newtracker);
      this.idx += 1;
      (this.show = false), (this.show = true);
    },

    removeTrackers() {
      Object.keys(this.tracker).forEach(key => {
        if (!this.tracker[key]["updated"]) {
          this.tracker[key]["dis"] += 1;
          if (this.tracker[key]["dis"] > 10) {
            console.log("올드에 등록");
            this.oldtracker.push(this.tracker[key]);
            delete this.tracker[key];
            console.log("제거");
          }
        }
        if (this.tracker[key]) {
          this.tracker[key]["updated"] = false;
        }
      });
    },

    // Canvas의 Detecting된 과일에 Rectangle과 Label
    draw(box, cls, id, grade, size) {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.font = "30px sans-serif";
      ctx.fillText(`id:${id}-${cls} `, box.left, box.top - 10);
      ctx.font = "30px sans-serif";
      ctx.fillText(
        `${grade}`,
        box["left"] + box["width"] / 2 - 25,
        box["top"] + box["height"] / 2 - 20
      );
      ctx.fillText(
        `${size}cm`,
        box["left"] + box["width"] / 2 - 15,
        box["top"] + box["height"] / 2 + 20
      );
      ctx.lineWidth = "5";
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(box["left"], box["top"], box["width"], box["height"]);
    },

    caldistance(obj1, obj2) {
      // obj1과 obj2의 거리를 구함
      return Math.sqrt(
        Math.pow(Math.abs(obj2["cx"] - obj1["cx"]), 2) +
          Math.pow(Math.abs(obj2["cy"] - obj1["cy"]), 2)
      );
    },

    finddistance(boxes) {
      const afters = [];
      const befores = [];
      const dists = [];
      const new_boxes = [];
      let dst = [];

      boxes.forEach(box => {
        afters.push({ cx: box["cx"], cy: box["cy"] });
      });

      // tracker들의 각 마지막 위치를 구함
      Object.keys(this.tracker).forEach(key => {
        const last = this.tracker[key]["last_pos"];
        befores.push(last);
      });

      // 가장 가까운 거리를 구함
      befores.forEach(before => {
        afters.forEach(after => {
          dst.push(this.caldistance(before, after));
        });
        const idx = dst.indexOf(Math.min(...dst));

        new_boxes.push(boxes[idx]);
        dists.push(dst[idx]);
        dst = [];
      });

      // 가장 가까운 거리들 다음 위치와 박스 그리고 거리를 반환
      return [new_boxes, dists];
    },
    updateposition(boxes) {
      if (boxes) {
        boxes.forEach(box => {
          const cx = box["left"] + box["width"] / 2;
          const cy = box["top"] + box["height"] / 2;
          box["cx"] = cx;
          box["cy"] = cy;
        });

        // 현재 trackers 내 거리와 새로운 boxes의 거리를 구함
        const results = this.finddistance(boxes);
        let new_boxes = results[0];
        let new_dist = results[1];

        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }

        new_boxes = new_boxes.filter(onlyUnique);
        new_dist = new_dist.filter(onlyUnique);
        new_dist = new_dist.filter(x => x < 150);
        new_dist = new_dist.slice(0, new_boxes.length);

        // 거리가 가까운 순으로 정렬된 index 계산
        const len = new_dist.length;
        const indices = new Array(len);
        for (var i = 0; i < len; ++i) indices[i] = i;
        indices.sort(function(a, b) {
          return new_dist[a] < new_dist[b]
            ? -1
            : new_dist[a] > new_dist[b]
            ? 1
            : 0;
        });

        // 현재 시각 구함
        const now = new Date();

        // tracker의 key를 list로 가져옴
        const ppl = Object.keys(this.tracker);
        let z = 0;

        // 가장 가까운 순으로 정렬된 index를 id로 하여 새로운 tracker들을 update
        indices.forEach(id => {
          if (z < ppl.length && z < boxes.length) {
            if (!this.tracker[ppl[id]]["updated"]) {
              const new_pos = {
                cx: new_boxes[id]["cx"],
                cy: new_boxes[id]["cy"]
              };

              this.tracker[ppl[id]]["last_pos"] = new_pos;
              this.tracker[ppl[id]]["pos"][now] = new_pos;
              this.tracker[ppl[id]]["box"] = new_boxes[id];
              this.tracker[ppl[id]]["dis"] = 0;
              this.tracker[ppl[id]]["come"] += 1;
              this.tracker[ppl[id]]["updated"] = true;

              this.draw(
                this.tracker[ppl[id]]["box"],
                this.tracker[ppl[id]]["cls"],
                this.tracker[ppl[id]]["id"],
                this.tracker[ppl[id]]["grade"],
                this.tracker[ppl[id]]["size"]
              );
              if (
                this.tracker[ppl[id]]["grade"] == "선별중" &&
                this.tracker[ppl[id]]["come"] > 2 &&
                this.yolomodel &&
                this.mobilenet
              ) {
                let results = this.classification(this.tracker[ppl[id]]["box"]);
                this.tracker[ppl[id]]["grade"] = results[0];
                this.tracker[ppl[id]]["img"] = results[1];
              }
              z += 1;
            }
          }
        });
        this.removeTrackers();

        let difference = boxes.filter(box => !new_boxes.includes(box));
        if (difference) {
          difference.forEach(box => this.maketracker(box, now));
        }
      } else {
        this.removeTrackers();
      }
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
  height: 5vh;
}

.main {
  display: flex;
}

.wrapper {
  margin: 10px;
}

.left {
  width: 63%;
  height: 85vh;
  background-color: #fff;
  border-radius: 3px;
}

.left-video {
  padding: 20px;
  padding-top: 45px;
}

.right {
  width: 37%;
  height: 85vh;
  margin-left: 15px;
}

.right-top {
  height: 20%;
  border-radius: 3px;
}

.right-bot {
  height: 80%;
  width: 100%;
  border-radius: 3px;
  background-color: #fff;
}

.title {
  background-color: #303952;
  color: white;
  padding: 10px;
  font-size: 1.3rem;
}

.text {
  color: black;
  padding: 15px 0px;
  background-color: #fff;
}

.card {
  padding: 3px;
  margin-bottom: 5px;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
}

.bot {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
