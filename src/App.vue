<template>
  <div id="app" style="border-radius: 5px">
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar'
  export default {
    name: 'my-project',
    components: { Sidebar }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import url('http://fonts.googleapis.com/earlyaccess/jejugothic.css');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Jeju Gothic", Arial, Helvetica, sans-serif;
  }

  body {
    border-radius: 25px;
  }

  .content {
    display: flex;
    width: 90vw;
    margin: 0 10vw;
    height: 100vh;
    background: #dfe6e9;
  }

  .center {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  #style-3::-webkit-scrollbar
  {
    width: 2px;
    background-color: #F5F5F5;
  }

  #style-3::-webkit-scrollbar-thumb
  {
    background-color: #ffeaa7;
  }

  [type="radio"]:checked,
  [type="radio"]:not(:checked) {
      position: absolute;
      left: -9999px;
  }
  [type="radio"]:checked + label,
  [type="radio"]:not(:checked) + label
  {
      position: relative;
      padding-left: 28px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      color: #666;
  }
  [type="radio"]:checked + label:before,
  [type="radio"]:not(:checked) + label:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      border: 1px solid #ddd;
      border-radius: 100%;
      background: #fff;
  }
  [type="radio"]:checked + label:after,
  [type="radio"]:not(:checked) + label:after {
      content: '';
      width: 12px;
      height: 12px;
      background: #F87DA9;
      position: absolute;
      top: 4px;
      left: 4px;
      border-radius: 100%;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
  }
  [type="radio"]:not(:checked) + label:after {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
  }
  [type="radio"]:checked + label:after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
  }

</style>
