export default function({db}){
	return {
		endpoint: "/api/getTasks",
		auth: "bypass",
		description: "This endpoint is responsible for issuing all tasks",
		errors: {},
		
		reqSchema: ()=> ({}),

		resSchema: ({array, string, object})=> ({
			tasks: array(object({
        _id: string(/.{1,24}/),
        status: string(/.{1,10}/),
        desc: string(/.{1,1000}/),
        date: string(/.{1,24}/),
      })),
		}),

		controller: async function(){
			const tasks = await db("task")
        .find({})
        .toArray() || [];
			return {tasks: tasks.map(t => {
				t._id = t._id.toString();
				return t;
			})};
		}
	}
}