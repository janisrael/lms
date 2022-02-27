<template>
	<div  class="gallery-outer">
    <!-- {{ data_featured }}   -->
    <VueSlickCarousel v-bind="settings" id="featuredCarousel">
      <template #prevArrow>
          <button class="arrow-btn" @click="prev()">
            <img
              class="slick-arrow"
              :src="prevArrow"
              alt="arrow-left">
          </button>
        </template>
        <template #nextArrow>
          <button class="arrow-btn" @click="next()">
            <img
              class="slick-arrow"
              :src="nextArrow"
              alt="arrow-left">
          </button>
        </template>
      <div v-for="(data, index) in datas" :key="index" class="slick-item" >
        <div class="slick-item-featured" :style="{'background-image': 'url(' + data.course_image_url + ')'}" @click="navigateTo(data)" @mouseenter="showLastView($event, data, index)" @mouseleave="hideLastView($event, data, index)">
            <div v-if="data.last_view" class="slick-item-child">
              <last-accessed-component :data="data"></last-accessed-component>
            </div>
            <!-- <component ref="lastAccessComponent" :is="lastAccessComponent" :data="last_access_data"></component> -->
          <div class="slick-content-wrapper">
            <div class="slick-left">
              <el-progress type="circle" :percentage="data.percentage" :width="50" :stroke-width="2"></el-progress>
            </div>
             <div class="slick-right">
              <div class="slick-right-desc">
                <span class="slick-title">{{ data.name }}</span>
                <!-- <span class="slick-desc" v-html="data.course_description"></span> -->
              </div>
              <div class="slick-right-icon">
                <img :src="playIcon"/>
              </div>
            </div>
            
          </div>
          <!-- <img class="slick-img" :src="data.course_image_url"/> -->
        </div>
      </div>
    </VueSlickCarousel>
	</div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import json_featured from '../dummy_course.json'
import LastAccessedComponent from './LessonComponent/LastAccessedComponent.vue'


export default {
  name: "FeaturedComponent",
  components: {
    VueSlickCarousel,
    LastAccessedComponent
  },
  props: {
    selected: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      // user: this.$store.getters.user,
      settings: {
        dots: false,
        centerPadding: "0px",
        focusOnSelect: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchThreshold: 5,
        arrows: true,
        infinite: true,
        // variableWidth: true,
        centerMode: false,
        draggable: false,
        windowWidth: null,
        progressive: "ondemand"
        // arrows: true,
      },
      nextArrow: "../../images/next.png",
          // "<i class='el-icon-arrow-right'></i>",
      prevArrow:
          "../../images/prev.png",
      playIcon: "../../images/play.png",
      data_featured: json_featured.data.course,
      datas: [],
      lastAccessComponent: null,
      last_access_data: {}
    };
  },
  created: function() {

    this.getCourseDetails()
  },
  methods: {
          //  this.getPercentage(value.lesson_finised)
    navigateTo(data) {
      var course_id = 'course_' + data.id
      console.log(course_id)
      var elmnt = document.getElementById(course_id);
      elmnt.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    },
    getCourseDetails() {
      let arr = this.selected
      arr.forEach((value, index) => {
        let data_lesson = {}
        if(value.last_accessed_lesson !== null || value.last_accessed_lesson !== '') {
          value.lessons.forEach((lesson, i) => {
          
            if(value.last_accessed_lesson === lesson.id) {
              data_lesson = lesson
            }
          })
        } else {
          data_lesson = null
        }
        arr[index]['last_view'] = data_lesson
        arr[index]['show_prev'] = false
      })
      this.datas = arr

    },
    showLastView(event, data, index) {
 
      if(data.last_view) {
       
        this.last_access_data = data.last_view
 
        setTimeout(() => this.ex_call_movescroll(data), 100)
      }
   
    },
    ex_call_movescroll() {
    this.lastAccessComponent = LastAccessedComponent
    },
    hideLastView(event, data, index) {
 
      this.datas.forEach((value, index) => {
        if(value.id === data.id) {
   
          value.show_prev = false
          let elemID = 'slickLastAccessed_' + index
                  // console.log(elemID)
          let someElement = ''
          someElement = document.getElementById(elemID);
          // someElement.className += " wrapper-hide";//add
          // someElement.classList.remove("show-wrapper");
        } else {
          value.show_prev = false
        }
      })
    }
    // getPercentage() {
    //   let array = []
    //   array = this.data_featured
    //   console.log(array)
    //   array.forEach((value, index) => {
    //     var percent = 0
    //     percent = this.calc(value.lesson_finised, value.lesson_count)
    //     var x = 0
    //     x = percent.toFixed(0)
    //     value.percentage = parseInt(x)
    //   })
    //   this.datas = array
    // },
    // calc(partialValue, totalValue) {

    //   return (100 * partialValue) / totalValue;
    // }
  }
};
</script>
