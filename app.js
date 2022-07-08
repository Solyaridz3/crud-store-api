require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')
// middleware
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const authMiddleware = require('./middleware/authentication');


app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}));
app.use(express.json())

app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get('/', (req, res) => {
    res.send('<h1>Store api</h1><a href="api/v1/products">products route</a>')
})

app.use('/api/v1/products', [authMiddleware, productsRouter]);
app.use('/api/v1/auth', authRouter);
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}`))
    } catch (err) {
        console.log(err)
    }
}
start();