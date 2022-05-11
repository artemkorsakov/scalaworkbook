---
layout: docsplus
title: "Непрозрачные типы"
prev: type-system/types-variance
next: type-system/types-structural
---

## {{page.title}}

Непрозрачные (**opaque**) псевдонимы типов Scala 3 обеспечивают абстракции типов без каких-либо накладных расходов.

### Накладные расходы на абстракцию

Предположим, что необходимо определить модуль, 
предлагающий арифметические операции над числами, которые представлены их логарифмами. 
Это может быть полезно для повышения точности, когда числовые значения очень большие или близкие к нулю.

Поскольку важно отличать "обычные" двойные значения от чисел, хранящихся в виде их логарифмов, введем класс `Logarithm`:

```scala mdoc:silent
class Logarithm(protected val underlying: Double):
  def toDouble: Double = math.exp(underlying)
  def + (that: Logarithm): Logarithm =
    // здесь используется метод apply сопутствующего объекта
    Logarithm(this.toDouble + that.toDouble)
  def * (that: Logarithm): Logarithm =
    new Logarithm(this.underlying + that.underlying)

object Logarithm:
  def apply(d: Double): Logarithm = new Logarithm(math.log(d))
```

Метод `apply` сопутствующего объекта позволяет создавать значения типа `Logarithm`, 
которые можно использовать следующим образом:

```scala mdoc:silent
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
```
```scala mdoc
println((l2 * l3).toDouble)
println((l2 + l3).toDouble)
```

В то время как класс `Logarithm` предлагает хорошую абстракцию для значений `Double`, 
которые хранятся в этой конкретной логарифмической форме, 
это накладывает серьезные накладные расходы на производительность: 
для каждой отдельной математической операции нужно извлекать значение `underlying`, 
а затем снова обернуть его в новый экземпляр `Logarithm`.


### Модульные абстракции

Рассмотрим другой подход к реализации той же библиотеки. 
На этот раз вместо того, чтобы определять `Logarithm` как класс, определяем его с помощью псевдонима типа. 
Во-первых, зададим абстрактный интерфейс модуля:

```scala mdoc:silent:reset
trait Logarithms:

  type Logarithm

  // operations on Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm
  def mul(x: Logarithm, y: Logarithm): Logarithm

  // functions to convert between Double and Logarithm
  def make(d: Double): Logarithm
  def extract(x: Logarithm): Double

  // extension methods to use `add` and `mul` as "methods" on Logarithm
  extension (x: Logarithm)
    def toDouble: Double = extract(x)
    def + (y: Logarithm): Logarithm = add(x, y)
    def * (y: Logarithm): Logarithm = mul(x, y)
```

Теперь давайте реализуем этот абстрактный интерфейс, задав тип `Logarithm` равным `Double`:

```scala mdoc
object LogarithmsImpl extends Logarithms:

  type Logarithm = Double

  // operations on Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm = make(x.toDouble + y.toDouble)
  def mul(x: Logarithm, y: Logarithm): Logarithm = x + y

  // functions to convert between Double and Logarithm
  def make(d: Double): Logarithm = math.log(d)
  def extract(x: Logarithm): Double = math.exp(x)
```

В рамках реализации `LogarithmsImpl` уравнение `Logarithm` = `Double` позволяет реализовать различные методы.

#### Дырявые абстракции

Однако эта абстракция немного "дырява". 
Мы должны убедиться, что всегда программируем только с абстрактным интерфейсом `Logarithms` 
и никогда не используем `LogarithmsImpl` напрямую. 
Прямое использование `LogarithmsImpl` сделало бы равенство `Logarithm = Double` видимым для пользователя, 
который может случайно использовать `Double` там, где ожидается логарифмическое удвоение. 
Например:

```scala
import LogarithmsImpl.*
val l: Logarithm = make(1.0)
val d: Double = l // type checks AND leaks the equality!
```

Необходимость разделения модуля на абстрактный интерфейс и реализацию может быть полезной, 
но также требует больших усилий, чтобы просто скрыть детали реализации `Logarithm`. 
Программирование с использованием абстрактного модуля `Logarithms` может быть очень утомительным 
и часто требует использования дополнительных функций, 
таких как типы, зависящие от пути, как в следующем примере:

```scala
def someComputation(L: Logarithms)(init: L.Logarithm): L.Logarithm = ...
```

##### Накладные расходы упаковки/распаковки

Абстракции типов, такие как `type Logarithm`, [стираются](https://www.scala-lang.org/files/archive/spec/2.13/03-types.html#type-erasure) 
в соответствии с их привязкой (`Any` - в нашем случае). 
То есть, хотя нам не нужно вручную переносить и разворачивать значение `Double`, 
все равно будут некоторые накладные расходы, связанные с упаковкой примитивного типа `Double`.

### Непрозрачные типы

Вместо того, чтобы вручную разбивать компонент `Logarithms` на абстрактную часть и на конкретную реализацию, 
можно просто использовать opaque типы для достижения аналогичного эффекта:

```scala
object Logarithms:
  // !!!
  opaque type Logarithm = Double

  object Logarithm:
    def apply(d: Double): Logarithm = math.log(d)

  extension (x: Logarithm)
    def toDouble: Double = math.exp(x)
    def + (y: Logarithm): Logarithm = Logarithm(math.exp(x) + math.exp(y))
    def * (y: Logarithm): Logarithm = x + y
```

Тот факт, что `Logarithm` совпадает с `Double`, известен только в области, где он определен, 
которая в приведенном выше примере соответствует объекту `Logarithms`. 
Равенство `Logarithm = Double` может использоваться для реализации методов (например, `*` и `toDouble`).

Однако за пределами модуля тип `Logarithm` полностью инкапсулирован или "непрозрачен" (opaque). 
Для пользователей невозможно обнаружить его реализацию:

```scala
import Logarithms.*
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
println((l2 * l3).toDouble) // prints 6.0
println((l2 + l3).toDouble) // prints 4.999...

val d: Double = l2 // ERROR: Found Logarithm required Double
```

Несмотря на то, что мы абстрагировались от `Logarithm`, абстракция предоставляется бесплатно: 
поскольку существует только одна реализация, 
во время выполнения не будет накладных расходов на упаковку для примитивных типов, таких как `Double`.

#### Резюме

Непрозрачные типы предлагают надежную абстракцию над деталями реализации, не накладывая расходов на производительность. 
Как показано выше, непрозрачные типы удобны в использовании и очень хорошо интегрируются с 
[функцией методов расширения](@DOC@methods/method-features#расширяемые-методы).


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-opaque-types.html)
