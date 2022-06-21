---
layout: docsplus
title: "ArrayBuffer"
prev: collections/vector
next: collections/maps
---

## {{page.title}}

`ArrayBuffer` используется тогда, когда нужна изменяемая индексированная последовательность общего назначения.
Поскольку `ArrayBuffer` индексирован, произвольный доступ к элементам выполняется быстро.

#### Создание ArrayBuffer

Чтобы использовать `ArrayBuffer`, в отличие от предыдущих рассмотренных классов, его нужно вначале импортировать:

```scala
import scala.collection.mutable.ArrayBuffer
```

Если необходимо начать с пустого `ArrayBuffer`, просто укажите его тип:

```scala
var strings = ArrayBuffer[String]()
var ints = ArrayBuffer[Int]()
var people = ArrayBuffer[Person]()
```

Если известен примерный размер `ArrayBuffer`, его можно задать:

```scala
val buf = new ArrayBuffer[Int](100_000)
```

Чтобы создать новый `ArrayBuffer` с начальными элементами, достаточно просто указать начальные элементы,
как для `List` или `Vector`:

```scala
val nums = ArrayBuffer(1, 2, 3)
val people = ArrayBuffer(
  Person("Bert"),
  Person("Ernie"),
  Person("Grover")
)
```

#### Добавление элементов в ArrayBuffer

Новые элементы добавляются в `ArrayBuffer` с помощью методов `+=` и `++=`.
Также можно использовать текстовый аналог: `append`, `appendAll`, `insert`, `insertAll`, `prepend` и `prependAll`.
Вот несколько примеров с `+=` и `++=`:

```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
```
```scala mdoc
val nums = ArrayBuffer(1, 2, 3)
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val nums = ArrayBuffer(1, 2, 3)
```
```scala mdoc
nums += 4
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val nums = ArrayBuffer(1, 2, 3)
nums += 4
```
```scala mdoc
nums ++= List(5, 6)
```

#### Удаление элементов из ArrayBuffer

`ArrayBuffer` является изменяемым, поэтому у него есть такие методы, как `-=`, `--=`, `clear`, `remove` и другие.
Примеры с `-=` и `--=`:

```scala mdoc
val a = ArrayBuffer.range('a', 'h')
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val a = ArrayBuffer.range('a', 'h')
```
```scala mdoc
a -= 'a'
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val a = ArrayBuffer.range('a', 'h')
a -= 'a'
```
```scala mdoc
a --= Seq('b', 'c')
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val a = ArrayBuffer.range('a', 'h')
a -= 'a'
a --= Seq('b', 'c')
```
```scala mdoc
a --= Set('d', 'e')
```

#### Обновление элементов в ArrayBuffer

Элементы в `ArrayBuffer` можно обновлять, либо переназначать:

```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
```
```scala mdoc
val a = ArrayBuffer.range(1,5)
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val a = ArrayBuffer.range(1,5)
```
```scala mdoc
a(2) = 50
println(a)
```
```scala mdoc:reset:invisible
import scala.collection.mutable.ArrayBuffer
val a = ArrayBuffer.range(1,5)
a(2) = 50
```
```scala mdoc
a.update(0, 10)
println(a)
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
