---
layout: fp
title: "Ленивые вычисления"
section: fp
prev: handling-errors
next: ???
---

## {{page.title}}

Нестрогость (или ленивое вычисление) — это свойство функции. 
Сказать, что функция не является строгой, просто означает, 
что функция может решить не оценивать один или несколько своих аргументов. 
Напротив, строгая функция всегда оценивает свои аргументы. 
Строгие функции являются нормой в большинстве языков программирования. 
Если не указано иное, любое определение функции в Scala будет строгим. 

В качестве примера рассмотрим следующую функцию:

```scala
def square(x: Double): Double = x * x
```

При вызове `square(41.0 + 1.0)`, функция `square` получит оценочное значение `42.0`, потому что она строгая.
Напротив, сокращающие логические функции `&&` и `||`, 
встречающиеся во многих языках программирования, включая Scala, не являются строгими.
Функция `&&` принимает два логических аргумента, но оценивает второй аргумент только в том случае, если первый истинен:

```scala mdoc
false && { println("!!"); true }
```

Аналогично `||` оценивает свой второй аргумент, только если первый `false`:

```scala mdoc
true || { println("!!"); false }
```

Еще одним примером нестрогости является управляющая конструкция `if` в Scala:

```scala
val result = if input.isEmpty then sys.error("empty input") else input
```

Нестрогие вычисления не кэшируются и вычисляются каждый раз при вызове:

```scala mdoc
def maybeTwice(b: Boolean, i: => Int) = if b then i + i else 0
val x = maybeTwice(true, { println("hi"); 1 + 41 })
```

### Lazy List

Рассмотрим, как можно использовать нестрогость для повышения эффективности 
и модульности функциональных программ на примере ленивых списков. 
Цепочки преобразований в ленивых списках объединяются в один проход благодаря использованию нестрогости. 
Вот простое определение `LazyList`:

```scala mdoc:silent
enum LazyList[+A]:
  case Empty
  case Cons(h: () => A, t: () => LazyList[A])

import LazyList.*

object LazyList:
  def cons[A](hd: => A, tl: => LazyList[A]): LazyList[A] =
    lazy val head = hd
    lazy val tail = tl
    Cons(() => head, () => tail)

  def empty[A]: LazyList[A] = Empty

  def apply[A](as: A*): LazyList[A] =
    if as.isEmpty then empty
    else cons(as.head, apply(as.tail*))
```




---

**References:**
- [Functional Programming in Scala, Second Edition, Chapter 5](https://www.manning.com/books/functional-programming-in-scala-second-edition?query=Functional%20Programming%20in%20Scala,%20Second%20Edition)
