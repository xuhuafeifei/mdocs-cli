# Railroad Diagram Syntax Reference

## Keyword
`railroad-diagram`

## Structure

```
railroad-diagram
  title "Title"
  ruleName = definition ;
```

## Rule Definition
- Format: `ruleName = definition ;` — must end with semicolon

## Expressions

### Terminals and Non-terminals
- Terminal: `"text"` or `'text'`
- Non-terminal: `identifier` (references other rules)

### Operators (W3C style)
- Sequence: `A B`
- Choice: `A | B`
- Optional: `A?`
- Repetition 0+: `A*`
- Repetition 1+: `A+`
- Grouping: `( A B )`
- Exception: `A - B`

### Operators (ISO 14977 style)
- Sequence: `A , B`
- Optional: `[ A ]`
- Repetition 0+: `{ A }`
- Comment: `(* text *)`
- Special: `? text ?`

## Comments
- W3C: `/* text */`
- ISO 14977: `(* text *)`
