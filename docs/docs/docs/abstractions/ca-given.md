---
layout: docsplus
title: "Given"
prev: abstractions
next: abstractions/ca-using
---

## Экземпляры given

_Given instances_ (или просто "givens") определяют "канонические" значения определенных типов, 
которые служат для синтеза аргументов [в параметрах контекста](@DOCS_LINK@abstractions/ca-using). 
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
тогда как `listOrd[T]` определяет данные `Ord[List[T]]` для всех типов `T`, 
которые поставляются с `given` экземпляром `Ord[T]`. 
Предложение `using` в `listOrd` определяет условие: 
для существования `given` типа `Ord[List[T]]` должен существовать `given` тип `Ord[T]`. 
Такие условия расширяются компилятором [до параметров контекста](@DOCS_LINK@abstractions/ca-using).

Результат:

```scala mdoc
def sort[T](lists: List[List[T]])(using ord: Ord[List[T]]): List[List[T]] =
  lists.sortWith((l1, l2) => ord.compare(l1, l2) < 0)
sort(List(List(1, 3, 4), List(1, 2), List(1, 2, 3, 4, 5)))
```


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/givens.html)
