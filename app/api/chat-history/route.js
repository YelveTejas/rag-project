import { auth } from "@/auth";
import { getCollection } from "../../../lib/mongo";

export async function GET(){
    try{
    const session = await auth();
    const userId = session?.user?.email || session?.user?.id || session?.user?.sub;

    if (!userId) {
       return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collection = await getCollection("chats");
    const chats = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(10).toArray();
    

    
    return Response.json(chats);
    }catch(error){
       console.log(error,'error')
       return Response.json([]);
    }

    
}
