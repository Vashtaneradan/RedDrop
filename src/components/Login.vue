<template>
  <div>
    <div v-if="user">
      {{ user.displayName }}
      [{{ user.email }}]
      <v-btn @click="logout">Logout</v-btn>
    </div>
    <div v-show="!user" id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import {firebase} from "../firebase.js";
import * as firebaseui from "firebaseui";

export default {
  name: "Login",

  data() {
    return {
      user: null,
    };
  },

  methods: {
    async logout() {
      await firebase.auth().signOut();
    },
  },

  mounted() {
    const auth = firebase.auth();
    const ui = new firebaseui.auth.AuthUI(auth);
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        }
      } else {
        this.user = null;
        // User is signed out
        ui.start('#firebaseui-auth-container', {
          signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
          ],
          callbacks: {
            // eslint-disable-next-line no-unused-vars
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
              return false;
            }
          }
        });
      }
    });


  },
}
</script>

<style>
@import "~firebaseui/dist/firebaseui.css";
</style>