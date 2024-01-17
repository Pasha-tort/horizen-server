import {expect} from "chai";
import {MongoClient, ObjectId} from "mongodb";

export default Test;

function Test({config}){
	const url = `http://127.0.0.1:${config.horizen.ports.server}`;
	const urlDB = config.horizen.mongodb.host;
	const mockTaskId = new ObjectId();

	const mockTasks = [
		{
			_id: mockTaskId,
			status: "processing",
			desc: "desc desc desc",
			date: new Date().toISOString(),
		},
		{
			_id: new ObjectId(),
			status: "processing",
			desc: "desc desc desc",
			date: new Date().toISOString(),
		},
		{
			_id: new ObjectId(),
			status: "processing",
			desc: "desc desc desc",
			date: new Date().toISOString(),
		}
	];
	const mockTasksObjectIds = mockTasks.map(t => t._id);
	const mockTasksIds = mockTasks.map(t => t._id.toString());

	const client = new MongoClient(urlDB);
	const collection = client.db().collection("task");

	before(async () => {
		await collection.insertMany(mockTasks);
	});

	after(async () => {
		await collection.deleteMany({_id: {$in: mockTasksObjectIds}});
		client.close();
	})

	describe("Проверка crud для task", function(){
		it("Должен вернуть новую task", async () => { 
			const date = new Date().toISOString(); 
			const body = {
				desc: "desc desc desc",
				date,
			};
			const response = await (await fetch(`${url}/api/addTask`, {
				method: "POST",
				headers: { "Content-Type": "application/json"},
				body: JSON.stringify(body)
			})).json();

			const {taskId, ...result} = response.result;

			expect(result)
				.to.deep.equal({
					date, 
					status: "processing",
					...body,
				});
			expect(response.result)
				.to.have.property("taskId");

			await collection.deleteOne({_id: new ObjectId(taskId)});
		});

		it("Должен вернуть все tasks", async () => {
			const response = await (await fetch(`${url}/api/getTasks`, {
				method: "POST",
				headers: { "Content-Type": "application/json"},
			})).json();
			mockTasksIds.forEach(id => {
				expect(response.result.tasksIds.map(taskId => taskId))
					.to.include(id);
				expect(response.result.tasks.map(t => t.taskId))
					.to.include(id);
			});
		});

		it("Должен изменить статусы task на archived", async () => {
			const response = await (await fetch(`${url}/api/completeTask`, {
				method: "POST",
				headers: { "Content-Type": "application/json"},
				body: JSON.stringify({
					taskId: mockTaskId.toString(),
				}),
			})).json();

			expect(response.result).to.deep.equal({taskId: mockTaskId.toString(), status: "archived"});
		});
	})
}