---
layout: docsplus
title: "Tuple"
section: scala
prev: collections/range
next: collections/queue
---

## Tuple (кортежи)

Scala `tuple` - это тип, который позволяет помещать коллекцию разных типов в один и тот же контейнер.
Например, учитывая `case class Person`:

```scala mdoc:silent
case class Person(name: String)
```

можно построить кортеж, содержащий `Int`, `String` и `Person`:

```scala mdoc
val t = (11, "eleven", Person("Eleven"))
```

Доступ к значениям кортежа осуществляется через индекс (начиная с 0):

```scala mdoc
t(0)
t(1)
t(2)
```

либо через методы вида `._i`, где `i` - порядковый номер (начиная с 1, в отличие от индекса)

```scala mdoc
t._1
t._2
t._3
```

Также можно использовать `extractor` для присвоения переменным значений полей кортежа:

```scala mdoc
val (num, str, person) = t
```

Кортежи хороши для случаев, когда необходимо поместить коллекцию разнородных типов
в небольшую структуру, похожую на коллекцию.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
