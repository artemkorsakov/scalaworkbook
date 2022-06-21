---
layout: docsplus
title: "Set"
prev: collections/maps
next: collections/range
---

## Работа с множествами

Множество ([Set](https://scala-lang.org/api/3.x/scala/collection/immutable/Set.html)) -
итерируемая коллекция без повторяющихся элементов.

В Scala есть как изменяемые, так и неизменяемые типы `Set`.
В этом разделе демонстрируется неизменяемое множество.

#### Создание множества

Создание нового пустого множества:

```scala mdoc:reset
val nums = Set[Int]()
val letters = Set[Char]()
```

Создание множества с исходными данными:

```scala mdoc:reset
val nums = Set(1, 2, 3, 3, 3)
val letters = Set('a', 'b', 'c', 'c')
```

#### Добавление элементов в множество

В неизменяемое множество новые элементы добавляются с помощью `+` и `++`,
результат присваивается новой переменной:

```scala mdoc
val a = Set(1, 2)
val b = a + 3
val c = b ++ Seq(4, 1, 5, 5)
```

Стоит отметить, что повторяющиеся элементы не добавляются в множество, а также, что порядок элементов произвольный.

#### Удаление элементов из множества

Элементы из множества удаляются с помощью методов `-` и `--`:

```scala mdoc:reset
val a = Set(1, 2, 3, 4, 5)
val b = a - 5
val c = b -- Seq(3, 4)
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
