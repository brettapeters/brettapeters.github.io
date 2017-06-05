import delay from '../delay';
const headData = require('./head');

export default function getHeadData() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(headData);
		}, delay);
	});
}