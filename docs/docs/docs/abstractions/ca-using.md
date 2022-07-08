---
layout: docsplus
title: "Using"
section: scala
prev: abstractions/ca-given
next: abstractions/type-classes
---

## Предложения using

Функциональное программирование имеет тенденцию выражать большинство зависимостей в виде простой параметризации функций. 
Это чисто и мощно, но иногда это приводит к функциям, которые принимают много параметров, 
где одно и то же значение передается снова и снова в длинных цепочках вызовов функций. 
Здесь могут помочь параметры контекста, поскольку они позволяют компилятору синтезировать повторяющиеся аргументы 
вместо того, чтобы каждый раз записывать их явно.

Например, с [экземплярами given intOrd и listOrd](@DOC@abstractions/ca-given) функция `max`, 
которая работает для любых аргументов с возможностью упорядочивания, может быть определена следующим образом:

```scala mdoc:invisible
trait Ord[T]:
  def compare(x: T, y: T): Int
  extension (x: T) def < (y: T) = compare(x, y) < 0
  extension (x: T) def > (y: T) = compare(x, y) > 0

given intOrd: Ord[Int] with
  def compare(x: Int, y: Int) =
    if x < y then -1 else if x > y then +1 else 0

given listOrd[T](using ord: Ord[T]): Ord[List[T]] with

  def compare(xs: List[T], ys: List[T]): Int = (xs, ys) match
    case (Nil, Nil) => 0
    case (Nil, _) => -1
    case (_, Nil) => +1
    case (x :: xs1, y :: ys1) =>
      val fst = ord.compare(x, y)
      if fst != 0 then fst else compare(xs1, ys1)    
```

```scala mdoc:silent
def max[T](x: T, y: T)(using ord: Ord[T]): T =
  if ord.compare(x, y) < 0 then y else x
```

Здесь параметр контекста `ord` вводится с предложением `using`.
Начав секцию параметров с ключевого слова `using`, мы сообщаем компилятору Scala,
что на месте вызова он должен автоматически найти аргумент с правильным типом.
Таким образом, компилятор Scala выполняет вывод терминов (**term inference**).
Функцию `max` можно применить следующим образом:

```scala mdoc
max(2, 3)(using intOrd)
```

Часть `(using intOrd)` передает `intOrd` как аргумент для параметра `ord`. 
Но смысл параметров контекста в том, что этот аргумент также можно опустить (и это обычно так и есть).
Таким образом, следующие выражения валидны:

```scala mdoc
max(2, 3)
max(List(1, 2, 3), Nil)
```

В вызове `max(2, 3)` компилятор Scala видит, что в области действия есть терм типа `Ord[Int]`,
и автоматически предоставит его в `max`.

### Анонимные параметры контекста

Во многих ситуациях нет необходимости явно упоминать имя параметра контекста, 
поскольку оно используется только в синтезированных аргументах для других параметров контекста. 
В этом случае можно не задавать имя параметра и указать только его тип. Например:

```scala mdoc:silent
//                  не нужно придумывать имя параметра
//                          vvvvvvvvvvvv
def maximum[T](xs: List[T])(using Ord[T]): T =
  xs.reduceLeft(max)
```

`maximum` принимает контекстный параметр типа `Ord[T]` только для того, 
чтобы передать его в качестве предполагаемого аргумента в `max`. 
Имя параметра опущено.

```scala mdoc
maximum(List(1, 2, 3))
```

Как правило, параметры контекста могут быть определены 
либо как полный список параметров, `(p_1: T_1, ..., p_n: T_n)`
либо как последовательность типов `T_1, ..., T_n`. 
Параметры Vararg не поддерживаются в `using` предложениях.

##### Явное предоставление контекстных аргументов

Подобно тому, как задается раздел параметров с `using`,
контекстные аргументы можно указать явно с помощью того же `using`:

```scala mdoc
maximum(List(1, 2, 3))(using intOrd)
```

Явное предоставление контекстных параметров может быть полезно,
если в области видимости доступны несколько разных подходящих по типу значений,
и мы хотим убедиться, что в функцию передается правильное значение.

### Параметры контекста класса

Если параметр контекста класса становится элементом путем добавления модификатора `val` или `var`, 
то этот член доступен как экземпляр `given`.

Сравните следующие примеры, в которых попытка указать явный элемент given приводит к двусмысленности:

```scala mdoc:silent
class GivenIntBox(using val givenInt: Int):
  def n = summon[Int]

class GivenIntBox2(using givenInt: Int):
  given Int = givenInt
  //def n = summon[Int] // неопределенность
```

Элемент `given` можно импортировать, как описано в разделе об [импорте givens](@DOC@abstractions/ca-given-imports):

```scala
val b = GivenIntBox(using 23)
import b.given
summon[Int]  // 23

import b.*
//givenInt // Not found
```

### Вывод сложных аргументов

Вот два других метода, которые используют контекстный параметр типа `Ord[T]`:

```scala mdoc:silent
def descending[T](using asc: Ord[T]): Ord[T] = new Ord[T]:
  def compare(x: T, y: T) = asc.compare(y, x)

def minimum[T](xs: List[T])(using Ord[T]) =
  maximum(xs)(using descending)
```

Тело метода `minimum` передает `descending` как явный аргумент в `maximum(xs)`. 
С этой настройкой все следующие вызовы нормализуются так:

```scala mdoc
val xs = List(List(1,2,3), Nil)
minimum(xs)
maximum(xs)(using descending)
maximum(xs)(using descending(using listOrd))
maximum(xs)(using descending(using listOrd(using intOrd)))
```

### Несколько using

В определении может быть несколько using предложений, 
и using предложения можно свободно смешивать с обычными предложениями параметров.
Пример:

```
def f(u: Universe)(using ctx: u.Context)(using s: ctx.Symbol, k: ctx.Kind) = ...
```

В коде несколько using предложений сопоставляются слева направо. 
Пример:

```
object global extends Universe { type Context = ... }
given ctx : global.Context with { type Symbol = ...; type Kind = ... }
given sym : ctx.Symbol
given kind: ctx.Kind
```

Тогда все следующие вызовы действительны (и нормализуются до последнего)

```
f(global)
f(global)(using ctx)
f(global)(using ctx)(using sym, kind)
```

Но `f(global)(using sym, kind)` выдало бы ошибку типа.

### Вызов экземпляров

Метод `summon` в `Predef` возвращает given определенного типа. 
Например, вот как можно вызвать given экземпляр для `Ord[List[Int]]`:

```
summon[Ord[List[Int]]]  // reduces to listOrd(using intOrd)
```

Метод `summon` определяется как (нерасширяющая) функция идентификации по параметру контекста.

```
def summon[T](using x: T): x.type = x
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/ca-given-using-clauses.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/using-clauses.html)
