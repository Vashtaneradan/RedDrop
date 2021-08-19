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
            <v-card style=" grid-area: a;" v-if="predictedPeriod !== null">
              <v-card-title class="text-body-2 flex justify-space-between mb-6">
                <span>Heute</span>
                <span>28 Tage</span>
              </v-card-title>
              <v-range-slider
                  class="mx-4"
                  :value="predictedPeriod"
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
                :value="avgPeriodLength"
            />
            <Tile
                :title="'Durchschnittliche Zyklusdauer'"
                :value="avgCycleLength"
            />
            <Tile
                :title="'Dauer letzte Periode'"
                :value="lastPeriodLength"
            />
            <Tile
                :title="'Blutung'"
                :avg_strength="avgStrength"
            />
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-date-picker
              :first-day-of-week="1"
              :value="dates"
              :events="predictedPeriodDays"
              show-adjacent-months
              event-color="#ff52b4"
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
          @delete="deleteEntry"
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

function getDayDifference(first, second) {
  return Math.round((new Date(second) - new Date(first)) / (1000 * 60 * 60 * 24));
}

function getDates(startDate, stopDate) {
  const dateArray = [];
  let currentDate = new Date(startDate.getTime());
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate).toISOString().substr(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export default {
  name: 'App',

  components: {
    RoundButton,
    Overlay,
    Tile,
  },

  computed: {
    dates() {
      return this.localStorage.data.map(day => day.date);
    },
    periods() {
      const periods = [];
      let previousDay = null;
      const dataCopy = [...this.localStorage.data];
      this.localStorage.data.forEach(day => {
        // beginnig of th array
        if (previousDay === null) {
          previousDay = day;
          return;
        }
        // cut period off
        if (getDayDifference(previousDay.date, day.date) > 1) {
          periods.push(dataCopy.splice(0, dataCopy.indexOf(day)));
        }
        previousDay = day;
      })
      if (dataCopy.length) {
        periods.push(dataCopy);
      }
      return periods;
    },
    avgPeriodLength() {
      return Math.round(this.periods.reduce((a, period) => a + period.length, 0) / this.periods.length * 10) / 10;
    },
    avgCycleLength() {
      const cycles = [];
      let previousCycleStartDay = null;
      this.periods.forEach(period => {
        if (previousCycleStartDay === null) {
          previousCycleStartDay = period[0];
          return;
        }
        cycles.push(getDayDifference(previousCycleStartDay.date, period[0].date));
        previousCycleStartDay = period[0];
      });
      if (!cycles.length) {
        cycles.push(0);
      }

      return Math.round(cycles.reduce((a, cycle) => a + cycle, 0) / cycles.length * 10) / 10;
    },
    lastPeriodLength() {
      if (this.periods.length === 0) {
        return 0;
      }
      const lastPeriod = this.periods[this.periods.length - 1];
      if (getDayDifference(lastPeriod[lastPeriod.length - 1].date, new Date()) > 2) {
        return lastPeriod.length;
      }
      if (this.periods.length <= 1) {
        return 0;
      }
      return this.periods[this.periods.length - 2].length;
    },
    avgStrength() {
      const sum = this.localStorage.data.reduce((a, day) => a + day.strength, 0);
      const avg = (sum / this.localStorage.data.length) || 0;
      switch (Math.round(avg)) {
        case 0:
          return 'light';
        case 1:
          return 'medium';
        case 2:
          return 'strong';
        default:
          return 'unknown';
      }
    },
    predictedPeriod() {
      if (this.periods.length === 0) {
        return null;
      }
      const lastPeriod = this.periods[this.periods.length - 1];
      const lastStartDate = new Date(lastPeriod[0].date);
      const cycleLength = this.avgCycleLength ? this.avgCycleLength : 28;
      const periodLength = this.avgPeriodLength ? this.avgPeriodLength : 6;

      const nextStartDate = new Date(lastStartDate.getTime());
      nextStartDate.setDate(lastStartDate.getDate() + cycleLength);

      const nextEndDate = new Date(nextStartDate.getTime());
      nextEndDate.setDate(nextStartDate.getDate() + periodLength - 1);

      return [getDayDifference(new Date(), nextStartDate), getDayDifference(new Date(), nextEndDate)];
    },
    predictedPeriodDays() {
      if (this.periods.length === 0) {
        return null;
      }
      const result = [];


      const lastPeriod = this.periods[this.periods.length - 1];
      let lastStartDate = new Date(lastPeriod[0].date);
      const cycleLength = this.avgCycleLength ? this.avgCycleLength : 28;
      const periodLength = this.avgPeriodLength ? this.avgPeriodLength : 6;

      let nextStartDate;
      let nextEndDate;

      for (let i = 0; i <= 20; i++) {
        nextStartDate = new Date(lastStartDate.getTime());
        nextStartDate.setDate(lastStartDate.getDate() + cycleLength);

        nextEndDate = new Date(nextStartDate.getTime());
        nextEndDate.setDate(nextStartDate.getDate() + periodLength - 1);

        result.push(...getDates(nextStartDate, nextEndDate));
        lastStartDate = new Date(nextStartDate.getTime());
      }
      return result;
    }
  },

  data: () => ({
    dialogState: false,
    tab: null,
    dialogLoadedDay: {},
  }),

  methods: {
    startEdit(date) {
      const day = this.localStorage.data.find(day => day.date === date);
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
      const oldDay = this.localStorage.data.find(day => day.date === saveDay.date);
      if (!oldDay) {
        this.localStorage.data.push(saveDay);
        this.localStorage.data.sort((a, b) => {
          var keyA = new Date(a.date),
              keyB = new Date(b.date);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      } else {
        oldDay.strength = saveDay.strength;
      }
    },
    deleteEntry(deleteDate) {
      this.localStorage.data = this.localStorage.data.filter(day => day.date !== deleteDate)
    }
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
