export default function({db}){
	return {
		endpoint: "/api/addTask",
		auth: "bypass",
		description: "This endpoint is responsible for adding new tasks",
		errors: {},
		
		reqSchema: ({string})=> ({
			desc: string(/.{1,1000}/),
			date: string(/.{1,24}/),
		}),

		resSchema: ({string})=> ({
			taskId: string(/.{1,25}/),
			status: string(/.{1,11}/),
			desc: string(/.{1,1000}/),
			date: string(/.{1,25}/),
		}),

		controller: async function({body: {desc, date}}){
			const dbTask = db("task");

			const {insertedId} = await dbTask
				.insertOne({desc, date, status: "processing"});

			const {_id, ...task} = await dbTask
				.findOne({_id: insertedId});

			return {taskId: _id.toString(), ...task};
		}
	}
}