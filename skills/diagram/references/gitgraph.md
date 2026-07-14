# Git Graph Syntax Reference

## Keyword & Orientation

```
gitGraph
gitGraph LR:
gitGraph TB:
gitGraph BT:
```

## Commands

### commit

```
commit
commit id: "abc123"
commit type: NORMAL
commit type: REVERSE
commit type: HIGHLIGHT
commit tag: "v1.0"
commit id: "abc123" type: HIGHLIGHT tag: "v1.0"
```

### branch

```
branch newBranch
branch newBranch order: 2
```

### checkout / switch

```
checkout branchName
switch branchName
```

### merge

```
merge branchName
merge branchName tag: "v2.0"
merge branchName id: "def456"
```

### cherry-pick

```
cherry-pick id: "abc123"
cherry-pick id: "abc123" parent: "parentHash"
```

## Config Options

```
{
  "gitGraph": {
    "showBranches": true,
    "showCommitLabel": true,
    "mainBranchName": "main",
    "mainBranchOrder": 0,
    "parallelCommits": false,
    "rotateCommitLabel": true
  }
}
```

## Theme Variables

```
git0 ... git7                        # branch colors
gitBranchLabel0 ... gitBranchLabel7  # branch label colors
gitInv0 ... gitInv7                  # inverted colors
commitLabelColor
commitLabelBackground
commitLabelFontSize
tagLabelColor
tagLabelBackground
tagLabelBorder
tagLabelFontSize
```

## Comments

```
%% this is a comment
```
