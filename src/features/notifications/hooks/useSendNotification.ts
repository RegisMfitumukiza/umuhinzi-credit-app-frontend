import { useMutation } from "@tanstack/react-query";
import { sendNotification } from "../api/notifications.api";

export const useSendNotification = () =>
  useMutation({ mutationFn: sendNotification });
