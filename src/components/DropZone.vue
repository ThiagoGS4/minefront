<template>
  <div
    class="dropzone border-dashed"
    :class="[
      { 'dropzone--active': isDragging && !props.disabled },
      { 'dropzone--disabled': props.disabled },
      { 'dropzone--disabled-drag': isDragging && props.disabled },
    ]"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <slot :isDragging="isDragging">
      <span>{{
        props.disabled
          ? "Ligue a VM antes de tentar adicionar mods"
          : "Arraste os arquivos aqui ou clique para selecionar"
      }}</span>
    </slot>
    <input
      :disabled="props.disabled"
      ref="fileInput"
      type="file"
      multiple
      class="hidden-input"
      @change="onFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue3-toastify";

const emit = defineEmits<{
  (e: "files-selected", files: File[]): void;
}>();

const props = defineProps<{
  disabled: boolean;
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(e: DragEvent) {
  if (!props.disabled) {
    isDragging.value = false;
    if (!e.dataTransfer) return;
    const files = Array.from(e.dataTransfer.files);
    emit("files-selected", files);
  } else {
    toast.error("Ligue a VM antes!", {
      position: toast.POSITION.TOP_RIGHT,
      transition: "slide",
    });
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const files = Array.from(target.files);
  emit("files-selected", files);
}
</script>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25%;
  min-height: 140px;     /* define uma altura base */
  border: 2px dashed #426ff5;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, transform 0.15s;
}

.dropzone--active {
  border-color: #42b860;
  background-color: #caffb1;
  /* se quiser um efeito leve, usa transform: */
  transform: scale(1.02);
}

.dropzone--disabled {
  border-color: rgba(126, 126, 126, 0.514);
  color: rgba(126, 126, 126, 0.514);
  cursor: not-allowed;
}

.dropzone--disabled-drag {
  border-color: rgb(189, 4, 4);
  background-color: #ff35357e;
  color: rgba(126, 126, 126, 0.514);
}

.hidden-input {
  display: none;
}
</style>
