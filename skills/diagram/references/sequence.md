# Sequence Diagram Syntax Reference

## Keyword

```
sequenceDiagram
```

## Participants

```
participant A
participant A as Alice
actor A
actor A as Alice
```

### Participant Types

```
participant A@{ "type": "boundary" }
```

Types: `actor`, `boundary`, `control`, `entity`, `database`, `collections`, `queue`

## Messages

```
A->B       # solid line with arrow
A-->B      # dotted line with arrow
A->>B      # solid line with open arrow
A-->>B     # dotted line with open arrow
A-xB       # solid line with cross
A-)B       # solid line with open circle
```

### Bidirectional

```
A<<->>B    # solid bidirectional
A<<-->>B   # dotted bidirectional
```

### Half-Arrows

```
A->B:      # solid half-arrow
A-->B:     # dotted half-arrow
```

### Text on Arrows

```
A->B: message text
A-->B: message text
A->>B: message text
```

## Activations

```
activate A
deactivate A
```

Shorthand (inline with message):

```
+A   # activate
-A   # deactivate
```

Example: `A->>+B: message` (activates B), `B-->>-A: response` (deactivates B)

## Loops & Conditionals

```
loop description
    A->B: message
end

alt condition
    A->B: message
else other condition
    A->B: message
end

opt condition
    A->B: message
end

par
    A->B: message
and
    A->C: message
end

critical condition
    A->B: message
option other condition
    A->B: message
end

break condition
    A->B: message
end
```

## Notes

```
Note right of A: text
Note left of A: text
Note over A: text
Note over A,B: text
```

## Box Grouping

```
box title
    participant A
    participant B
end

box rgba(0,0,255,0.5) title
    participant A
end
```

## Rect Highlighting

```
rect rgb(r,g,b)
    A->B: message
end
```

## Autonumber

```
autonumber                          # start at 1, increment 1
autonumber 10                       # start at 10, increment 1
autonumber 10 5                     # start at 10, increment 5
autonumber 10 5 "(%d)"              # with format string
```

## Actor Menus

```
link A: label @ url
links A: {"label1": "url1", "label2": "url2"}
```

## Comments

```
%% this is a comment
```
