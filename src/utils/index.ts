import * as crypto from 'crypto'
export const generateUUID = () => crypto.randomUUID().toString().replace(/-/gi, '')
