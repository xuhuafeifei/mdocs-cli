# Mindmap Syntax Reference

## Keyword

```
mindmap
```

## Hierarchy

Indentation-based. Root node is the first line after `mindmap`.

```
mindmap
  Root
    Child A
      Grandchild A1
      Grandchild A2
    Child B
      Grandchild B1
```

## Shapes

```
id[text]       # square (default if just text)
id(text)       # rounded
id((text))     # circle
id))text((     # bang
id)(text)(     # cloud
id{{text}}     # hexagon
```

Default shape is rectangle when using plain text.

## Icons

```
::icon(fa fa-book)
::icon(fa fa-car)
::icon(fa fa-solid fa-star)
```

FontAwesome icons. Place after the node text on the same line.

## Styling

```
:::className    # apply classDef to node
```

## Markdown Strings

Use backtick-delimited strings for formatting:

```
Root["`**bold**`"]
Child("`*italic*`")
```

## Config

```
{
  "mindmap": {
    "padding": 20,
    "useMaxWidth": true
  }
}
```

Tidy tree layout is used by default.

## Comments

```
%% this is a comment
```
