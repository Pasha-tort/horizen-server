import Horizen from "horizen-framework/backend";
import config from "../../config.json" assert {type: "json"};

const horizen = new Horizen(config.horizen);

export default horizen.init(async function(props){
	const {controllers} = props;
	const deps = {...props, config};

	return {
		port: config.horizen.ports.server,

		controllers: {
			post: [
				controllers.addTask(deps),
				controllers.completeTask(deps),
				controllers.getTasks(deps),
			],
		}
	};
});