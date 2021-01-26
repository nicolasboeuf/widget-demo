import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user:{
      selectedGeoLevel:"national",
      selectedGeoCode:undefined
    },
    structure:{},
    territoireData:{
      national:{},
      regional:{},
      departemental:{}
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    initStructure (state,data) {
      state.structure = data
    },
    setTerritoireData (state,payload) {
      state.territoireData[payload.level] = payload.data
    }
  }
})
