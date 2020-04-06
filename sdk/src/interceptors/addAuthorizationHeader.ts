import { AxiosRequestConfig } from "axios";
import isFunction from "lodash/isFunction";

export default function addAuthorizationHeader(
    apiTokenOrGetApiToken: string | null | (() => Promise<string | null>)
) {
    return async (
        requestConfig: AxiosRequestConfig
    ): Promise<AxiosRequestConfig> => {
        const apiToken = isFunction(apiTokenOrGetApiToken)
            ? await apiTokenOrGetApiToken()
            : apiTokenOrGetApiToken;
        return apiToken
            ? {
                  ...requestConfig,
                  headers: {
                      ...requestConfig.headers,
                      Authorization: `Bearer ${apiToken}`,
                  },
              }
            : requestConfig;
    };
}
