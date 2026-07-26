import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization

        if (
            !authorizationHeader || !authorizationHeader.startsWith('Bearer ')
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please log in."
            })
        }
        
        const token = authorizationHeader.split(' ')[1]

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.userId = decodedToken.id
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        })
    }
}

export default authUser