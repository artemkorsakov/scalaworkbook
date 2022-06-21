---
layout: docsplus
title: "Vector"
prev: collections/lazylist
next: collections/array-buffer
---

## {{page.title}}

[Vector](https://scala-lang.org/api/3.x/scala/collection/immutable/Vector.html) -
это индексируемая неизменяемая последовательность.
"Индексируемая" часть описания означает, что она обеспечивает произвольный доступ
и обновление за практически постоянное время,
поэтому можно быстро получить доступ к элементам `Vector` по значению их индекса,
например, получить доступ к `listOfPeople(123_456_789)`.

В общем, за исключением той разницы, что (а) `Vector` индексируется, а `List` - нет,
и (б) `List` имеет метод `::`, эти два типа работают одинаково.

Вот несколько способов создания `Vector`:

```scala mdoc:reset
val nums = Vector(1, 2, 3, 4, 5)
val strings = Vector("one", "two")
case class Person(name: String)
val people = Vector(
  Person("Bert"),
  Person("Ernie"),
  Person("Grover")
)
```

Поскольку `Vector` неизменяем, в него нельзя добавить новые элементы.
Вместо этого создается новая последовательность,
с добавленными к существующему `Vector` в начало или в конец элементами.

Например, так элементы добавляются в конец:

```scala mdoc
val a = Vector(1,2,3)
val b = a :+ 4
val c = a ++ Vector(4, 5)
```

А так - в начало `Vector`-а:

```scala mdoc:reset
val a = Vector(1,2,3)
val b = 0 +: a
val c = Vector(-1, 0) ++: a
```

В дополнение к быстрому произвольному доступу и обновлениям,
`Vector` обеспечивает быстрое добавление в начало и конец.

> Подробную информацию о производительности `Vector` и других коллекций см. в
> [характеристиках производительности коллекций](https://docs.scala-lang.org/overviews/collections-2.13/performance-characteristics.html).

Наконец, `Vector` в цикле `for` используется точно так же, как `List`, `ArrayBuffer` или любая другая последовательность:

```scala mdoc
val names = Vector("Joel", "Chris", "Ed")
for name <- names do println(s"My name is $name")
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
