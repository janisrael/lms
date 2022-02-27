<template>
  <div class="row full-height">
    <el-row class="">
      <el-col :span="24" >
        <el-dialog
          id="dialogLesson"
          :visible.sync="dialogLesson"
          top="0%"
          width="100%"
          :fullscreen="true"
          :before-close="handleClose"
          :lock-scroll="true"
          :close-on-click-modal="false"
          :destroy-on-close="true"
          style="background-image: url('../../images/singlepage.jpg'); background-size: cover;"
          center>
          <el-row>
            <el-col :span="24" style="padding: 30px 30px 0px 30px;">
                <el-col :span="16">
                  <div style="display: inline-block; width: 100%;">
                    <div class="view-lesson-title"><span style="text-transform: uppercase;">{{ title }}</span></div>
                    <div class="view-lesson-arrows-container">
                      <i class="el-icon-back"  @click="prevLesson()"></i> 
                      <i class="el-icon-right" @click="nextLesson()"></i>
                    </div>
                  </div>
                  <div>
                    <el-card id="lesson-view-video-container">
                      <div>
                        <div class="item">
                          <div class="player" >
                            <!-- <vimeo :vimeourl="vimeourl" :id="vimeoID"></vimeo> -->
                          <transition name="el-fade-in">
                            <div style="height: 575px;">
                              <div v-if="showVideo === false">
                                loading
                              </div>
                              <video-player
                                  :video_url="collected_details.video_url"
                                  :isPreview="isPreview"
                                  :startPosition="collected_details.startPosition"
                                  :currentTime="collected_details.currentTime"
                                  :lessonDuration="collected_details.actualDuration"
                                  :updateLessonTime="updatePopupLessonTime"
                                  :setLessonDuration="lessonDuration()"
                                  :currentLesson="collected_details"
                                  :playerHeight="575"
                                  :toNextStep="false"
                                  :key="collected_details.video_url"
                                  :lesson_count="23"
                                  :lessons="collected_details.resources"
                                  @closeClicked="closeLesson"
                                  @loaded="updateVideoSize"
                                  @change="reqResponse"
                                  @rendered="pdfrenderStatus"
                                  @ended="updateProgress"
                              >

                              </video-player>
                          


                              <!-- <component
                                ref="videoComponent"
                                :is="videoComponent"
                                :selected="videoData"
                                :vimeourl="vimeourl"
                                :id="vimeoID"
                                @change="CloseModal"
                              /> -->
                            </div>
                          </transition>
                            
                                <!-- <vimeo-player ref="player" :video-id="videoID" :player-height="height" :player-width="width"  @ready="onReady"/> -->
                          </div>
                        </div>
                      </div>
                      <div>
                     
                        <div class="block-video-details">
                          <div style="display: inline-block;">
                            <el-avatar :size="30" :src="collected_details.author_image_url" style="position: absolute;margin-top: 5px;"></el-avatar>
                            <div style="display: inline-block;padding-left: 60px;padding-top: 15px;font-weight: 600;"><span class="color-white">{{ collected_details.author_name }}</span></div>
                          </div>

                          <div style="display: inline-block; padding-left: 40px;">
                            <i class="far fa-clock color-white"></i>
                            <span class="color-white">2:28</span>
                            <span class="color-white">Module 3/6</span>
                          </div>

                          <div style="display: inline-block;float: right;padding: 5px;">
                            <el-radio-group id="radioVideo" v-model="lessonType" style="margin-bottom: 30px;" @change="lessonTypeChange()">
                              <el-radio-button label="video" class="el-radio-group-radio-video"><i class="fas fa-video"></i> VIDEO</el-radio-button>
                              <el-radio-button label="resources" class="el-radio-group-radio-video "><i class="fas fa-book-open"></i> RESOURCES</el-radio-button>
                            </el-radio-group>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="lesson-view-right-container">
                  <el-col :span="24" style="padding:0 20px;">
                      <el-radio-group v-model="lessonTab" style="margin-bottom: 30px;" @change="lessonTabChange()">
                        <el-radio-button class="btn-default btn-tab-left" label="overview">OVERVIEW</el-radio-button>
                        <el-radio-button class="btn-default btn-tab-left" label="faq">FAQ</el-radio-button>
                      </el-radio-group>
                  </el-col>
                  <el-col :span="24" style="padding:0 20px;">
                    <div class="lesson-tab-content">
                      <transition name="el-fade-in">
                        <div v-if="show">
                          <component
                            ref="currentComponent"
                            :is="currentComponent"
                            :selected_data="tab_data"
                            @change="CloseModal"
                          />
                        </div>

                      </transition>
                    </div>
                  </el-col>
                  </div>
                </el-col>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="24">
              <component ref="lessonComponent" :is="lessonComponent" :selected="data" @reSlick="reSlickData"/>
            </el-col>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
	</div>
</template>

<script>
import json_details from '../dummy_details.json'
import LessonTabOverview from './LessonComponent/LessonTabOverview'
import LessonTabFaq from './LessonComponent/LessonTabFaq'
import LessonCarouselComponent from './LessonComponent/LessonCarouselComponent.vue'
// import Vimeo from './LessonComponent/Vimeo.vue'
import PdfComponent from './LessonComponent/Pdf.vue'
import VideoPlayer from './LessonComponent/VimeoPlayer.vue'
export default {
  name: "LessonViewComponent",
  components: {
    LessonTabOverview,
    LessonTabFaq,
    LessonCarouselComponent,
    // Vimeo,
    PdfComponent,
    VideoPlayer
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    data_course: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      dialogLesson: false,
      loading: false,
      show: false,
      showVideo: false,
      data_details: json_details.data.course_details,
      lesson_id: this.data.selected_id,
      lessons: this.data,
      title: '',
      collected_details: '',
      currentComponent: null,
      lessonComponent: null,
      videoComponent: null,
      tab_data: '',
      // videoUrl: 'https://vimeo.com/470292592',
      data_selected: {},
      lessonTab: '',
      lessonType: 'video',
      videoData: {},
      startPosition: 0,
      isPreview: false,
      coach_token: APP_TOKEN,

    };
  },
  created: function() {
    this.loading = true
    this.getDetails()
    this.dialogLesson = true


  },
  methods: {
    lessonDuration() {
      const minutes = (148 / 60) >> 0;
      const seconds = Math.round(148 % 60);
      return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },
    updateVideoSize() {

        this.showVideo = true
    
    },
    updateProgress(result) {
     console.log('  this.$emit("update", result);')
    },
    pdfrenderStatus(value) {
     
      if (value === true) {
        // this.showVideo = true
        // this.loading = false;
      } else {
        // this.showVideo = false
        // this.loading = false;
      }
    },
    reqResponse(value) {
      // if(value === true) {
        console.log('reqResponse')
      // this.loading = false;
      // }
    },
    closeLesson: function () {
      window.close();
    },
    updatePopupLessonTime(val, complete = false) {
       console.log('Update the main window when the video is complete')
      // 
      // this.updateLessonTime(val, complete).then((result) => {
      //   this.updateProgress(result);

      //   if (complete) {
      //     window.opener.dispatchEvent(
      //       new CustomEvent("elearn.updateTotals", {
      //         detail: result,
      //       })
      //     );
      //   }
      // });
    },
    reSlickData(data) {
      this.data_selected = {}
      this.lessonComponent = null
      this.data_selected = data.value
      this.title = data.value.name
      this.lessonComponent = LessonCarouselComponent
      console.log('mother')
    },
    nextLesson() {
      this.$refs.lessonComponent.next()
    },
    prevLesson() {
      this.$refs.lessonComponent.prev()
    },

    lessonTypeChange(data) {
      // console.log(this.lessonType)
      this.showVideo = false
      this.videoComponent = null
        if(this.lessonType === 'video') {
   
            this.showVideo = true
            this.videoData = this.collected_details
            this.videoComponent = VideoPlayer
          }
        if(this.lessonType === 'resources') {
          
          this.showVideo = true
          // console.log(this.collected_details)
          this.videoData = this.collected_details
          this.videoComponent = PdfComponent
        }

    },
    lessonTabChange(data) {
      // console.log(this.lessonTab)
      this.show = false
      this.currentComponent = null
      // if(data) {
      //   this.currentComponent = LessonTabOverview
      //   this.tab_data = this.collected_details.course_description
      // }
      // else {
        this.tab_data = ''
        if(this.lessonTab === 'faq') {
            this.currentComponent = LessonTabFaq
            this.show = true
            this.tab_data = this.collected_details.faqs
          }
        if(this.lessonTab === 'overview') {
          this.currentComponent = LessonTabOverview
          this.show = true
          this.tab_data = this.collected_details.course_description
        }
      // }
      
     
    },
    CloseModal() {
      console.log('close')
    },
    getDetails() {
      const lesson_id = this.lesson_id
      let col_details = {}
      this.data_selected = this.data
  
      this.data_details.forEach((value, index) => {
        if(this.data.selected_lesson_id === value.lesson_id) {
          col_details = value
          col_details['chapter_name'] = this.data.selected_chapter
          col_details['lesson_name'] = this.data.selected_lesson
          col_details['course_description'] = this.data.course_description
          col_details['selected_overview'] = this.data.selected_overview
          col_details['highlight'] = true
          this.title = this.data.selected_lesson
        }
      })
      // this.playerOptions.sources.src = col_details.video_url
      // this.playerOptions.poster =  this.data.selected_overview

      this.collected_details = col_details
      this.lessonComponent = LessonCarouselComponent
      this.tab_data = this.data.course_description

      setTimeout(() => this.ex_call_component(this.data.course_description), 100)
    
    },
    ex_call_component(data) {

      this.lessonTab = 'overview'
      this.show = true
      this.currentComponent = LessonTabOverview
      this.videoComponent = VideoPlayer

    },
    close() {
      this.dialogLesson = false
      this.$emit('change')
    },
    handleClose(done) {
      this.dialogLesson = false
      this.$emit('change')
      done();
    }
  }
};
</script>
