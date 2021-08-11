<template>
  <v-card>
    <div class="text-center">
      <v-progress-circular
          v-if="value"
          :rotate="-90"
          :size="100"
          :width="15"
          :value="percentage"
          color="#920052"
      >
        {{ value }}
      </v-progress-circular>

      <div v-if="avg_strength" style="
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
margin: 1rem;">
        <v-img
            height="100"
            max-width="100"
            class="ma-auto"
            :src="require('@/assets/'  + avg_strength + '.svg')"
        ></v-img>
      </div>

    </div>
    <v-card-title class="flex-column text-body-2 circular__description">
      <span v-if="avg_strength">{{ avg_strength }}</span>
      <span v-if="!avg_strength">
        <div class="">
          {{ title }}
        </div>
      </span>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Tile",

  props: {
    title: String,
    value: {
      type: Number,
      default: 0,
    },
    avg_strength: String,
  },

  data: () => ({
    //
  }),

  computed: {
    percentage() {
      return 100 / 31 * this.value;
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}

.circular__description {
  word-break: normal;
}
</style>