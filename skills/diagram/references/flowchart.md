# Flowchart Syntax Reference

## Keyword & Direction

```
flowchart TD    # top-down (alias TB)
flowchart TB    # top-bottom
flowchart BT    # bottom-top
flowchart LR    # left-right
flowchart RL    # right-left

graph TD        # legacy keyword (same directions)
```

## Node Shapes

```
id[rect]
id(round)
id([stadium])
id[[subroutine]]
id[(cylinder)]
id((circle))
id>asymmetric]
id{rhombus}
id{{hexagon}}
id[/parallelogram/]
id[\parallelogram alt\]
id(((double circle)))
```

### Shape Syntax via `@{ shape: xxx }`

```
id@{ shape: rect }
id@{ shape: rounded }
id@{ shape: stadium }
id@{ shape: subroutine }
id@{ shape: cylinder }
id@{ shape: circle }
id@{ shape: double-circle }
id@{ shape: diamond }
id@{ shape: hexagon }
id@{ shape: lean-r }
id@{ shape: lean-l }
id@{ shape: trapezoid }
id@{ shape: inv-trapezoid }
id@{ shape: div-rect }
id@{ shape: docs }
id@{ shape: process }
id@{ shape: delay }
id@{ shape: stored-data }
id@{ shape: display }
id@{ shape: paper-tape }
id@{ shape: odd }
id@{ shape: tagged-document }
id@{ shape: priority }
id@{ shape: manual-input }
id@{ shape: manual-operation }
id@{ shape: crossed-circle }
id@{ shape: lining }
id@{ shape: collaboration }
id@{ shape: edge-bump }
id@{ shape: text }
```

`菱形` is an alias for `diamond`.

## Links

```
A --> B      # arrow
A --- B      # line (no arrow)
A ==> B      # thick arrow
A -.-> B     # dotted arrow
A --o B      # circle edge
A --x B      # cross edge
A ~~~ B      # invisible link
```

### Link Text

```
A -->|text| B
A ---|text| B
A -- text --> B
A -- text --- B
A == text ==> B
A -. text .-> B
```

### Multi-Length Links

```
A ---> B       # longer arrow
A ----> B
A -----> B
A ===> B       # longer thick
A ====> B
A -.-.-> B     # longer dotted
A -.-> B
```

### Chaining

```
A --> B --> C --> D
A --> B --> C --> D --> E
```

## Subgraphs

```
subgraph title
    A --> B
end

subgraph id [title]
    A --> B
end
```

## Direction (inside subgraph)

```
direction TB
direction BT
direction LR
direction RL
```

## Edge IDs & Animation

```
A --> B@e1
e1@{ animation: fast }
```

## Markdown Strings

Use backtick-delimited strings for formatting inside nodes:

```
A["`**bold text**`"]
B["`*italic text*`"]
```

## Styling

### classDef

```
classDef className fill:#f9f,stroke:#333,stroke-width:4px
```

### Apply Class

```
class nodeId className        # apply to one node
class nodeId1,nodeId2 className  # apply to multiple
nodeId:::className            # inline shorthand
```

### style (per-node)

```
style nodeId fill:#bbf,stroke:#f66,stroke-width:2px,color:#fff
```

## Interactions

```
click nodeId callback         # JavaScript callback
click nodeId "URL"            # hyperlink
click nodeId "URL" "_blank"   # hyperlink with target
```

## Icons & Entities

```
A[fa:fa-fire]                 # FontAwesome icon
A["text #quot;"]              # entity code: "
A["text #9829;"]              # entity code: ♥
```

## Reserved Word

`end` breaks flowcharts. Use `End`, `END`, or wrap in quotes: `["end"]`.

## Comments

```
%% this is a comment
```
