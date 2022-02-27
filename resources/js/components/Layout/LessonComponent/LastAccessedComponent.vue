<template>
    <div v-if="data.last_view.name" class="last-accessed-wrapper" :style="{'background-image': 'url(' + data.last_view.image_url + ')'}">
      <div class="overlayslick">
          <img :src="playIcon"/>
      </div>
      <el-progress id="lastAccessProgress" :percentage="data.percentage" :show-text="false" status="success" :stroke-width="2"></el-progress>
      <div class="slick-content-last-accessed">
        <span class="color-white">continue watching</span>
        <span style="color:#21a0ff; font-weight: 400; text-transform: capitalize;">{{ data.last_view.name }}</span>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'LastAccessedComponent',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        playIcon: "../../images/play.png",
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>