export function toDefaultMessage({
    property,
    type,
}: {
    property: string
    type: string
}): string {
    return `El campo '${property}' debe ser de tipo '${type}'`
}

export function validatorErrorMessages(error: any): string[] {
    const { messages } = error
    return Object.values(messages).flat(Infinity) as string[]
}

export function requestValidatorErrorMessages(error: any): string[] {
    const {
        messages: { errors },
    } = error

    const errorMessages = errors.map((err: any) => err?.message) as string[]

    return [...new Set(errorMessages)]
}
