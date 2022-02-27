<template>

    
          <div ref="vimeoPlayer" id="vimeoPlayer" >
          </div>
          <!-- <div> -->
            <!-- <VideoCompleteOverlay
                v-if="showOverlay"
                :currentLesson="currentLesson"
                :toNextStep="toNextStep"
                :rewatch="restartPlayer"
                :lesson_count="lesson_count"
                :lessonsData="lessons"
                @playNext="playNext"
                @closeClicked="closeClicked"
            /> -->
          <!-- </div> -->
    



<!--        <div-->
<!--            class="loader"-->
<!--            v-show="!isReady"-->
<!--            style="margin-top: 20vh !important;"-->
<!--        >-->
<!--            <loader-->
<!--                :width="30"-->
<!--                :height="30"-->
<!--            />-->
<!--        </div>-->
    
</template>

<script>
// import { mapState } from "vuex";

import Player from "@vimeo/player";
// import VideoCompleteOverlay from "@C/search/VideoCompleteOverlay";
// import exitFullscreen from "@H/exitFullscreen";

export default {
  name: "VimeoPlayer",
  data() {
    return {
      lastTime: null,
      interval: null,
      isReady: false,
      isComplete: false,
      heldVolume: null,
      showOverlayTrigger: true,
      retries: 0,
    };
  },
  props: {
    video_url: {
      validator: (prop) => typeof prop === "string" || prop === null,
      required: true,
    },
    currentLesson: {
      type: Object,
      required: true,
    },
    toNextStep: {
      type: [Function, Boolean],
      default: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    startPosition: {
      type: Number,
      required: true,
    },
    currentTime: {
      type: Number,
      required: true,
    },
    lessonDuration: {
      type: Number,
      required: true,
    },
    setLessonDuration: {
      type: String,
      required: true,
    },
    updateLessonTime: {
      type: Function,
      required: true,
    },
    lesson_count: {
      type: Number,
      required: false,
    },
    lessons: {
      type: Array,
      required: false,
    },
    playerHeight: {
      type: Number,
      default: 575
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (!this.isPreview) {
      this.player
        .getCurrentTime()
        .then((seconds) => this.updateLessonTime(seconds));
    }
  },
  computed: {
    // ...mapState(["bus"]),
    showOverlay: function () {
      return !this.isPreview && this.isComplete && this.showOverlayTrigger;
    },
  },
  watch: {
    async isComplete(val) {
      // Will fire on load and on complete.
      // No impact firing on complete
      // as well so leaving it in.
      if (val && !this.isPreview) {
        this.showOverlayTrigger = false;
        this.player.getVolume().then((volume) => {
          this.heldVolume = volume;
          this.player.setVolume(0);
        });
        this.player.off("timeupdate");
        this.player.off("seeked");
        this.player.off("play");
        this.player.off("ended");

        this.player.on("ended", () => {
          // Add events back in
          this.player.off("ended");
          this.showOverlayTrigger = true;
          this.player.setVolume(this.heldVolume);
          this.addTimeUpdateEvent();
          this.addSeekedEvent();
          this.addPlayEvent();
          this.addEndedEvent();
        });

        try {
          const duration = await this.player.getDuration();
          const seconds = await this.player.setCurrentTime(duration - 1);
          await this.player.play();
        } catch {
          Promise.reject();
        }
      }
    },
  },
  methods: {
    async initPlayer() {
      await this.player.ready();
      this.player.off("resize");

      this.player.on("loaded", (data) => {
        // Get video duration and set in parent
        if (this.lessonDuration === 0) {
          this.player.getDuration().then((dur) => this.setActualDuration(dur));
        } else {
          // Set the last known position or start again if complete
          if (this.startPosition && this.startPosition < 100) {
            this.player.setCurrentTime(
              this.lessonDuration * (this.startPosition / 100)
            );
          } else {
            this.player.setCurrentTime(0);
            this.isComplete = this.startPosition == 100;
          }
        }

        // If previously played resume
        if (this.currentTime && !this.isComplete) {
          this.player.setCurrentTime(this.currentTime);
        }

        // Reveal player
        this.isReady = true;
        this.$emit("change", this.isReady);
        this.$emit("loaded");
        this.$emit("rendered", true);
        console.log(this.bus, "nis");
        this.bus.$emit("iframe:loaded");
      });

      if (!this.isPreview) {
        this.addTimeUpdateEvent();
        this.addSeekedEvent();
        this.addPlayEvent();
        this.addEndedEvent();
      }
    },
    playNext(next_id, course_id) {
      this.$emit("playNextSingleLesson", next_id, course_id); // trigger playNextSingleLesson on SingleLesson file
    },
    addTimeUpdateEvent() {
      this.player.on("timeupdate", ({ duration, percent, seconds }) => {
        // Will trigger an update every ten seconds.
        if (this.lastTime === null || this.lastTime + 10 < seconds) {
          this.lastTime = seconds;
          this.updateLessonTime(seconds);
        }
      });
    },
    addPlayEvent() {
      this.player.on("play", () => {
        this.isComplete = false;
      });
    },
    addSeekedEvent() {
      this.player.on("seeked", ({ seconds }) => {
        this.updateLessonTime(seconds);
        this.isComplete = false;
      });
    },
    addEndedEvent() {
      this.player.on("ended", ({ duration }) => {
        // Video ended set progress to 100% (the duration of the video)
        this.updateLessonTime(duration, true);
        this.isComplete = true;

        exitFullscreen();
      });
    },
    async init() {
      if (this.video_url) {
        this.player = new Player(this.$refs.vimeoPlayer, {
          url: this.video_url,
          responsive: true,
          height: this.playerHeight
        });

        try {
          await this.initPlayer();
        } catch (error) {
          await this.player.destroy();
          this.player = null;
          this.retries++;
          if (this.retries < 5) {
            await this.init();
          } else {
            this.$emit("fail");
          }
        }
      }
    },
    setActualDuration(duration) {
      this.setLessonDuration(duration);
      if (this.startPosition && this.startPosition < 100) {
        this.player.setCurrentTime(duration * (this.startPosition / 100));
      } else {
        this.player.setCurrentTime(0);
        this.isComplete = this.startPosition == 100;
      }
    },
    restartPlayer() {
      this.isComplete = false;
      this.player.play();
    },
    async pause() {
      try {
        await this.player.pause();
        const seconds = await this.player.getCurrentTime();
        const duration = await this.player.getDuration();
        Promise.resolve((seconds / duration) * 100);
      } catch {
        Promise.reject();
      }
    },
    closeClicked() {
      // Bubble up
      this.$emit("closeClicked");
    },
  },
  components: {
    // VideoCompleteOverlay,
  },
};
</script>
