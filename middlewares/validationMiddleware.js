module.exports = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, {
            abortEarly: false,
            errors: {
                wrap: {
                    label: ''
                }
            }
        });
        next()
    } catch (err) {
        console.log(err)
        const errors = err.details.map(detail => ({name: detail.context.key, message: detail.message}));
        return res.status(422).json(errors)
    }
}