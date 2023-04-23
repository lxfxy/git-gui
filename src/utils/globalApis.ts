import { useRef } from "@/hooks";
import { useDialog, useMessage, useNotification } from "naive-ui";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { ref } from "vue";

export const [dialog, setGlobalDialog] = useRef<DialogApiInjection>();
export const [message, setGlobalMessage] = useRef<MessageApiInjection>();
export const [notification, setNotification] =
    useRef<NotificationApiInjection>();
export const setup = () => {
    setGlobalDialog(useDialog());
    setGlobalMessage(useMessage());
    setNotification(useNotification());
};
