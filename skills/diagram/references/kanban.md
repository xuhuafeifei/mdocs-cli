# Kanban Diagram Syntax

## Declaration
```
kanban
```

## Columns
```
columnId[Column Title]
```
Or without ID: `[Column Title]`

## Tasks
Tasks are indented under their column:
```
columnId[Column Title]
    taskId[Task Description]
    [Task Description]
```

## Metadata
```
taskId[Task Description]@{ ticket: "MC-123", assigned: "name", priority: "High" }
```
- **priority** values: `Very High`, `High`, `Low`, `Very Low`
- **ticket**: ticket/issue reference string
- **assigned**: assignee name string

## Configuration
```
config:
  ticketBaseUrl: "https://example.com/browse/#TICKET#"
```
`#TICKET#` placeholder is replaced with the ticket value from metadata.

## Example
```mermaid
kanban
    todo[To Do]
        task1[Create project]@{ ticket: "MC-1", assigned: "Alice", priority: "High" }
    inProgress[In Progress]
        task2[Write docs]@{ ticket: "MC-2", assigned: "Bob" }
    done[Done]
```

## Comments
```
%% This is a comment
```
