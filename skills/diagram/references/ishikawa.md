# Ishikawa (Fishbone) Diagram Syntax Reference

## Keyword
`ishikawa-beta`

## Structure

```
ishikawa-beta
  Problem statement
    Category 1
      Cause 1
      Cause 2
        Sub-cause
    Category 2
      Cause 3
```

## Rules
- First line after keyword: the problem/event (root of diagram)
- Top-level indented items: main "bones" (categories)
- Sub-items under categories: causes (indented further)
- Nest deeper for sub-causes
- Do NOT use `fishbone`; use `ishikawa-beta`
- Comments: `%%`
