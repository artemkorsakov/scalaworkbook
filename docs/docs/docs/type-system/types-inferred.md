---
layout: docsplus
title: "Определение типов"
section: scala
prev: type-system
next: type-system/types-generics
---

## {{page.title}}

Как и в других статически типизированных языках программирования, в Scala тип можно объявить при создании новой переменной:

```scala
val x: Int = 1
val y: Double = 1
```

В этих примерах типы явно объявлены как `Int` и `Double` соответственно. 
Однако в Scala обычно не нужно объявлять тип при объявлении переменной:

```scala mdoc
val a = 1
val b = List(1, 2, 3)
val m = Map(1 -> "one", 2 -> "two")
```

Scala сама выводит типы, как показано выше.

Действительно, большинство переменных определяются без указания типа, 
и способность Scala автоматически определять его — 
это одна из особенностей, которая делает Scala похожим на язык с динамической типизацией.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-inferred.html)
