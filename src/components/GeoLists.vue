<template>

  <div>

    <div class="list_container">
      <label class="rf-label" for="select-hint" aria-describedby="select-hint-desc-hint">Rechercher par région</label>
      <p class="rf-hint-text" id="select-hint-desc-hint">Choisir dans la liste</p>
      <select class="rf-select" id="select-reg" name="select" @change="changeGeoLevel('regional',$event)">
          <option value="" selected disabled hidden>ex : Bourgogne-France-Comté</option>
          <option v-for="d in regions" :value="d['value']" :key="d['value']">{{d['label']}}</option>
      </select>
    </div>

    <div class="list_container">
      <label class="rf-label" for="select-hint" aria-describedby="select-hint-desc-hint">Rechercher par département</label>
      <p class="rf-hint-text" id="select-hint-desc-hint">Choisir dans la liste</p>
      
      <select class="rf-select" id="select-dep" name="select" @change="changeGeoLevel('departemental',$event)">
          <option value="" selected disabled hidden>ex : Côte-d'Or</option>
          <option v-for="d in departements" :value="d['value']" :key="d['value']">{{d['label']}}</option>
      </select>
    </div>

  </div>
  
</template>

<script>
import store from '@/store'

export default {
  name: 'DataBox',
  data(){
    return {
      departements:[],
      regions:[]
    }
  },
  props: {
    
  },
  computed: {

  },
  methods: {

    async populateLists(){
      var self = this
      // request all data \\
      // this whole block should be executed globally, in a middleware or something \\
      const regionalDataRequest = await fetch("data/par_territoire/territoire-regional-global-light.json")
      const regionalData = await regionalDataRequest.json()
      store.commit("setTerritoireData",{level:"regional",data:regionalData})

      const departementalDataRequest = await fetch("data/par_territoire/territoire-departemental-global-light.json")
      const departementalData = await departementalDataRequest.json()
      store.commit("setTerritoireData",{level:"departemental",data:departementalData})

      // requests end here \\

      store.state.territoireData["departemental"].forEach(function (level) {
        let depObj = { "label":level["libelle"],"value":level["dep"] }
        self.departements.push(depObj)
      })

      store.state.territoireData["regional"].forEach(function (level) {
        let regObj = { "label":level["libelle"],"value":level["reg"] }
        self.regions.push(regObj)
      })

    },

    changeGeoLevel(level,event){

      level == "departemental" ? document.querySelector('#select-reg').value = "" : document.querySelector('#select-dep').value = ""
      store.commit("setUserChoices",{level:level,code:event.target.value})

    }
  },

  beforeMount() {
    this.populateLists()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* import DSE stylesheet, to delete if parent has access */
  @import "../../css/all.min.css";

  select{
    width: 250px;
  }

  h4{
    margin-bottom:0px;
  }

  .list_container{
    display: inline-block;
    margin-left: 50px;
    margin-bottom: 30px;
  }

</style>
