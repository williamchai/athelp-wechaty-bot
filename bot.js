const { Wechaty, Room } = require('wechaty')

const bot = Wechaty.instance()
var myself = ''

bot
.on('scan', (url, code)=>{
    let loginUrl = url.replace('qrcode', 'l')
    // require('qrcode-terminal').generate(loginUrl)
    // console.log(url)
})
.on('login', user=>{
    console.log(`${user} login`)
    myself = user
})
.on('friend', async function (contact, request){
    if(request){
        await request.accept()
        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
    }
})
.on('message', async function(m){
    const contact = m.from()
    const content = m.content()
    const room = await m.room()
    
    if(m.self()){
        return
    }
    
    console.log(m)
    mentioned = await m.mentioned()
    // console.log('mentioned:', mentioned)

    if(room){
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
        // console.log(`Room memeber: ${room.memberList()}`)//, ${room.nameMap}, ${room.roomAliasMap}, ${room.contactAliasMap}`)
        // console.log(room.obj.roomAliasMap)
        if(mentioned && mentioned[0]==myself){
            console.log('bot is mentioned!')
            atList = room.memberList().filter(c => c!=myself && c!=contact)
            console.log(`@list: ${atList}`)
            atString = atList.map(function(c){
                return room.roomAlias(c) ? '@'+room.roomAlias(c) : '@'+c.name()
            }).join(' ')
            m.say(`From ${contact.name()}: ${m.content()}`, atList)
            // m.say(`${atString} From ${contact.name()}: ${m.content()}`)
        }
    }

    if(/hello/.test(content)){
        console.log(`Contact: ${contact.name()} Content: ${content}`)
        m.say(`Hi ${contact.name()}!`)
      
    }

    // if(/room/.test(content)){
    //     let keyroom = await Room.find({topic: "test"})
    //     if(keyroom){
    //         await keyroom.add(contact)
    //         await keyroom.say("welcome!", contact)
    //     }
    // }
})
.init()