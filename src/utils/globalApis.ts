import { useRef } from "@/hooks";
import { useDialog, useMessage } from "naive-ui";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import { ref } from "vue";

export const dialog = ref<DialogApiInjection>();
export const setGlobalDialog = (
    newDialog: DialogApiInjection = useDialog()
) => {
    dialog.value = newDialog;
};
export const [message, setGlobalMessage] = useRef<MessageApiInjection>(
    undefined,
    (newMessage = useMessage()) => {
        message.value = newMessage;
    }
);

export const setup = () => {
    setGlobalDialog();
    setGlobalMessage();
};
