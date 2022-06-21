---
layout: docsplus
title: "LazyList"
prev: collections/list
next: collections/vector
---

## {{page.title}}

Коллекции Scala также включают [LazyList](https://scala-lang.org/api/3.x/scala/collection/immutable/LazyList.html),
который представляет собой ленивый неизменяемый связанный список.
Он называется «ленивым» — или нестрогим — потому что вычисляет свои элементы только тогда, когда они необходимы.

Примеры:

```scala mdoc:silent
val x = LazyList.range(1, Int.MaxValue)
x.take(1)    
x.take(5)    
x.map(_ + 1) 
```

`LazyList` начинает вычислять свои элементы только при вызове некоторых методов, например, `foreach`:

```scala mdoc
x.take(1).foreach(println)
```

Для получения дополнительной информации об использовании, преимуществах и недостатках
строгих и нестрогих (ленивых) коллекций см.
обсуждение "строгих" и "нестрогих" коллекций на странице
["Архитектура Scala 2.13’s Collections"](https://docs.scala-lang.org/overviews/core/architecture-of-scala-213-collections.html).


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
