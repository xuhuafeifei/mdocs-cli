# ER Diagram Syntax Reference

## Keyword

```
erDiagram
```

## Relationships

Format: `LEFT_ENTITY cardinality_left line_type cardinality_right RIGHT_ENTITY : "label"`

### Cardinality Symbols

```
||   exactly one
|o   zero or one
}|   one or more
}o   zero or more
```

Left side: `||`, `|o`, `}|`, `}o`
Right side: same symbols

### Line Types

```
--   solid line (identifying relationship)
..   dashed line (non-identifying relationship)
```

### Relationship Examples

```
ENTITY01 ||--o{ ENTITY02 : "label"        # one-to-many (identifying)
ENTITY01 |o--o{ ENTITY02 : "label"        # zero/one-to-many
ENTITY01 }|--|| ENTITY02 : "label"        # many-to-one
ENTITY01 }o--o{ ENTITY02 : "label"        # many-to-many
ENTITY01 ||..o{ ENTITY02 : "label"        # one-to-many (non-identifying)
ENTITY01 |o..|| ENTITY02 : "label"        # zero/one-to-one (non-identifying)
ENTITY01 }|..|{ ENTITY02 : "label"        # many-to-many (non-identifying)
```

### Text Alternatives for Cardinality

Instead of symbols, use brackets:

```
[1]       exactly one
[0..1]    zero or one
[1..*]    one or more
[0..*]    zero or more
```

Example: `ENTITY01 [1] -- [0..*] ENTITY02 : "label"`

## Attributes

```
ENTITY {
    type name "key" constraint
    string name
    int id PK
    string email UK
    int user_id FK
}
```

### Types

```
string, int, float, blob, date, datetime, timestamp, boolean, etc.
```

### Constraints

```
PK   primary key
FK   foreign key
UK   unique key
```

Mark as key with quotes: `"key"` before constraint.

## Entity Aliases

```
ENTITY [alias]
```

## Styling

### classDef

```
classDef className fill:#f9f,stroke:#333,stroke-width:4px
```

## Comments

```
%% this is a comment
```
