import { NestApp } from './core/NestApp'
;(async function () {
  const app = new NestApp()
  await app.boot()
  await app.run()
})()
