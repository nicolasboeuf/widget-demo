<template>
  <div class="databox">
    <h1 class='rf-text--lead'>{{ovqStructure['nom_ovq']}}</h1>
    <div v-for="i in indicateurs" :key="i['id_indicateur_fr']">
      
      
      
      <h3>{{i["nom"]}}</h3>
      <br>
      <b>Valeur initiale</b>
      <br>
      {{i["initial_value"]}}
      <br>
      <br>
      <b>Valeur actuelle</b>
      <br>
      {{i["latest_value"]}}
      (dernière maj le {{new Date(i["latest_value_date"]).toLocaleDateString()}})
      <br>
      <br>
      <b>Valeur cible</b>
      <br>
      {{i["target"]}}
      (complété à {{i["target_percentage"]}}%)
      <br>
      <br>


    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'DataBox',
  data(){
    return {
      ovqStructure:{},
      ovqDataset:{},
      indicateurs:{}
    }
  },
  props: {
    ovqid: String
  },
  computed: {
    selectedGeoLevel () {
      return store.state.user.selectedGeoLevel
    },
    selectedGeoCode () {
      return store.state.user.selectedGeoCode
    },
  },
  methods: {
    async getOvqData(){
      var self = this
      // request all data \\
      // this whole block should be executed globally, in a middleware or something \\

      const dataRequest = await fetch("data/structure-cible.json")
      const data = await dataRequest.json()

      store.commit('initStructure',data)

      const nationalDataRequest = await fetch("data/par_territoire/territoire-national-global-light.json")
      const nationalData = await nationalDataRequest.json()
      store.commit("setTerritoireData",{level:"national",data:nationalData})

      const regionalDataRequest = await fetch("data/par_territoire/territoire-regional-global-light.json")
      const regionalData = await regionalDataRequest.json()
      store.commit("setTerritoireData",{level:"regional",data:regionalData})

      const departementalDataRequest = await fetch("data/par_territoire/territoire-departemental-global-light.json")
      const departementalData = await departementalDataRequest.json()
      store.commit("setTerritoireData",{level:"departemental",data:departementalData})

      // requests end here \\

      this.ovqStructure = store.state.structure.find(ovqStructure => ovqStructure['id_ovq'] == this.ovqid)
      let ovqObj

      switch(this.selectedGeoLevel){
        case "national":
          ovqObj = store.state.territoireData.national[0]["ovq"]
          break
        case "regional":    
          ovqObj = store.state.territoireData.regional[this.selectedGeoCode-1]["ovq"]
          break
        case "departemental":
          ovqObj = store.state.territoireData.departemental[this.selectedGeoCode-1]["ovq"]
          break
      }

      this.ovqStructure["indicateurs"].forEach(function(indic){
        self.indicateurs[indic["id_indicateur_fr"]] = {}
        self.indicateurs[indic["id_indicateur_fr"]]["nom"] = indic["nom_indicateur"]
      })

      this.ovqDataset = ovqObj.find(ovqDataset => ovqDataset['id_ovq'] == this.ovqid);

      let indicateursJSON = this.ovqDataset["indicateurs"]

      indicateursJSON.forEach(function (indicateurPropreties) {
        let dataIndicateur = indicateurPropreties[Object.keys(indicateurPropreties)[0]]
        let indicateurID = Object.keys(indicateurPropreties)
        for (const [prop, value] of Object.entries(dataIndicateur[0])) {
         self.indicateurs[indicateurID][prop] = value  
        }
      })
    }
  },
  beforeMount() {
    this.getOvqData()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  /* import DSE stylesheet, to delete if parent has access */
  @import "../../css/all.min.css";

</style>
