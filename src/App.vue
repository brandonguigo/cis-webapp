<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="90"
        />

        <v-toolbar-title>Projet CIS</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="/logout"
        text
      >
        <span class="mr-2">Logout</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="mt-15">
        <v-toolbar-title class="ml-3">Envoyer une demande au cluster de cassage</v-toolbar-title>
        <v-form v-model="valid" v-on:submit.prevent="submitRequest">
          <v-container>
            <v-text-field
              v-model="hash"
              label="Hash à casser"
              required
            ></v-text-field>
            <v-btn
                class="mr-4 primary"
                type="submit"
            >
              submit
            </v-btn>
          </v-container>
        </v-form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UserInfoStore from "@/store/user-info-store";
import aws from "@/store/aws";

export default {
  name: "App",
  components: {},
  data: () => ({
    valid: false,
    hash: "",
    userInfo: {}
  }),
  methods: {
    submitRequest() {
      aws.addToSQS(UserInfoStore.state.cognitoInfo.email, this.hash);
    }
  },
  mounted() {
    this.userInfo = UserInfoStore.state.cognitoInfo;
  }
};
</script>
