const express=require('express')
const nodemailer=require('nodemailer')
const keys=require('../keys')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

let Schema = mongoose.Schema
let Schemas={
    album: new Schema({
        name: String,
        description: String,
        image: String,
        images:[{
            url:String,
            name:String,
        }],
        comments:[{
            _id:Schema.Types.ObjectId,
            content:String,
            username:String,
        }],
        set:{
            _id:Schema.Types.ObjectId,
            name: String,
            description: String,
        },
    }),
    set:new Schema({
        name:String,
        description:String,
        image: String,
        albums:[{
            _id:Schema.Types.ObjectId,
            name:String,
            description:String,
            image:String,
        }]
    }),
    comment:new Schema({
        content:String,
        user:{
            username:String,
            login:String,
        },
        album:{
            name:String,
        },
        set:{
            name:String,
        },
    }),
    users:new Schema({
        username:String,
        email:String,
        login:String,
        settings:{
            sets:{
                created:Boolean,
                edited:Boolean,
                deleted:Boolean,
            },
            albums:{
                created:Boolean,
                edited:Boolean,
                deleted:Boolean,
            },
        }
    })
}
let models={
    album:mongoose.model('albums',Schemas.album),
    set:mongoose.model('sets',Schemas.set),
    comment:mongoose.model('comments',Schemas.comment),
    user:mongoose.model('users',Schemas.users),
}

const databases={
    albums:null,
    sets:null,
    comments:null,
    reactions:null,
    users:null,
    connect(){
        mongoose.connect(keys.atlasURI,{useNewUrlParser: true, useUnifiedTopology: true},()=>console.log("connected"))
        mongoose.connection.once("open",()=>{
            this.albums=mongoose.connection.db.collection('albums')
            this.sets=mongoose.connection.db.collection('sets')
            this.comments=mongoose.connection.db.collection('comments')
            this.users=mongoose.connection.db.collection('users')
            app.listen(1000)
        })
    }
}
databases.connect()

app.use(cors())
app.use(express.json())

// admin passcode checker
app.post('/admin',(req,res)=>{
    if(req.body.admin&&req.body.code){
        if(req.body.code==keys.codes.website){
            res.send((req.body.admin==keys.codes.admin).toString())
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})

// comments
app.get("/comments",(req,res)=>{
    if(req.query.code&&req.query.set&&req.query.album){
        if(req.query.code==keys.codes.website){
            models.comment.find({"album.name":req.query.album,"set.name":req.query.set},(err,comments)=>{
                comments.forEach(comment=>{
                    comment.user.login=null
                })
                if(err){console.log(err)}
                else{
                    res.json(comments)
                }
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.post("/comment",(req,res)=>{
    console.log(req.body)
    if(req.body.codes&&req.body.content&&req.body.album&&req.body.set){
        if(req.body.codes.login&&req.body.codes.website){
            if(req.body.codes.website==keys.codes.website){
                models.user.find({"login":req.body.codes.login},(err,user)=>{
                    if(err){console.log(err);res.sendStatus(500)}
                    else{
                        if(user.length==1){
                            models.comment.create({
                                content:req.body.content,
                                user:{
                                    username:user[0].username,
                                    login:req.body.codes.login,
                                },
                                album:{name:req.body.album},
                                set:{name:req.body.set},
                            },(err,comment)=>{
                                models.album.findOneAndUpdate({"name":req.body.album},{$push:{comments:comment._id}},(err,album)=>{
                                    if(err){console.log(err);res.sendStatus(500)}
                                    else{
                                        res.sendStatus(200)
                                    }
                                })
                            })
                        }else{res.sendStatus(401)}
                    }
                })
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.delete("/comment",(req,res)=>{
    if(req.body.codes&&req.body.id){
        if(req.body.codes.website&&req.body.codes.login){
            if(req.body.codes.website==keys.codes.website){
                models.comment.deleteOne({"_id":req.body.id},(err,comment)=>{
                    if(err){console.log(err);res.sendStatus(500)}
                    else{
                        models.album.findOneAndUpdate({"name":req.body.album},{$pull:{comments:req.body.id}},(err,album)=>{
                            if(err){console.log(err);res.sendStatus(500)}
                            else{
                                res.sendStatus(200)
                            }
                        })
                    }
                })
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})

// images
app.get('/images',(req,res)=>{
    if(req.query.set&&req.query.album&&req.query.code){
        if(req.query.code==keys.codes.website){
            models.album.findOne({name:req.query.album,"set.name":req.query.set},(err,album)=>{
                if(err){res.sendStatus(500)}
                else if(album){
                    res.send(album.images)
                }else{res.sendStatus(404)}
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})

// albums
app.get('/album',(req,res)=>{
    if(req.query.set&&req.query.code){
        if(req.query.code==keys.codes.website){
            models.album.find({"set.name":req.query.set},(err,data)=>{
                if(err||!data[0]){res.sendStatus(404)} 
                else {res.json(data)}
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.post('/album',(req,res)=>{
    if(req.body.codes&&req.body.set&&req.body.constructor){
        if(req.body.constructor.name&&req.body.constructor.description&&req.body.constructor.image&&req.body.constructor.set&&req.body.constructor.images){
            if(req.body.constructor.set.name&&req.body.codes.admin&&req.body.codes.website){
                if(req.body.codes.admin==keys.codes.admin&&req.body.codes.website==keys.codes.website){
                        models.album.find({name:req.body.constructor.name,"set.name":req.body.set},(err,data)=>{
                            if(err){res.sendStatus(500);console.log(err)}
                            if(data.length==0){
                                models.set.find({name:req.body.set},(err,_data)=>{
                                    if(err){res.sendStatus(500);console.log(err)}
                                    else if(_data.length==1){
                                        models.album.create({
                                            name:req.body.constructor.name,
                                            description:req.body.constructor.description,
                                            image:req.body.constructor.image,
                                            images:req.body.constructor.images,
                                            set:{
                                                _id:_data[0]._id,
                                                name:req.body.constructor.set.name,
                                                description:_data[0].description,
                                            },
                                            comments:[]
                                        }).then((__data)=>{
                                            if(err){res.sendStatus(500);console.log(err)}
                                            else{
                                                models.set.updateOne({_id:_data[0]._id},{$push:{albums:{_id:__data._id,name:req.body.constructor.name,description:req.body.constructor.description,image:req.body.constructor.image}}},(__data_)=>{
                                                    if(err){res.sendStatus(500);console.log(err)}
                                                    else{res.sendStatus(200)}
                                                })
                                            }
                                        })
                                    }else{res.sendStatus(404)}
                                })
                            }else{res.sendStatus(409)}
                        })
                }else{res.sendStatus(401)}
            }else{res.sendStatus(406)}
        }else{res.sendStatus(406)}
    }else(res.sendStatus(406))
})
app.delete('/album',(req, res) => {
    if(req.body.codes&&req.body.name&&req.body.set){
        if(req.body.codes.admin&&req.body.codes.website){
            if(req.body.codes.admin==keys.codes.admin&&req.body.codes.website==keys.codes.website){
                models.album.find({name:req.body.name,"set.name":req.body.set},(err, data)=>{
                    if(err){res.sendStatus(500)}
                    else{
                        if(data.length>0){
                            models.set.find({name:req.body.set},(err,_data)=>{
                                if(err){res.sendStatus(500)}
                                else{
                                    if(_data.length>0){
                                        models.set.updateOne({_id:_data[0]._id},{$pull:{albums:{_id:data[0]._id}}},(err)=>{
                                            if(err){res.sendStatus(500)}
                                            else{
                                                models.album.deleteOne({_id:data[0]._id},(err)=>{
                                                    if(err){res.sendStatus(500)}
                                                    else{res.sendStatus(200)}
                                                })
                                            }
                                        })
                                    }else{res.sendStatus(404)}
                                }
                            })
                        }else{res.sendStatus(404)}
                    }
                })
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.put('/album',(req,res)=>{
    if(req.body.codes&&req.body.name&&req.body.set&&req.body.constructor){
        if(req.body.constructor.description&&req.body.constructor.image&&req.body.constructor.images&&req.body.constructor.title){
            if(req.body.codes.admin&&req.body.codes.website){
                if(req.body.codes.admin==keys.codes.admin&&req.body.codes.website==keys.codes.website){
                    models.album.find({name:req.body.name},(err, data)=>{
                        if(err){res.sendStatus(500)}
                        else{
                            if(data.length>0){
                                models.set.find({name:req.body.set},(err,_data)=>{
                                    if(err){res.sendStatus(500)}
                                    else{
                                        models.set.updateOne({_id:_data[0]._id,"albums.name":req.body.constructor.title},{$set:{"albums.$._id":data[0]._id,"albums.$.name":req.body.constructor.title,"albums.$.description":req.body.constructor.description,"albums.$.image":req.body.constructor.image}},(err)=>{
                                            if(err){res.sendStatus(500)}
                                            else{                                                
                                                models.album.updateOne({_id:data[0]._id},{$set:{description:req.body.constructor.description,image:req.body.constructor.image,images:req.body.constructor.images,name:req.body.constructor.title}},(err)=>{
                                                    if(err){res.sendStatus(500)}
                                                    else{res.sendStatus(200)}
                                                })
                                            }
                                        })
                                    }
                                })
                            }else{res.sendStatus(404)}
                        }
                    })
                }else{res.sendStatus(401)}
            }else{res.sendStatus(406)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})

// sets
app.get('/sets',(req,res)=>{
    if(req.query.code){
        if(req.query.code==keys.codes.website){
            models.set.find({},(err,data)=>{
                if(err) throw err
                res.json(data)
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.post('/sets',(req,res)=>{
    if(req.body.codes&&req.body.title&&req.body.description&&req.body.image){
        if(req.body.codes.website&&req.body.codes.admin){
            if(req.body.codes.website==keys.codes.website&&req.body.codes.admin==keys.codes.admin){
                models.set.find({name:req.body.title},(err, data)=>{
                    if(err) throw err
                    if(data.length==0){
                        let set=new models.set({
                            name:req.body.title,
                            description:req.body.description,
                            image:req.body.image
                        })
                        set.save()
                        res.sendStatus(200)
                    }else{res.sendStatus(409)}
                })
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.put('/sets',(req,res)=>{
    console.log(req.body)
    if(req.body.code&&req.body.admin&&req.body.title&&req.body.description&&req.body.name&&req.body.image){
        if(req.body.code==keys.codes.website&&req.body.admin==keys.codes.admin){
            if(req.body.title&&req.body.description&&req.body.image){
                models.set.findOneAndUpdate({name:req.body.title},{$set:{description:req.body.description,image:req.body.image,name:req.body.name}},(err,data)=>{
                    if(err) throw err
                    if(data){
                        res.sendStatus(200)
                    }else{res.sendStatus(404)}
                })
            }else{res.sendStatus(406)}
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.delete('/sets',(req,res)=>{
    if(req.body.code&&req.body.admin&&req.body.title){
        if(req.body.code==keys.codes.website&&req.body.admin==keys.codes.admin){
            models.set.findOneAndDelete({name:req.body.title},(err,data)=>{
                if(err) throw err
                res.sendStatus(200)
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})

// Settings
app.get('/settings',(req,res)=>{
    if(req.query.code&&req.query.login){
        if(req.query.code==keys.codes.website){
            models.user.find({login:req.query.login},(err,data)=>{
                if(err) throw err
                res.json(data[0].settings)
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.put('/settings',(req,res)=>{
    if(req.body.code&&req.body.login&&req.body.settings){
        if(req.body.code==keys.codes.website){
            models.user.findOneAndUpdate({login:req.body.login},{$set:{settings:req.body.settings}},(err,data)=>{
                if(err) throw err
                if(data){
                    res.sendStatus(200)
                }else{res.sendStatus(404)}
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})

// Users
app.post('/user',(req,res)=>{
    if(req.body.username&&req.body.login&&req.body.code&&req.body.email){
        if(req.body.code==keys.codes.website){
            models.user.findOne({login:req.body.login},(err,data)=>{
                if(err) throw err
                if(data){
                    res.sendStatus(409)
                }else{
                    let user=new models.user({
                        username:req.body.username,
                        email:req.body.email,
                        login:req.body.login,
                        settings:{
                            sets:{
                                created:true,
                                edited:false,
                                deleted:false,
                            },
                            albums:{
                                created:true,
                                edited:false,
                                deleted:false,
                            },
                        }
                    })
                    user.save()
                    res.sendStatus(200)
                }
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})