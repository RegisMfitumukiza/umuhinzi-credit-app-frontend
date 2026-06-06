import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { authStorage } from "../utils/auth-storage";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (response) => {
      authStorage.setAccessToken(response.data.accessToken);
      authStorage.setRefreshToken(response.data.refreshToken);
      queryClient.setQueryData(["auth-user"], {
        success: true,
        message: "OK",
        data: response.data.user,
      });
    },
  });
};
