<template>
  <div id="sidebar">
    <div class="title"  style="-webkit-app-region: drag">
      <img src="../assets/logo.png" width="60%">
    </div>
    <router-link class="tabs" to="/">
      <i class="icons fas fa-home"></i>
      <div class="menu">처음</div>
    </router-link>
    <router-link class="tabs" to="/fruits">
      <i class="icons fas fa-apple-alt"></i>
      <div class="menu">과일</div>
    </router-link>
    <router-link class="tabs" to="/vegetables">
      <i class="icons fas fa-carrot"></i>
      <div class="menu">야채</div>
    </router-link>
    <router-link class="tabs" to="/static">
      <i class="icons fas fa-chart-pie"></i>
      <div class="menu">통계</div>
    </router-link>
    <router-link class="tabs" to="/howto">
      <i class="icons fas fa-question-circle"></i>
      <div class="menu">사용법</div>
    </router-link>
    <div class="corp">
      <i class="fas fa-copyright" style="margin-right: 5px"></i>Developed by OS1
    </div>
  </div>
</template>

<script>
export default {
  name: "sidebar"
};
</script>

<style scoped>
#sidebar {
  position: fixed;
  width: 10vw;
  height: 100vh;
  background: #2c3e50;
  border-right: 2px solid black;
  padding-top: 5px;
  color: white;
}

.title {
  margin: 0;
  padding: 10px;
  text-align: center;
}

.tabs {
  display: block;
  text-decoration: none;
  padding: 8px;
  color: white;
  border-bottom: 0.5px solid white;
}

.tabs:hover {
  background: #7f8c8d;
}

.tabs:focus {
  background: #7f8c8d;
}

.icons {
  color: #00cec9;
  font-size: 5rem;
  text-align: center;
  width: 100%;
}

.menu {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 10px;
}

.corp {
  position: absolute;
  bottom: 2%;
  width: 100%;
  color: floralwhite;
  font-size: 0.7rem;
  text-align: center;
}
</style>
