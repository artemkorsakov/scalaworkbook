---
layout: docsplus
title: "Given"
section: scala
prev: abstractions
next: abstractions/ca-using
---

## Экземпляры given

_Given instances_ (или просто "givens") определяют "канонические" значения определенных типов, 
которые служат для синтеза аргументов [в параметрах контекста](@DOC@abstractions/ca-using). 
Пример:

```scala mdoc:silent
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

Этот код определяет трейт `Ord` с двумя экземплярами `given`. 
`intOrd` определяет `given` для типа `Ord[Int]`, 
тогда как `listOrd[T]` определяет `given` `Ord[List[T]]` для всех типов `T`, 
которые поставляются с `given` экземпляром `Ord[T]`. 
Предложение `using` в `listOrd` определяет условие: 
для существования `given` типа `Ord[List[T]]` должен существовать `given` тип `Ord[T]`. 
Такие условия расширяются компилятором [до параметров контекста](@DOC@abstractions/ca-using).

Результат:

```scala mdoc
def sort[T](lists: List[List[T]])(using ord: Ord[List[T]]): List[List[T]] =
  lists.sortWith((l1, l2) => ord.compare(l1, l2) < 0)
sort(List(List(1, 3, 4), List(1, 2), List(1, 2, 3, 4, 5)))
```

### Анонимные givens

Имя `given` может быть опущено. 
Таким образом, определения выше также могут быть выражены следующим образом:

```scala
given Ord[Int] with
  ...
given [T](using Ord[T]): Ord[List[T]] with
  ...
```

Если имя `given` отсутствует, компилятор синтезирует его из реализованного типа (типов).

> Имя, синтезированное компилятором, выбирается читабельным и достаточно кратким. 
> Например, два приведенных выше экземпляра получат имена: `given_Ord_Int` и `given_Ord_List`.
> Точные правила синтеза имен находятся [здесь](https://docs.scala-lang.org/scala3/reference/contextual/relationship-implicits.html#anonymous-given-instances). 
> Эти правила не гарантируют отсутствия конфликтов имен между экземплярами типов `given`, которые "слишком похожи". 
> Чтобы избежать конфликтов, можно использовать именованные экземпляры.

> Для обеспечения надежной двоичной совместимости 
> общедоступным библиотекам следует отдавать предпочтение именованным экземплярам.

### Псевдоним given

Псевдоним можно использовать для определения экземпляра `given`, равного некоторому выражению. 
Пример:

```scala
given global: ExecutionContext = ForkJoinPool()
```

Это создает given `global` типа `ExecutionContext`, который равен правой части `ForkJoinPool()`. 
При первом запросе к `global` создается новый `ForkJoinPool`, 
который затем возвращается для всех обращений к `global`. 
Эта операция является потокобезопасной.

Псевдоним также может быть анонимным, например:

```scala
given Position = enclosingTree.position
given (using config: Config): Factory = MemoizingFactory(config)
```

Псевдоним given может иметь параметры типа и параметры контекста, как и любой другой given, 
но он может реализовывать только один тип.

### Given макросы

Псевдонимы given могут иметь [модификаторы `inline` и `transparent`](@DOC@metaprogramming/inline).
Пример:

```scala
transparent inline given mkAnnotations[A, T]: Annotations[A, T] = ${
  // code producing a value of a subtype of Annotations
}
```

Так как `mkAnnotations` - `transparent`, тип приложения — это тип его правой части, 
которая может быть правильным подтипом объявленного типа результата `Annotations[A, T]`.

Экземпляры `given` могут иметь модификаторы `inline`, но не иметь `transparent`, 
так как их тип уже известен из подписи. 
Пример:

```scala
trait Show[T] {
  inline def show(x: T): String
}

inline given Show[Foo] with {
  /*transparent*/ inline def show(x: Foo): String = ${ ... }
}

def app =
  // inlines `show` method call and removes the call to `given Show[Foo]`
  summon[Show[Foo]].show(foo)
```

Обратите внимание, что встроенные методы в экземплярах `given` могут быть `transparent`.

Встраивание экземпляров `given` не будет встраивать/дублировать реализацию `given`, 
оно просто дополнит создание экземпляра. 
Это используется для устранения мертвого кода экземпляров `given`, которые не используются после встраивания.

### Привязанные к шаблону экземпляры given

Экземпляры `given` также могут появляться в шаблонах. Пример:

```scala
for given Context <- applicationContexts do

pair match
  case (ctx @ given Context, y) => ...
```

В первом фрагменте анонимные экземпляры `given` для класса `Context` 
устанавливаются путем перечисления `applicationContexts`. 
Во втором фрагменте `given` экземпляр `Context` с именем `ctx` 
устанавливается путем сопоставления с первой половиной селектора `pair`.

В каждом случае экземпляр `given`, привязанный к шаблону, состоит из `given` и типа `T`. 
Шаблон соответствует точно тем же селекторам, что и шаблон приписывания типа `_: T`.

### Отрицательные given

Специальный тип `scala.util.NotGiven` реализует "отрицательный" поиск в неявном расширении.

Для любого типа запроса `Q`, `NotGiven[Q]` выполняется успешно тогда и только тогда, 
когда неявный поиск `Q` терпит неудачу, например:

```scala mdoc:silent
import scala.util.NotGiven

trait Tagged[A]

case class Foo[A](value: String)
object Foo:
  given fooTagged[A](using Tagged[A]): Foo[A] = Foo("fooTagged is found")
  given fooNotTagged[A](using NotGiven[Tagged[A]]): Foo[A] = Foo("fooNotTagged is found")

given Tagged[Int]()
```

```scala mdoc
summon[Foo[Int]].value
summon[Foo[String]].value
```


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/givens.html)
