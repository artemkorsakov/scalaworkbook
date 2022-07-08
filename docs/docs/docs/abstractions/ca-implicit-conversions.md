---
layout: docsplus
title: "Неявные преобр."
section: scala
prev: abstractions/context-functions
next: abstractions/ca-by-name-parameters
---

## Неявные преобразования типов

Неявные преобразования определяются экземплярами `given` класса `scala.Conversion`.
Этот класс определен в пакете `scala` следующим образом:

```scala
abstract class Conversion[-T, +U] extends (T => U):
  def apply (x: T): U
```

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

Неявное преобразование автоматически применяется компилятором в трех случаях:
1. Если выражение `e` имеет тип `T` и `T` не соответствует ожидаемому типу выражения `S`. 
2. В выборе `e.m` с `e` типа `T`, но `T` не определяет член `m`. 
3. В приложении `e.m(args)` с `e` типа `T`, если `T` определяет некоторые элементы с именем `m`, 
но ни один из этих членов не может быть применен к аргументам `args`.

В первом случае компилятор ищет given экземпляр `scala.Conversion`, который сопоставляет аргумент типа `T` с типом `S`. 
Во втором и третьем случаях он ищет given экземпляр `scala.Conversion`, 
который сопоставляет аргумент типа `T` с типом, определяющим член `m`, 
к которому можно применить `args`, если они присутствуют. 
Если такой экземпляр `C` найден, выражение `e` заменяется на `C.apply(e)`.

### Примеры

1) Пакет `Predef` содержит преобразования «автоматического упаковывания», 
которые сопоставляют примитивные числовые типы с подклассами `java.lang.Number`. 
Например, преобразование из `Int` в `java.lang.Integer` можно определить следующим образом:

```scala
given int2Integer: Conversion[Int, java.lang.Integer] =
  java.lang.Integer.valueOf(_)
```

2) Паттерн "magnet" иногда используется для выражения нескольких вариантов метода. 
Вместо того чтобы определять перегруженные версии метода, 
можно также позволить ему принимать один или несколько аргументов специально определенных "магнитных" типов, 
в которые могут быть преобразованы различные типы аргументов. 
Пример:

```scala
object Completions:

  // The argument "magnet" type
  enum CompletionArg:
    case Error(s: String)
    case Response(f: Future[HttpResponse])
    case Status(code: Future[StatusCode])

  object CompletionArg:

    // conversions defining the possible arguments to pass to `complete`
    // these always come with CompletionArg
    // They can be invoked explicitly, e.g.
    //
    //   CompletionArg.fromStatusCode(statusCode)

    given fromString    : Conversion[String, CompletionArg]               = Error(_)
    given fromFuture    : Conversion[Future[HttpResponse], CompletionArg] = Response(_)
    given fromStatusCode: Conversion[Future[StatusCode], CompletionArg]   = Status(_)
  end CompletionArg
  import CompletionArg.*

  def complete[T](arg: CompletionArg) = arg match
    case Error(s) => ...
    case Response(f) => ...
    case Status(code) => ...

end Completions
```

Эта конструкция сложнее, чем простая перегрузка `complete`, 
но все же может быть полезна, если обычная перегрузка недоступна 
(как в случае выше, поскольку у нас не может быть двух перегруженных методов, принимающих аргументы `Future[...]`), 
или если обычная перегрузка привела бы к комбинаторному взрыву вариантов.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/ca-implicit-conversions.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/conversions.html)
