import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../api/auth.api";
import { authStorage } from "../utils/auth-storage";


export const useAuthUser = () => {
    return useQuery({
        queryKey: ["auth-user"],
        queryFn: getAuthUser,
        enabled: !!authStorage.getAccessToken()
    });
}

