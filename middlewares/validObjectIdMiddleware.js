const { isValidObjectId } = require('mongoose')

module.exports = (req, res, next) => {
    if (isValidObjectId(req.params.id)) {
        next()
    }
    else {
        return res.status(400).json({ message: 'Invalid ID' })
    }
}