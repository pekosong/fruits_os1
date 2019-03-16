<template>
  <div id="static" class="content">
    <div class="wrapper">
      <div class="top">
        <div>
          <h3>월간 생산량</h3>
        </div>
        <b-card-group deck>
          <b-card
            img-height="300"
            img-src="https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_09c1a101-671d-4bad-911a-48a556c15906.jpg"
            img-alt="Card image"
            img-top
          >
            <b-card-text>
              <h2>사과</h2>
              <h4>2,070개</h4>
            </b-card-text>
          </b-card>
          <b-card
            img-height="300"
            img-src="https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_9fa00eb7-1e12-45d7-8716-cd530fc487ac.jpg"
            img-alt="Card image"
            img-top
          >
            <b-card-text>
              <h2>오렌지</h2>
              <h4>1,570개</h4>
            </b-card-text>
          </b-card>
          <b-card
            img-height="300"
            img-src="https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_b6eaf3fa-b20e-45c7-ade1-560e662fc33f.jpg"
            img-alt="Card image"
            img-top
          >
            <b-card-text>
              <h2>바나나</h2>
              <h4>2,070개</h4>
            </b-card-text>
          </b-card>
          <b-card
            img-height="300"
            img-src="https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_d80adcd7-fbc0-419c-b9f2-c2dfe1da84d1.jpg"
            img-alt="Card image"
            img-top
          >
            <b-card-text>
              <h2>딸기</h2>
              <h4>1,700개</h4>
            </b-card-text>
          </b-card>
          <b-card
            img-height="300"
            img-src="https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_71fd3d29-42b0-4073-b8ec-c3aa47256462.jpg"
            img-alt="Card image"
            img-top
          >
            <b-card-text>
              <h2>토마토</h2>
              <h4>1,500개</h4>
            </b-card-text>
          </b-card>
        </b-card-group>
      </div>
      <div class="bot">
        <div class="child">
          <div>
            <h3>주간 생산량</h3>
          </div>
          <GChart
            :settings="{packages: ['bar']}"
            :data="chartData1"
            :options="chartOptions1"
            :createChart="(el, google) => new google.charts.Bar(el)"
            @ready="onChartReady"
          />
        </div>
        <div class="child">
          <div>
            <h3>일간 생산량</h3>
          </div>
          <GChart
            :settings="{packages: ['bar']}"
            :data="chartData2"
            :options="chartOptions2"
            :createChart="(el, google) => new google.charts.Bar(el)"
            @ready="onChartReady"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";

export default {
  name: "static",
  components: {
    GChart
  },
  data() {
    return {
      chartsLib: null,
      chartData1: [
        ["Year", "A급", "B급", "C급"],
        ["사과", 1000, 400, 200],
        ["오렌지", 1170, 460, 250],
        ["바나나", 660, 1120, 300],
        ["딸기", 1030, 540, 350]
      ],
      chartOptions1: {
        chart: {
          title: "주간 생산량",
          subtitle: "2019년 3월 15일"
        }
      },
      chartData2: [
        ["Year", "A급", "B급", "C급"],
        ["사과", 1000, 400, 200],
        ["오렌지", 1170, 460, 250],
        ["바나나", 660, 1120, 300],
        ["딸기", 1030, 540, 350]
      ],
      chartOptions2: {
        chart: {
          title: "일별 생산량",
          subtitle: "2019년 3월 15일"
        }
      }
    };
  },
  mounted() {}
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  margin: 20px;
}
.top {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
.bot {
  display: flex;
}
.child {
  width: 50%;
  background: #ffffff;
  border-radius: 10px;
  padding: 15px;
}
.child:nth-child(2) {
  margin-left: 15px;
}
</style>
