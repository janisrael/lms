<template>
	<div class="gallery-outer">
    <div v-for="(c, i) in data_course" :key="i">
      <section :ref="'course_' + c.id" :id="'course_' + c.id">
      <span class="course-name color-white" :id="'courseName' + c.id" >{{ c.name }}</span>
      <!-- {{ c.lesson_count }} -->
      <!-- {{ currentIndex }} -->
      <VueSlickCarousel ref="slick" v-bind="settings" id="courseCarousel" @beforeChange="handleSlideClick(c)">
        <template #prevArrow>
            <button class="arrow-btn arrow-course" @click="prev(c.lesson_count, c.id)">
              <img
                class="slick-arrow"
                :src="prevArrow"
                alt="arrow-left">
            </button>
          </template>
          <template #nextArrow>
            <button class="arrow-btn arrow-course">
              <img
                class="slick-arrow"
                :src="nextArrow"
                alt="arrow-left">
            </button>
          </template>
        <div v-for="(lesson, index) in c.lessons" :key="index" class="slick-item" @click="getLesson(c, lesson, index)" style="margin-left: 5px; margin-right: 5px;">
          <span v-if="lesson.chapter_visible === true" name="chapterNName" :ref="'chapterName' + c.id" :id="'chapterName' + c.id" class="chapter-name">{{ lesson.chapter_name }}</span>  
          <span v-else class="visibile-false chapter-name default-chapter">.</span>  
          <!-- <lazy-background :src="lesson.image_url" >
          </lazy-background> -->
          <lazy-background
            :src="lesson.image_url"
            @onLoad="onLoad(lesson.name)"
            image-class="cam-viewport"
            :blur="0"
            position="center"
            size="cover"
            class="slick-item-lesson">
              <div slot="content">
                <div class="overlayslick">
                      <img :src="playIcon"/>
                </div>
                <div class="slick-content-wrapper-lesson">
                  <div class="slick-desc-lesson">
                    <div class="lesson-name color-white">
                      {{ lesson.name }}
                    </div>
                    
                    <!-- <img :src="lesson.image_url" style="width: 100%;"> -->
                  </div>
                  <div v-show="visible">
                    <i class="el-icon-loading"></i>
                  </div>
                </div>
              </div>
          </lazy-background>
          <!-- <div class="slick-item-lesson" :style="{'background-image': 'url(' + lesson.image_url + ')'}">
          </div> -->
          <el-progress id="featuredProgress" :percentage="lesson.percentage" :show-text="false" status="success" :stroke-width="2"></el-progress>
        </div>
      </VueSlickCarousel>
      </section>
    </div>
      <component
        ref="currentComponent"
        :is="currentComponent"
        :data="data_lesson"
        :data_course="data_course"
        :videoId="videoID"
        :videoUrl="videoURL"
        @change="CloseModal"
      />
	</div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import json_course from '../dummy_course.json'
import LessonViewComponent from './LessonViewComponent.vue'
export default {
  name: "CourseComponent",
  components: {
    VueSlickCarousel,
    LessonViewComponent
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
      galleryChapterName: '',
      title: '',
      data_course: [],
      courseId: 1,
      subCourseLight: '',
      manualNavigation: 0,
      currentIndex: 0,
      videoURL: 'https://vimeo.com/315901527',
      playIcon: "../../images/play.png",
      videoID: '315901527',
      settings: {
        dots: false,
        centerPadding: "0px",
        focusOnSelect: false,
        infinite: false,
        speed: 500,
        edgeFriction: 0.35,
        slidesToShow: 6,
        slidesToScroll: 1,
        touchThreshold: 5,
        arrows: true,
        // variableWidth: true,
        centerMode: false,
        draggable: false,
        windowWidth: null,
        cssEase: 'ease',
        // fade: true,
        lazyLoad: "progressive",
        useCSS: true,
        initialSlide: 0,
        // arrows: true,
      },
      nextArrow: "../../images/next.png",
          // "<i class='el-icon-arrow-right'></i>",
      prevArrow:
          "../../images/prev.png",
      currentComponent: null,
      data_lesson: '',
      loadingImage: "../../images/loader.png",
      visible: true,
      newLeft: 0
    };
  },
  created: function() {
    console.log(this.data_course)
    this.getChapters()
  },
  // updated() {
  //   this.$nextTick(function () {
  //     if (this.$refs.slick) {
  //       this.$refs.slick.create(this.slickOptions);
  //     }
  //   });
  // },
  methods: {
    CloseModal() {
      console.log('close')
      this.currentComponent = null
      this.data_lesson = ''
    },
    onLoad(data) {
   
      this.visible = false
    },
    getLesson(data, lesson, index) {
      data['selected_lesson'] = lesson.name
      data['selected_lesson_id'] = lesson.id
      data['selected_chapter'] = lesson.chapter_name
      data['selected_chapter_id'] = lesson.chapter_id
      data['selected_overview'] = lesson.image_url
      data['go_to'] = index
      this.data_lesson = data
      console.log(this.data_lesson,'asd ')
      this.currentComponent = LessonViewComponent
      console.log(this.data_lesson , 'data_lesson')
    },
    getChapters() {
      this.data_course = this.selected
      this.data_course.forEach((value, index) => {
        let chapter_id = ''
        let x = 0
        value.lessons.forEach((lesson, i) => {
          x = 1
          if(lesson.chapter_id !== chapter_id && x === 1) {
            chapter_id = lesson.chapter_id
            lesson['chapter_visible'] = true
          } else {
            lesson['chapter_visible'] = false
          }
        })
        value['lesson_count'] = value.lessons.length
      })
    
    },
 
    handleSlideClick(dataset) {
      // var names = e.target.name
      
      console.log(dataset, 'datas')
      this.currentIndex = dataset
      console.log(this.currentIndex,'data')
      let chapter = '#chapterName' + dataset.id
 
      // const left = this.$refs.chapter.getBoundingClientRect().left

      let position = document.querySelector(chapter);
      let gg = 'chapter-name' + dataset.id
 
      console.log(position.getBoundingClientRect().left, chapter)
      this.newLeft= this.newLeft + 280
      // document.getElementsByClassName(gg).style.left = this.newLeft
      document.getElementById('chapterName' + dataset.id).style.marginLeft=this.newLeft + 'px';
      var element = document.getElementById('chapterName' + dataset.id);
      element.classList.add("transition-chapter");
    console.log(this.newLeft,'newLeft')
      // if(dataset === count) {
      //   console.log('stop')
      // } else {
      //   console.log('no')
      // }
    },
    navChangeTitle(index) {
     console.log(index)
     this.manualNavigation = 4
    },
    next(count, id) {

      console.log(this.currentIndex,'c')
        if(this.currentIndex !== count) {
          this.$refs.slick.next()
        } else {
          console.log('stop')
        }

    },
    prev(count) {
      if(this.currentIndex > 0) {
        this.$refs.slick.prev()
      } else {
        console.log('stop')
      }
        // this.$refs.slick.prev()
    }
  }
};
</script>
<style scoped>

</style>