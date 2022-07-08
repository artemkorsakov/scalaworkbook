---
layout: docsplus
title: "Range"
section: scala
prev: collections/set
next: collections/tuple
---

## Диапазон (Range)

[`Range`](https://scala-lang.org/api/3.x/scala/collection/immutable/Range.html) 
часто используется для заполнения структур данных и для циклов `for`.
Эти примеры демонстрируют, как создавать диапазоны:

```scala mdoc
1 to 5
1 until 5
1 to 10 by 2
'a' to 'c'
```

`Range` можно использовать для заполнения коллекций:

```scala mdoc
val x = (1 to 5).toList
val y = (1 to 5).toBuffer
```

Они также используются в циклах `for`:

```scala mdoc
for i <- 1 to 3 do println(i)
```

Во многих коллекциях есть метод `range`:

```scala mdoc
Vector.range(1, 5)
List.range(1, 10, 2)
Set.range(1, 10)
```

Диапазоны также полезны для создания тестовых коллекций:

```scala mdoc
val evens = (0 to 10 by 2).toList
val odds = (1 to 10 by 2).toList
val doubles = (1 to 5).map(_ * 2.0)
val map = (1 to 3).map(e => (e,s"$e")).toMap
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
