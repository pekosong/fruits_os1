<template>
  <div id="Fruits" class="content">
    <!-- 야채 종류 선택 -->
    <div id="style-3" class="left">
      <div v-for="item in items" :key="item.id">
        <div @click="select(item)" style="cursor:pointer">
          <img :src="item.img" style="width: 130px;">
          <span style="font-size:1.5rem">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 야채 종류 선택 -->
    <div v-if="show" class="right">
      <div class="center">
        <h2>선별을 원하는 과일을 선택 해주세요</h2>
      </div>
    </div>

    <!-- 야채 등급 선택 -->
    <div v-else class="right">
      <div class="center">
        <div>
          <img class="bgimg" :src="selectedimg" style="width: 350px;">
          <div>
            <h1>{{ selectedname }}</h1>
          </div>
        </div>

        <!-- 야채 등급 선택 : 2~3개 등급 -->
        <div class="options">
          몇 등급으로 나눌까요 :
          <input type="radio" id="two" value="2" v-model="picked">
          <label for="two">2개</label>
          <input type="radio" id="three" value="3" v-model="picked">
          <label for="three">3개</label>
          <input type="radio" id="four" value="4" v-model="picked">
          <label for="four">4개</label>
          <br>
          <div>
            <b-button size="lg" class="mr-2" variant="success" @click="startclass">시작하기</b-button>
          </div>
        </div>
      </div>
    </div>

    <classification
      v-if="start"
      :selectedimg="selectedimg"
      :selectedname="selectedname"
      :selectedename="selectedename"
      :numbers="numbers"
      :mobilenet="mobilenet"
      @backto-home="reset"
    ></classification>
  </div>
</template>

<script>
import Classification from "./Classification";
export default {
  name: "Fruits",
  components: { Classification },
  data() {
    return {
      items: [
        {
          id: 1,
          name: "감자",
          ename: "potato",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_d35d7ad7-6230-41e2-95ab-0a5b9a1b80d0.jpg"
        },
        {
          id: 2,
          name: "양파",
          ename: "onion",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c52783e5-46ee-4c38-b0a0-6e792b9fe497.jpg"
        },
        {
          id: 3,
          name: "피망",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_de08d850-94fe-4901-a562-8f9a764c48eb.jpg"
        },
        {
          id: 4,
          name: "브로콜리",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_09a00d67-c8d6-4fac-9b86-e3b137c924a0.jpg"
        },
        {
          id: 5,
          name: "샐러리",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_ecd43712-2b83-4e7f-aa0b-af7f24a7b28e.jpg"
        },
        {
          id: 6,
          name: "당근",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_25ccf4fc-4f29-4642-97d2-ed1955c6d440.jpg"
        },
        {
          id: 7,
          name: "애호박",
          ename: "",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_878dc704-552d-43b1-b30d-6d0470c7e66d.jpg"
        },
        {
          id: 8,
          name: "Green Beans",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_401558f8-255f-4584-ad12-fdcc16c2ecd9.jpg"
        },
        {
          id: 9,
          name: "아스파라거스",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_60576c7b-67a8-4d73-809c-0119f6ddc342.jpg"
        },
        {
          id: 10,
          name: "Cauliflower",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c876cbb8-a9c0-441b-8c30-87be44922e04.jpg"
        },
        {
          id: 11,
          name: "대파",
          ename: "",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_4fd69247-e19d-45d2-9308-2efda8fda2a4.jpg"
        }
      ],
      show: true,
      selectedimg: null,
      selectedname: null,
      selectedename: null,
      picked: "",
      start: false
    };
  },
  computed: {
    numbers: function() {
      return Number(this.picked);
    }
  },
  methods: {
    select(item) {
      if (this.show) {
        this.show = !this.show;
      }
      this.selectedimg = item.img;
      this.selectedname = item.name;
      this.selectedename = item.ename;
    },
    reset() {
      this.mobilenet = undefined;
      console.log("model 제거 완료");
      this.start = !this.start;
    },
    async startclass() {
      this.start = !this.start;
    }
  }
};
</script>

<style scoped>
label {
  margin-left: 20px;
}

.left {
  width: 10vw;
  padding: 20px;
  background: #ffffff;
  text-align: center;
  overflow: scroll;
  overflow-x: hidden;
}

.right {
  margin: 0 0 0 0vw;
  width: 80vw;
  height: 100vh;
  text-align: center;
  background: #ffffff;
}

.options {
  margin-top: 20px;
  padding: 20px 0;
  border-top: 0.5px solid grey;
}
</style>