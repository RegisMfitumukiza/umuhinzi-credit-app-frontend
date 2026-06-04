import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "../api/auth.api";


export const useResendEmailVerificationEmail = () => {
    return useMutation({
        mutationFn: resendVerificationEmail,
    })
}