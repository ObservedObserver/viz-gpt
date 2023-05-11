import { useContext } from "react";
import { NotificationContext } from ".";

export function useNotification() {
    return useContext(NotificationContext);
}