<template>
	<div>
    <!-- {{ selected }} -->
    <el-col :span="24" class="pdf-container">
        <button class="arrow-btn-pdf arrow-pdf-prev" @click="prev()">
          <img
            class="arrow-pdf"
            :src="prevArrow"
            alt="arrow-left">
        </button>
        <button class="arrow-btn-pdf arrow-pdf-next" @click="next()">
          <img
            class="arrow-pdf"
            :src="nextArrow"
            alt="arrow-right">
        </button>
        <span class="pdf-details color-white">Page: {{currentPage}} / {{pageCount}}</span>
          <pdf
          id="pdfCanvass"
      
          :src="pdfUrl"
          :page="currentPage"

          @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event"
        >

            </pdf>
    </el-col>
    

	</div>
</template>
<script>

import pdf from 'vue-pdf'

export default {
  name: 'PdfComponent',
  props: {
    selected: {
      // required: true,
      type: Object
    }
  },
	components: {
		pdf
	},
	data() {
		return {
			currentPage: 1,
      pageCount: 0,
      pdfUrl: 'https://lms-frontend.app/images/sample.pdf',
      data: this.selected,
      nextArrow: "../../images/next.png",
      prevArrow: "../../images/prev.png",
		}
  },
  
  created () {
    this.getData()
  },
  methods: {
    getData() {
      // let data = this.data.resources[0]
      // this.pdfUrl = data.file
    },
    next() {
      if(this.currentPage < this.pageCount) {
         this.currentPage = this.currentPage + 1
      } else {
        console.log('no more page')
      }
    },
    prev() {
      if(this.currentPage  > 1) {
         this.currentPage = this.currentPage - 1
      } else {
        console.log('no more page')
      }

    }
  },
}

</script>