import html from './templateParser';
import getHeadData from './api/data/metaDataApi';
import { getAllBooks } from './api/data/bookDataApi';

const head = meta => html`
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>$${meta.title}</title>
		${meta.styleSheets.map(href => html`
			<link href="$${href}" rel="stylesheet">
		`)}
	</head>
`;

const body = books => html`
	<body>
		<h1>Some books I have!</h1>
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th>Pages</th>
					<th>Year</th>
				</tr>
			</thead>
			<tbody>
		${books.map(book => html`
			<tr>
				<td>$${book.title}</td>
				<td>$${book.author}</td>
				<td>$${book.pages}</td>
				<td>$${book.year}</td>
				<td><img src="$${book.thumbnail}" alt="$${book.title}" /></td>
			</tr>
		`)}
			</tbody>
		</table>
	</body>
`;

const execute = (template, context) => (
	Promise.resolve(context).then(data => template(data))
);

const build = (...sections) => (
	Promise.all(sections).then(parts => (
		html`
<!DOCTYPE html>
<html lang="en">
${parts}
</html>`
	))
	.catch(console.log)
);

build(
	execute(head, getHeadData()),
	execute(body, getAllBooks())
).then(console.log);

