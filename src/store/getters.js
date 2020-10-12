const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  userLevel: state => state.user.userLevel,
  dialogStauts: state => state.user.dialogStauts,
  userDialog: state => state.user.userDialog,
  applyStep: state => state.user.applyStep,
  rechargeStauts: state => state.user.rechargeStauts,
  task: state => state.user.task
}
export default getters