---
layout: docsplus
title: "Зависимые типы функций"
section: scala
prev: type-system/types-structural
next: type-system/type-lambdas
---

## {{page.title}}

Зависимый тип функции (_dependent function type_) описывает типы функций, 
где тип результата может зависеть от значений параметров функции. 
Концепция зависимых типов и типов зависимых функций является более продвинутой, 
и обычно с ней сталкиваются только при разработке собственных библиотек или использовании расширенных библиотек.

### Зависимые типы методов

Рассмотрим следующий пример гетерогенной базы данных, в которой могут храниться значения разных типов. 
Ключ содержит информацию о типе соответствующего значения:

```scala
trait Key { type Value }

trait DB {
  def get(k: Key): Option[k.Value] // зависимый метод
}
```

Получив ключ, метод `get` предоставляет доступ к карте и потенциально возвращает сохраненное значение типа `k.Value`. 
Мы можем прочитать этот _path-dependent type_ как: 
"в зависимости от конкретного типа аргумента `k` возвращается соответствующее значение".

Например, у нас могут быть следующие ключи:

```scala
object Name extends Key { type Value = String }
object Age extends Key { type Value = Int }
```

Вызовы метода `get` теперь будут возвращать такие типы:

```scala
val db: DB = ...
val res1: Option[String] = db.get(Name)
val res2: Option[Int] = db.get(Age)
```

Вызов метода `db.get(Name)` возвращает значение типа `Option[String]`, 
а вызов `db.get(Age)` возвращает значение типа `Option[Int]`. 
Тип возвращаемого значения зависит от конкретного типа аргумента, переданного для `get` — 
отсюда и название _dependent type_.

### Зависимые типы функций

Как видно выше, в Scala 2 уже была поддержка зависимых типов методов. 
Однако создание значений типа `DB` довольно громоздко:

```scala
// создание пользователя DB
def user(db: DB): Unit =
  db.get(Name) ... db.get(Age)

// создание экземпляра DB и передача его `user`
user(new DB {
  def get(k: Key): Option[k.Value] = ... // implementation of DB
})
```

Необходимо вручную создать анонимный внутренний класс `DB`, реализующий метод `get`. 
Для кода, основанного на создании множества различных экземпляров `DB`, это очень утомительно.

`DB` trait имеет только один абстрактный метод `get`. 
Было бы неплохо использовать в этом месте лямбда-синтаксис...

```scala
user { k =>
  ... // implementation of DB
}
```

На самом деле, в Scala 3 теперь это возможно! Можно определить `DB` как зависимый тип функции:

```scala
type DB = (k: Key) => Option[k.Value]
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//        зависимый тип функции
```

Учитывая это определение `DB`, можно использовать приведенный выше вызов `user`.

##### Определение

Зависимый тип функции (_dependent function type_) — это тип функции, результат которой зависит от параметров функции. 
Например:

```
trait Entry { type Key; val key: Key }

def extractKey(e: Entry): e.Key = e.key          // зависимый метод

val extractor: (e: Entry) => e.Key = extractKey  // значение зависимой функции
            // ^^^^^^^^^^^^^^^^^^^
            // зависимый тип функции
```

Тип обычной функции `A => B` представлен как экземпляр [trait-а `Function1`](https://scala-lang.org/api/3.x/scala/Function1.html) 
(т.е. `Function1[A, B]`) 
и аналогично для функций с большим количеством параметров. 
Зависимые функции также представлены как экземпляры этих трейтов, но они получают дополнительное уточнение. 
На самом деле, зависимый тип функции выше — это просто синтаксический сахар для

```
Function1[Entry, Entry#Key]:
  def apply(e: Entry): e.Key
```

### Практический пример: числовые выражения

Предположим, что необходимо определить модуль, который абстрагируется от внутреннего представления чисел. 
Это может быть полезно, например, для реализации библиотек для автоматического дифференцирования.

Начнем с определения модуля для чисел:

```scala
trait Nums:
  // тип Num оставлен абстрактным
  type Num
  
  // некоторые операции над числами
  def lit(d: Double): Num
  def add(l: Num, r: Num): Num
  def mul(l: Num, r: Num): Num
```

> Здесь опускается конкретная реализация Nums, но в качестве упражнения можно реализовать Nums, 
> назначив тип Num = Double и реализуя соответствующие методы.

Программа, использующая числовую абстракцию, теперь имеет следующий тип:

```scala
type Prog = (n: Nums) => n.Num => n.Num

val ex: Prog = nums => x => nums.add(nums.lit(0.8), x)
```

Тип функции, которая вычисляет производную, наподобие `ex`:

```scala
def derivative(input: Prog): Double
```

Учитывая удобство зависимых типов функций, вызов этой функции в разных программах прост:

```scala
derivative { nums => x => x }
derivative { nums => x => nums.add(nums.lit(0.8), x) }
// ...
```

Напомним, что та же программа в приведенной выше кодировке будет выглядеть так:

```scala
derivative(new Prog {
  def apply(nums: Nums)(x: nums.Num): nums.Num = x
})
derivative(new Prog {
  def apply(nums: Nums)(x: nums.Num): nums.Num = nums.add(nums.lit(0.8), x)
})
// ...
```

#### Комбинация с контекстными функциями

Комбинация методов расширения, [контекстных функций](@DOC@abstractions/context-functions)
и зависимых функций обеспечивает мощный инструмент для разработчиков библиотек. 
Например, мы можем уточнить нашу библиотеку, как указано выше, следующим образом:

```scala
trait NumsDSL extends Nums:
  extension (x: Num)
    def +(y: Num) = add(x, y)
    def *(y: Num) = mul(x, y)

def const(d: Double)(using n: Nums): n.Num = n.lit(d)

type Prog = (n: NumsDSL) ?=> n.Num => n.Num
//                       ^^^
//     prog теперь - контекстная функция, которая неявно предполагает NumsDSL в контексте вызова

def derivative(input: Prog): Double = ...

// теперь нам не нужно упоминать Nums в приведенных ниже примерах
derivative { x => const(1.0) + x }
derivative { x => x * x + const(2.0) }
// ...
```

#### Дополнительные примеры

В приведенном ниже примере определяется trait `C` и два зависимых типа функций `DF` и `IDF`, 
а также выводятся результаты вызовов соответствующих функций:

```scala mdoc:silent
trait C { type M; val m: M }

type DF = (x: C) => x.M

type IDF = (x: C) ?=> x.M

val c = new C { type M = Int; val m = 3 }

val depfun: DF = (x: C) => x.m

val idepfun: IDF = summon[C].m
```

```scala mdoc
val t = depfun(c)
val u = idepfun(using c)
```

В следующем примере тип зависимости `f.Eff` относится к типу `CanThrow`:

```scala mdoc:silent
trait Effect

// Type X => Y
abstract class Fun[-X, +Y]:
  type Eff <: Effect
  def apply(x: X): Eff ?=> Y

class CanThrow extends Effect
class CanIO extends Effect

given ct: CanThrow = new CanThrow
given ci: CanIO = new CanIO

class I2S extends Fun[Int, String]:
  type Eff = CanThrow
  def apply(x: Int) = x.toString

class S2I extends Fun[String, Int]:
  type Eff = CanIO
  def apply(x: String) = x.length

// def map(f: A => B)(xs: List[A]): List[B]
def map[A, B](f: Fun[A, B])(xs: List[A]): f.Eff ?=> List[B] =
  xs.map(f.apply)

// def mapFn[A, B]: (A => B) -> List[A] -> List[B]
def mapFn[A, B]: (f: Fun[A, B]) => List[A] => f.Eff ?=> List[B] =
  f => xs => map(f)(xs)

// def compose(f: A => B)(g: B => C)(x: A): C
def compose[A, B, C](f: Fun[A, B])(g: Fun[B, C])(x: A): f.Eff ?=> g.Eff ?=> C =
  g(f(x))

// def composeFn: (A => B) -> (B => C) -> A -> C
def composeFn[A, B, C]: (f: Fun[A, B]) => (g: Fun[B, C]) => A => f.Eff ?=> g.Eff ?=> C =
  f => g => x => compose(f)(g)(x)
  
val i2s = new I2S
val s2i = new S2I
```

```scala mdoc
mapFn(i2s)(List(1, 2, 3)).mkString
composeFn(i2s)(s2i)(22)
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-dependent-function.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/new-types/dependent-function-types.html)
- [Scala 3 Reference, Details](https://docs.scala-lang.org/scala3/reference/new-types/dependent-function-types-spec.html)
