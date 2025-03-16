import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { dateTimeToString } from 'App/Utils/CustomDateTime'
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
            const info = {
                ip: request.ip(),
                request: log,
                dateTime: dateTimeToString(),
                headers: request.headers(),
            }

            for (let key in info) {
                fs.appendFileSync(
                    logFile,
                    `${key.toUpperCase()}: ${JSON.stringify(info[key])}\n`,
                )
            }

            fs.appendFileSync(logFile, '\n')
        }

        logger.info(log)

        await next()
    }
}
