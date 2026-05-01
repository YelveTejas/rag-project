import { getCollection } from "../../../lib/mongo";

export async function GET(){
    try{
    const collection = await getCollection();
    const chats = await collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(10).toArray();
    

    
    return Response.json(chats);
    }catch(error){
       console.log(error,'error')
       return Response.json([]);
    }

    
}