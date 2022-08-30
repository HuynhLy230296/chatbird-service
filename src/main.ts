import { NestApp } from './core/NestApp'
import * as dotenv from 'dotenv'
declare const module: any
dotenv.config()
;(async function () {
  const app = new NestApp()
  await app.boot()
  await app.run()
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
})()
