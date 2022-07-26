---
layout: fp
title: "Функц. структура данных"
section: fp
prev: index
next: handling-errors
---

## Функциональная структура данных

Функциональная структура данных (_functional data structures_) работает с использованием только чистых функций. 
Напомним, что чистая функция не должна изменять данные или выполнять другие побочные эффекты. 
Следовательно, **функциональные структуры данных по определению являются неизменяемыми**.

### Односвязный список

Одной из самых распространённых функциональных структур данных является односвязный список.

Односвязный список можно определить так:

```scala mdoc:invisible
import scala.{List as _, Nil as _}
import scala.collection.immutable.{List as _, Nil as _}
```
```scala mdoc:silent
enum List[+A]:
  case Nil
  case Cons(head: A, tail: List[A])

import List.*

object List:
  def apply[A](as: A*): List[A] =
    if as.isEmpty then Nil
    else Cons(as.head, apply(as.tail*))
```

Перечисление `List` содержит два конструктора данных, которые представляют две возможные формы `List`. 
`List` может быть пустым, обозначаемым конструктором данных `Nil`, 
или непустым, обозначаемым конструктором данных `Cons` (сокращение от _construction_). 
Непустой список состоит из начального элемента `head`, 
за которым следует `List` (возможно, пустой) оставшихся элементов (`tail`):

![List](https://drek4537l1klr.cloudfront.net/pilquist/v-5/Figures/figure-3-1.png) 

Создать список можно следующим образом:

```scala mdoc
val ex1: List[Double] = Nil
val ex2: List[Int] = Cons(1, Nil)
val ex3: List[String] = Cons("a", Cons("b", Nil))
val ex4: List[String] = List.apply("a", "b")
```

#### Операции над односвязным списком

Над этой функциональной структурой данных можно определить, например, следующие операции суммы и произведения,
которые используют [сопоставление с образцом](@DOC@structures#match-expressions):

```scala
def sum(ints: List[Int]): Int = ints match
  case Nil => 0
  case Cons(x, xs) => x + sum(xs)

def product(ds: List[Double]): Double = ds match
  case Nil => 1.0
  case Cons(0.0, _) => 0.0
  case Cons(x, xs) => x * product(xs)
```

Рекурсивные определения довольно часто встречаются при написании функций, 
работающими с рекурсивными типами данных, такими как `List` 
(который рекурсивно ссылается сам на себя в конструкторе данных `Cons`).

#### Совместное использование данных в функциональных структурах данных

Когда данные неизменяемы, как писать функции, которые, например, добавляют или удаляют элементы из списка? 
Когда добавляется элемент `e` в начало существующего списка, скажем `xs`, 
возвращается новый список, в данном случае `Cons(e, xs)`. 
Поскольку списки неизменяемы, на самом деле не нужно копировать `xs`; можно просто использовать его повторно. 
Это называется обменом данными (_data sharing_). 
Совместное использование неизменяемых данных часто позволяет более эффективно реализовывать функции; 
всегда можно вернуть неизменяемые структуры данных, не беспокоясь о том, что последующий код что-то изменит. 
Нет необходимости делать копии, чтобы избежать модификации или повреждения.

Точно так же, чтобы удалить элемент из начала списка `val mylist = Cons(x, xs)`, можно просто вернуть его "хвост" - `xs`. 
Никакого реального удаления не происходит. Первоначальный список `mylist` все еще доступен в целости и сохранности. 
Говорится, что функциональные структуры данных являются _постоянными_, 
что означает, что существующие ссылки никогда не изменяются операциями над структурой данных.

![Data sharing](https://drek4537l1klr.cloudfront.net/pilquist/v-5/Figures/figure-3-3.png)

Пример операции удаления:

```scala
def tail[A](l: List[A]): List[A] =
  l match
    case Nil         => sys.error("tail of empty list")
    case Cons(_, xs) => xs
```

В результате останутся две неизменяемые структуры данных: `l` и `xs`.

### Деревья

Ещё одним примером функциональной структуры данных является двоичное дерево:

```scala
enum Tree[+A]:
  case Leaf(value: A)
  case Branch(left: Tree[A], right: Tree[A])
```

![Tree](https://drek4537l1klr.cloudfront.net/pilquist/v-5/Figures/figure-3-4.png)


---

**References:**
- [Functional Programming in Scala, Second Edition, Chapter 3](https://www.manning.com/books/functional-programming-in-scala-second-edition?query=Functional%20Programming%20in%20Scala,%20Second%20Edition)
