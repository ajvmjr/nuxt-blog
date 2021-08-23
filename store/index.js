import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts){
        state.loadedPosts = posts
      },
      addPost(state, post){
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost){
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
        state.loadedPosts[postIndex] = editedPost
      },
      setToken(state, token){
        state.token = token
      },
      clearToken(state){
        state.token = null
      }
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return context.app.$axios.$get('/posts.json')
          .then(data => {
            const postsArray = []
            for (const key in data) {
              postsArray.push({ ...data[key], id: key })
            }
            commit('setPosts', postsArray)
          })
          .catch(e => context.error(e));
      },
      setPosts({ commit }, posts){
        commit('setPosts', posts)
      },
      authenticateUser({ commit, dispatch }, authData){
        let authUrl =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        process.env.fbApiKey
        if (!authData.isLogin) {
          authUrl =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            process.env.fbApiKey
        } 
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .then((result) => { 
            commit('setToken', result.idToken)
            localStorage.setItem('token', result.idToken)
            localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.expiresIn) * 3600)
            Cookie.set('jwt', result.idToken)
            Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000)
            return this.$axios.$post('http://localhost:3000/api/track-data', { data: 'Authenticated!' })
          })
          .catch((e) => console.log(e))
      },
      initAuth({ commit, dispatch }, req) {
        let token
        let expirationDate

        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split("=")[1];
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');
        }
        if (new Date().getTime() > +expirationDate || !token) {
          dispatch('logout')
          return;
        }
        commit('setToken', token);
      },
      logout({ commit }){
        commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('expirationDate')
        if(process.client){
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }
      },
      addPost({ rootState, commit }, post){
        const createdPost = { ...post, updateDate: new Date() }
        return this.$axios
        .$post(
          `posts.json?auth=${rootState.token}`,
          createdPost
        )
        .then((result) => {
          commit('addPost', { ...createdPost, id: result.data.name })
        })
        .catch((e) => console.log(e))
      },
      editPost({ rootState, commit }, editedPost){
        return this.$axios
        .$put(
          `posts/${editedPost.id}.json?auth=${rootState.token}`,
          editedPost
        )
        .then((res) => commit('editPost', editedPost))
        .catch((e) => console.log(e))
      },
    },
    getters: {
      loadedPosts: state => state.loadedPosts,
      isAuthenticated: state => state.token != null
    },
  })
}

export default createStore