import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useAppStore = defineStore('AppStore', () => {
  const error =  ref(null);

  function showError(msg) {
    error.value = msg;
    setTimeout(() => error.value = null, 2000);
  }
  return {
    error,
    showError,
  }
});
