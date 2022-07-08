---
layout: docsplus
title: "Распаковка параметров"
section: scala
prev: details/export-causes
next: details/type-test
---

## {{page.title}}

Допустим есть список кортежей, например:

```scala mdoc:silent
val xs: List[(Int, Int)] = List((1, 2), (3, 4))
```

и необходимо изменить `xs` в `List[Int]`, чтобы каждая пара чисел была сопоставлена с их суммой. 
Ранее лучший способ сделать это - с помощью декомпозиции сопоставления с образцом:

```scala
xs map {
  case (x, y) => x + y
}
```

Хотя это правильно, это также неудобно и сбивает с толку, поскольку `case` предполагает, 
что сопоставление с образцом может завершиться ошибкой. 
Как более короткая и понятная альтернатива, Scala 3 теперь позволяет

```scala mdoc
xs.map {
  (x, y) => x + y
}
```

или, что то же самое:

```scala mdoc
xs.map(_ + _)
```

а также

```scala mdoc
def combine(i: Int, j: Int) = i + j
xs.map(combine)
```

Как правило, значение функции с `n > 1` параметрами упаковывается в функциональный тип 
формы `((T_1, ..., T_n)) => U`, если это ожидаемый тип. 
Параметр кортежа декомпозируется, и его элементы передаются непосредственно базовой функции.

Более конкретно, адаптация применяется к несовпадающему списку формальных параметров. 
В частности, адаптация не является преобразованием между типами функций. 
Поэтому не принимается:

```scala mdoc:silent
val combiner: (Int, Int) => Int = _ + _
```

```scala mdoc:fail
xs.map(combiner)
```

Значение функции должно быть явно сложены:

```scala mdoc
xs.map(combiner.tupled)
```

Преобразование может быть предусмотрено в пользовательском коде:

```scala
import scala.language.implicitConversions
transparent inline implicit def `fallback untupling`(f: (Int, Int) => Int): ((Int, Int)) => Int =
  p => f(p._1, p._2)     // use specialized apply instead of unspecialized `tupled`
xs.map(combiner)
```

Попытка распаковки параметров предпринимается до применения преобразований, 
поэтому преобразование области действия не может нарушить распаковку.


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/other-new-features/parameter-untupling.html)
- [Scala 3 Reference - Details](https://docs.scala-lang.org/scala3/reference/other-new-features/parameter-untupling-spec.html)
