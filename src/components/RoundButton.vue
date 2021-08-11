<template>
  <v-btn
      class="mx-2 button"
      @click="$emit('click', $event)"
      fab
      dark
      color="#DF007D"
  >
    <v-icon dark>
      mdi-plus
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "RoundButton"
}
</script>

<style scoped>
.button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}
</style>