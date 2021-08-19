<template>
  <v-dialog
      :value="dialogState"
      @input="$emit('change',false)"
      max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Track Period</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>

            <v-col cols="12">
              <v-text-field
                  type="date"
                  v-model="day.date"
              />
            </v-col>

            <v-col
                cols="12"
            >
              <v-slider
                  v-model="day.strength"
                  :tick-labels="ticksLabels"
                  :max="2"
                  step="1"
                  ticks="always"
                  tick-size="2"
                  color="#DF007D"
                  track-color="#920052"
              ></v-slider>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="#920052"
            text
            @click="deleteEntry"
        >
          Delete
        </v-btn>
        <v-btn
            color="#920052"
            text
            @click="$emit('change',false)"
        >
          Close
        </v-btn>
        <v-btn
            color="#DF007D"
            class="white--text"
            depressed
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Overlay",

  props: {
    dialogState: Boolean,
    loadedDay: Object,
  },

  watch: {
    loadedDay: function (newVal) {
      this.day.date = newVal.date;
      this.day.strength = newVal.strength;
    }
  },

  data: () => ({
    day: {},
    ticksLabels: [
      'low',
      'medium',
      'strong',
    ],
  }),

  methods: {
    save() {
      this.$emit('save', {...this.day});
      this.$emit('change', false);
    },
    deleteEntry() {
      this.$emit('delete', this.day.date);
      this.$emit('change', false);
    }
  },
}
</script>

<style scoped>

</style>