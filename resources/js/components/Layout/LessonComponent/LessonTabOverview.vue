<template>
  <el-row>
    <el-col :span="24">
      <!-- {{ selected_data }} -->
    <div v-html="selected_data"></div>
      <!-- <div v-html="selected_data"></div> -->
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "LessonTabOverview",
  props: {
    selected_data: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      loading: false,
      fas: []
    };
  },
  created: function() {
  },
  methods: {
      handleChange() {

      }
  }
};
</script>
