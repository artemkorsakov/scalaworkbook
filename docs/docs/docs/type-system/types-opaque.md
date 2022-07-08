---
layout: docsplus
title: "Непрозрачные типы"
section: scala
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

```scala mdoc:silent:reset
object MyMath:
  // !!!
  opaque type Logarithm = Double

  // два способа использования типа Logarithm

  object Logarithm:
    def apply(d: Double): Logarithm = math.log(d)

    def safe(d: Double): Option[Logarithm] =
      if d > 0.0 then Some(math.log(d)) else None

  end Logarithm

  extension (x: Logarithm)
    def toDouble: Double = math.exp(x)
    def + (y: Logarithm): Logarithm = Logarithm(math.exp(x) + math.exp(y))
    def * (y: Logarithm): Logarithm = x + y

end MyMath
```

Тот факт, что `Logarithm` совпадает с `Double`, известен только в области, где он определен, 
которая в приведенном выше примере соответствует объекту `MyMath`.
Или, другими словами, внутри области видимости `Logarithm` рассматривается как псевдоним типа, 
но он полностью инкапсулирован или "непрозрачен" (**opaque**) для внешнего мира, 
где, как следствие, `Logarithm` рассматривается как абстрактный тип, не имеющий ничего общего с `Double`.
Равенство `Logarithm = Double` может использоваться для реализации методов (например, `*` и `toDouble`).

Общедоступный API `Logarithm` состоит из методов `apply` и `safe`, определенных в сопутствующем объекте. 
Они преобразуются из `Double` в значения `Logarithm`. 
Более того, операции `toDouble`, которые преобразуют в другую сторону, 
и операции `+` и `*` определяются как методы расширения над значениями `Logarithm`. 
Следующие операции допустимы, поскольку они используют функциональные возможности, реализованные в объекте `MyMath`.

```scala mdoc
import MyMath.Logarithm
val l = Logarithm(1.0)
val l2 = Logarithm(2.0)
val l3 = l * l2
val l4 = l + l2
```

Но следующие операции приведут к ошибкам типа:

```scala
val d: Double = l       // error: found: Logarithm, required: Double
val l2: Logarithm = 1.0 // error: found: Double, required: Logarithm
l * 2                   // error: found: Int(2), required: Logarithm
l / l2                  // error: `/` is not a member of Logarithm
```

Несмотря на то, что мы абстрагировались от `Logarithm`, абстракция предоставляется бесплатно: 
поскольку существует только одна реализация, 
во время выполнения не будет накладных расходов на упаковку для примитивных типов, таких как `Double`.

### Границы псевдонимов непрозрачных типов

Псевдонимы непрозрачных типов также могут иметь ограничения. Пример:

```scala mdoc:reset:silent
object Access:

  opaque type Permissions = Int
  opaque type PermissionChoice = Int
  opaque type Permission <: Permissions & PermissionChoice = Int

  extension (x: PermissionChoice)
    def | (y: PermissionChoice): PermissionChoice = x | y
  extension (x: Permissions)
    def & (y: Permissions): Permissions = x | y
  extension (granted: Permissions)
    def is(required: Permissions) = (granted & required) == required
    def isOneOf(required: PermissionChoice) = (granted & required) != 0

  val NoPermission: Permission = 0
  val Read: Permission = 1
  val Write: Permission = 2
  val ReadWrite: Permissions = Read | Write
  val ReadOrWrite: PermissionChoice = Read | Write

end Access
```

Объект `Access` определяет три псевдонима непрозрачного типа:
- `Permission`, представляющий одно разрешение,
- `Permissions`, представляющий набор разрешений со значением "все эти разрешения предоставлены",
- `PermissionChoice`, представляющий набор разрешений со значением "по крайней мере одно из этих разрешений предоставлено".

Вне объекта `Access` значения типа `Permissions` могут быть объединены с помощью оператора `&`, 
где `x & y` означает "все разрешения в `x` и в `y` предоставлены". 
Значения типа `PermissionChoice` можно комбинировать с помощью оператора `|`, 
где `x | y` означает "разрешение в `x` или `y` предоставлено".

Обратите внимание, что внутри объекта `Access` операторы `&` и `|` всегда разрешаются в соответствующие методы `Int`, 
поскольку члены всегда имеют приоритет над методами расширения. 
По этой причине метод расширения `|` в `Access` не вызывает бесконечную рекурсию.

В частности, определение `ReadWrite` должно использовать `|`, побитовый оператор для `Int`, 
даже если внешний клиентский код `Access` будет использовать `&`, метод расширения для `Permissions`. 
Внутренние представления `ReadWrite` и `ReadOrWrite` идентичны, 
но это не видно клиенту, которого интересует только семантика `Permissions`, как в примере ниже.

Все три псевдонима непрозрачного типа имеют один и тот же базовый тип представления `Int`. 
Тип `Permission` имеет верхнюю границу `Permissions & PermissionChoice`.
Это дает понять за пределами объекта `Access`, что `Permission` является подтипом двух других типов.
Следовательно, следующий сценарий использования проходит type-checks.

```scala mdoc
object User:
  import Access.*

  case class Item(rights: Permissions)
  extension (item: Item)
    def +(other: Item): Item = Item(item.rights & other.rights)

  val roItem = Item(Read)  // OK, since Permission <: Permissions
  val woItem = Item(Write)
  val rwItem = Item(ReadWrite)
  val noItem = Item(NoPermission)

  assert(!roItem.rights.is(ReadWrite))
  assert(roItem.rights.isOneOf(ReadOrWrite))

  assert(rwItem.rights.is(ReadWrite))
  assert(rwItem.rights.isOneOf(ReadOrWrite))

  assert(!noItem.rights.is(ReadWrite))
  assert(!noItem.rights.isOneOf(ReadOrWrite))

  assert((roItem + woItem).rights.is(ReadWrite))
end User
```

С другой стороны, вызов `roItem.rights.isOneOf(ReadWrite)` выдаст ошибку типа:

```scala
assert(roItem.rights.isOneOf(ReadWrite))
                               ^^^^^^^^^
                               Found:    (Access.ReadWrite : Access.Permissions)
                               Required: Access.PermissionChoice
```

`Permissions` и `PermissionChoice` являются разными, несвязанными типами вне `Access`.


### Члены непрозрачного типа в классах

Хотя обычно непрозрачные типы используются вместе с объектами, чтобы скрыть детали реализации модуля, 
их также можно использовать с классами.

Например, можно переопределить приведенный выше пример логарифмов как класс.

```scala
class Logarithms:

  opaque type Logarithm = Double

  def apply(d: Double): Logarithm = math.log(d)

  def safe(d: Double): Option[Logarithm] =
    if d > 0.0 then Some(math.log(d)) else None

  def mul(x: Logarithm, y: Logarithm) = x + y
```

Члены непрозрачного типа разных экземпляров обрабатываются как разные:

```scala
val l1 = new Logarithms
val l2 = new Logarithms
val x = l1(1.5)
val y = l1(2.6)
val z = l2(3.1)
l1.mul(x, y) // type checks
l1.mul(x, z) // error: found l2.Logarithm, required l1.Logarithm
```

В общем, можно думать о непрозрачном типе как о прозрачном только в пределах `private[this]`.

### Резюме

Непрозрачные типы предлагают надежную абстракцию над деталями реализации, не накладывая расходов на производительность. 
Как показано выше, непрозрачные типы удобны в использовании и очень хорошо интегрируются с 
[функцией методов расширения](@DOC@methods/extension-methods).

Подробнее об opaque type:
- [Мотивация](https://docs.scala-lang.org/sips/opaque-types.html)
- [Детали](https://docs.scala-lang.org/scala3/reference/other-new-features/opaques-details.html)


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-opaque-types.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/other-new-features/opaques.html)
