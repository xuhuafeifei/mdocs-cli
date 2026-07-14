# Wardley Map Syntax Reference

## Keyword
`wardley-beta`

## Structure

```
wardley-beta
  title Map Title
  size [800, 600]
```

## Coordinates
- Format: `[visibility, evolution]` — NOT x,y
- visibility = Y axis (0–1), evolution = X axis (0–1)

## Components
```
component Name [0.5, 0.3]
  label [10, -20]
  (decorator)
```
- Anchors: `anchor Name [0.9, 0.1]`

## Decorators
`(inertia)`, `(build)`, `(buy)`, `(outsource)`, `(market)`

## Links
- Dependency: `A -> B`
- With annotation: `A -> B; label`

## Flows
- Forward: `A +> B`
- Reverse: `A +< B`
- Bidirectional: `A +<> B`
- Labeled: `A +'text'> B`

## Evolution
- `evolve Name targetEvolution`

## Pipelines
```
pipeline Parent {
  component "Child" [0.3]
}
```

## Custom Evolution Axis
```
evolution Stage1 -> Stage2 -> Stage3 -> Stage4
evolution Stage1/Label1 -> Stage2/Label2 -> Stage3/Label3 -> Stage4/Label4
```
- Optional `@width` after stage

## Notes
```
note "text" [0.5, 0.5]
```

## Annotations
```
annotations [x, y]
  annotation 1,[x,y] "text"
```

## Accelerators / Deaccelerators
```
accelerator "text" [vis, evo]
deaccelerator "text" [vis, evo]
```

## Trend
```
Component -.- (x, y)
```
- Uses standard x,y NOT [vis,evo]

## Naming
- Names with hyphens OK without quotes
- Quote if name starts with non-letter
