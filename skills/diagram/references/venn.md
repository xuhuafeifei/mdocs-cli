# Venn Diagram Syntax Reference

## Keyword
`venn-beta`

## Structure

```
venn-beta
  title "Title"
  set A
  set B
  union A,B
```

## Sets
- `set Name`
- `set Name["Label"]`
- `set Name["Label"]:size`

## Unions
- `union Set1,Set2`
- `union Set1,Set2["Label"]`
- `union Set1,Set2["Label"]:size`
- Must define sets before using in union

## Text Nodes
```
set A
  text id1["Label"]
```
- Indented under set or union

## Styling
```
style Name fill:#color
style Name color:#color
style Name stroke:#color
style Name stroke-width:N
style Name fill-opacity:N
```
