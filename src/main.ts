import { createApp } from "vue";
import App from "./App.vue";
import "vuetify/styles/main.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { router } from "./routes";
import "@mdi/font/css/materialdesignicons.css";
import "vue3-toastify/dist/index.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const app = createApp(App);

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

app.use(vuetify);
app.use(router);
app.mount("#app");
