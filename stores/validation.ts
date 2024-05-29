import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useValidationStore = defineStore("validation", () => {
  function checkValidation(
    data: Record<string, any>,
    fields: Record<string, string>
  ) {
    for (const field in fields) {
      if (!data[field]) {
        const errorMessage = `'${fields[field]}' обязательно для заполнения`;
        toast.error(errorMessage);
        return false;
      }
    }
    return true;
  }

  return { checkValidation };
});
