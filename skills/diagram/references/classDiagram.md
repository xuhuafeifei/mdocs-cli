# Class Diagram Syntax Reference

## Keyword

```
classDiagram
```

## Class Definition

```
class ClassName
class ClassName {
    +type name
}
```

Shorthand (no braces):

```
ClassName : +type name
ClassName : +methodName() returnType
```

## Visibility

```
+  public
-  private
#  protected
~  package / internal
```

## Classifiers

```
*  abstract
$  static
```

## Members

```
+publicMethod()
-privateField : int
#protectedField : string
```

### Return Types

```
+getMethod() : string
+calculate(int a, int b) : int
```

### Generic Types

```
~List~T~
~Map~K,V~
```

## Annotations

```
<<interface>>
<<enumeration>>
<<service>>
<<abstract>>
```

Applied to class:

```
class ClassName {
    <<interface>>
    +method()
}
```

Or standalone:

```
class ClassName
<<interface>> ClassName
```

## Relationships

Label and multiplicity are optional on all relationships.

```
<|--   inheritance (extends)
*--    composition
o--    aggregation
-->    association (directed)
--     link (solid, undirected)
..>    dependency
..|>   realization (implements)
..     link (dashed, undirected)
```

### Two-Way Relationships

```
<-->   two-way association
o-->   two-way with aggregation
```

### Lollipop Interfaces

```
()--   lollipop interface
```

### Cardinality / Multiplicity

```
Class01 "1" --> "many" Class02 : label
Class01 "1..*" --> "0..1" Class02
```

## Namespaces

```
namespace NamespaceName {
    class ClassA
    class ClassB
}
```

Dot notation: `A.B.C`

## Notes

```
note "text" as noteId
noteId..>Class
```

## Styling

### classDef

```
classDef className fill:#f9f,stroke:#333,stroke-width:4px
```

### Apply Class

```
class nodeId className        # apply to one class
nodeId:::className            # inline shorthand
```

## Comments

```
%% this is a comment
```
