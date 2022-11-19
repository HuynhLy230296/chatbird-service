import { MESSAGE_TYPE } from 'src/utils/constants/entity'

export interface Message {
  roomID: string
  value: string
  type: MESSAGE_TYPE
  replyFor?: {
    groupID: string
    messageID: string
  }
}
