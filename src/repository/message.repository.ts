import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import Message, { GroupMessage } from 'src/entities/Message'
import { EntityNotFoundException } from 'src/exceptions/entity.exception'

@Injectable()
export class MessageRepository {
  private readonly collection = admin.firestore().collection('message')

  async findLastMessageGroup(roomID: string) {
    const snap = await this.collection.doc(roomID).get()
    if (!snap.exists) {
      throw new EntityNotFoundException('User not found')
    }

    const lastGroupID = snap.get('lastGroup')
    if (!lastGroupID) {
      return null
    }
    const data = snap.get(lastGroupID)

    return {
      id: lastGroupID,
      previousGroup: data.previousGroup,
      messages: data.messages,
    } as GroupMessage
  }

  async findMessageGroupByID(roomID: string, groupID: string) {
    const snap = await this.collection.doc(roomID).get()
    if (!snap.exists) {
      throw new EntityNotFoundException('User not found')
    }
    const data = snap.get(groupID)
    let messages = data.messages || []
    return {
      id: groupID,
      previousGroup: data.previousGroup,
      messages: messages,
    } as GroupMessage
  }

  async findMessageBy(roomID: string, messageID: string, groupID: string): Promise<Message> {
    const snap = await this.collection.doc(roomID).get()
    if (!snap.exists) {
      throw new EntityNotFoundException('User not found')
    }
    const data = snap.get(groupID)
    const message: Message = data.messages.find((mes: Message) => mes.id === messageID)

    return (message || null) as Message
  }

  async update(roomID: string, group: Partial<GroupMessage>): Promise<boolean> {
    const ref = this.collection.doc(roomID)

    let payload = {} as any

    if (group.messages) {
      const snap = await ref.get()
      const messageGroup = snap.get(group.id)
      payload[group.id] = {
        messages: [...(messageGroup?.messages || []), ...group.messages],
        previousGroup: group.previousGroup,
      }
    }
    await ref.set(payload, { merge: true })
    return true
  }
  async updateLastGroup(roomID: string, lastGroup: string): Promise<boolean> {
    const ref = this.collection.doc(roomID)

    await ref.set(
      {
        lastGroup: lastGroup,
      },
      { merge: true }
    )
    return true
  }
}
