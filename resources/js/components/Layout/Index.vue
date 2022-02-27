<template>
  <div class="row full-height" style="margin-left: 0px !important; margin-right: 0px !important;">
    <el-row class="">
      <transition name="el-fade-in">
          <div v-if="loading" class="loader-container">
            <div class="main-loader">
              <sc-loader :color="'white'"/>
            </div>
          </div>
        </transition>
      <el-col :span="24" >
        <featured-component :selected="data_featured"></featured-component>
        <course-component :selected="data_course"></course-component>
      </el-col>
    </el-row>
	</div>
</template>

<script>
import FeaturedComponent from "./FeaturedComponent.vue";
import CourseComponent from "./CourseComponent.vue";
import ScLoader from "../Loader/ScLoaderComponent.vue";
import json_featured from '../dummy_course.json'
export default {
  name: "Index",
  components: {
    CourseComponent,
    FeaturedComponent,
    ScLoader
  },
  data() {
    return {
      loading: true,
      data_all: json_featured.data.course,
      data_featured: [],
      data_course: [],
      coach_token: APP_TOKEN,
    };
  },
  mounted: function() {
    // this.showLoader()
    setTimeout(() => this.showLoader(), 1000)
  },
  created: function() {
    this.getDatas()
    this.getCourses()
  },
  methods: {
    getCourses() {
      let token = localStorage.accessToken
      axios
      .get('/api/v1/courses',{
        params: {
          apiKey: token
        }
      })
      .then(response => {
          console.log(response,'response')
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
    },
    showLoader() {
      this.loading = false
    },
    getDatas() {
      let arr_fetured = []
      let arr_course = []
      this.data_all.forEach((value, index) => {
        var x = 0
        var percent = 0
        if(value.is_featured === true) {
      
          percent = this.calc(value.lesson_finised, value.lesson_count)
         
          x = percent.toFixed(0) 
          arr_fetured['percentage'] = parseInt(x)
          arr_fetured.push(value)
          // arr_fetured['id'] = value.id
          // arr_fetured['name'] = value.name
          // arr_fetured['course_description'] = value.course_description
          // arr_fetured['course_image_url'] = value.course_image_url
          // arr_fetured['is_accessible'] = value.is_accessible
          // arr_fetured['is_complete'] = value.is_complete
          // arr_fetured['is_global_gallery'] = value.is_global_gallery
          // arr_fetured['is_accessible'] = value.is_accessible
          // arr_fetured['last_accessed_chapter'] = value.last_accessed_chapter
          // arr_fetured['last_accessed_lesson'] = value.last_accessed_lesson
          // arr_fetured['is_global_gallery'] = value.is_global_gallery
          // arr_fetured['lesson_count'] = value.lesson_count
          // arr_fetured['lesson_finised'] = value.lesson_finised
          // arr_fetured['locale'] = value.locale
        
          // arr_fetured['sort_order'] = value.sort_order
          
        }
      })
    
      this.data_featured = arr_fetured
      this.data_course = this.data_all
      axios
      .get('/api/v1/account/user?pl=' + this.coach_token).then(res => res.ok && res.json())
      .then(response => {
    
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
    },
    calc(partialValue, totalValue) {
      return (100 * partialValue) / totalValue;
    }
  }
};
</script>
