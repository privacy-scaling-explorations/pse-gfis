# PSE Good First Issues Tracker

This is a simple frontend/backend to grab all the "good first issues" from a number of Github orgs/repos.

Starting from a list of orgs/repos, we use GraphQL to query the Github endpoint for their issues. And then we filter for issues that have the tag "good-first-issues" (and slight variations). We then simply add them up and give people a simple frontend to view the list.

<img width="628" alt="image" src="https://github.com/adrianmcli/pse-gfis/assets/943555/39cf9cdd-757d-4cc3-ab09-a4a7bb84e1ba">
