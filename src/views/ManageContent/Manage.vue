<template>
  <div class="Manage">
    <!-- 头部组件 -->
    <HeaderManage></HeaderManage>
  </div>
</template>
<script>
import HeaderManage from "@/components/header/headerManage";
export default {
  name: "manage",
  data() {
    return {
      isCollapse: true
    };
  },
  components: {
    HeaderManage
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
</style>
