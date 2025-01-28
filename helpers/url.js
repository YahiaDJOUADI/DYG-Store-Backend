
exports.generateUrl = (path) => {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${path}`
}