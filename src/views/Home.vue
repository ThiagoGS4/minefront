<template>
  <v-row dense>
    <v-col cols="12" align="center">
      <h1>Bem Vindo a Garcia's server Hub</h1>

      <v-card-text v-if="mobile">
        <v-row class="ga-2" align="center" justify="center">
          <v-col cols="12" sm="6">
            <v-btn
              block
              :loading="isLoading"
              :color="isVmUp ? '#eb2d2d' : '#04c75c'"
              @click="isVmUp ? stopVM() : startVM()"
              append-icon="mdi-power"
            >
              {{ isVmUp ? "Desligar VM" : "Iniciar VM" }}
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6">
            <v-btn
              block
              variant="outlined"
              color="primary"
              :loading="isLoading"
              @click="checkVMState"
              append-icon="mdi-information"
            >
              Ver estado da VM
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6">
            <v-btn
              block
              :disabled="!isVmUp"
              :loading="isLoadingServer"
              :color="isServerUp ? '#eb2d2d' : '#04c75c'"
              @click="isServerUp ? stopServer() : startServer()"
              append-icon="mdi-server"
            >
              {{ isServerUp ? "Desligar Server" : "Iniciar Server" }}
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6">
            <v-btn
              block
              variant="outlined"
              color="secondary"
              :disabled="!isVmUp"
              :loading="isLoadingServer"
              @click="checkServerState"
              append-icon="mdi-information"
            >
              Ver estado do server
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-row dense justify="center">
        <v-col cols="6" v-if="!mobile">
          <v-card>
            <v-col cols="12" class="ga-4 d-flex justify-center">
              <v-btn
                @click="isVmUp ? stopVM() : startVM()"
                :loading="isLoading"
                :color="isVmUp ? '#eb2d2d' : '#04c75c'"
                >{{ isVmUp ? "Desligar VM" : "Iniciar VM" }}
                <v-icon class="ml-2">mdi-power</v-icon></v-btn
              >
              <v-btn
                variant="outlined"
                color="primary"
                @click="checkVMState"
                :loading="isLoading"
              >
                Ver estado da VM
                <v-icon class="ml-2">mdi-information</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" class="ga-4 d-flex justify-center">
              <v-btn
                @click="isServerUp ? stopServer() : startServer()"
                :disabled="!isVmUp"
                :loading="isLoadingServer"
                :color="isServerUp ? '#eb2d2d' : '#04c75c'"
                >{{ isServerUp ? "Desligar Server" : "Iniciar Server" }}
                <v-icon class="ml-2">mdi-server</v-icon></v-btn
              >
              <v-btn
                variant="outlined"
                color="secondary"
                @click="checkServerState"
                :loading="isLoadingServer"
                :disabled="!isVmUp"
              >
                Ver estado do server
                <v-icon class="ml-2">mdi-information</v-icon>
              </v-btn>
            </v-col>
          </v-card>
        </v-col>
        <v-col cols="12">
          <DropZone
            :disabled="!isVmUp"
            @files-selected="handleFilesSelected"
            v-slot="{ isDragging }"
          >
            <p v-if="isDragging && isVmUp">Solta os mods aqui…</p>
            <p v-else>
              {{
                isVmUp
                  ? "Arraste os mods aqui ou clique para selecionar"
                  : "Ligue a VM antes de tentar adicionar mods"
              }}
            </p>
          </DropZone>

          <p v-if="uploading">Enviando mods…</p>

          <v-row dense>
            <v-col cols="12">
              <v-data-table
                v-model="selectedMods"
                :headers="modsHeaders"
                :items="listMods"
                item-value="mod"
                show-select
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                @click="deleteMods(selectedMods)"
                :disabled="selectedMods.length === 0"
                >{{
                  selectedMods.length > 1
                    ? "Deletar Mods Selecionados"
                    : "Deletar Mod Selecionado"
                }}</v-btn
              >
            </v-col>

            <v-col cols="12">
              <v-data-table
                v-model="selectedWorld"
                :headers="worldsHeaders"
                :items="listWorlds"
                item-value="world"
                show-select
                select-strategy="single"
              />
            </v-col>
            <v-col cols="12">
              <v-btn @click="moveWorld">mover mundo atual</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                :disabled="!selectedWorld"
                @click="restoreWorld(selectedWorld!)"
                >restaurar mundo selecionado</v-btn
              >
            </v-col>
          </v-row>

          <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title class="text-h6"> Mods inseridos: </v-card-title>

              <v-card-text v-for="name in lastResult.names">
                ● {{ name }}
              </v-card-text>

              <v-card-text>
                por favor, confira se os mods possuem dependências e se estão na
                versão certa do server
                <span class="text-red">(1.21.10)</span>
              </v-card-text>

              <v-card-actions class="justify-end">
                <v-btn color="primary" @click="dialog = false"> OK </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import callAPI from "../fetching";
import { toast } from "vue3-toastify";
import DropZone from "../components/DropZone.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const API = new callAPI();

const isVmUp = ref(false);
const isServerUp = ref(false);
const isLoading = ref(false);
const isLoadingServer = ref(false);

const uploading = ref(false);
const lastResult = ref<any | null>(null);
const selectedWorld = ref<string>();
const worldsHeaders = [
  { title: "ID", value: "id" },
  { title: "World", value: "world" },
];

//mods
const listMods = ref<string[]>([]); //terminar isso
/* const modItems = computed(() =>
  mods.value.map((name) => ({ name }))
); */

const listWorlds = ref<string[]>([]);

const selectedMods = ref<string[]>([]);

const loadingMods = ref(false);

const dialog = ref(false);

async function handleFilesSelected(files: File[]) {
  if (!files.length) return;
  try {
    uploading.value = true;
    const result = await API.addMods(files);
    lastResult.value = result;
    dialog.value = true;
    await loadMods();
  } finally {
    uploading.value = false;
  }
}

interface IstateVM {
  vmName: string;
  powerState: string;
  host: string;
}

interface IstateServer {
  powerState: string;
  status: string;
  mcStatus?: string;
}

const modsHeaders = [
  { title: "ID", value: "id" },
  { title: "Mod", value: "mod" },
];

async function checkVMState() {
  isLoading.value = true;
  const resVmState = await API.checkStateVM().then((response: IstateVM) => {
    if (response.powerState === "VM deallocated") {
      return false;
    } else {
      return true;
    }
  });
  isLoading.value = false;
  return resVmState;
}

async function checkServerState() {
  isLoadingServer.value = true;
  const checkServerResp = await API.checkServerStatus().then(
    (response: IstateServer) => {
      if (response.mcStatus === "offline") {
        return false;
      } else {
        return true;
      }
    }
  );
  isLoadingServer.value = false;
  return checkServerResp;
}

async function startVM() {
  isLoading.value = true;
  const result: IstateVM = await API.startVM();
  isLoading.value = false;
  if (result.powerState === "VM running") {
    isVmUp.value = true;
    toast.success("VM ligada com sucesso!", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  } else {
    isVmUp.value = false;

    toast.error("Ocorreu um erro ao ligar a VM, tente novamente.", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

async function stopVM() {
  isLoading.value = true;
  const result: IstateVM = await API.stopVM();
  isLoading.value = false;
  if (result.powerState === "VM deallocated") {
    isServerUp.value = false;
    isVmUp.value = false;
    toast.success("VM desligada com sucesso!", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  } else {
    isVmUp.value = true;

    toast.error("Ocorreu um erro ao desligar a VM, tente novamente.", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

async function startServer() {
  isLoadingServer.value = true;
  const result: IstateServer = await API.startServer();
  isLoadingServer.value = false;

  if (result.status === "mc_server_started") {
    isServerUp.value = true;
    toast.success("Server iniciado com sucesso!", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  } else {
    isServerUp.value = false;
    toast.error("Ocorreu um erro ao iniciar o server, tente novamente.", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

async function stopServer() {
  isLoadingServer.value = true;
  const result: IstateServer = await API.stopServer();
  isLoadingServer.value = false;

  if (result.status === "mc_server_stopped") {
    isServerUp.value = false;
    toast.success("Server parado com sucesso!", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  } else {
    isServerUp.value = true;
    toast.error("Ocorreu um erro ao parar o server, tente novamente.", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

//mods

async function loadMods() {
  //implementar tabela de mods
  try {
    loadingMods.value = true;
    const resp = await API.listMods();

    listMods.value = resp.mods.map((mod: string, index: number) => {
      return { id: index + 1, mod };
    });
    console.log("listMods.value -->", listMods.value);
  } finally {
    loadingMods.value = false;
  }
}

async function deleteMods(mods: string[]) {
  try {
    await API.removeMods(mods);
    toast.success("Mods deletados com sucesso", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  } catch (err) {
    toast.error("Ocorreu um erro ao deletar mods, tente novamente. " + err, {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
  await loadMods();
}

async function getWorldsList() {
  try {
    const resp = await API.getWorldsList();
    listWorlds.value = resp.worlds.map((world: string, index: number) => {
      return { id: index + 1, world };
    });
  } catch (err) {
    toast.error("Ocorreu um erro ao buscar mundos, tente novamente. " + err, {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

async function moveWorld() {
  try {
    await API.moveWorld();

    if (!isServerUp) {
      toast.success("Mundo movido com sucesso! Resetando server...", {
        position: toast.POSITION.TOP_RIGHT,
        transition: "slide",
      });
      await stopServer();
      await startServer();
    } else {
      toast.success("Mundo movido com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
        transition: "slide",
      });
    }
    await getWorldsList()
  } catch (err) {
    toast.error("Ocorreu um erro ao mover o mundo, tente novamente. " + err, {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

async function restoreWorld(world: string) {
  try {
    await API.restoreWorld(world);

    if (!isServerUp) {
      toast.success("Mundo restaurado com sucesso! Resetando server...", {
        position: toast.POSITION.TOP_RIGHT,
        transition: "slide",
      });
      await stopServer();
      await startServer();
    } else {
      toast.success("Mundo restaurado com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
        transition: "slide",
      });
    }
    await getWorldsList()
  } catch (err) {
    toast.error(
      "Ocorreu um erro ao restaurado o mundo, tente novamente. " + err,
      {
        position: toast.POSITION.TOP_RIGHT,
        transition: "slide",
      }
    );
  }
}

onBeforeMount(async () => {
  isVmUp.value = await checkVMState();
});
onMounted(async () => {
  await loadMods();
  console.log("listMods", listMods.value);

  await getWorldsList();

  isServerUp.value = await checkServerState();
});
</script>

<style scoped>
@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.slide-out-right {
  animation-name: slideOutRight;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
</style>
