const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  permission_routes: state => state.permission.routes
}
export default getters
