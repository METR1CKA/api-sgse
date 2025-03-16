import { DateTime } from 'luxon'

const DATE_FORMATS = {
    FULL: 'yyyy-MM-dd HH:mm:ss',
    DATE: 'yyyy-MM-dd',
} as const

type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS]

const localZone = 'America/Monterrey'

export function dateTimeToString({
    dateTime,
    format = 'yyyy-MM-dd HH:mm:ss',
    zone = localZone,
}: {
    dateTime: DateTime
    format?: DateFormat
    zone?: string
}) {
    return dateTime.setZone(zone).toFormat(format)
}

export function now(): DateTime {
    return DateTime.now().setZone(localZone)
}

export function isValidDateTime({
    date,
    format = 'yyyy-MM-dd HH:mm:ss',
    zone = localZone,
}: {
    date: string
    format?: DateFormat
    zone?: string
}) {
    const { isValid, invalidReason } = DateTime.fromFormat(
        date,
        format,
    ).setZone(zone)

    return {
        isValid,
        invalidReason,
    }
}
