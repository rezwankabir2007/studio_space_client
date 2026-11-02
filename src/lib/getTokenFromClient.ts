import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
       const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError) {
        throw new Error(tokenError.message || "Failed to get token.");
      }

      const token = tokenData?.token;
      return token;
}