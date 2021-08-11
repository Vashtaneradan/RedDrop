<template>
  <v-app>
    <v-main>
      <v-toolbar
          color="#DF007D"
          dark
          flat
      >
        <v-toolbar-title>RedDrop</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-slot:extension>
          <v-tabs
              v-model="tab"
              align-with-title
          >
            <v-tabs-slider color="#920052"></v-tabs-slider>

            <v-tab>
              Home
            </v-tab>
            <v-tab>
              Calendar
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="grid__container">
            <v-card style=" grid-area: a;">
              <v-card-title class="text-body-2 flex justify-space-between mb-6">
                <span>Heute</span>
                <span>28 Tage</span>
              </v-card-title>
              <v-range-slider
                  class="mx-4"
                  :value="[5,10]"
                  :min="0"
                  :max="28"
                  track-color="grey"
                  color="#DF007D"
                  ticks="always"
                  tick-size="2"
                  thumb-label="always"
                  readonly
              />
            </v-card>
            <Tile
                :title="'Durchschnittliche Periondenlänge'"
                :value="4"
            />
            <Tile
                :title="'Durchschnittliche Zyklusdauer'"
                :value="27"
            />
            <Tile
                :title="'Dauer letzte Periode'"
                :value="4"
            />
            <Tile
                :title="'Blutung'"
                :avg_strength="'light'"
            />
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-date-picker
              :value="dates"
              full-width
              readonly
              multiple
              no-title
              color="#DF007D"
              @click:date="startEdit"
          ></v-date-picker>
        </v-tab-item>
      </v-tabs-items>
      <v-footer padless>
        <v-col
            class="text-center"
            cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Vashtaneradan</strong>
        </v-col>
      </v-footer>
      <Overlay
          :loadedDay="dialogLoadedDay"
          :dialogState="dialogState"
          @change="dialogState = $event"
          @save="save"
      />
      <RoundButton
          @click="startSave"
      />
    </v-main>
  </v-app>
</template>

<script>
import Tile from './components/Tile';
import Overlay from './components/Overlay';
import RoundButton from './components/RoundButton';

export default {
  name: 'App',

  components: {
    RoundButton,
    Overlay,
    Tile,
  },

  computed: {
    dates() {
      return this.data.map(day => day.date);
    },
  },

  data: () => ({
    dialogState: false,
    tab: null,
    dialogLoadedDay: {},
    data: [
      {
        date: '2021-08-10',
        strength: 0,
      },
      {
        date: '2021-08-11',
        strength: 1,
      },
    ]
  }),

  methods: {
    startEdit(date) {
      const day = this.data.find(day => day.date === date);
      if (day) {
        this.dialogLoadedDay = day;
      } else {
        this.dialogLoadedDay = {
          date,
          strength: 0,
        }
      }
      this.dialogState = true;
    },

    startSave() {
      this.dialogLoadedDay = {
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        strength: 0,
      }
      this.dialogState = true;
    },

    save(saveDay) {
      const oldDay = this.data.find(day => day.date === saveDay.date);
      if (!oldDay) {
        this.data.push(saveDay);
      } else {
        oldDay.strength = saveDay.strength;
      }
    },
  },
};
</script>

<style scoped>
.grid__container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  gap: 10px 10px;
  grid-template-areas:
    "a a"
    ". ."
    ". .";
  margin: 10px;
}
</style>
