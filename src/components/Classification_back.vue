<template>
  <div class="class-item">
    <div class="class-item-wrapper">
      <!-- Top -->
      <div class="class-item-top">
        <div>
          <h1>{{status}} : {{selectedName}}</h1>
        </div>
      </div>
      <!-- Top-end -->

      <!-- Main -->
      <div class="class-item-main">
        <!-- Left -->
        <b-container class="class-item-left">
          <b-row class="class-item-title">실시간 선별 영상 - Real Time</b-row>
          <b-row class="class-item-left-video">
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
        <div class="class-item-right">
          <!-- Right-Top -->

          <b-container class="class-item-right-top">
            <b-row class="class-item-title">과일 선별 집계 현황</b-row>
            <b-row v-for="n in grade" :key="n" v-show="show" class="class-item-text p-2 border">
              <b-col class="col-2" style="color:red;font-size:1.3rem">{{ n }} 등급 </b-col>
              <b-col class="col-2">흠: {{ defect[selectedMatrix[n].defect] }}</b-col>
              <b-col class="col-2">착색: {{ selectedMatrix[n].color }}</b-col>
              <b-col class="col-4">크기: {{ selectedMatrix[n].size }}cm 이상</b-col>
              <b-col class="col-2" style="color:blue;font-size:1.3rem">{{ count[grade][n-1] }} 개</b-col>
            </b-row>
          </b-container>

          <!-- Right-Top-End -->

          <!-- Right-Bot -->
          <b-container class="class-item-right-bot">
            <b-row class="class-item-title">과일 선별 결과 누적</b-row>
            <b-row class="class-item-text">
              <b-col v-show="show">
                <b-card
                  v-for="(item, index) in oldtracker.slice().reverse().slice(0,5)"
                  :key="index"
                  no-body
                  @click="showIndex(index)"
                  class="class-item-card"
                >
                  <b-row no-gutters class="p-1">
                    <b-col md="2">
                      <b-card-img :src="item['img']"></b-card-img>
                    </b-col>
                    <b-col md="10">
                      <b-row class="text-center">
                        <b-col style="margin-top:20px" md="3">
                          <div>
                            <h4>ID:{{item["cnt"]}}</h4>
                          </div>
                          <div>
                            <h4>{{item["grade"]}}</h4>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>흡집</div>
                          <img
                            :src="selectedImg"
                            :style="{filter:'grayscale(' + (100 - (100 / 1 * ((item['grade'] == '유') ? 1 : 0) )) + '%)'}"
                            style="width: 45px"
                          >
                          <div>
                            <b-button size="sm" v-if="item['grade'] == '유'" variant="info">정상</b-button>
                            <b-button size="sm" v-else variant="danger">비정상</b-button>
                          </div>
                        </b-col>
                        <b-col md="3">
                          <div>착색</div>
                          <img
                            :src="selectedImg"
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
                          <img :src="selectedImg" :width="'45px'">
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
      <div class="class-item-bot center">
        <div>
          <b-button size="lg" class="mr-2" variant="success" @click="detectObj">시작하기</b-button>
          <b-button size="lg" @click="backToHome">나가기</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import { setInterval } from "timers";
import yolo from "tfjs-yolo";

export default {
  name: "classification",
  props: [
    "selectedImg",
    "selectedName",
    "selectedEname",
    "selectedMatrix",
    "grade",
  ],
  data() {
    return {
      defect: { 0: "무", 1: "유" },
      color: { 1: "상", 2: "중", 3: "하" },
      status: "선별 중",
      mobilenet: undefined,
      yolomodel: undefined,
      classes: ["유", "무"],
      count: {
        2:[0, 0],
        3:[0, 0, 0],
        4:[0, 0, 0, 0]
      },
      width: 1024,
      height: 768,
      tracker: [],
      oldtracker: [],
      idx: 1,
      show: true,
      cnt: 1,
      numbers: 2
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
    
    this.axios
      .get(`http://localhost:5000/loadmodel/${this.selectedEname}`)
      .then(result => {
        console.log(result.data)
      })
      .catch(err => {
        console.log(err.response)
      })

    this.loadYolomodel();
    this.loadMobilenet();
    setInterval(() => {
      this.play();
    }, 100);
  },
  methods: {    
    showIndex(idx) {
      console.log(idx);
    },

    // Yolo V3 Model + Classification Model Loading
    async loadYolomodel() {
      this.yolomodel = await yolo.v3tiny(`http://localhost:5000/api/${this.$route.params.category}5/model.json`);
      console.log("yolo model 로딩 완료");
    },
    async loadMobilenet() {      
      const modelname = `http://localhost:5000/api/${this.selectedEname}2/model.json`;
      console.log(modelname, "로딩시작");
      this.mobilenet = await tf.loadLayersModel(modelname, false);
      this.mobilenet.predict(tf.zeros([1, 224, 224, 3])).dispose();
      console.log(this.selectedEname, "model 로딩완료");
    },

    // Loop 시작
    play() {
      try {
        this.$refs.canvas1
          .getContext("2d")
          .drawImage(this.$refs.video, 0, 0, this.width, this.height);
        if (this.yolomodel && this.mobilenet) {
          this.detectObj();
        }
      } catch { err => {
        console.log(err);
      }}
    },

    // Yolo Model로 과일 / 야채 Detecting
    async detectObj() {
      const boxes = await this.yolomodel.predict(this.$refs.canvas1, {
        maxBoxes: 5,
        scoreThreshold: 0.2,
        iouThreshold: 0.5,
        numClasses: 5,
        anchors: [10, 14, 23, 27, 37, 58, 81, 82, 135, 169, 344, 319],
        classNames: ["apple", "tomato", "pear", "orange", "peach"],
        inputSize: 416
      });

      let classes = [];
      this.makeCanvas();

      boxes.forEach(el => classes.push(el.class));

      // 과일 / 야채가 Detected되면 Position Update
      if (this.selectedEname == "fruits") {
        this.status = "분류 중";
        this.updatePosition(boxes);
      } else if (classes.includes(this.selectedEname)) {
        this.status = "선별 중";
        let filteredboxses = boxes.filter(
          box => box.class == this.selectedEname
        );
        this.updatePosition(filteredboxses);
      } else {
        this.updatePosition();
        this.status = `${this.selectedEname} 감지 안 됨`;
      }
    },

    // 화면 출력 
    makeCanvas() {
      try {
        this.$refs.canvas
          .getContext("2d")
          .drawImage(this.$refs.canvas1, 0, 0, 1024, 768);
      } catch { err => {
        console.log(err)
      }}
    },

    // Canvas2에 Detected된 과일 / 야채 분류
    classification(box) {
      try {
        console.log(box)
        const img = this.$refs.canvas1.toDataURL("image/png");
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
        const cropimg = this.$refs.cropfruits.toDataURL("image/png");
        const inputImage = this.preProcess(this.$refs.cropfruits);
        const predictions = this.mobilenet.predict(inputImage);

        let size1 = 0

        // Axios Post request
        size1 = this.axios
        .post(`http://localhost:5000/predict`, {
          name: 'song',
          img: img,
          box: box
        })
        .then(result => {
          return result.data
        })
        .catch(err => {
        console.log(err.response)
        })

        const results = Array.from(predictions.dataSync());
        const fault = this.classes[results.indexOf(Math.max(...results))];
        const size = 9
        const color = 2

        let result = ""
        
        if (this.grade == 2) {
          if (fault == this.selectedMatrix[1].defect && size >= this.selectedMatrix[1].size && color == this.selectedMatrix[1].color) {
            this.count[this.grade][0] += 1;
            result = "1급"
          } else {
            this.count[this.grade][1] += 1;
            result = "2급"
          }
        } else if (this.grade == 3) {
          if (fault == this.selectedMatrix[1].defect && size >= this.selectedMatrix[1].size && color == this.selectedMatrix[1].color) {
            this.count[this.grade][0] += 1;
            result = "1급"
          } else if (fault == this.selectedMatrix[2].defect && size >= this.selectedMatrix[2].size && color == this.selectedMatrix[2].color) {
            this.count[this.grade][1] += 1;
            result = "2급"
          } else {
            this.count[this.grade][2] += 1;
            result = "3급"
          }
        } else {
          if (fault == this.selectedMatrix[1].defect && size >= this.selectedMatrix[1].size && color == this.selectedMatrix[1].color) {
            this.count[this.grade][0] += 1;
            result = "1급"
          } else if (fault == this.selectedMatrix[2].defect && size >= this.selectedMatrix[2].size && color == this.selectedMatrix[2].color) {
            this.count[this.grade][1] += 1;
            result = "2급"
          } else if (fault == this.selectedMatrix[2].defect && size >= this.selectedMatrix[2].size && color == this.selectedMatrix[2].color) {
            this.count[this.grade][2] += 1;
            result = "3급"
          } else {
            this.count[this.grade][3] += 1;
            result = "4급"
          }
        }

        console.log(result)
        // 분류 결과, 이미지, 크기 
        return [fault, cropimg, size1];
      } catch (err) {
        console.log(err);
      }
      this.show = false;
      this.show = true;
    },

    // 분류 전 전처리 진행
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

    // 홈으로 이동하고 모델 초기화
    backToHome() {
      this.$emit("backto-home");
      this.yolomodel = null;
      this.mobilenet = null;
    },

    // Canvas의 Detected된 야채에 Rectangle과 Label 그리기
    draw(box, cls, grade, size) {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.font = "36px sans-serif";
      ctx.fillStyle = "#FFA500";
      ctx.fillText(`${cls} `, box.left, box.top - 10);
      ctx.font = "30px sans-serif";
      ctx.fillStyle = "#3498db";
      ctx.fillText(
        `${grade}`,
        box["left"] + box["width"] / 2 - 25,
        box["top"] + box["height"] / 2 - 20
      );
      ctx.fillStyle = "#2ecc71";
      ctx.fillText(
        `${size}cm`,
        box["left"] + box["width"] / 2 - 15,
        box["top"] + box["height"] / 2 + 20
      );      
      ctx.lineWidth = "5";
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(box["left"], box["top"], box["width"], box["height"]);
    },

    // 새로운 객체 Detected되면 등록
    makeTracker(box, now) {
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
        // size: parseInt(Math.min(box.width, box.height) / 25),
        size: "",
        come: 0,
        dis: 0,
        color: "",
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
        }
        // 특정 지점에 있으면 Tracking 중지
        // 객체 삭제 및 올드에 등록
        if (this.tracker[key]["dis"] > 10) {
          console.log("올드에 등록");
          if (this.tracker[key]["grade"] != "선별중") {
            this.tracker[key]["cnt"] = this.cnt;
            // console.log(this.tracker[key]);
            this.oldtracker.push(this.tracker[key]);
            this.cnt += 1;
          }
          delete this.tracker[key];
        }
        if (this.tracker[key]) {
          this.tracker[key]["updated"] = false;
        }
      });
    },

    calculateDistance(obj1, obj2) {
      // obj1과 obj2의 거리를 구함
      return Math.sqrt(
        Math.pow(Math.abs(obj2["cx"] - obj1["cx"]), 2) +
          Math.pow(Math.abs(obj2["cy"] - obj1["cy"]), 2)
      );
    },

    findDistance(boxes) {
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
          dst.push(this.calculateDistance(before, after));
        });
        const idx = dst.indexOf(Math.min(...dst));

        new_boxes.push(boxes[idx]);
        dists.push(dst[idx]);
        dst = [];
      });

      // 가장 가까운 거리들 다음 위치와 박스 그리고 거리를 반환
      return [new_boxes, dists];
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    updatePosition(boxes) {
      if (boxes) {
        boxes.forEach(box => {
          const cx = box["left"] + box["width"] / 2;
          const cy = box["top"] + box["height"] / 2;
          box["cx"] = cx;
          box["cy"] = cy;
        });

        // 현재 trackers 내 거리와 새로운 boxes의 거리를 구함
        const results = this.findDistance(boxes);
        let new_boxes = results[0];
        let new_dist = results[1];

        // function onlyUnique(value, index, self) {
        //   return self.indexOf(value) === index;
        // }

        new_boxes = new_boxes.filter(this.onlyUnique);
        new_dist = new_dist.filter(this.onlyUnique);
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

                Promise.resolve(results[2]).then(value => {
                  this.tracker[ppl[id]]["size"] = value["size"];
                  this.tracker[ppl[id]]["grade"] = value["class"];
                })
                // this.tracker[ppl[id]]["size"] = res;
              }
              z += 1;
            }
          }
        });
        this.removeTrackers();

        let difference = boxes.filter(box => !new_boxes.includes(box));
        if (difference) {
          difference.forEach(box => this.makeTracker(box, now));
        }
      } else {
        this.removeTrackers();
      }
    }
  }
};
</script>

<style scoped>
.class-item {
  position: fixed;
  margin: 0 0 0 10vw;
  width: 90vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #dfe6e9;
}

.class-item-top {
  height: 5vh;
}

.class-item-main {
  display: flex;
}

.class-item-wrapper {
  margin: 20px;
}

.class-item-left {
  width: 63%;
  max-height: 850px;
  background-color: #fff;
  border-radius: 3px;
}

.class-item-left-video {
  padding: 15px;
}

.class-item-right {
  width: 37%;
  height: 85vh;
  margin-left: 15px;
}

.class-item-right-top {
  border-radius: 3px;
  margin-bottom: 10px;
}

.class-item-right-bot {
  min-height: 75%;
  width: 100%;
  border-radius: 3px;
  background-color: #fff;
}

.class-item-title {
  background-color: #303952;
  color: white;
  padding: 10px;
  font-size: 1.3rem;
}

.class-item-text {
  color: black;
  font-size: 1.2rem;
  background-color: #fff;
}

.class-item-card {
  padding: 3px;
  margin-bottom: 5px;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
}

.class-item-bot {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
