const escape = require('escape-html');

const html = (literals, ...expressions) => (
	literals.raw.reduce((result, lit, i) => {
		let exp = expressions[i];

		if (Array.isArray(exp)) {
			exp = exp.join('');
		}

		if (lit.endsWith('$')) {
			exp = escape(exp);
			lit = lit.slice(0, -1);
		}

		return `${result}${lit}${exp || ''}`;
	}, '')
);

export default html;