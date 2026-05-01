import {getCollection} from "./mongo";

export async function saveMessage(message){
    const collection  = await getCollection();
    return await collection.insertOne({
        message,
        createdAt: new Date()
    })
}