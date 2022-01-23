const express=require('express')
const app = express()
const mongoose = require('mongoose')
const nodemailer=require('nodemailer')
const keys=require('../keys')
const databases={
    async connect(){
        
    }
}

databases.connect().then(()=>{app.listen(3000)})