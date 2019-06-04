<template>
  <div id="ClassMain" class="content">
    <!-- 과일 종류 선택 -->
    <div id="style-scroll" class="class-left">
      <div v-for="item in items[$route.params.category]" :key="item.id">
        <div class="class-item" @click="select(item)">
          <img class="class-item-image" :src="item.img">
          <span class="class-item-font">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 과일 종류 선택 -->
    <div v-if="selected" class="class-right">
      <div class="center">
        <h2>선별을 원하는 {{ selectedCategory[$route.params.category] }} 선택 해주세요</h2>
      </div>
    </div>

    <!-- 과일 등급 선택 -->
    <div v-else class="class-right">
      <div class="center">
        <div>
          <img :src="selectedImg" style="width: 350px;">
          <div>
            <h1>{{ selectedName }}</h1>
          </div>
        </div>

        <!-- 과일 등급 선택 : 2~3개 등급 -->
        <b-form-group label="등급 선별 기준 선택">
          <b-form-checkbox-group
            v-model="selectedValue"
            :options="options"
            name="flavour-1a"
          ></b-form-checkbox-group>
        </b-form-group>
        <div class="class-options">
          흠 / 멍 기준 :
          <input type="radio" id="two" value="2" v-model="picked">
          <label for="two">소</label>
          <input type="radio" id="three" value="3" v-model="picked">
          <label for="three">중</label>
          <input type="radio" id="four" value="4" v-model="picked">
          <label for="four">대</label>
          <br>
          색깔 기준 :
          <input type="radio" id="two" value="2" v-model="picked">
          <label for="two">소</label>
          <input type="radio" id="three" value="3" v-model="picked">
          <label for="three">중</label>
          <input type="radio" id="four" value="4" v-model="picked">
          <label for="four">대</label>
          <br>
          크기 기준 :
          <input type="radio" id="two" value="2" v-model="picked">
          <label for="two">7cm</label>
          <input type="radio" id="three" value="3" v-model="picked">
          <label for="three">8cm</label>
          <input type="radio" id="four" value="4" v-model="picked">
          <label for="four">9cm</label>
          <br>
          <div>
            <b-button size="lg" class="mr-2" variant="success" @click="startClass">시작하기</b-button>
          </div>
        </div>
      </div>
    </div>

    <classification
      v-if="start"
      :selectedImg="selectedImg"
      :selectedName="selectedName"
      :selectedEname="selectedEname"
      :numbers="numbers"
      :mobilenet="mobilenet"
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
      options: [
        { text: '흠/멍', value: 'orange' },
        { text: '크기', value: 'apple' },
        { text: '색깔', value: 'pineapple' },
      ],
      value:0,
      selectedValue: [],
      selected: true,
      selectedImg: null,
      selectedName: null,
      selectedEname: null,
      picked: "",
      start: false,
      mobilenet: undefined,
      selectedCategory: {
        fruits: "과일",
        vegetables: "야채"
      }
    };
  },
  computed: {
    ...mapState(["items"]),
    numbers: function() {
      return Number(this.picked);
    }
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
    async startClass() {
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
  margin-top: 20px;
  padding: 20px 0;
  border-top: 0.5px solid grey;
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
</style>
