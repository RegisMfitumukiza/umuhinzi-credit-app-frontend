import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api";
import { authStorage } from "../utils/auth-storage";


export const useLogout = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logoutUser,

        onSettled: () => {
            authStorage.clear();
            queryClient.clear();
        }
    })
}