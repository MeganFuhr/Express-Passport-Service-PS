const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const morgan = require('morgan')
const path = require('path')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const PORT = process.env.PORT || 3000
const app = express()
const sessionsRouter = require('./src/routers/sessionsRouter')
const adminRouter = require('./src/routers/adminRouter')
const authRouter = require('./src/routers/authRouter')

//morgan monitors web traffic. options are tiny or combined
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, '/public/')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({secret: 'globomantics'}))

require('./src/config/passport.js')(app)

app.set('views','./src/views')
app.set('view engine', 'ejs')

app.use('/sessions', sessionsRouter)
app.use('/admin', adminRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
	res.render('index', {title: "Welcome to Kung Fu J!", data: ['a','b','c']})
})

//chalk is just an easy way to color text
//set debug=* & node app.js will debug all packages. debug=app & node app.js will debug just app
app.listen(PORT,() =>
	debug(`I'm listening on port ${chalk.green(PORT)}`)
)