import { IQiitaState } from "@/types/qiita";
import { ICategory } from "@/domain/qiita";
import { QiitaModule } from "@/store/modules/qiita";
import axios from "axios";
import {
  IIssueAccessTokensResponse,
  IFetchAuthenticatedUserResponse,
  IAuthorizationResponse,
  ISaveCategoryResponse,
  IFetchCategoriesResponse,
  IUpdateCategoryResponse
} from "@/domain/qiita";

jest.mock("@/domain/Qiita");
jest.mock("axios");

describe("QiitaModule", () => {
  describe("getters", () => {
    let state: IQiitaState;

    beforeEach(() => {
      state = {
        authorizationCode: "34d97d024861f098d2e45fb4d9ed7757f97f5b0f",
        accessToken: "72d79c218c16c65b8076c7de8ef6ec55504ca6a0",
        qiitaAccountId: "test-user",
        permanentId: "1",
        isLoggedIn: false,
        categories: []
      };
    });

    it("should be able to get authorizationCode", () => {
      const wrapper = (getters: any) => getters.authorizationCode(state);
      const authorizationCode: IQiitaState["authorizationCode"] = wrapper(
        QiitaModule.getters
      );

      expect(authorizationCode).toEqual(state.authorizationCode);
    });

    it("should be able to get accessToken", () => {
      const wrapper = (getters: any) => getters.accessToken(state);
      const accessToken: IQiitaState["accessToken"] = wrapper(
        QiitaModule.getters
      );

      expect(accessToken).toEqual(state.accessToken);
    });

    it("should be able to get permanentId", () => {
      const wrapper = (getters: any) => getters.permanentId(state);
      const permanentId: IQiitaState["permanentId"] = wrapper(
        QiitaModule.getters
      );

      expect(permanentId).toEqual(state.permanentId);
    });

    it("should be able to get categories", () => {
      const wrapper = (getters: any) => getters.categories(state);
      const categories: IQiitaState["categories"] = wrapper(
        QiitaModule.getters
      );

      expect(categories).toEqual(state.categories);
    });
  });

  describe("mutations", () => {
    let state: IQiitaState;

    beforeEach(() => {
      state = {
        authorizationCode: "",
        accessToken: "",
        qiitaAccountId: "",
        permanentId: "",
        isLoggedIn: false,
        categories: []
      };
    });

    it("should be able to save authorizationCode", () => {
      const wrapper = (mutations: any) =>
        mutations.saveAuthorizationCode(
          state,
          "34d97d024861f098d2e45fb4d9ed7757f97f5b0f"
        );
      wrapper(QiitaModule.mutations);

      expect(state.authorizationCode).toEqual(
        "34d97d024861f098d2e45fb4d9ed7757f97f5b0f"
      );
    });

    it("should be able to save accessToken", () => {
      const wrapper = (mutations: any) =>
        mutations.saveAccessToken(
          state,
          "72d79c218c16c65b8076c7de8ef6ec55504ca6a0"
        );
      wrapper(QiitaModule.mutations);

      expect(state.accessToken).toEqual(
        "72d79c218c16c65b8076c7de8ef6ec55504ca6a0"
      );
    });

    it("should be able to save qiitaAccountId", () => {
      const wrapper = (mutations: any) =>
        mutations.saveQiitaAccountId(state, "test-user");
      wrapper(QiitaModule.mutations);

      expect(state.qiitaAccountId).toEqual("test-user");
    });

    it("should be able to save permanentId", () => {
      const wrapper = (mutations: any) => mutations.savePermanentId(state, "1");
      wrapper(QiitaModule.mutations);

      expect(state.permanentId).toEqual("1");
    });

    it("should be able to save categories", () => {
      const categories: ICategory[] = [
        {
          categoryId: 1,
          name: "テストカテゴリー1"
        },
        {
          categoryId: 2,
          name: "テストカテゴリー2"
        },
        {
          categoryId: 3,
          name: "テストカテゴリー3"
        }
      ];
      const wrapper = (mutations: any) =>
        mutations.saveCategory(state, categories);
      wrapper(QiitaModule.mutations);

      expect(state.categories).toEqual(categories);
    });

    it("should be able to add categories", () => {
      const category: ICategory = {
        categoryId: 1,
        name: "テストカテゴリー"
      };
      const wrapper = (mutations: any) =>
        mutations.addCategory(state, category);
      wrapper(QiitaModule.mutations);

      expect(state.categories[0]).toEqual(category);
    });

    it("should be able to update category", () => {
      state.categories = [{ categoryId: 1, name: "テストカテゴリ" }];

      const updateCategory: {
        stateCategory: ICategory;
        categoryName: string;
      } = {
        stateCategory: state.categories[0],
        categoryName: "編集したカテゴリ名"
      };

      const wrapper = (mutations: any) =>
        mutations.updateCategory(state, updateCategory);
      wrapper(QiitaModule.mutations);

      expect(state.categories[0].name).toEqual(updateCategory.categoryName);
    });
  });

  describe("actions", () => {
    it("should be able to create account", async () => {
      const mockPostResponse: { data: IIssueAccessTokensResponse } = {
        data: {
          client_id: "4f54451e86041b5c0a29419b4058f44b5ea04ae9",
          scopes: ["read_qiita"],
          token: "72d79c218c16c65b8076c7de8ef6ec55504ca6a0"
        }
      };

      const mockGetResponse: { data: IFetchAuthenticatedUserResponse } = {
        data: {
          id: "test-user",
          permanent_id: "1"
        }
      };

      const mockAxios: any = axios;
      mockAxios.get.mockResolvedValue(mockGetResponse);
      mockAxios.post.mockResolvedValue(mockPostResponse);

      const commit = jest.fn();
      const dispatch = jest.fn();

      const params: IAuthorizationResponse = {
        code: "34d97d024861f098d2e45fb4d9ed7757f97f5b0f",
        callbackState: "89bd7d77-b352-45f8-9585-388939d426ad",
        localState: "89bd7d77-b352-45f8-9585-388939d426ad"
      };

      const wrapper = (actions: any) =>
        actions.fetchUser(
          { dispatch, commit },
          { params: params, accountAction: "signUp" }
        );
      await wrapper(QiitaModule.actions);

      expect(commit.mock.calls).toEqual([
        ["saveAuthorizationCode", "34d97d024861f098d2e45fb4d9ed7757f97f5b0f"],
        ["saveAccessToken", "72d79c218c16c65b8076c7de8ef6ec55504ca6a0"],
        ["savePermanentId", "1"],
        ["saveQiitaAccountId", "test-user"]
      ]);

      expect(dispatch.mock.calls).toEqual([["createAccount"]]);
    });

    it("should be able to login", async () => {
      const mockPostResponse: { data: IIssueAccessTokensResponse } = {
        data: {
          client_id: "4f54451e86041b5c0a29419b4058f44b5ea04ae9",
          scopes: ["read_qiita"],
          token: "72d79c218c16c65b8076c7de8ef6ec55504ca6a0"
        }
      };

      const mockGetResponse: { data: IFetchAuthenticatedUserResponse } = {
        data: {
          id: "test-user",
          permanent_id: "1"
        }
      };

      const mockAxios: any = axios;
      mockAxios.get.mockResolvedValue(mockGetResponse);
      mockAxios.post.mockResolvedValue(mockPostResponse);

      const commit = jest.fn();
      const dispatch = jest.fn();

      const params: IAuthorizationResponse = {
        code: "34d97d024861f098d2e45fb4d9ed7757f97f5b0f",
        callbackState: "89bd7d77-b352-45f8-9585-388939d426ad",
        localState: "89bd7d77-b352-45f8-9585-388939d426ad"
      };

      const wrapper = (actions: any) =>
        actions.fetchUser(
          { dispatch, commit },
          { params: params, accountAction: "login" }
        );
      await wrapper(QiitaModule.actions);

      expect(commit.mock.calls).toEqual([
        ["saveAuthorizationCode", "34d97d024861f098d2e45fb4d9ed7757f97f5b0f"],
        ["saveAccessToken", "72d79c218c16c65b8076c7de8ef6ec55504ca6a0"],
        ["savePermanentId", "1"],
        ["saveQiitaAccountId", "test-user"]
      ]);

      expect(dispatch.mock.calls).toEqual([["issueLoginSession"]]);
    });

    it("should not commit when callbackState don't match localState", async () => {
      const commit = jest.fn();

      const params: IAuthorizationResponse = {
        code: "34d97d024861f098d2e45fb4d9ed7757f97f5b0f",
        callbackState: "callbackState-45f8-9585-388939d426ad",
        localState: "localState-52-45f8-9585-388939d426ad"
      };

      const wrapper = (actions: any) =>
        actions.fetchUser(
          { commit },
          { params: params, accountAction: "signUp" }
        );
      await wrapper(QiitaModule.actions);

      expect(commit.mock.calls).toEqual([]);
    });

    it("should be able to save category", async () => {
      const categoryId = 1;
      const categoryName: string = "テストカテゴリー";

      const mockPostResponse: { data: ISaveCategoryResponse } = {
        data: {
          categoryId: categoryId,
          name: categoryName
        }
      };

      const mockAxios: any = axios;
      mockAxios.post.mockResolvedValue(mockPostResponse);

      const commit = jest.fn();

      const wrapper = (actions: any) =>
        actions.saveCategory({ commit }, categoryName);
      await wrapper(QiitaModule.actions);

      const savedCategory: ICategory = {
        categoryId: categoryId,
        name: categoryName
      };

      expect(commit.mock.calls).toEqual([["addCategory", savedCategory]]);
    });

    it("should be able to fetch categories", async () => {
      const categories: IFetchCategoriesResponse[] = [
        {
          categoryId: 1,
          name: "テストカテゴリー1"
        },
        {
          categoryId: 2,
          name: "テストカテゴリー2"
        },
        {
          categoryId: 3,
          name: "テストカテゴリー3"
        }
      ];

      const mockPostResponse: { data: IFetchCategoriesResponse[] } = {
        data: categories
      };

      const mockAxios: any = axios;
      mockAxios.get.mockResolvedValue(mockPostResponse);

      const commit = jest.fn();

      const wrapper = (actions: any) => actions.fetchCategory({ commit });
      await wrapper(QiitaModule.actions);

      expect(commit.mock.calls).toEqual([["saveCategory", categories]]);
    });

    it("should be able to update category", async () => {
      const updateCategoryItem: {
        stateCategory: ICategory;
        categoryName: string;
      } = {
        stateCategory: { categoryId: 1, name: "テストカテゴリ" },
        categoryName: "編集したカテゴリ名"
      };

      const mockPostResponse: { data: IUpdateCategoryResponse } = {
        data: {
          categoryId: updateCategoryItem.stateCategory.categoryId,
          name: updateCategoryItem.categoryName
        }
      };

      const mockAxios: any = axios;
      mockAxios.patch.mockResolvedValue(mockPostResponse);

      const commit = jest.fn();

      const wrapper = (actions: any) =>
        actions.updateCategory({ commit }, updateCategoryItem);
      await wrapper(QiitaModule.actions);

      expect(commit.mock.calls).toEqual([
        ["updateCategory", updateCategoryItem]
      ]);
    });
  });
});
