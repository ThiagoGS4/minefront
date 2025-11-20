<template>
  <v-row dense>
    <v-col cols="12" align="center">
      <h1>Bem Vindo a Garcia's server Hub</h1>

      <v-row dense justify="center">
        <v-col cols="6">
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

          <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Mods inseridos:
      </v-card-title>

      <v-card-text>
        {{lastResult}}
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="dialog = false">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { /* computed, */ onBeforeMount, onMounted, ref } from "vue";
import callAPI from "../fetching";
import { toast } from "vue3-toastify";
import DropZone from "../components/DropZone.vue";

const API = new callAPI();

const isVmUp = ref(false);
const isServerUp = ref(false);
const isLoading = ref(false);
const isLoadingServer = ref(false);

const uploading = ref(false);
const lastResult = ref<any | null>(null);


//mods
//const mods = ref<string[]>([]); //terminar isso
/* const modItems = computed(() =>
  mods.value.map((name) => ({ name }))
);
const loadingMods = ref(false) */

const dialog = ref(false)

async function handleFilesSelected(files: File[]) {
  if (!files.length) return;
  try {
    uploading.value = true;
    const result = await API.addMods(files);
    lastResult.value = result;
    dialog.value = true
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
  mcStatus?: string
}

async function checkVMState() {
  isLoading.value = true;
  const resVmState =  await API.checkStateVM().then((response: IstateVM) => {
    if (response.powerState === "VM deallocated") {
      return false;
    } else {
      return true;
    }
  });
  isLoading.value = false;
  return resVmState
}

async function checkServerState() {
  isLoadingServer.value = true;
  const checkServerResp = await API.checkServerStatus().then((response: IstateServer) => {
    if (response.mcStatus === "offline") {
      return false;
    } else {
      return true;
    }
  });
  isLoadingServer.value = false;
  return checkServerResp
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

/* async function loadMods() { //implementar tabela de mods
  try {
    loadingMods.value = true;
    const res: {mods: string[]} = await API.listMods();
    mods.value = res.mods || [];
  } finally {
    loadingMods.value = false;
  }
} */

onBeforeMount(async () => {
 isVmUp.value = await checkVMState();
});
onMounted(async () => {
  isServerUp.value = await checkServerState()
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
