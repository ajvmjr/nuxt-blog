const bodyParser = require('body-parser')

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  mode: 'universal',
  head: {
    title: 'blog',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'My cool 1st blog' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/styles/main.css'
  ],

  loading: { color: 'red', height: '5px', duration: 5000 },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/core-components.js',
    '~plugins/date-filter.js',
  ],

  axios: {
    baseURL: process.env.BASE_URL || 'https://nuxt-blog-learn-default-rtdb.firebaseio.com/'
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env: {
    baseUrl: process.env.BASE_URL || 'https://nuxt-blog-learn-default-rtdb.firebaseio.com/',
    fbApiKey: 'AIzaSyBB1NhChop0-fULV2SJRBiL5F2gwD4Q1cU'
  },

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  //É possível gerenciar manualmente as rotas, apesar de o nuxt já fazer tudo
  // router: {
  //   extendRoutes(routes, resolve){
  //     routes.push({
  //       path: '*',
  //       component: resolve(__dirname, 'pages/index.vue')
  //     })
  //   }
  // }

  //Middlewares executados em todas as rotas
  router: {
    middleware: 'log-mid'
  },
  //Middlewares no servidor - express e node ou até meus próprios 
  serverMiddleware: [
    bodyParser.json(),
    '~/api'
  ]
}
