<template>
  <div id="mainpage" class="content">
    <div class="main-left">
      <div class="center">
        <h1>상품의 정확한 선별</h1>
        <h2>저희 OS1에 맡겨주세요</h2>
      </div>
    </div>
    <div class="main-right"></div>
  </div>
</template>

<script>
export default {
  name: "mainpage"
};
</script>

<style scoped>
h1 {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #34495e;
}

.main-left {
  width: 40vw;
  background: #ffffff;
  position: relative;  
}

.main-right {
  width: 50vw;
  background: url("~@/assets/images/photo-1452804882841-573355623310.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>


