export function toDefaultMessage({
    property,
    type,
}: {
    property: string
    type: string
}) {
    return `El campo '${property}' debe ser de tipo '${type}'`
}
