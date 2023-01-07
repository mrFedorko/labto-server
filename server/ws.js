import { wsServer } from "./app.js";
import Chat from "./models/Chat.js";



export const handleChat = () => {

    
    return(
        wsServer.on('connection', async ws => {
            let userId = null
            ws.on('message', async (msg) => {
                try {
                    const {owner, from, text, date} = JSON.parse(msg);       
                    
                    if(owner){
                        userId = owner
                    }

                    const msgBody = {text, from, date, like:false}
                    const chat = await Chat.findOne({owner:userId});
        
                    if(!chat
                        ){
                        const newChat = new Chat({owner:userId, messages:[msgBody]});
                        await newChat.save();
                        ws.send (msgBody)
        
                    } else {
                       chat.messages.push(msgBody);
                       await chat.save()
                       ws.send(JSON.stringify(msgBody))
                    }
        
                } catch (error) {
                    console.error(error);
                    ws.close();
                }
            });
         }) 

    )
}