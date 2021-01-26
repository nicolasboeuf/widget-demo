<template>
  <div class="databox">
    <h1 class='rf-text--lead'>{{ovq['nom_ovq']}}</h1>
    {{ovq}}
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'DataBox',
  data(){
    return {
      ovq:{}
    }
  },
  props: {
    ovqid: String
  },
  computed: {
  },
  methods: {
    async getOvqData(){
      // this block should be executed globally, in a middleware or something
      const response = await fetch("/structure-cible.json")
      const data = await response.json()
      store.commit('initStructure',data)
      //
      let structure = store.state.structure
      this.ovq = structure.find(ovq => ovq['id_ovq'] == this.ovqid);
      
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
