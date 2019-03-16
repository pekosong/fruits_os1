<template>
  <div id="howto" class="content">
    <div class="wrapper">
      <div class="top"></div>
      <div class="bot">
        <div class="child">
        </div>
        <div class="child">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Howto",
  components: {
    
  },
  data() {
    return {
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
