import { MESSAGE_TYPE } from 'src/utils/constants/entity'

export default class Message {
  id: string
  type: MESSAGE_TYPE
  roomID: string
  value: string
  replyFor?: {
    groupID: string
    messageID: string
  }
  sender: string
  createAt: number
}
export class GroupMessage {
  id: string
  previousGroup: string
  messages: Message[]
}
