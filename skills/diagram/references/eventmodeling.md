# Event Modeling Syntax Reference

## Keyword
`eventmodeling`

## Time Frames
- Compact: `tf NN type EntityId`
- Relaxed: `timeframe NN type EntityId`
- Reset frames: `rf NN type EntityId` or `resetframe NN type EntityId`

## Entity Types
- `ui` — UI/View
- `pcr` or `processor` — Processor/Command Handler
- `cmd` or `command` — Command
- `rmo` or `readmodel` — Read Model
- `evt` or `event` — Event

## Inline Data
```
tf NN type EntityId { field: type }
```

## Data Blocks
```
data EntityId {
  field: value
}
```
- Reference: `tf NN type EntityId [[DataBlockId]]`

## Data Types (in backticks)
`json`, `jsobj`, `figma`, `salt`, `uri`, `md`, `html`, `text`

## Multiple Relations
```
tf NN rmo EntityId ->> 02 ->> 03
```

## Namespaces
- Dot notation: `Cart.InventoryChanged`

## Swimlanes
- Auto-inferred from entity type
