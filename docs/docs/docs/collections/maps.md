---
layout: docsplus
title: "Maps"
prev: collections/array-buffer
next: collections/set
---

## {{page.title}}

`Map` — это итерируемая коллекция, состоящая из пар ключей и значений.
В Scala есть как изменяемые, так и неизменяемые типы `Map`.
В этом разделе показано, как использовать неизменяемый `Map`.

#### Создание Map

Неизменяемая `Map` создается следующим образом:

```scala mdoc:silent
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)
```

Перемещаться по элементам `Map` в цикле `for` можно следующим образом:

```scala mdoc
for (k, v) <- states do println(s"key: $k, value: $v")
```

#### Доступ к элементам Map

Доступ к элементам `Map` осуществляется через указание в скобках значения ключа:

```scala mdoc
val ak = states("AK")
val al = states("AL")
```

На практике также используются такие методы, как `keys`, `keySet`, `keysIterator`, циклы `for`
и функции высшего порядка, такие как `map`, для работы с ключами и значениями `Map`.

#### Добавление элемента в Map

При добавлении элементов в неизменяемую карту с помощью `+` и `++`, создается новая карта:

```scala mdoc:reset
val a = Map(1 -> "one")
val b = a + (2 -> "two")
val c = b ++ Seq(
  3 -> "three",
  4 -> "four"
)
```

#### Удаление элементов из Map

Элементы удаляются с помощью методов `-` или `--`.
В случае неизменяемой `Map` создается новый экземпляр, который нужно присвоить новой переменной:

```scala mdoc:reset
val a = Map(
  1 -> "one",
  2 -> "two",
  3 -> "three",
  4 -> "four"
)
val b = a - 4    
val c = a - 4 - 3
```

#### Обновление элементов в Map

Чтобы обновить элементы на неизменяемой `Map`, используется метод `update` (или оператор `+`):

```scala mdoc:reset
val a = Map(
  1 -> "one",
  2 -> "two",
  3 -> "three"
)
val b = a.updated(3, "THREE!")
val c = a + (2 -> "TWO...")
```

#### Перебор элементов в Map

Элементы в `Map` можно перебрать с помощью цикла `for`, как и для остальных коллекций:

```scala mdoc:reset
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)
for (k, v) <- states do println(s"key: $k, value: $v")
```

Существует много способов работы с ключами и значениями на `Map`.
Общие методы `Map` включают `foreach`, `map`, `keys` и `values`.

В Scala есть много других специализированных типов `Map`,
включая `CollisionProofHashMap`, `HashMap`, `LinkedHashMap`, `ListMap`, `SortedMap`, `TreeMap`, `WeakHashMap` и другие.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
