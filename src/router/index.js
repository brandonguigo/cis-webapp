/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import auth from "../store/auth";
import LogoutSuccess from "@/components/LogoutSuccess";
import UserInfoStore from "../store/user-info-store";
import UserInfoApi from "../store/user-info";
import ErrorComponent from "@/components/Error";

Vue.use(Router);
//TODO switch this to async to wait for the data to come before render home
async function requireAuth(to, from, next) {
  if (!auth.auth.isUserSignedIn()) {
    UserInfoStore.setLoggedIn(false);
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  } else {
    const data = await UserInfoApi.getUserInfo();
    UserInfoStore.setLoggedIn(true);
    UserInfoStore.setCognitoInfo(data);
    next();
  }
}

export default new Router({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
      //beforeEnter: requireAuth
    },
    {
      path: "/login"
      //beforeEnter(to, from, next) {
      //auth.auth.getSession();
      //}
    },
    {
      path: "/login/oauth2/code/cognito",
      beforeEnter(to, from, next) {
        var currUrl = window.location.href;

        console.log(currUrl);
        auth.auth.parseCognitoWebResponse(currUrl);
        next();
      }
    },
    {
      path: "/logout",
      component: LogoutSuccess,
      beforeEnter(to, from, next) {
        //auth.logout();
        next("/");
      }
    },
    {
      path: "/error",
      component: ErrorComponent
    }
  ]
});
