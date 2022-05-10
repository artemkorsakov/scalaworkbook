---
layout: docsplus
title: "Неявные преобр."
prev: abstractions/ca-multiversal-equality
next: concurrency
---

## Неявные преобразования типов

Неявные преобразования определяются экземплярами `given` класса `scala.Conversion`. 
Например, без учета возможных ошибок преобразования, этот код определяет неявное преобразование из `String` в `Int`:

```scala
given Conversion[String, Int] with
  def apply(s: String): Int = Integer.parseInt(s)
```

Используя псевдоним, можно выразиться более кратко:

```scala
given Conversion[String, Int] = Integer.parseInt(_)
```

Используя любое из этих преобразований, теперь `String` можно использовать в местах, где ожидается `Int`:

```scala
import scala.language.implicitConversions

// метод, который ожидает Int
def plus1(i: Int) = i + 1

// можно передать строку, которая преобразуется в Int
plus1("1")
```

> Обратите внимание на предложение `import scala.language.implicitConversions` в начале, 
> чтобы разрешить неявные преобразования в файле.


### Обсуждение

Пакет `Predef` содержит преобразования «автоматического упаковывания», 
которые сопоставляют примитивные числовые типы с подклассами `java.lang.Number`. 
Например, преобразование из `Int` в `java.lang.Integer` можно определить следующим образом:

```scala
given int2Integer: Conversion[Int, java.lang.Integer] =
  java.lang.Integer.valueOf(_)
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/ca-implicit-conversions.html)
