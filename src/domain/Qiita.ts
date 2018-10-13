import { QiitaAPI } from "@/api/qiita";
import { QiitaStockerAPI } from "@/api/qiitaStocker";

export const STORAGE_KEY_AUTH_STATE = "authorizationState";
export const STORAGE_KEY_ACCOUNT_ACTION = "accountAction";

export interface IAuthorizationRequest {
  clientId: string;
  state: string;
}

export interface IAuthorizationResponse {
  code: string;
  callbackState: string;
  localState?: string;
}

export interface IIssueAccessTokensRequest {
  client_id: string;
  client_secret: string;
  code: string;
}

export interface IIssueAccessTokensResponse {
  client_id: string;
  scopes: string[];
  token: string;
}

export interface IFetchAuthenticatedUserRequest {
  accessToken: string;
}

export interface IFetchAuthenticatedUserResponse {
  permanent_id: string;
}

export interface ICreateAccountRequest {
  apiUrlBase: string;
  permanentId: string;
  accessToken: string;
}

export interface ICreateAccountResponse {
  accountId: string;
  _embedded: { sessionId: string };
}

export const requestToAuthorizationServer = (
  authorizationRequest: IAuthorizationRequest
) => {
  location.href = `http://qiita.com/api/v2/oauth/authorize?client_id=${
    authorizationRequest.clientId
  }&scope=read_qiita&state=${authorizationRequest.state}`;
};

export const issueAccessToken = async (
  request: IIssueAccessTokensRequest
): Promise<IIssueAccessTokensResponse> => {
  return await QiitaAPI.issueAccessToken(request);
};

export const fetchAuthenticatedUser = async (
  request: IFetchAuthenticatedUserRequest
): Promise<IFetchAuthenticatedUserResponse> => {
  return await QiitaAPI.fetchAuthenticatedUser(request);
};

export const createAccount = async (
  request: ICreateAccountRequest
): Promise<ICreateAccountResponse> => {
  return await QiitaStockerAPI.createAccount(request);
};

export const matchState = (responseState: string, state: string): boolean => {
  if (responseState !== state) {
    return false;
  }
  return true;
};

export const stateNotMatchedMessage = (): string => {
  return "不正なリクエストが行われました。再度、ユーザ登録を行なってください。";
};
