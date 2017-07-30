'use strict';
const alfy = require('alfy');
const isNil = require('lodash.isnil');
const alfredNotifier = require('alfred-notifier');

alfredNotifier();

const WORKSPACE_ID = process.env.WORKSPACE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const getProjectNames = projects =>
  `Projects: ${projects.map(proj => proj.name).join(', ')}`;

const getAssignee = assignee => `Assigned to ${assignee.name}`;

const getSubtitle = task => {
  let subtitle = '';

  if (!isNil(task.projects)) {
    subtitle += getProjectNames(task.projects);
  }

  if (!isNil(task.assignee)) {
    subtitle += ` | ${getAssignee(task.assignee)}`;
  }

  return subtitle;
};

alfy
  .fetch(`https://app.asana.com/api/1.0/workspaces/${WORKSPACE_ID}/typeahead`, {
    headers: {Authorization: `Bearer ${ACCESS_TOKEN}`},
    query: {
      query: alfy.input,
      type: 'task',
      opt_fields: 'id,name,this.assignee.name,this.projects.name'
    }
  })
  .then(data =>
    alfy.output(
      data.data.map(x => ({
        uid: `${WORKSPACE_ID}/${x.id}`,
        title: x.name,
        autocomplete: x.name,
        subtitle: getSubtitle(x),
        arg: `${WORKSPACE_ID}/${x.id}`
      }))
    )
  );
