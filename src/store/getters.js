const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  name: (state) => state.user.name,
  avatar: (state) => state.user.avatar,
  menu_routes: (state) => state.menu.routes
}
export default getters
