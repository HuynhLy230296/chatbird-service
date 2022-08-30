import { NestApp } from './core/NestApp'
import * as dotenv from 'dotenv'
dotenv.config()
;(async function () {
  const app = new NestApp()
  await app.boot()
  await app.run()
})()
