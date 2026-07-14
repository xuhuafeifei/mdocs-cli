# State Diagram Syntax Reference

## Keyword

```
stateDiagram-v2
```

## States

```
stateId
stateId : description
state "Long Name" as id
```

## Transitions

```
state1 --> state2
[*] --> state1       # start transition
state1 --> [*]       # end transition
state1 --> state2 : transition label
```

## Composite States

```
state StateName {
    state1 --> state2
    state3 --> state4
}
```

## Choice (Conditional)

```
state ChoiceName <<choice>>
state1 --> ChoiceName
ChoiceName --> state2 : condition A
ChoiceName --> state3 : condition B
```

## Fork / Join

```
state ForkName <<fork>>
state JoinName <<join>>

state1 --> ForkName
ForkName --> state2
ForkName --> state3
state2 --> JoinName
state3 --> JoinName
JoinName --> state4
```

## Concurrency

Use `--` as a divider inside a composite state:

```
state CompositeState {
    state1 --> state2
    --
    state3 --> state4
}
```

## Notes

```
note right of StateName : text
note left of StateName : text
note left of StateName
    multi-line text
end note
```

## Direction

```
direction LR
direction RL
direction TB
direction BT
```

## Styling

### classDef

```
classDef className fill:#f9f,stroke:#333,stroke-width:4px
```

### Apply Class

```
stateId:::className
```

## Comments

```
%% this is a comment
```
