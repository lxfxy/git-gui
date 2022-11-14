import { useDialog } from "naive-ui";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { ref } from "vue";

export const dialog = ref<DialogApiInjection>();
export const setGlobalDialog = (
    newDialog: DialogApiInjection = useDialog()
) => {
    dialog.value = newDialog;
};

export const setup = () => {
    setGlobalDialog();
};
