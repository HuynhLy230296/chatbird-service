import * as dotenv from 'dotenv'
import { NestApp } from './core/NestApp'

dotenv.config()

declare const module: any
;(async function () {
  const app = new NestApp()
  await app.boot()
  await app.run()
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
})()
