---
layout: docsplus
title: "Методы расш. - детали"
section: scala
prev: abstractions/ca-given-imports
next: abstractions/ca-type-classes
---

## Методы расширения

Методы расширения (_extension methods_) позволяют добавлять методы к типу после его определения, 
т.е. позволяют добавлять новые методы в закрытые классы. 
Например, предположим, что кто-то другой создал класс `Circle`:

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

Теперь представим, что необходим метод `circumference`, но нет возможности изменить исходный код `Circle`. 
До того как концепция вывода терминов была введена в языки программирования, 
единственное, что можно было сделать, это написать метод в отдельном классе или объекте, подобном этому:

```scala
object CircleHelpers:
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
```

Затем этот метод можно было использовать следующим образом:

```scala
val aCircle = Circle(2, 3, 5)

CircleHelpers.circumference(aCircle)
```

Методы расширения позволяют создать метод `circumference` для работы с экземплярами `Circle`:

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
```

В этом коде:
- `Circle` — это тип, к которому будет добавлен метод расширения `circumference`
- Синтаксис `c: Circle` позволяет ссылаться на переменную `c` в методах расширения

Затем в коде метод `circumference` можно использовать так же, как если бы он был изначально определен в классе `Circle`:

```scala
aCircle.circumference
```

#### Импорт методов расширения

Представим, что `circumference` определен в пакете `lib` - его можно импортировать с помощью

```scala
import lib.circumference

aCircle.circumference
```

Если импорт отсутствует, то компилятор выводит подробное сообщение об ошибке, 
подсказывая возможный импорт, например так:

```scala
value circumference is not a member of Circle, but could be made available as an extension method.

The following import might fix the problem:

  import lib.circumference
```

### Операторы

Синтаксис метода расширения также можно использовать для определения операторов. Примеры:

```scala
extension (x: String)
  def < (y: String): Boolean = ...
extension (x: Elem)
  def +: (xs: Seq[Elem]): Seq[Elem] = ...
extension (x: Number)
  infix def min (y: Number): Number = ...

"ab" < "c"
1 +: List(2, 3)
x min 3
```

### Generic расширения

Также возможно расширить generic типы, добавив параметры типа в расширение. 
Например:

```scala
extension [T](xs: List[T])
  def second = xs.tail.head

extension [T: Numeric](x: T)
  def + (y: T): T = summon[Numeric[T]].plus(x, y)
```

Параметры типа в расширениях также можно комбинировать с параметрами типа в самих методах:

```
extension [T](xs: List[T])
  def sumBy[U: Numeric](f: T => U): U = ...
```

Аргументы типа, соответствующие параметрам типа метода, передаются стандартно:

```
List("a", "bb", "ccc").sumBy[Int](_.length)
```

Напротив, аргументы типа, соответствующие параметрам типа `extension`, могут быть переданы, 
только если на метод ссылаются как на метод без расширения:

```
sumBy[String](List("a", "bb", "ccc"))(_.length)
```

Или при передаче обоих аргументов типа:

```
sumBy[String](List("a", "bb", "ccc"))[Int](_.length)
```

Расширения также могут принимать предложения `using`. 
Например, приведенное выше расширение `+` можно было бы записать с предложения `using`:

```
extension [T](x: T)(using n: Numeric[T])
  def + (y: T): T = n.plus(x, y)
```

### Коллективные расширения

Ключевое слово `extension` объявляет о намерении определить один или несколько методов расширения для типа,
заключенного в круглые скобки.
Чтобы определить для типа несколько методов расширения, используется следующий синтаксис:

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

Коллективные расширения, подобные этим, являются сокращением для индивидуальных расширений, 
где каждый метод определяется отдельно. 
Например, расширение выше - это:

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2

extension (c: Circle)
  def diameter: Double = c.radius * 2

extension (c: Circle)
  def area: Double = math.Pi * c.radius * c.radius
```

Коллективные расширения также могут принимать параметры типа и содержать предложения `using`. 
Пример:

```
extension [T](xs: List[T])(using Ordering[T])
  def smallest(n: Int): List[T] = xs.sorted.take(n)
  def smallestIndices(n: Int): List[Int] =
    val limit = smallest(n).max
    xs.zipWithIndex.collect { case (x, i) if x <= limit => i }
```

### Вызов методов расширения

Чтобы преобразовать ссылку в метод расширения, компилятор должен знать о методе расширения. 
В этом случае говорится, что метод расширения применим в точке отсчета. 

Существует четыре возможных способа применения метода расширения:
- метод расширения виден под простым именем, 
будучи определенным, унаследованным или импортированным в области, охватывающей ссылку.
- метод расширения является членом некоторого экземпляра `given`, видимого в точке ссылки.
- ссылка имеет форму `r.m`, а метод расширения определен в неявной области видимости типа `r`.
- ссылка имеет форму `r.m`, а метод расширения определен в некотором экземпляре `given` в неявной области видимости типа `r`.

Вот пример первого правила:

```scala mdoc:silent
trait IntOps:
  extension (i: Int) def isZero: Boolean = i == 0

  extension (i: Int) def safeMod(x: Int): Option[Int] =
    // метод расширения, определенный в той же области видимости - IntOps
    if x.isZero then None
    else Some(i % x)

object IntOpsEx extends IntOps:
  extension (i: Int) def safeDiv(x: Int): Option[Int] =
    // метод расширения, введенный в область видимости через наследование от IntOps
    if x.isZero then None
    else Some(i / x)

trait SafeDiv:
  import IntOpsEx.*

  extension (i: Int) def divide(d: Int): Option[(Int, Int)] =
    // методы расширения импортированы и, следовательно, находятся в области видимости
    (i.safeDiv(d), i.safeMod(d)) match
      case (Some(d), Some(r)) => Some((d, r))
      case _ => None
```

Согласно второму правилу, метод расширения можно сделать доступным, 
определив экземпляр `given`, содержащий его, например так:

```scala mdoc:silent
given ops1: IntOps()  // приносит safeMod в область видимости 

1.safeMod(2)
```

По третьему и четвертому правилу метод расширения доступен, 
если он находится в неявной области действия типа получателя или в экземпляре `given` в этой области. 
Пример:

```
class List[T]:
  ...
object List:
  ...
  extension [T](xs: List[List[T]])
    def flatten: List[T] = xs.foldLeft(List.empty[T])(_ ++ _)

  given [T: Ordering]: Ordering[List[T]] with
    extension (xs: List[T])
      def < (ys: List[T]): Boolean = ...
end List

// метод расширения доступен, поскольку он находится в неявной области видимости List[List[Int]]
List(List(1, 2), List(3, 4)).flatten

// метод расширения доступен, поскольку он находится в given Ordering[List[T]], 
// который сам находится в неявной области видимости List[Int]
List(1, 2) < List(3)
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/ca-extension-methods.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/extension-methods.html)
