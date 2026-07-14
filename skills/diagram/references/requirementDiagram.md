# Requirement Diagram Syntax

## Declaration
```
requirementDiagram
```

## Requirement Types
- `requirement`
- `functionalRequirement`
- `interfaceRequirement`
- `performanceRequirement`
- `physicalRequirement`
- `designConstraint`

## Requirement Definition
```
type name {
    id: value
    text: value
    risk: Low|Medium|High
    verifymethod: Analysis|Inspection|Test|Demonstration
}
```

## Element Definition
```
element name {
    type: value
    docref: value
}
```

## Relationships
```
source - type -> dest
dest <- type - source
```

### Relationship Types
- `contains`
- `copies`
- `derives`
- `satisfies`
- `verifies`
- `refines`
- `traces`

## Direction
```
direction TB|BT|LR|RL
```

## Markdown Formatting
Use `**bold**` and `*italic*` within quotes for text formatting.

## Styling
```
style name fill:#ffa
classDef name fill:#f96
class name className
name:::className
```

## Example
```mermaid
requirementDiagram
    requirement test_req {
        id: 1
        text: the test text.
        risk: high
        verifymethod: test
    }
    element test_entity {
        type: simulation
    }
    test_entity - satisfies -> test_req
```

## Comments
```
%% This is a comment
```
