<template>
    <el-row>
      <el-col :span="24">
        <!-- {{ selected }} -->
        <div>
          <el-input id="searchBar" placeholder="Search Question, Answer or Topic..." v-model="search" clearable class="input-with-select">
            <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
          </el-input>
        </div>
        <el-collapse v-for="(faq, i) in data" :key="i" v-model="data.id" accordion @change="handleChange">
          <el-collapse-item :name="faq.id">
              <template slot="title">
                <!-- <i class="header-icon el-icon-info"></i> -->
                <transition name="el-fade-in">
                  <i v-if="faq.is_active === false" class="el-icon-minus"></i>
                  <i v-else class="el-icon-plus"></i>
                </transition>
                <span>{{ faq.question }}</span>
              </template>
            <div v-html="faq.answer"></div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24">
        <span style="display: block; width: 100%; text-align: center;">Can't see your question above?</span>
        <el-button class="suggest-question-btn">SUGGEST A NEW QUESTION</el-button>
      </el-col>
    </el-row>
</template>

<script>
export default {
  name: "LessonTabFaq",
  props: {
    selected_data: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      iconClass: 'plus',
      activeName: '',
      data: []
    };
  },
  mounted: function() {
    // this.showLoader()
    // setTimeout(() => this.showLoader(), 1000)
  },
  watch: {
    search: function() {
      if (this.search.length >= 2 || this.search.length === 0) {
        this.searchData()
      }
    }
  },
  created: function() {
    this.mapData()
  },
  methods: {
    searchData() {
    //  console.log('sec')
     if(this.search.length !== 0) {
      let arr = []
        this.data.forEach((value, index) => {
          if(value.question.toLowerCase().includes(this.search.toLowerCase()) || value.answer.toLowerCase().includes(this.search.toLowerCase())) {
            arr.push(value)
          }
        })
        this.data = arr
        // console.log(arr,'arr')
     } else {
       this.mapData()
     }
    },
    mapData() {
      this.selected_data.forEach((value, index) => {
        value['is_active'] = false
      })
      this.data = this.selected_data
    },
    handleChange(val) {
      if(val) {
          // console.log('notzero')
        this.activeName = val
        this.data.forEach((value, index) => {
          if(value.id === val) {
            value.is_active = true
          }
        })
      }
      if(!val){
        // console.log('zero')
         this.data.forEach((value, index) => {
          if(value.id === this.activeName) {
              value.is_active = false
          }
        })
      }
      
      // console.log(this.activeName)
      
    }
  }
};
</script>
