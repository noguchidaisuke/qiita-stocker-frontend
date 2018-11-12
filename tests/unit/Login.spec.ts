import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Login from "../../src/pages/Login.vue";
import { QiitaModule } from "@/store/modules/Qiita";

import { LoginState } from "@/types/login";
import VueRouter from "vue-router";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();

describe("Login.vue", () => {
  let store: any;
  let state: LoginState;
  let actions: any;

  it('calls store action "login" when button is clicked', () => {
    state = {
      authorizationCode: "",
      accessToken: "",
      permanentId: "",
      isLoggedIn: false,
      categories: []
    };

    actions = {
      login: jest.fn()
    };

    store = new Vuex.Store({
      modules: {
        QiitaModule: {
          namespaced: true,
          state,
          actions,
          getters: QiitaModule.getters
        }
      }
    });

    const wrapper = shallowMount(Login, { store, localVue, router });
    const button = wrapper.find("button");

    button.trigger("click");
    expect(actions.login).toHaveBeenCalled();
  });
});
