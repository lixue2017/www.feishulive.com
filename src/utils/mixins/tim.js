import { mapState } from 'vuex'
import { apiAddRoomManager, apiRoomAdmin, apiBlacklist, apiRoomAdminById, apiCancelRoomAdmin } from '@/api/live'
export default {
  computed: {
    ...mapState('user', {
      //当然用户Id
      userId: state => state.userInfo.userId
    }),
    ...mapState('chat',[ 
      'roomId'
    ])
  },
  methods: {
    /**
     * 判断当前用户是否为群主 
     */
    async isGroupLeader() {
      let result = await this.tweblive._tim.getGroupList({
        groupProfileFilter: ['ownerID']
      })
      let resultData = result.data || []
      if(resultData.groupList.length > 0){
        //群资料信息
        let group =  resultData.groupList[0]
        //群主Id
        let ownerID = group.ownerID
        //用户Id是否等于群主Id
        return { isOwner: this.userId == ownerID }
      }
      return { isOwner: false }
    },
    /**
     * 是否为房管
     * IM直播群不允许调用setGroupMemberRole
     * 通过api调用
     */
    isRoomAdmin(){
      return apiRoomAdmin({roomId: this.roomId})
    },
    /**
     * 查看当前用户是否为房管
     */
    isRoomAdminById(userId){
      return apiRoomAdminById({roomId: this.roomId, userId})
    },
    /**
     * 设置房管
     */
    setRoom(userId){
      return apiAddRoomManager({roomId: this.roomId, userId})
      // return this.tweblive._tim.setGroupMemberRole({
      //   groupID: this.roomId,
      //   userID: userId,
      //   role: 'Admin'
      // }).then(()=>{
      //   apiAddRoomManager({roomId: this.roomId, userId})
      // }).catch((result)=>{
      //   debugger
      // })
    },
    /**
     * 取消房管
     */
    cancelRoomAdmin(userId){
      return apiCancelRoomAdmin({roomId: this.roomId, userId})
    },
    /**
     * 禁言一小时
     */
    muteAnHour(userId){
      // return this.tweblive._tim.setGroupMemberMuteTime({
      //   groupID: this.roomId,
      //   userID: userId,
      //   muteTime: 3600
      // }).then((result)=>{})
      return apiBlacklist({
        roomId: this.roomId,
        userId: userId,
        type: 1
      })
    },
    /**
     * 永久禁言
     */
    muteForever(userId){
      // return this.tweblive._tim.setGroupMemberMuteTime({
      //   groupID: this.roomId,
      //   userID: userId,
      //   muteTime: 999999999
      // }).then((result)=>{})
      return apiBlacklist({
        roomId: this.roomId,
        userId: userId,
        type: 2
      })
    }
  }
}