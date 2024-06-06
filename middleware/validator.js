import joi from "joi";
import createError from "http-errors";

const validateRegisterUser = (req, res, next) => {
    const validationSchema = joi.object({
        username: joi.string().required().trim().min(3).disallow(""),
        password: joi.string().required().min(3).max(16),
        email: joi.string().required().email().disallow(""),
        role: joi.string().required().default("user")
    })

    const { error, value } = validationSchema.validate(req.body)
    if (error) {
        return next(createError(422, error.message))
    }

    req.body = value;
    next();
};

const validateLoginUser = (req, res, next) => {
    const validationSchema = joi.object({
        email: joi.string().required().email().disallow(""),
        password: joi.string().required().min(3).max(16)
    })

    const { error, value } = validationSchema.validate(req.body)
    if (error) {
        return next(createError(422, error.message))
    }

    req.body = value;
    next();
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const validateFetchReq = (req, res, next) => {
    const validationSchema = joi.object({
        page: joi.string().default(1).disallow(0),
        limit: joi.string().default(10).disallow(0),
        sort: joi.string().default("asc").disallow(""),
        id: joi.string()
    })

    const { error, value } = validationSchema.validate(req.query);
    if (error) {
        return next(createError(422, error.message))
    }

    req.query = value;
    next();
}

export { validateRegisterUser, validateLoginUser, admin, validateFetchReq }