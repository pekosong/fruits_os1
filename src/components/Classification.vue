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
              <canvas
                style="border-radius: 10px;"
                ref="cropfruits"
                id="cropfruits"
                width="300px"
                height="300px"
                v-show="false"
              ></canvas>
            </div>
          </div>
        </div>
        <!-- Left-End -->

        <!-- Right -->
        <div class="right">
          <!-- Right-Bot -->
          <div>
            <h4>등급별 선별 현황</h4>
          </div>
          <b-container class="right-top">
            <b-row class="results">
              <b-col v-for="n in numbers" :key="n" v-show="show" class="center">
                <img
                  :src="selectedimg"
                  :style="{filter:'grayscale(' + (100 - (100 / n)) + '%)'}"
                  style="width: 100px;"
                >
                <b-button
                  size="lg"
                  block
                  variant="dark"
                >{{ classes[numbers][n-1] }} - {{ count[numbers][n-1]}} 개</b-button>
              </b-col>
            </b-row>
          </b-container>

          <div>
            <h4>등급 선별 결과</h4>
          </div>
          <b-container class="right-bot">
            <b-row>
              <b-col v-show="show" style="width: 670px">
                <b-card
                  v-for="(item, index) in oldtracker.slice().reverse().slice(0,5)"
                  :key="index"
                  no-body
                  class="mb-1"
                  style="max-height: 120px; border-bottom: 1px solid black;"
                >
                  <b-row no-gutters class="p-1">
                    <b-col style="margin-top:2px" md="2">
                      <b-card-img :src="item['img']" class="rounded-0"></b-card-img>
                    </b-col>
                    <b-col md="10">
                      <b-row align-h="center" class="text-center">
                        <b-col style="margin-top:15px" md="2">
                          <div>
                            <h4>ID:{{item["id"]}}</h4>
                          </div>
                          <div>
                            <h3>{{item["grade"]}}</h3>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>흡집</div>
                          <div>
                            <img
                              :src="selectedimg"
                              :style="{filter:'grayscale(' + (100 - (100 / 1 * ((item['grade'] == 'A급') ? 1 : 0) )) + '%)'}"
                              style="width: 45px"
                            >
                            <div>
                              <b-button size="sm" v-if="item['grade'] == 'A급'" variant="info">정상</b-button>
                              <b-button size="sm" v-else variant="danger">비정상</b-button>
                            </div>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>색깔</div>
                          <div>
                            <img
                              :src="selectedimg"
                              :style="{filter:'grayscale(' + (100 - (100 / 1 * color)) + '%)'}"
                              style="width: 45px"
                            >
                            <div>
                              <b-button size="sm" v-if="color" variant="info">정상</b-button>
                              <b-button size="sm" v-else variant="danger">비정상</b-button>
                            </div>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>크기</div>
                          <div>
                            <img
                              :src="selectedimg"
                              :width="'45px'"
                            >
                            <div>
                              <b-button size="sm" variant="info">{{item['size']}}cm</b-button>
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-card>
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
      color: 1,
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
    this.loadyolomodel1();
    this.loadmobilenet();
    setInterval(() => {
      this.play();
    }, 200);
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
        scoreThreshold: 0.6,
        iouThreshold: 0.5,
        numClasses: 3,
        classNames: ["orange", "apple", "tomato"],
        inputSize: 416
      });

      let song = 0;
      this.makecanvas();

      // Detecting
      if (this.selectedename == "fruits") {
        this.tracker.updateposition(boxes);
        this.status = "분류 중";
        song += 1;
      } else {
        this.status = "선별 중";
        this.updateposition(boxes);
        song += 1;
      }

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

    // Canvas2에 Detecting된 과일 분류
    classification(box) {
      try {
        const left = parseInt(box.left);
        const top = parseInt(box.top);
        const width = parseInt(box.width);
        const height = parseInt(box.height);

        this.$refs.cropfruits
          .getContext("2d")
          .drawImage(
            this.$refs.canvas1,
            left,
            top,
            width,
            height,
            0,
            0,
            300,
            300
          );
        const img = this.$refs.cropfruits.toDataURL("image/png");

        const inputImage = tf.browser
          .fromPixels(this.$refs.cropfruits)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(tf.scalar(255))
          .expandDims();

        const predictions = this.mobilenet.predict(inputImage);
        const results = Array.from(predictions.dataSync());
        const result = this.classes[this.numbers][
          results.indexOf(Math.max(...results))
        ];
        this.quality = result == "A급" ? 1 : 0;
        this.prob = Math.max(...results);

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
    backtohome() {
      this.$emit("backto-home");
      this.yolomodel = null;
      this.mobilenet = null;
    },
    maketracker(pos, cls, box, now) {
      this.tracker[this.idx] = {};
      this.tracker[this.idx]["id"] = this.idx;

      const cx = box.left - box.width / 2;
      const cy = box.top - box.height / 2;
      this.tracker[this.idx]["last_pos"] = { cx: cx, cy: cy };

      this.tracker[this.idx]["day"] = `${now.getMonth() +
        1}월 ${now.getDate()}일`;
      this.tracker[this.idx][
        "hr"
      ] = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      this.tracker[this.idx]["pos"] = pos;
      this.tracker[this.idx]["come"] = 0;
      this.tracker[this.idx]["dis"] = 0;
      this.tracker[this.idx]["cls"] = cls;
      this.tracker[this.idx]["gone"] = false;
      this.tracker[this.idx]["updated"] = false;
      this.tracker[this.idx]["box"] = box;
      this.tracker[this.idx]["grade"] = "선별중";
      this.tracker[this.idx]["img"] = "";

      this.tracker[this.idx]["size"] = parseInt(
        Math.min(box.width, box.height) / 20
      );
      this.idx += 1;
      (this.show = false), (this.show = true);
    },
    caldistance(obj1, obj2) {
      const cx1 = obj1["cx"];
      const cy1 = obj1["cy"];
      const cx2 = obj2["cx"];
      const cy2 = obj2["cy"];

      // obj1과 obj2의 거리를 구함
      return Math.sqrt(
        Math.pow(Math.abs(cx2 - cx1), 2) + Math.pow(Math.abs(cy2 - cy1), 2)
      );
    },

    // Canvas의 Detecting된 과일에 Rectangle과 Label
    draw(box,  cls, id, grade, size) {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.font = "30px sans-serif";
      ctx.fillText(`id:${id}-${cls} `, box.left, box.top - 10);
      ctx.font = "30px sans-serif";
      ctx.fillText(`${grade}`, box.left + box.width / 2 - 25, box.top + box.height / 2 - 20);
      ctx.fillText(`${size}cm`, box.leftft + box.width / 2 - 15, box.top + box.height / 2 + 20);
      ctx.lineWidth = "5";
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(box.left, box.top, box.width, box.height);
    },

    finddistance(afters, boxes) {
      const befores = [];
      const dists = [];
      const new_afters = [];
      const new_boxes = [];
      let dst = [];

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

        new_afters.push(afters[idx]);
        new_boxes.push(boxes[idx]);
        dists.push(dst[idx]);
        dst = [];
      });

      // 가장 가까운 거리들 다음 위치와 박스 그리고 거리를 반환
      return [new_afters, new_boxes, dists];
    },
    updateposition(boxes) {
      try {
        const afters = [];

        // boxes에서 cx, cy 값 반환
        boxes.forEach(box => {
          const cx = box.left - box.width / 2;
          const cy = box.top - box.height / 2;
          afters.push({ cx: cx, cy: cy });
        });

        // 현재 trackers 내 거리와 새로운 boxes의 거리를 구함
        const results = this.finddistance(afters, boxes);
        const new_afters = results[0];
        const new_boxes = results[1];
        const new_dist = results[2];

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
              this.tracker[ppl[id]]["dis"] = 0;
              this.tracker[ppl[id]]["come"] += 1;
              this.tracker[ppl[id]]["last_pos"] = new_afters[id];
              this.tracker[ppl[id]]["pos"][now] = new_afters[id];
              this.tracker[ppl[id]]["box"] = new_boxes[id];
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
                this.tracker[ppl[id]]["come"] > 5
              ) {
                let results = this.classification(this.tracker[ppl[id]]["box"]);
                this.tracker[ppl[id]]["grade"] = results[0];
                this.tracker[ppl[id]]["img"] = results[1];
              }
              z += 1;
            }
          }
        });

        Object.keys(this.tracker).forEach(key => {
          if (!this.tracker[key]["updated"]) {
            this.tracker[key]["dis"] += 1;
            if (this.tracker[key]["dis"] > 10) {
              console.log("올드에 등록");
              this.oldtracker.push(this.tracker[key]);
              console.log(this.oldtracker);
              delete this.tracker[key];
              console.log("제거");
            }
          }
          try {
            this.tracker[key]["updated"] = false;
          } catch (err) {}
        });

        function song(box) {
          const cx = box.left - box.width / 2;
          return !xs.includes(cx);
        }

        let xs = [];
        new_boxes.forEach(el => xs.push(el.left - el.width / 2));
        if (boxes.length > z) {
          boxes.filter(song).forEach(box => {
            console.log("등록");
            const new_tracker = {};
            const cx = box.left - box.width / 2;
            const cy = box.top - box.height / 2;
            new_tracker[now] = { cx: cx, cy: cy };
            this.maketracker(new_tracker, box.class, box, now);
          });
        }
      } catch (err) {
        console.log(err);
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
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}

.right-bot {
  min-height: 55vh;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
}

.bot {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.results {
  margin-left: 0;
  width: 100%;
  height: 150px;
}

.container {
  display: flex;
}

.wrapper {
  margin: 30px;
}
</style>
