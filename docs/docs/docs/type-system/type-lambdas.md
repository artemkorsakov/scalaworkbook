---
layout: docsplus
title: "Type Lambdas"
prev: ./types-dependent-function
next: ./types-others
---

## Лямбда-типы

Лямбда-тип позволяет выразить тип более высокого типа напрямую, без определения типа.

```scala
[X, Y] =>> Map[Y, X]
```

Например, приведенный выше тип определяет конструктор бинарного вида, 
который сопоставляет аргументы `X` и `Y` с `Map[Y, X]`. 
Параметры типа лямбда-выражений могут иметь границы, но они не могут содержать аннотации вариативности `+` или `-`.


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/new-types/type-lambdas.html)
- [Scala 3 Reference, Details](https://docs.scala-lang.org/scala3/reference/new-types/type-lambdas-spec.html)
