# Packet Diagram Syntax Reference

## Keyword
`packet`

## Structure

```
packet
  title Packet Title
  0-3: "Version"
  4-7: "IHL"
  8: "Reserved"
```

## Field Syntax
- Range (multi-bit): `start-end: "Field Name"`
- Single bit: `N: "Field Name"` where N is the bit position
- Relative bits (v11.7.0+): `+N: "Field Name"` where N is number of bits after previous field

## Mixing Syntax
```
packet
  title Example
  0-3: "Version"
  +4: "IHL"
  +8: "Total Length"
```

## Notes
- Do NOT use `packet-beta`; use `packet`
- Comments: `%%`
