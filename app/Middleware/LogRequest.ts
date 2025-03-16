import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'

export default class LogRequest {
    public async handle(
        { request, logger }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        const log = `${request.method()} => ${request.url()}`

        const tempPath = Application.tmpPath()

        const logFile = `${tempPath}/request.log`

        if (fs.existsSync(tempPath)) {
            fs.appendFileSync(logFile, `${log}\n`)
        }

        logger.info(log)

        await next()
    }
}
