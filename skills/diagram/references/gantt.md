# Gantt Chart Syntax Reference

## Keyword

```
gantt
```

## Header

```
title Chart Title
dateFormat YYYY-MM-DD          # default format
axisFormat %Y-%m-%d            # x-axis display format
tickInterval 1month            # tick interval
excludes weekends, 2024-01-01  # excluded dates (comma-separated)
inclusiveEndDates               # treat end dates as inclusive
```

## Sections

```
section Section Name
```

## Tasks

```
taskName : status, id, start, end/duration
taskName : id, start, end/duration
taskName : id, after taskId, duration
```

### Status (optional, combinable)

```
done       completed task
active     in-progress task
crit       critical task
milestone  milestone marker
```

Combine: `done,crit`, `active,crit`, etc.

### Start

```
2024-01-01           # specific date
after taskId         # after another task
```

### Duration

```
Xd    days
Xw    weeks
Xh    hours
Xm    minutes
Xs    seconds
Xy    years
XM    months
```

### Task Examples

```
Task1         :a1, 2024-01-01, 30d
Task2         :a2, after a1, 20d
Done Task     :done, a3, 2024-01-01, 10d
Critical Task :crit, a4, after a3, 5d
Milestone     :milestone, m1, after a4, 0d
Active+Crit   :active,crit, a5, after m1, 3d
```

## Compact Mode

```
compact
```

## Vertical Markers

```
vert markerName 2024-06-01
```

## todayMarker

```
todayMarker stroke-width:5px,stroke:#0f0,stroke-dasharray:5,5
```

Set to `off` to hide: `todayMarker off`

## Click

```
click taskId href "URL"
click taskId call callback()
```

## Comments

```
%% this is a comment
```
