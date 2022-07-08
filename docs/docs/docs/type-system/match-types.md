---
layout: docsplus
title: "Match Types"
section: scala
prev: type-system/type-lambdas
next: type-system/polymorphic-function-types
---

## Типы match

Тип match сводится к одной из его правых частей, в зависимости от проверяемого типа. 
Например:

```
type Elem[X] = X match
  case String => Char
  case Array[t] => t
  case Iterable[t] => t
```

Матчинг определяет тип, который сокращается следующим образом:

```
Elem[String]       =:=  Char
Elem[Array[Int]]   =:=  Int
Elem[List[Float]]  =:=  Float
Elem[Nil.type]     =:=  Nothing
```

Здесь под `=:=` подразумевается, что левая и правая стороны являются взаимными подтипами друг друга.

В общем случае тип match имеет вид:

```
S match { P1 => T1 ... Pn => Tn }
```

где `S, T1, ..., Tn` - типы, а `P1, ..., Pn` - шаблоны типов. 
Переменные типа в шаблонах, как обычно, начинаются со строчной буквы.

Типы match могут составлять часть определений рекурсивных типов. 
Пример:

```scala mdoc:silent
type LeafElem[X] = X match
  case String => Char
  case Array[t] => LeafElem[t]
  case Iterable[t] => LeafElem[t]
  case AnyVal => X
```

Определения рекурсивного типа match также могут иметь верхнюю границу, например:

```
type Concat[Xs <: Tuple, +Ys <: Tuple] <: Tuple = Xs match
  case EmptyTuple => Ys
  case x *: xs => x *: Concat[xs, Ys]
```

В этом определении известно, что каждый экземпляр `Concat[A, B]`, редуцированный или нет, является подтипом `Tuple`. 
Это необходимо для проверки типа рекурсивного вызова `x *: Concat[xs, Ys]`, 
поскольку `*:` требует в качестве правого операнда `Tuple`.

#### Зависимая типизация

Типы match можно использовать для определения методов с зависимыми типами. 
Например:

```scala mdoc:silent
def leafElem[X](x: X): LeafElem[X] = x match
  case x: String      => x.charAt(0)
  case x: Array[t]    => leafElem(x(0))
  case x: Iterable[t] => leafElem(x.head)
  case x: AnyVal      => x
```

Результат:

```scala mdoc
leafElem(Array(List("abc")))
```

Этот специальный режим ввода выражений match используется только при выполнении следующих условий:
- шаблоны выражений match не имеют условий (guards)
- тип проверяемого выражения match является подтипом типа match
- выражение match и тип match имеют одинаковое количество cases
- все шаблоны выражений match являются типизированными шаблонами, 
и эти типы относятся к соответствующим шаблонам типов как `=:=`.

#### Termination

Определения типов match могут быть рекурсивными, 
а это означает, что при сокращении типов match можно попасть в бесконечный цикл.

Поскольку редукция связана с созданием подтипов, есть механизм обнаружения циклов. 
В результате следующее выдаст разумное сообщение об ошибке:

```
type L[X] = X match
  case Int => L[X]

def g[X]: L[X] = ???
```

```
|  val x: Int = g[Int]
|                  ^
|  Recursion limit exceeded.
|  Maybe there is an illegal cyclic reference?
|  If that's not the case, you could also try to
|  increase the stacksize using the -Xss JVM option.
|  A recurring operation is (inner to outer):
|  
|    subtype LazyRef(Test.L[Int]) <:< Int
```

Внутри компилятор Scala обнаруживает такие циклы, превращая выбранные переполнения стека в ошибки типов. 
Если во время создания подтипа происходит переполнение стека, 
исключение будет перехвачено и преобразовано в ошибку времени компиляции, 
указывающую на трассировку тестов подтипа, вызвавшую переполнение, без отображения полной трассировки стека.

#### Match Types Variance

Все позиции типа в типе match (проверяемые, шаблоны, тела) считаются инвариантными.


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/new-types/match-types.html)
