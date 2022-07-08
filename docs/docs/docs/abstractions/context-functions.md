---
layout: docsplus
title: "Контекстные функции"
section: scala
prev: abstractions/ca-multiversal-equality
next: abstractions/ca-implicit-conversions
---

## {{page.title}}

_Контекстные функции_ — это функции с параметрами контекста. 
Их типы являются типами контекстных функций. 
Вот пример подобного типа:

```scala
type Executable[T] = ExecutionContext ?=> T
```

Контекстные функции записываются с использованием `?=>` знака "стрелка". 
Они применяются к синтезированным аргументам точно так же, как применяются методы с контекстными параметрами. 
Например:

```scala
given ec: ExecutionContext = ...

  def f(x: Int): ExecutionContext ?=> Int = ...

  // можно было бы написать следующим образом с псевдонимом типа выше
  // def f(x: Int): Executable[Int] = ...

  f(2)(using ec)   // явный аргумент
  f(2)             // выводимый аргумент
```

И наоборот, если ожидаемый тип выражения `E` является типом контекстной функции `(T_1, ..., T_n) ?=> U` 
и `E` не является литералом контекстной функции, 
`E` преобразуется в литерал контекстной функции путем перезаписи его в

```scala
(x_1: T1, ..., x_n: Tn) ?=> E
```

где имена `x_1, ..., x_n` произвольны. 
Это расширение выполняется перед проверкой типа выражения `E`, 
что означает, что `x_1, ..., x_n` доступны как данные в `E`.

Как и их типы, литералы контекстных функций записываются 
с использованием `?=>` стрелки между параметрами и результатами. 
Они отличаются от обычных литералов функций тем, что их типы являются типами контекстной функций.

Например, продолжая предыдущие определения,

```scala
def g(arg: Executable[Int]) = ...

  g(22)      // расширяется до g((ev: ExecutionContext) ?=> 22)

  g(f(2))    // расширяется до g((ev: ExecutionContext) ?=> f(2)(using ev))

  g((ctx: ExecutionContext) ?=> f(3))  // расширяется до g((ctx: ExecutionContext) ?=> f(3)(using ctx))
  g((ctx: ExecutionContext) ?=> f(3)(using ctx)) // осталось как есть
```

#### Пример: шаблон построителя

Типы контекстных функций обладают значительной выразительной силой. 
Например, вот как они могут поддерживать "шаблон построителя", 
целью которого является создание таких таблиц:

```
table {
  row {
    cell("top left")
    cell("top right")
  }
  row {
    cell("bottom left")
    cell("bottom right")
  }
}
```

Идея состоит в том, чтобы определить классы для `Table` и `Row`, которые позволяют добавлять элементы через `add`:

```scala
class Table:
    val rows = new ArrayBuffer[Row]
    def add(r: Row): Unit = rows += r
    override def toString = rows.mkString("Table(", ", ", ")")

  class Row:
    val cells = new ArrayBuffer[Cell]
    def add(c: Cell): Unit = cells += c
    override def toString = cells.mkString("Row(", ", ", ")")

  case class Cell(elem: String)
```

Затем можно определить методы конструктора `table`, `row` и `cell` с типами контекстных функций в качестве параметров.

```scala
def table(init: Table ?=> Unit) =
    given t: Table = Table()
    init
    t

  def row(init: Row ?=> Unit)(using t: Table) =
     given r: Row = Row()
     init
     t.add(r)

  def cell(str: String)(using r: Row) =
     r.add(new Cell(str))
```

При такой настройке приведенный выше код построения таблицы компилируется и расширяется до:

```scala
table { ($t: Table) ?=>

    row { ($r: Row) ?=>
      cell("top left")(using $r)
      cell("top right")(using $r)
    }(using $t)

    row { ($r: Row) ?=>
      cell("bottom left")(using $r)
      cell("bottom right")(using $r)
    }(using $t)
  }
```

#### Пример пост-условия

В качестве более крупного примера, 
вот способ определения конструкций для проверки произвольных постусловий с использованием метода расширения `ensuring`, 
чтобы на проверенный результат можно было ссылаться просто с помощью `result`. 
В примере сочетаются непрозрачные псевдонимы типов, типы контекстных функций и методы расширения, 
чтобы обеспечить абстракцию с нулевыми издержками.

```scala mdoc
object PostConditions:
  opaque type WrappedResult[T] = T

  def result[T](using r: WrappedResult[T]): T = r

  extension [T](x: T)
    def ensuring(condition: WrappedResult[T] ?=> Boolean): T =
      assert(condition(using x))
      x
end PostConditions
import PostConditions.{ensuring, result}

val s = List(1, 2, 3).sum.ensuring(result == 6)
```

Пояснения: тип контекстной функции `WrappedResult[T] ?=> Boolean` используется в качестве типа условия `ensuring`. 
Таким образом, аргумент для `ensuring` такой, как `(result == 6)` 
будет иметь заданный тип `WrappedResult[T]` в области видимости для передачи методу `result`. 
`WrappedResult` является новым типом, чтобы убедиться, 
что мы не получаем нежелательных данных в области видимости 
(это хорошая практика во всех случаях, когда задействованы параметры контекста). 
Поскольку `WrappedResult` - это псевдоним opaque типа, его значения не нужно упаковывать, 
а поскольку `ensuring` добавляется как метод расширения, его аргумент также не нуждается в упаковывании. 
Следовательно, реализация `ensuring` близка по эффективности к наилучшему коду, 
который можно было бы написать вручную:

```scala
val s =
  val result = List(1, 2, 3).sum
  assert(result == 6)
  result
```


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/context-functions.html)
