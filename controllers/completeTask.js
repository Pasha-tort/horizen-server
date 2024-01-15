import {ObjectId} from "mongodb";

const WrongUpdate = new Error("update failed");

export default function({db}){
	return {
		endpoint: "/api/completeTask",
		auth: "bypass",
		description: "This endpoint is responsible for switching the status for one specific task",
		errors: {WrongUpdate},
		
		reqSchema: ({string})=> ({
			taskId: string(/.{1,24}/),
		}),

		resSchema: ({string})=> ({
			taskId: string(/.{1,100}/),
      status: string(/.{1,10}/),
		}),

		controller: async function({body: {taskId}}){
			const {value} = await db("task")
        .findOneAndUpdate(
          {_id: new ObjectId(taskId)}, 
          {$set: {status: "archived"}}, 
          {returnDocument: "after"},
        );
			if (!value)
				throw WrongUpdate;

			return {taskId: value._id.toString(), status: value.status};
		}
	}
}