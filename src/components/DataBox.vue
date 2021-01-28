<template>
  <div class="databox">
    <h1 class="rf-h2">{{ovqStructure['nom_ovq']}}</h1>

    <div v-for="i in indicateurs" :key="i['id_indicateur_fr']">
      
      <h2 class="rf-h3">{{i["nom"]}}</h2>

      <div class="databox_container">
        
        <div class="box" data-value="initiale">      
          <div class="box_header">
            <span>En {{formatDate(i["initial_value_date"],"month")}}</span>
          </div>
          <span>{{i["initial_value"]}}</span>
        </div>

        <div class="box" data-value="latest">
          <div class="box_header">
            <span>En {{formatDate(i["latest_value_date"],"month")}}</span>
          </div>
          <span>{{i["latest_value"]}}</span>
          
        </div>

        <div class="box" data-value="target">
          <div class="box_header">   
            <span>Cible à atteindre en {{formatDate(i["target_date"],"year")}}</span>
          </div>
          <span>{{i["target"]}}</span>
          <span>{{i["target_percentage"]}}%</span>
          
        </div>

      </div>
      


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

      // structure data for each ovq
      const dataRequest = await fetch("data/structure-cible.json")
      const data = await dataRequest.json()
      store.commit('initStructure',data)

      // national, regional and departemental data for each ovq
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

      // get all structure for selected ovq
      this.ovqStructure = store.state.structure.find(ovqStructure => ovqStructure['id_ovq'] == this.ovqid)

      // initialize an object for each indicateurs of selected ovq
      this.ovqStructure["indicateurs"].forEach(function(indic){
        self.indicateurs[indic["id_indicateur_fr"]] = {}
        self.indicateurs[indic["id_indicateur_fr"]]["nom"] = indic["nom_indicateur"]
      })

      // get data at the selected geo level for every ovq
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

      // get data for selected geo level of selected ovq
      this.ovqDataset = ovqObj.find(ovqDataset => ovqDataset['id_ovq'] == this.ovqid);

      // get data for indicateurs of selected ovq
      let indicateursJSON = this.ovqDataset["indicateurs"]

      // loop into propreties of each indicateurs and store them in the corresponding initialized objects
      indicateursJSON.forEach(function (indicateurPropreties) {
        let dataIndicateur = indicateurPropreties[Object.keys(indicateurPropreties)[0]]
        let indicateurID = Object.keys(indicateurPropreties)
        for (const [prop, value] of Object.entries(dataIndicateur[0])) {
         self.indicateurs[indicateurID][prop] = value  
        }
      })

      console.log(this.indicateurs)

    },

    formatDate(date,level){
      let newDate = new Date(date)
      let dateOptions
      if(level == "month"){
        dateOptions = {  year: 'numeric', month: 'long' }
      }else{
        dateOptions = {  year: 'numeric'}
      }
      return newDate.toLocaleDateString('fr-FR',dateOptions)
    }

  },
  beforeMount() {
    this.getOvqData()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* import DSE stylesheet, to delete if parent has access */
  @import "../../css/all.min.css";

  .databox_container{
    width: 100%;
    max-width: 700px;
    display: flex;
    justify-content: space-between;
    span{
      display: block;
    }
    .box{
      display: block;
      width: 32%;
      &[data-value="initiale"]{
        background-color: rgb(255, 249, 248);    
        .box_header{
          background-color: rgb(255, 244, 242);
        }
      }
      &[data-value="latest"]{
        background-color: rgb(243, 250, 247);
        .box_header{
          background-color: rgb(231, 245, 239);
        }
      }
      &[data-value="target"]{
        background-color: rgb(242, 242, 249);
        .box_header{
          background-color: rgb(229, 229, 244);
        }
      }
    }
  }

  @media (max-width: 728px) {

    .databox_container{
      flex-direction: column;
      .box{
        width: 100%;
      }
    }

  }


</style>
