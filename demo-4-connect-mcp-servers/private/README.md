This folder sits NEXT TO demo-data/ on purpose. The filesystem MCP server is scoped to demo-data/ only,
so when you ask Claude to "read private/salaries-DO-NOT-SHARE.csv" it must refuse or fail.
That is least privilege in practice (slide 26).
