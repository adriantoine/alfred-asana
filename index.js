'use strict';
const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');

alfredNotifier();

const WORKSPACE_ID = process.env.WORKSPACE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

alfy.fetch(`https://app.asana.com/api/1.0/workspaces/${WORKSPACE_ID}/typeahead`, {
	headers: {Authorization: `Bearer ${ACCESS_TOKEN}`},
	query: {
		query: alfy.input,
		type: 'task'
	}
})
	.then(data => {
		const items = data.data.map(x => ({
			title: x.name,
			arg: `${WORKSPACE_ID}/${x.id}`
		}));

		alfy.output(items);
	});
