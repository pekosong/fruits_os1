<template>
  <div id="ClassMain">
    <!-- 종류 선택 -->
    <div v-if="!start" class="content">
      <div id="style-scroll" class="class-left">
        <div v-for="item in items[$route.params.category]" :key="item.id">
          <div class="class-item" @click="select(item)">
            <img class="class-item-image" :src="item['img']">
            <br>
            <span class="class-item-font">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- 종류 선택 -->
      <div v-if="selected" class="class-right">
        <div class="center">
          <h2>선별을 원하는 {{ selectedCategory[$route.params.category] }} 선택 해주세요</h2>
        </div>
      </div>

      <!-- 등급 선택 -->
      <div v-else class="class-right">
        <div class="center">
          <div>
            <img :src="selectedImg" style="width: 250px;">
            <div>
              <h1>{{ selectedName }} : {{ grade }}개 등급</h1>
              <b-form-group>
                <b-form-radio-group v-model="grade" :options="gradeOption" name="radio-inline"></b-form-radio-group>
              </b-form-group>
            </div>
          </div>

          <!-- 등급 선택 : 2~3개 등급 -->
          <div class="d-flex">
            <div v-for="n in grade" :key="n" class="class-options" style="font-size:1.2rem">
              <div style="margin-bottom:20px">
                <h2>{{ n }}등급</h2>
              </div>
              <b-form-group label="흠집 / 멍">
                <b-form-radio-group
                  v-model="selectedMatrix[grade][n].defect"
                  :options="options.option1"
                  buttons
                  button-variant="outline-primary"
                  size="md"
                  name="radio-btn-outline"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group label="착색">
                <b-form-radio-group
                  v-model="selectedMatrix[grade][n].color"
                  :options="options.option2"
                  buttons
                  button-variant="outline-primary"
                  size="md"
                  name="radio-btn-outline"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group label="크기">
                <b-form-radio-group
                  v-model="selectedMatrix[grade][n].size"
                  :options="options.option3"
                  buttons
                  button-variant="outline-primary"
                  size="md"
                  name="radio-btn-outline"
                ></b-form-radio-group>
              </b-form-group>
            </div>
          </div>
          <div>
            <b-button size="lg" class="mr-2" variant="success" @click="startClass">시작하기</b-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 분류 화면 -->
    <classification
      v-else
      :selectedImg="selectedImg"
      :selectedName="selectedName"
      :selectedEname="selectedEname"
      :selectedMatrix="selectedMatrix[grade]"
      :grade="grade"
      @backto-home="reset"
    ></classification>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Classification from "./Classification";
export default {
  name: "ClassMain",
  components: { Classification },
  data() {
    return {
      grade: 2,
      gradeOption: [
        { text: "2개", value: 2 },
        { text: "3개", value: 3 },
        { text: "4개", value: 4 }
      ],
      options: {
        option1: [{ text: "무", value: 0 }, { text: "유", value: 1 }],
        option2: [
          { text: "상", value: 1 },
          { text: "중", value: 2 },
          { text: "하", value: 3 }
        ],
        option3: [
          { text: "9cm", value: 9 },
          { text: "8cm", value: 8 },
          { text: "7cm", value: 7 }
        ]
      },
      value: 0,
      selectedValue: [],
      selected: true,
      selectedMatrix: {
        2 : {
          1: {
            defect: 0, color : 1, size : 9
          },
          2: {
            defect: 1, color : 2, size : 8
          }
        },
        3 : {
          1: {
            defect: 0, color : 1, size : 9
          },
          2: {
            defect: 0, color : 2, size : 8
          },
          3: {
            defect: 1, color : 2, size : 7
          }
        },
        4 : {
          1: {
            defect: 0, color : 1, size : 9
          },
          2: {
            defect: 0, color : 2, size : 8
          },
          3: {
            defect: 1, color : 2, size : 7
          },
          4: {
            defect: 1, color : 3, size : 7
          }
        }
      },
      selectedImg: null,
      selectedName: null,
      selectedEname: null,
      picked: "",
      start: false,
      selectedCategory: {
        fruits: "과일",
        vegetables: "야채"
      }
    };
  },
  computed: {
    ...mapState(["items"])
  },
  methods: {
    select(item) {
      if (this.selected) {
        this.selected = !this.selected;
      }
      this.selectedImg = item.img;
      this.selectedName = item.name;
      this.selectedEname = item.ename;
    },
    reset() {
      this.mobilenet = undefined;
      console.log("model 제거 완료");
      this.start = !this.start;
    },
    startClass() {
      this.start = !this.start;
    }
  }
};
</script>

<style scoped>
label {
  margin-left: 20px;
}

.class-left {
  width: 10vw;
  padding: 20px;
  background: #ffffff;
  text-align: center;
  overflow: scroll;
  overflow-x: hidden;
}

.class-right {
  margin: 0 0 0 0vw;
  width: 80vw;
  height: 100vh;
  text-align: center;
  background: #ffffff;
}

.class-options {
  margin: 10px;
  padding: 15px;
  border: 1px solid grey;
}

.class-item {
  cursor: pointer;
}

.class-item-image {
  width: 130px;
}

.class-item-image:hover {
  width: 145px;
  transition: 0.5s;
}

.class-item-font {
  font-size: 1.5rem;
}

.btn .btn-outline-primary .btn-md {
  width: 100px !important;
  padding: 20px !important;
}
</style>
