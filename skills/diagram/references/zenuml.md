# ZenUML Sequence Diagram Syntax Reference

## Keyword
`zenuml`

## Structure

```
zenuml
  title Title
  Alice->Bob: message
```

## Participants
- Implicit by usage: just use the name
- Alias: `A as Alice`
- Annotators: `@Actor Alice`, `@Database Bob`

## Messages
- Async: `Alice->Bob: message`
- Sync: `A.SyncMessage` or `A.SyncMessage(params) { nested }`
- Creation: `new A1` or `new A2(params)`
- Reply: `a = A.SyncMessage()` or `return result` or `@return A->B: result`

## Control Structures
- Loop: `while(cond) { }`, `for`, `forEach`, `foreach`, `loop`
- Alt: `if(cond) { } else if(cond) { } else { }`
- Opt: `opt { }`
- Parallel: `par { }`
- Try/catch: `try { } catch { } finally { }`

## Comments
- `// comment` — markdown supported in comments
