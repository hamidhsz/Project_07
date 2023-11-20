import axios from 'axios';
import { createStore } from 'vuex';
import router from '../router';
import Swal from 'sweetalert2';

export default createStore({

  state: {
    errorMsg: null,
    userId: localStorage.getItem('user'),
    connectedUser: null,
    publications: [],
    selectedUser: [],
    selectedUserPublications: [],
    users: [],
    likes: null
  },
  
  getters: {
    showPublications: (state) => state.publications,
    showUsers: (state) => state.users,
    showSelectedUserPublications: (state) => state.selectedUserPublications,
  },

  mutations: {
    SET_USER_ID(state, userId) {
      state.userId = userId;
    },
    SET_CONNECTED_USER(state, user) {
      state.connectedUser = user;
    },
    SET_PUBLICATIONS(state, publications) {
      state.publications = publications;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_SELECTED_USER(state, selectedUser) {
      state.selectedUser = selectedUser;
    },
    SET_SELECTED_USER_PUBLICATIONS(state, selectedUserPublications) {
      state.selectedUserPublications = selectedUserPublications;
    }
  },

  actions: {
    getUserId({ commit }, userId) {
      commit('SET_USER_ID', userId);
    },

    getOneUser({ commit }) {
      axios.get('/users/' + this.state.userId)
        .then(res => {
          commit('SET_CONNECTED_USER', res.data)
        })
        .catch((error) => {
          console.log(error);
        });
    },

    findUser({ commit }) {
      axios.get('/users')
      .then(res => {
        commit("SET_USERS", res.data);
        commit("SET_SELECTED_USER", res.data.find(user => user.id == localStorage.getItem("selectedUser")))
      })
      .catch((error) => {
        console.log(error);
      });
    },

    findUserPublications({ commit }) {
      axios.get('/publications')
        .then(res => {
          commit("SET_SELECTED_USER_PUBLICATIONS", res.data.filter(publication => publication.userId.toString().includes(localStorage.getItem("selectedUser")))
          )
        })
        .catch((error) => {
          console.log(error);
        });
      
    },

    logout({ commit }) {
      commit('SET_USER_ID', null);
      commit('SET_CONNECTED_USER', null);
      localStorage.clear();      
      router.push("/")
    },

    getPublications({ commit }) {
      axios.get('/publications')
        .then(res => {
          commit("SET_PUBLICATIONS", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getUsers({ commit }) {
      axios.get('/users')
        .then(res => {
          commit("SET_USERS", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    auth() {
      if(localStorage.length == 0) {
        Swal.fire({
          title: "Veuillez vous connecter",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#32c068",
        })
        router.push("/");
      } else {
        const token = localStorage.getItem("token");
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const user = JSON.parse(window.atob(base64));
        console.log(user)
        console.log(this.state.userId)
        if(user.userId != this.state.userId) {
          Swal.fire({
            title: "Veuillez vous connecter",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#32c068",
          })
          localStorage.clear()
          router.push("/")
        }
      }
    },
  },
})
