---
layout: docsplus
title: "Алгебр. типы данных"
section: scala
prev: type-system/types-union
next: type-system/types-variance
---

## Алгебраические типы данных (ADT)

Алгебраические типы данных (_ADT_) могут быть созданы с помощью [конструкции `enum`](@DOC@modeling/enums).

Концепция `enum` является достаточно общей, чтобы также поддерживать алгебраические типы данных (_ADT_) 
и их обобщенную версию (_GADT_). 
Вот пример, показывающий, как тип `Option` может быть представлен в виде _ADT_:

```scala
enum Option[+T]:
  case Some(x: T)
  case None
```

В этом примере создается `Option` `enum` с параметром ковариантного типа `T`, 
состоящим из двух вариантов: `Some` и `None`.
`Some` параметризуются параметром значения `x`; это сокращение для написания case класса, который расширяет `Option`. 
Поскольку `None` не параметризован, он обрабатывается как обычное значение `enum`.

Предложения `extends`, которые были опущены в предыдущем примере, также могут быть указаны явно:

```scala mdoc:silent
enum Option[+T]:
  case Some(x: T) extends Option[T]
  case None       extends Option[Nothing]
```

Как и в случае с обычными значениями `enum`, `case` `enum` определяются в сопутствующем объекте перечисления, 
поэтому они называются `Option.Some` и `Option.None` (если только определения не "вытягиваются" при импорте):

```scala mdoc
Option.Some("hello")
Option.None
```

Обратите внимание, что тип приведенных выше выражений всегда `Option`. 
Как правило, тип case enum будет расширен до базового типа enum, если не ожидается более конкретный тип. 
Это тонкая разница по сравнению с обычными case class-ами. 
Классы, составляющие case enum, существуют, и их можно использовать, 
либо создав их непосредственно с помощью `new`, либо явно указав ожидаемый тип.

```scala mdoc
new Option.Some(2)
val x: Option.Some[Int] = Option.Some(3)
```

Как и в других случаях использования перечисления, 
АТД могут определять дополнительные методы. 
Например, вот снова `Option` с методом `isDefined` и конструктором `Option(...)` в сопутствующем объекте:

```scala
enum Option[+T]:
  case Some(x: T)
  case None

  def isDefined: Boolean = this match
    case None => false
    case Some(_) => true

object Option:
  def apply[T >: Null](x: T): Option[T] =
    if (x == null) None else Some(x)
```

Перечисления и _ADT_ используют одну и ту же синтаксическую конструкцию, 
поэтому их можно рассматривать просто как два конца спектра, и вполне возможно создавать гибриды. 
Например, приведенный ниже код дает реализацию `Color` либо с тремя значениями перечисления, 
либо с параметризованным case, который принимает значение RGB:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
  case Mix(mix: Int) extends Color(mix)
```

##### Рекурсивные перечисления

До сих пор все перечисления состояли только из различных вариантов значений или case class-ов.
Перечисления также могут быть рекурсивными, как показано в приведенном ниже примере кодирования натуральных чисел:

```scala
enum Nat:
  case Zero
  case Succ(n: Nat)
```

Например, значение `Succ(Succ(Zero))` представляет число `2` в унарной кодировке.
Очень похожим образом могут быть определены списки:

```scala
enum List[+A]:
  case Nil
  case Cons(head: A, tail: List[A])
```

### Обобщенные алгебраические типы данных (GADT)

Приведенная выше нотация для перечислений очень лаконична
и служит идеальной отправной точкой для моделирования типов данных.
Также возможно выразить гораздо более мощные типы: обобщенные алгебраические типы данных (GADTs).

Вот пример GADT, где параметр типа (`T`) определяет содержимое, хранящееся в поле:

```scala
enum Box[T](contents: T):
  case IntBox(n: Int) extends Box[Int](n)
  case BoolBox(b: Boolean) extends Box[Boolean](b)
```

Сопоставление с шаблоном в конкретном конструкторе (`IntBox` или `BoolBox`) восстанавливает информацию о типе:

```scala
def extract[T](b: Box[T]): T = b match
  case IntBox(n)  => n + 1
  case BoolBox(b) => !b
```

Безопасно возвращать `Int` только в первом случае, 
так как из сопоставления с шаблоном известно, что `b` был `IntBox`.

### Дешугаризация перечислений

Концептуально перечисления можно рассматривать как определение `sealed` класса вместе с сопутствующим объектом. 
Посмотрим на дешугаризацию перечисления `Color`:

```scala
sealed abstract class Color(val rgb: Int) extends scala.reflect.Enum
object Color:
  case object Red extends Color(0xFF0000) { def ordinal = 0 }
  case object Green extends Color(0x00FF00) { def ordinal = 1 }
  case object Blue extends Color(0x0000FF) { def ordinal = 2 }
  case class Mix(mix: Int) extends Color(mix) { def ordinal = 3 }

  def fromOrdinal(ordinal: Int): Color = ordinal match
    case 0 => Red
    case 1 => Green
    case 2 => Blue
    case _ => throw new NoSuchElementException(ordinal.toString)
```

Вышеописанная дешугаризация упрощена, 
[детали доступны по ссылке](https://docs.scala-lang.org/scala3/reference/enums/desugarEnums.html).

Хотя перечисления можно кодировать вручную с помощью других конструкций, 
использование `enum` является более кратким, 
а также включает несколько дополнительных утилит (таких как метод `fromOrdinal`).


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-adts-gadts.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/enums/adts.html)
