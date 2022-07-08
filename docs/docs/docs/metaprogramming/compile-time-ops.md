---
layout: docsplus
title: "Compile-time ops"
section: scala
prev: metaprogramming/inline
next: metaprogramming/macros
---

## Операции во время компиляции

### Пакет scala.compiletime

Пакет [scala.compiletime](https://scala-lang.org/api/3.x/scala/compiletime.html) 
содержит операции метапрограммирования, которые можно использовать внутри `inline` метода. 
Эти операции охватывают некоторые распространенные случаи использования макросов без необходимости определения макроса.

### Reporting

Метод `error` используется для создания определяемых пользователем ошибок компиляции во время встроенного расширения.
Он имеет следующую подпись:

```scala
inline def error(inline msg: String): Nothing
```

Если встроенное расширение приводит к вызову `error(msgStr)`,
компилятор выдает сообщение об ошибке, содержащее заданный `msgStr`.

```scala mdoc:silent
import scala.compiletime.error

inline def doSomething(inline mode: Boolean): Unit =
  if mode then println("true")
  else if !mode then println("false")
  else error("Mode must be a known value")
```

```scala mdoc
doSomething(true)
doSomething(false)
```

```scala mdoc:fail
val bool: Boolean = true
doSomething(bool)
```

Если `error` вызывается вне `inline` метода, при компиляции этого вызова будет выдаваться ошибка.
Если `error` написан внутри `inline` метода, ошибка будет выдаваться только в том случае,
если после встраивания вызова он не будет удален как часть мертвой ветки.
В предыдущем примере, если бы значение `mode` было известно во время компиляции,
сохранена была бы только одна из первых двух ветвей и ошибки компиляции не было бы.

Если желательно включить часть исходного кода аргументов в сообщение об ошибке,
можно использовать метод `codeOf`.

```scala
import scala.compiletime.{codeOf, error}

inline def doSomething(inline mode: Boolean): Unit =
  if mode then println("true")
  else if !mode then println("false")
  else error("Mode must be a known value but got: " + codeOf(mode))

val bool: Boolean = true
doSomething(bool)
  |doSomething(bool)
  |^^^^^^^^^^^^^^^^^
  |Mode must be a known value but got: bool
```


### Выборочный вызов имплицитов (Summoning)

#### summonFrom

Предполагается, что многие области программирования на уровне типов
могут выполняться с помощью методов перезаписи вместо implicits.
Но иногда implicits неизбежны.
До сих пор проблема заключалась в том, что стиль программирования неявного поиска,
подобный Prolog, становится вирусным:
как только некоторая конструкция зависит от неявного поиска,
она сама должна быть написана как логическая программа.
Рассмотрим, например, проблему создания `TreeSet[T]` или `HashSet[T]` в зависимости от того,
имеет ли тип `T` `Ordering` или нет.
Мы можем создать набор неявных определений следующим образом:

```scala
trait SetFor[T, S <: Set[T]]

class LowPriority:
  implicit def hashSetFor[T]: SetFor[T, HashSet[T]] = ...

object SetsFor extends LowPriority:
  implicit def treeSetFor[T: Ordering]: SetFor[T, TreeSet[T]] = ...
```

Понятно, что это некрасиво.
Помимо всей обычной косвенности неявного поиска, мы сталкиваемся с проблемой определения приоритетов правил,
когда мы должны гарантировать, что `treeSetFor` имеет приоритет над `hashSetFor`, если тип элемента имеет `Ordering`.
Это решается (неуклюже) путем добавления `hashSetFor` в суперкласс `LowPriority` объекта `SetsFor`,
где определен `treeSetFor`.
Возможно, шаблон все еще был бы приемлем, если бы можно было сдержать грубый код.
Однако, это не так.
Каждый пользователь абстракции должен быть параметризован с помощью имплицитного `SetFor`.
Принимая во внимание простую задачу "Я хочу `TreeSet[T]`, если `T` можно упорядочить, иначе — `HashSet[T]`",
это кажется слишком церемонным.

Есть некоторые предложения по улучшению ситуации в конкретных областях,
например, путем разрешения более сложных схем определения приоритетов.
Но все они сохраняют вирусный характер программ неявного поиска, основанных на логическом программировании.

Напротив, новая конструкция `summonFrom` делает неявный поиск доступным в функциональном контексте.
Чтобы решить проблему создания правильного набора, можно было бы использовать его следующим образом:

```scala
import scala.compiletime.summonFrom

inline def setFor[T]: Set[T] = summonFrom {
  case ord: Ordering[T] => new TreeSet[T]()(using ord)
  case _                => new HashSet[T]
}
```

Вызов `summonFrom` принимает pattern matching в качестве аргумента.
Все паттерны в замыкании являются атрибуциями типа формы `identifier : Type`.

Паттерны примеряются последовательно.
Выбирается первый паттерн `x: T`, при котором может быть вызвано неявное значение типа `T`.

В качестве альтернативы можно также использовать `given` экземпляр с привязкой к шаблону,
что позволяет избежать явного предложения `using`.
Например, `setFor` можно было бы также сформулировать следующим образом:

```scala
import scala.compiletime.summonFrom

inline def setFor[T]: Set[T] = summonFrom {
  case given Ordering[T] => new TreeSet[T]
  case _                 => new HashSet[T]
}
```

`summonFrom` приложения должны быть уменьшены во время компиляции.

Следовательно, если мы вызовем `Ordering[String]`, то вернется новый экземпляр `TreeSet[String]`.

```scala
summon[Ordering[String]]

println(setFor[String].getClass) // prints class scala.collection.immutable.TreeSet
```

Отметим, приложения `summonFrom` могут вызывать _ambiguity errors_.
Рассмотрим следующий код с двумя `given` в области видимости типа `A`.
Совпадение с шаблоном `f` вызовет ошибку неоднозначности `f`.

```scala
class A
given a1: A = new A
given a2: A = new A

inline def f: Any = summonFrom {
  case given _: A => ???  // error: ambiguous givens
}
```

#### summonInline

Сокращение `summonInline` обеспечивает простой способ написать `summon`,
который откладывается до тех пор, пока вызов не будет встроен.
В отличие от `summonFrom`, `summonInline` также выдает ошибку неявного отсутствия (_implicit-not-found error_),
если данный экземпляр вызываемого типа не найден.

```scala
import scala.compiletime.summonInline
import scala.annotation.implicitNotFound

@implicitNotFound("Missing One")
trait Missing1

@implicitNotFound("Missing Two")
trait Missing2

trait NotMissing
given NotMissing = ???

transparent inline def summonInlineCheck[T <: Int](inline t : T) : Any =
  inline t match
    case 1 => summonInline[Missing1]
    case 2 => summonInline[Missing2]
    case _ => summonInline[NotMissing]

val missing1 = summonInlineCheck(1) // error: Missing One
val missing2 = summonInlineCheck(2) // error: Missing Two
val notMissing : NotMissing = summonInlineCheck(3)
```


### Values

#### constValue и constValueOpt

`constValue` - это функция, которая производит постоянное значение, представленное типом.

```scala
import scala.compiletime.constValue
import scala.compiletime.ops.int.S

transparent inline def toIntC[N]: Int =
  inline constValue[N] match
    case 0        => 0
    case _: S[n1] => 1 + toIntC[n1]

inline val ctwo = toIntC[2]
```

`constValueOpt` - то же самое, что и `constValue`, но возвращает `Option[T]`, 
что позволяет обрабатывать ситуации, когда значение отсутствует. 
Обратите внимание, что `S` - это тип преемника некоторого одноэлементного типа. 
Например, `S[1]` - это одноэлементный тип `2`.


### Inline Matching

#### erasedValue

До сих пор были показаны встроенные (`inline`) методы, 
которые принимают термины (кортежи и целые числа) в качестве параметров. 
Что, если вместо этого необходимо основывать различия на типах? 
Например, хотелось бы иметь возможность написать функцию `defaultValue`, 
которая для заданного типа `T` возвращает `Option` значение по умолчанию для `T`, если оно существует. 
Можно выразить это, используя переписывающие выражения соответствия 
и простую вспомогательную функцию `scala.compiletime.erasedValue`, которая определяется следующим образом:

```scala
def erasedValue[T]: T
```

Функция `erasedValue` _делает вид_, что возвращает значение аргумента типа `T`. 
Вызов этой функции всегда будет приводить к ошибке времени компиляции, 
если вызов не будет удален из кода при встраивании.

Используя `erasedValue`, можно определить `defaultValue` следующим образом:

```scala mdoc:silent
import scala.compiletime.erasedValue

transparent inline def defaultValue[T] =
  inline erasedValue[T] match
    case _: Byte    => Some(0: Byte)
    case _: Char    => Some(0: Char)
    case _: Short   => Some(0: Short)
    case _: Int     => Some(0)
    case _: Long    => Some(0L)
    case _: Float   => Some(0.0f)
    case _: Double  => Some(0.0d)
    case _: Boolean => Some(false)
    case _: Unit    => Some(())
    case _          => None
```

Затем:

```scala mdoc
val dInt: Some[Int] = defaultValue[Int]
val dDouble: Some[Double] = defaultValue[Double]
val dBoolean: Some[Boolean] = defaultValue[Boolean]
val dAny: None.type = defaultValue[Any]
```

В качестве другого примера рассмотрим приведенную ниже версию на уровне типов `toInt`: 
для заданного типа, представляющего число Пеано, вернуть соответствующее ему целочисленное значение. 
Рассмотрим определения чисел, как в разделе ["inline match"](@DOC@metaprogramming/inline#встроенные-match). 
Вот как можно определить `toIntT`:

```scala
transparent inline def toIntT[N <: Nat]: Int =
  inline scala.compiletime.erasedValue[N] match
    case _: Zero.type => 0
    case _: Succ[n] => toIntT[n] + 1

inline val two = toIntT[Succ[Succ[Zero.type]]]
```

`erasedValue` - это `erased` метод, поэтому его нельзя использовать и он не имеет поведения во время выполнения. 
Поскольку `toIntT` выполняет статические проверки статического типа `N`, 
его можно безопасно использовать для тщательного изучения возвращаемого типа (в данном случае - `S[S[Z]]`).


### Операции (scala.compiletime.ops)

Пакет [scala.compiletime.ops](https://scala-lang.org/api/3.x/scala/compiletime/ops.html) 
содержит типы, обеспечивающие поддержку примитивных операций над одноэлементными типами. 
Например, `scala.compiletime.ops.int.*` обеспечивает поддержку умножения двух одноэлементных типов `Int`, 
`scala.compiletime.ops.boolean.&&` - объединения двух `Boolean` типов.
Когда все аргументы типа `scala.compiletime.ops` являются одноэлементными типами, 
компилятор может оценить результат операции.

```scala
import scala.compiletime.ops.int.*
import scala.compiletime.ops.boolean.*

val conjunction: true && true = true
val multiplication: 3 * 5 = 15
```

Многие из этих одноэлементных операций предназначены для использования в инфиксе 
(как в [SLS §3.2.10](https://www.scala-lang.org/files/archive/spec/2.13/03-types.html#infix-types)).

Поскольку псевдонимы типов имеют те же правила приоритета, что и их эквиваленты на уровне терминов, 
операции составляются с ожидаемыми правилами приоритета:

```scala
import scala.compiletime.ops.int.*
val x: 1 + 2 * 3 = 7
```

Типы операций расположены в пакетах, названных по типу левого параметра: 
например, `scala.compiletime.ops.int.+` представляет собой сложение двух чисел, 
а `scala.compiletime.ops.string.+` представляет собой конкатенацию строк. 
Чтобы использовать оба типа и отличить их друг от друга, 
тип соответствия может отправляться в правильную реализацию:

```scala
import scala.compiletime.ops.*

type +[X <: Int | String, Y <: Int | String] = (X, Y) match
  case (Int, Int) => int.+[X, Y]
  case (String, String) => string.+[X, Y]

val concat: "a" + "b" = "ab"
val addition: 1 + 1 = 2
```


### Детали

Дополнительная информация об операциях во время компиляции:
- [PR #4768](https://github.com/lampepfl/dotty/pull/4768), 
- [PR #7201](https://github.com/lampepfl/dotty/pull/7201).


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/metaprogramming/compiletime-ops.html)
- [Scala 3 Guide](https://docs.scala-lang.org/scala3/guides/macros/compiletime.html)
