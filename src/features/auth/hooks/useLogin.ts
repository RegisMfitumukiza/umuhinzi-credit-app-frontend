import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { authStorage } from "../utils/auth-storage";


export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,

        onSuccess: (response) => {
            authStorage.setAccessToken(response.data.accessToken);
            authStorage.setRefreshToken(response.data.refreshToken);
        }
    })
}