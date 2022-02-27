<template>
    <el-row class="">
      <el-col :span="24" style="margin-top: 20px;">
        <section :ref="'course_' + new_data.id" :id="'course_' + new_data.id">
          <span class="course-name color-white" :id="'courseName' + new_data.id" style="margin-top: 0px !important;">{{ new_data.name }}</span>
          <VueSlickCarousel ref="slick" v-bind="settings" id="courseCarousel" @afterChange="handleAfterChange">
            <template #prevArrow>
                <button class="arrow-btn arrow-course" @click="prev(new_data.lesson_count, new_data.id)">
                  <img
                    class="slick-arrow"
                    :src="prevArrow"
                    alt="arrow-left">
                </button>
              </template>
              <template #nextArrow>
                <button class="arrow-btn arrow-course" @click="next(dataset)">
                  <img
                    class="slick-arrow"
                    :src="nextArrow"
                    alt="arrow-left">
                </button>
              </template>
            <div  v-for="(lesson, index) in new_data.lessons" :key="index" id="lessonCarouselContainer" class="slick-item" @click="getLesson(lesson, index)">
              <span v-if="lesson.chapter_visible === true" name="chapterNName" :ref="'chapterName' + new_data.id" :id="'chapterName' + new_data.id" class="chapter-name">{{ lesson.chapter_name }}</span>  
              <span v-else class="visibile-false chapter-name default-chapter">.</span>  
              <transition name="el-fade-in">
                <div v-if="!hidden">
                  <transition name="el-fade-in">
                  <div v-if="lesson.highlight" class="border-top"></div>
                  </transition>
                </div>
              </transition>
              <lazy-background
                :src="lesson.image_url"
                @onLoad="onLoad(lesson.name)"
                @onError="onError(lesson)"
                image-class="cam-viewport"
                :blur="0"
                position="center"
                size="cover"
                class="slick-item-lesson slick-item-lesson-carousel">
                  <div slot="content" class="slick-content-wrapper-lesson">
                    <div class="slick-desc-lesson">
                      <div class="lesson-name color-white">
                        {{ lesson.name }}
                      </div>
                    </div>
                    <div v-show="visible">
                      <i class="el-icon-loading"></i>
                    </div>
                  </div>
              </lazy-background>
              <el-progress id="featuredProgress" :percentage="lesson.percentage" :show-text="false" :stroke-width="2"></el-progress>
            </div>
          </VueSlickCarousel>
        </section>
      </el-col>
    </el-row>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
export default {
  name: "LessonCarouselComponent",
  components: {
    VueSlickCarousel
  },
  props: {
    selected: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loading: true,
      courseId: 1,
      count: 0,
      galleryChapterName: '',
      title: '',
      subCourseLight: '',
      currentIndex: 0,
      manualNavigation: 0,
      data_featured: [],
      data_course: [],
      hidden: false,
      settings: {
        dots: false,
        centerPadding: "0px",
        lazyLoad: "progressive",
        focusOnSelect: true,
        infinite: false,
        accessibility: true,
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
        initialSlide: this.selected.go_to,

        // arrows: true,
      },
      nextArrow: "../../images/next.png",
          // "<i class='el-icon-arrow-right'></i>",
      prevArrow:
          "../../images/prev.png",
      loadingImage: "../../images/loader.png",
      visible: true,
      newLeft: 0,
      new_data: {},
      arrowOption: {
        currentSlide: 0
      },
      loadCount: 1
    };
  },
  created: function() {
    this.getHighlight()
  },
  methods: {
    getHighlight() {
      this.selected.lessons.forEach((value, index) => {
        if(index === this.selected.go_to) {
          value['highlight'] = true
          this.currentIndex = index
        } else {
          value['highlight'] = false
        }
      })
      this.count = this.selected.lessons.length
      this.new_data = this.selected
    },
    getLesson(data, index) {
      // let obj = {}
      // obj = this.data
      this.hidden = true
      this.new_data.lessons.forEach((value, i) => {
        if(i === index) {
          value['highlight'] = true
        } else {
          value['highlight'] = false
        }
      })
   
      this.$refs.slick.goTo(index)
      this.$emit('reSlick', { value: data})
      this.hidden = false
      // this.updateData( index)

    },
    onLoad(data) {
  
      console.log(this.loadCount, this.count)
      if(this.count === this.loadCount) {
        console.log('all image loaded')
        this.loadCount = 1
        return
      } else {
        this.loadCount = this.loadCount + 1
        
      }
      // There are 3 states, loading, loaded, and error
      this.visible = false
    },
    onError(data) {
      console.log(data,'error')
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
      // console.log(this.data_course,'revised')
    },
   handleAfterChange(event, slick, slideIndex) {
    console.log('handleAfterChange', event, slick, slideIndex);
  },
  handleSlideClick(dataset) {
      this.currentIndex = ''
      this.currentIndex = this.$refs.slick.$refs.innerSlider.currentSlide
      // console.log(dataset)
    },
    navChangeTitle(index) {
    //  console.log(index)
     this.manualNavigation = 4
    },
    next(dataset) {
      // console.log( this.$refs.slick,'sd')
      // currentSlide
      let count = this.count - 1
      let data = {}
        if(this.currentIndex < count) {
          this.currentIndex = this.currentIndex + 1
          // this.getLesson('test', this.currentIndex)
          this.new_data.lessons.forEach((value, index) => {
            if(index === this.currentIndex) {
              data = value
            }
          })
          this.$refs.slick.next()
          this.getLesson(data, this.currentIndex)
          // this.$emit('reSlick', { value: data})
        } else {
          console.log('stop')
        }
    },
    prev(dataset) {
      let data = {}
      if(this.currentIndex > 0) {
        this.currentIndex = this.currentIndex - 1

        this.new_data.lessons.forEach((value, index) => {
        if(index === this.currentIndex) {
            data = value
          }
        })
        this.$refs.slick.prev()
        this.getLesson(data, this.currentIndex)
        // this.$emit('reSlick', { value: data})
      } else {
        console.log('stop')
      }
    }
  }
};
</script>
