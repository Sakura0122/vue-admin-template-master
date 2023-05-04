const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token
  // 在组件中获取sidebar
  // this.$store.state.app.sidebar

  // 在组件中获取getters
  // ...mapGetters(['sidebar'])
  // 封装全局getters的作用 就是为了获取vuex中的state值方便
}
export default getters
