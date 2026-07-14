# XY Chart Syntax Reference

## Keywords
`xychart` | `xychart-beta` | `xychart horizontal`

## Structure

```
xychart-beta
  title "Chart Title"
  x-axis [cat1, cat2, cat3]
  y-axis "Y Label" 0 --> 100
  line [10, 20, 30]
  bar [5, 15, 25]
```

## Axis Syntax
- Categorical x-axis: `x-axis [cat1, cat2, cat3]`
- Numeric range: `x-axis "title" min --> max`
- Auto range: `y-axis "title"`
- Text with spaces must be in quotes

## Data Series
- `line [val1, val2, val3]` — line plot
- `bar [val1, val2, val3]` — bar plot
- Multiple series allowed

## Config Options
```
%%{init: {"xyChart": {"width": 700, "height": 400}}}%%
```
- **Chart**: width, height, titlePadding, titleFontSize, showTitle, chartOrientation, plotReservedSpacePercent, showDataLabel, showDataLabelOutsideBar
- **AxisConfig** (under xAxisConfig/yAxisConfig): showLabel, labelFontSize, labelPadding, showTitle, titleFontSize, titlePadding, showTick, tickLength, tickWidth, showAxisLine, axisLineWidth

## Theme Variables
- `xyChart.backgroundColor`
- `xyChart.titleColor`
- `xyChart.dataLabelColor`
- `xyChart.xAxisLabelColor`
- `xyChart.plotColorPalette` — comma-separated color list
