# User Journey Diagram Syntax

## Declaration
```
journey
```

## Title
```
title Chart Title
```

## Sections
```
section Section Name
```

## Tasks
```
Task name: score: comma-separated-actors
```
- **score**: 1-5 (1 = low satisfaction, 5 = high satisfaction)
- **actors**: comma-separated list of participant names

## Example
```mermaid
journey
    title My working day
    section Go to work
        Make tea: 5: Me
        Go upstairs: 3: Me
        Do work: 1: Me, Cat
    section Go home
        Go downstairs: 5: Me
        Sit down: 5: Me
```

## Comments
```
%% This is a comment
```
