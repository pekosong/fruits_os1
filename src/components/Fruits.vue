<template>
  <div id="Fruits" class="content">
    <!-- 과일 종류 선택 -->
    <div id="style-3" class="left">
      <div v-for="item in items" :key="item.id">
        <div @click="select(item)" style="cursor:pointer">
          <img :src="item.img" style="width: 130px;">
          <span style="font-size:1.5rem">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 과일 종류 선택 -->
    <div v-if="show" class="right">
      <div class="center">
        <h2>선별을 원하는 과일을 선택 해주세요</h2>
      </div>
    </div>

    <!-- 과일 등급 선택 -->
    <div v-else class="right">
      <div class="center">
        <div>
          <img class="bgimg" :src="selectedimg" style="width: 350px;">
          <div>
            <h1>{{ selectedname }}</h1>
          </div>
        </div>

        <!-- 과일 등급 선택 : 2~3개 등급 -->
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
          name: "사과",
          ename: "apple",       
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_09c1a101-671d-4bad-911a-48a556c15906.jpg"
        },
        {
          id: 2,
          name: "오렌지",
          ename: "orange",       
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_9fa00eb7-1e12-45d7-8716-cd530fc487ac.jpg"
        },
        {
          id: 3,
          name: "바나나",
          ename: "banana",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_b6eaf3fa-b20e-45c7-ade1-560e662fc33f.jpg"
        },
        {
          id: 4,
          name: "딸기",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_d80adcd7-fbc0-419c-b9f2-c2dfe1da84d1.jpg"
        },
        {
          id: 5,
          name: "메론",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_05864a94-cc23-4e66-abd3-0588d343e708.jpg"
        },
        {
          id: 6,
          name: "귤",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_25be7bb2-e9e8-44bb-a338-60d54ec82e30.jpg"
        },
        {
          id: 7,
          name: "풋사과",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_63fd0746-73e7-40e3-b45c-d3a3ae362447.jpg"
        },
        {
          id: 8,
          name: "아보카도",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_1aea0e10-1ec5-4247-a64b-601cdcf79099.jpg"
        },
        {
          id: 9,
          name: "복숭아",
          ename: "",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c2a71955-6f56-47ec-9dd7-7788474ce338.jpg"
        },
        {
          id: 10,
          name: "수박",
          ename: "",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_4f79ab8d-3485-4fee-8e94-1597ecf719c8.jpg"
        },
        {
          id: 11,
          name: "감",
          ename: "",
          img:
            "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_aeb3ab92-fd79-42f1-890f-9a84b726777c.jpg"
        },
        {
          id: 12,
          name: "방울토마토",
          ename: "",
          img:
            "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_71fd3d29-42b0-4073-b8ec-c3aa47256462.jpg"
        }
      ],
      show: true,
      selectedimg: null,
      selectedname: null,
      selectedename: null,
      picked: "",
      start: false,
      mobilenet: undefined
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
