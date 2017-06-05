import delay from '../delay';
const books = require('./books');

export function getAllBooks() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(books);
		}, delay);
	});
}