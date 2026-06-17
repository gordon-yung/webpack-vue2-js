<template>
  <div>
    <h2 :class="content.text">Hello Webpack Vue App!!!</h2>
    <div class="flex">
      <div>box1</div>
      <div>box2</div>
    </div>
  </div>
</template>

<script>
import content from "@/styles/common.module.less";
export default {
  name: "App",
  data() {
    return {
      content,
    };
  },
};
</script>

<style scoped lang="less">
.red {
  color: @blue;
}
</style>
