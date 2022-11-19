import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'
import useTransaction from 'src/database/hook/useTransaction'
import Message, { GroupMessage } from 'src/entities/Message'
import { MessageRepository } from 'src/repository/message.repository'
import { generateUUID } from 'src/utils'
import { MAX_GROUP_MESSAGE } from 'src/utils/constants'
import { MESSAGE_TYPE } from 'src/utils/constants/entity'

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}
  async getLastMessages(roomID: string) {
    const group = await this.messageRepository.findLastMessageGroup(roomID)
    const lastMessages = group.messages || []
    const promises = lastMessages.map(async (mes: Message) => {
      let replyMessage = null
      if (mes.replyFor) {
        const { messageID, groupID } = mes.replyFor
        replyMessage = await this.messageRepository.findMessageBy(roomID, messageID, groupID)
      }
      return {
        type: mes.type,
        value: mes.value,
        replyFor: replyMessage,
        sender: mes.sender,
        createAt: mes.createAt,
      }
    })
    const messages = await Promise.all(promises)
    return {
      messages,
      groupID: group.id,
      previousGroup: group.previousGroup,
    }
  }
  async getMessagesByGroup(roomID: string, groupID: string) {
    const group = await this.messageRepository.findMessageGroupByID(roomID, groupID)
    const lastMessages = group.messages || []
    const promises = lastMessages.map(async (mes: Message) => {
      let replyMessage = null
      if (mes.replyFor) {
        const { messageID, groupID } = mes.replyFor
        replyMessage = await this.messageRepository.findMessageBy(roomID, messageID, groupID)
      }
      return {
        type: mes.type,
        value: mes.value,
        replyFor: replyMessage,
        sender: mes.sender,
        createAt: mes.createAt,
      }
    })
    const messages = await Promise.all(promises)
    return {
      messages,
      groupID: group.id,
      previousGroup: group.previousGroup,
    }
  }
  async addMessage(roomID: string, message: string, sender: string) {
    const lastMessageGroup = await this.messageRepository
      .findLastMessageGroup(roomID)
      .catch((e) => null)
    const isNewGroup = MAX_GROUP_MESSAGE <= (lastMessageGroup?.messages || []).length
    const groupID = !lastMessageGroup || isNewGroup ? generateUUID() : lastMessageGroup.id
    const time = dayjs().valueOf()
    const messageObj: Message = {
      id: generateUUID(),
      type: MESSAGE_TYPE.TEXT,
      roomID: roomID,
      value: message,
      sender: sender,
      createAt: time,
    }

    const payload: GroupMessage = {
      id: groupID,
      previousGroup: null,
      messages: [messageObj],
    }

    if (!lastMessageGroup) {
      payload.previousGroup = null
    } else {
      payload.previousGroup = isNewGroup
        ? lastMessageGroup.id
        : lastMessageGroup.previousGroup || null
    }

    await useTransaction(async () => {
      if (!lastMessageGroup || isNewGroup) {
        await this.messageRepository.updateLastGroup(roomID, groupID)
      }
      return this.messageRepository.update(roomID, payload)
    })
    return messageObj
  }
}
