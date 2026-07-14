# Timeline Syntax Reference

## Keyword & Direction

```
timeline           # default direction
timeline LR        # left-to-right (v11.14.0+)
timeline TD        # top-down (v11.14.0+)
```

## Title

```
title Chart Title
```

## Events

```
timePeriod : event
timePeriod : event1 : event2
```

### Multi-line Events

Use additional `:` lines aligned under the time period:

```
timePeriod : event1
           : event2
           : event3
```

## Sections

```
section Section Name
```

## Line Breaks

```
<br>    # line break within event text
```

## Config

```
{
  "timeline": {
    "disableMulticolor": true
  }
}
```

`disableMulticolor`: `true` disables alternating colors, `false` enables them (default).

## Theme Variables

```
cScale0 ... cScale11          # background colors for timeline entries
cScaleLabel0 ... cScaleLabel11 # label colors for timeline entries
```

## Comments

```
%% this is a comment
```
