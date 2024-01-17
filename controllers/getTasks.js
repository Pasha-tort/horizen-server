export default function({db}){
	return {
		endpoint: "/api/getTasks",
		auth: "bypass",
		description: "This endpoint is responsible for issuing all tasks",
		errors: {},
		
		reqSchema: ()=> ({}),

		resSchema: ({array, string, object})=> ({
			tasksIds: array(string(/.{1,24}/)),
			tasks: array(object({
        taskId: string(/.{1,24}/),
        status: string(/.{1,10}/),
        desc: string(/.{1,1000}/),
        date: string(/.{1,24}/),
      })),
		}),

		controller: async function(){
			const tasks = await db("task")
        .find({})
        .toArray() || [];
			const tasksIds = tasks.map(({_id}) => _id.toString());
			return {
				tasks: tasks.map(t => {
					t.taskId = t._id.toString();
					delete t._id;
					return t;
				}), 
				tasksIds,
			};
		}
	}
}