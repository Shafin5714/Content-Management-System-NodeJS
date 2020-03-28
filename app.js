const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const hbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const {globalVariables} = require('./config/configuration')
const {mongodbUrl,PORT} = require('./config/configuration')
const methodOverride = require('method-override')
const {selectOption}= require('./config/customFunctions')
const fileUpload = require('express-fileupload')
const passport = require('passport')

const app = express()
// configure Mongoose to Connect to Mongodb
mongoose.connect(mongodbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false

}).then(()=> console.log('MongoDB Connected')).catch((err)=>console.log(err))



// configure express
// use for using middleware
app.use(express.json()) ///data to be in json format
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))


// flash and session
app.use(session({
    secret:'anysecret',
    saveUninitialized:true, ///saves a session even if there is no modification
    resave:true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(globalVariables)


// file upload middleware 
app.use(fileUpload())


// setup view engine to use handlebars
app.engine('handlebars',hbs({defaultLayout:'default',helpers:{select:selectOption}}))
app.set('view engine','handlebars')
// Method override middleware
app.use(methodOverride('newMethod'))
// routes
const defaultRoutes = require('./routes/defaultRoutes')
const adminRoutes = require('./routes/adminRoutes')
app.use('/',defaultRoutes)
app.use('/admin',adminRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})