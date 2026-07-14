# Cynefin Diagram Syntax Reference

## Keyword
`cynefin-beta`

## Structure

```
cynefin-beta
  title Optional Title

  complex
    "Item 1"
    "Item 2"
  complicated
    "Item 3"
  clear
    "Item 4"
  chaotic
    "Item 5"
  confusion
    "Item 6"

  complex --> complicated : "Transition label"
```

## Domain Blocks
- `complex`, `complicated`, `clear`, `chaotic`, `confusion`
- Items: quoted strings on own indented lines
- Domains can appear in any order; positions are fixed
- Confusion domain: max 3 items visible

## Transitions
- `domain1 --> domain2 : "label"`
- Self-loop transitions are ignored

## Config
```
%%{init: {"cynefin": {"width": 700, "height": 500}}}%%
```
- width, height, padding, showDomainDescriptions, boundaryAmplitude

## Theme Variables
- `cynefin.complexBg`, `complicatedBg`, `clearBg`, `chaoticBg`, `confusionBg`
- `cynefin.boundaryColor`, `cliffColor`, `arrowColor`, `labelColor`, `textColor`

## Accessibility
- `accTitle: Title text`
- `accDescr: Description text`
