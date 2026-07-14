# Tree View Syntax Reference

## Keyword
`treeView-beta`

## Structure
- Indentation-based hierarchy (spaces)

```
treeView-beta
  Root/
    file1.ts
    "file with spaces"
    highlighted :::highlight
    doc.md ## description text
    app.tsx icon(react) :::highlight ## Main app
```

## Entry Types
- **Directory**: trailing `/` on label — gets folder icon + bold
- **File**: auto-detected by extension

## Label Options
- Quoted labels: `"file name"` for names with spaces
- Highlight: `name :::highlight`
- Description: `name ## description text`
- Icon override: `name icon(iconName)`
- Combined: `name :::highlight icon(react) ## description`

## Auto-detected Icons
javascript, typescript, react, python, json, markdown, html, css, yaml, terminal, database, lock, git, docker, folder, file

## Comments
- `%%`

## Config
```
%%{init: {"treeView": {"rowIndent": 15}}}%%
```
- rowIndent, paddingX, paddingY, lineThickness, showIcons

## Theme Variables
- `treeView.labelFontSize`, `labelColor`, `lineColor`, `iconColor`, `descriptionColor`, `highlightBg`, `highlightStroke`
