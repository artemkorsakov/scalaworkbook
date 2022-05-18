---
layout: docsplus
title: "Inline"
prev: metaprogramming
next: metaprogramming/compile-time-ops
---

## {{page.title}}

### Встроенные определения

`inline` — это новый [мягкий модификатор](@DOC@soft-keywords), 
который гарантирует, что определение будет встроено в момент использования. 
Пример:

```scala mdoc:silent
object Config:
  inline val logging = true

object Logger:

  private var indent = 0

  inline def log[T](msg: String, indentMargin: => Int)(op: => T): T =
    if Config.logging then
      println(s"${"  " * indent}start $msg")
      indent += indentMargin
      val result = op
      indent -= indentMargin
      println(s"${"  " * indent}$msg = $result")
      result
    else op
end Logger
```

Объект `Config` содержит определение встроенного значения `logging`. 
Это означает, что `logging` рассматривается как _постоянное значение_, эквивалентное его правой части `true`. 
Правая часть выражения `inline val` сама должна быть константным выражением. 
Используемый таким образом `inline` эквивалентен `final` Java и Scala 2. 
Обратите внимание, что встроенная константа `final` по-прежнему поддерживается в Scala 3, 
но ее использование будет прекращено.

Объект `Logger` содержит определение встроенного метода `log`. 
Этот метод всегда будет встроен в точку вызова.

Во встроенном коде объект `if-then-else` с постоянным условием будет переписан на его `then` или `else` часть. 
Следовательно, в приведенном выше методе `log` часть `if Config.logging` 
с `Config.logging == true` будет переписано в его `then` часть.

Вот пример:

```scala
var indentSetting = 2

def factorial(n: BigInt): BigInt =
  log(s"factorial($n)", indentSetting) {
    if n == 0 then 1
    else n * factorial(n - 1)
  }
```

Если `Config.logging == false`, метод будет переписан (упрощен) так:

```scala
def factorial(n: BigInt): BigInt =
  if n == 0 then 1
  else n * factorial(n - 1)
```

Как можно заметить, поскольку ни один из `msg` или `indentMargin` не использовался, 
они не отображаются в сгенерированном коде для `factorial`. 
Также обратите внимание на тело `log` метода: `else`-часть сводится к простому файлу `op`. 
В сгенерированном коде не генерируется никаких замыканий, 
потому что к параметру по имени идет обращение только один раз. 
Следовательно, код был встроен напрямую, а вызов был уменьшен в бета-версии.

В случае `true`, код будет переписан на:

```scala
def factorial(n: BigInt): BigInt =
  val msg = s"factorial($n)"
  println(s"${"  " * indent}start $msg")
  Logger.inline$indent_=(indent.+(indentSetting))
  val result =
    if n == 0 then 1
    else n * factorial(n - 1)
  Logger.inline$indent_=(indent.-(indentSetting))
  println(s"${"  " * indent}$msg = $result")
  result
```

Обратите внимание, что параметр по значению `msg` оценивается только один раз 
в соответствии с обычной семантикой Scala путем привязки значения 
и повторного использования `msg` через тело `factorial`. 
Также обратите внимание на особую обработку присваивания приватной переменной `indent`. 
Присваивание достигается созданием метода установки `def inline$indent_=` и вызовом его.

Встроенные методы всегда должны применяться полностью. Например, вызов

```
Logger.log[String]("some op", indentSetting)
```

будет неправильно сформирован, и компилятор будет жаловаться на отсутствие аргументов. 
Однако можно передавать аргументы с подстановочными знаками. 
Например,

```
Logger.log[String]("some op", indentSetting)(_)
```

### Рекурсивные встроенные методы

Встроенные методы могут быть рекурсивными. 
Например, при вызове с постоянным `n` следующий метод `power` 
будет реализован прямым встроенным кодом без какого-либо цикла или рекурсии.

```scala
inline def power(x: Double, n: Int): Double =
  if n == 0 then 1.0
  else if n == 1 then x
  else
    val y = power(x, n / 2)
    if n % 2 == 0 then y * y else y * y * x

power(expr, 10)
// translates to
//
//   val x = expr
//   val y1 = x * x   // ^2
//   val y2 = y1 * y1 // ^4
//   val y3 = y2 * x  // ^5
//   y3 * y3          // ^10
```

Параметры встроенных методов также могут иметь `inline` модификатор. 
Это означает, что фактические аргументы этих параметров будут встроены в тело `inline def`. 
`inline` параметры имеют семантику вызова, эквивалентную параметрам по имени, 
но допускают дублирование кода в аргументе. 
Обычно это полезно, когда необходимо распространить постоянные значения, 
чтобы обеспечить дальнейшую оптимизацию/сокращение.

В следующем примере показана разница в переводе между by-value, by-name и `inline` параметрами:

```scala
inline def funkyAssertEquals(actual: Double, expected: => Double, inline delta: Double): Unit =
  if (actual - expected).abs > delta then
    throw new AssertionError(s"difference between ${expected} and ${actual} was larger than ${delta}")

funkyAssertEquals(computeActual(), computeExpected(), computeDelta())
// translates to
//
//   val actual = computeActual()
//   def expected = computeExpected()
//   if (actual - expected).abs > computeDelta() then
//     throw new AssertionError(s"difference between ${expected} and ${actual} was larger than ${computeDelta()}")
```

### Правила переопределения

Встроенные методы могут переопределять другие невстроенные методы. 
Правила следующие:
а) Если встроенный метод `f` реализует или переопределяет другой, не встроенный метод, 
встроенный метод также может быть вызван во время выполнения. Например, рассмотрим сценарий:

```scala
abstract class A:
  def f: Int
  def g: Int = f

class B extends A:
  inline def f = 22
  override inline def g = f + 11

val b = new B
val a: A = b
// inlined invocatons
assert(b.f == 22)
assert(b.g == 33)
// dynamic invocations
assert(a.f == 22)
assert(a.g == 33)
```

Встроенные вызовы и динамически отправленные вызовы дают одинаковые результаты.

б) Встроенные методы фактически являются final.

в) Встроенные методы также могут быть абстрактными. 
Абстрактный встроенный метод может быть реализован только другими встроенными методами. 
Его нельзя вызвать напрямую:

```scala
abstract class A:
  inline def f: Int

object B extends A:
  inline def f: Int = 22

B.f         // OK
val a: A = B
a.f         // error: cannot inline f in A.
```

### Отношение к `@inline`

Scala 2 также определяет `@inline` аннотацию, 
которая используется в качестве подсказки для встроенного кода. 
Модификатор `inline` является более мощным вариантом:
- расширение гарантирует лучшую эффективность,
- расширение происходит во внешнем интерфейсе, а не в бэкэнде, и
- расширение также применяется к рекурсивным методам.

#### Определение константного выражения

Правые части встроенных значений и аргументов для встроенных параметров должны быть константными выражениями в смысле, 
определенном [SLS §6.24](https://www.scala-lang.org/files/archive/spec/2.13/06-expressions.html#constant-expressions), 
включая специфичные для платформы расширения, такие как свертывание констант чисто числовых вычислений.

Встроенное значение должно иметь литеральный тип, например `1` или `true`.

```scala
inline val four = 4
// equivalent to
inline val four: 4 = 4
```

Также возможно иметь встроенные значения типов, которые не имеют синтаксиса, например `Short(4)`.

```scala
trait InlineConstants:
  inline val myShort: Short

object Constants extends InlineConstants:
  inline val myShort/*: Short(4)*/ = 4
```

### Прозрачные встроенные методы

Встроенные методы могут быть дополнительно объявлены `transparent`. 
Это означает, что возвращаемый тип встроенного метода может быть преобразован в более точный тип при расширении. 
Пример:

```scala
class A
class B extends A:
  def m = true

transparent inline def choose(b: Boolean): A =
  if b then new A else new B

val obj1 = choose(true)  // static type is A
val obj2 = choose(false) // static type is B

// obj1.m // compile-time error: `m` is not defined on `A`
obj2.m    // OK
```

Здесь встроенный метод `choose` возвращает экземпляр любого из двух типов `A` или `B`. 
Если бы `choose` не был объявлен как `transparent`, результат его раскрытия всегда был бы типа `A`, 
даже если вычисляемое значение могло бы иметь подтип `B`. 
Встроенный метод является "черным ящиком" в том смысле, что детали его реализации не просачиваются. 
Но если указан модификатор `transparent`, расширение является типом расширенного тела. 
Если аргумент `b` равен `true`, то этот тип равен `A`, иначе — `B`. 
Следовательно, вызов `m` на `obj2` пройдет проверку типов, 
поскольку `obj2` имеет тот же тип, что и расширение `choose(false)`, т.е. `B`. 
Прозрачные встроенные методы являются "белыми ящиками" в том смысле, 
что тип приложения такого метода может быть более специализированным, 
чем его объявленный возвращаемый тип, в зависимости от того, как расширяется метод.

В следующем примере мы видим, как тип возвращаемого значения `zero` специализирован для одноэлементного типа `0`, 
что позволяет приписать дополнению правильный тип `1`.

```scala
transparent inline def zero: Int = 0

val one: 1 = zero + 1
```

### Прозрачный и непрозрачный inline

Как уже обсуждалось, прозрачные встроенные методы могут влиять на проверку типов в месте вызова. 
Технически это означает, что прозрачные встроенные методы должны быть расширены во время проверки типов программы. 
Другие встроенные методы встраиваются позже, когда программа полностью типизирована.

Например, следующие две функции будут типизированы одинаково, но будут встроены в разное время.

```scala
inline def f1: T = ...
transparent inline def f2: T = (...): T
```

Примечательным отличием является поведение `transparent inline given`. 
Если при встраивании такого определения сообщается об ошибке, 
это будет рассматриваться как неявное несоответствие поиска, и поиск будет продолжен. 
A `transparent inline given` может добавить описание типа в свой RHS (как в `f2` предыдущем примере), 
чтобы избежать точного типа, но сохранить поведение поиска. 
С другой стороны, `inline given` принимается как неявное значение, а затем встраивается после ввода. 
Любая ошибка будет выдаваться как обычно.

### Встроенные условия

Выражение `if-then-else`, условием которого является постоянное выражение, может быть упрощено до выбранной ветви. 
Префикс выражения `if-then-else` с `inline` префиксом гарантирует, что условие должно быть постоянным выражением, 
и, таким образом, гарантирует, что условное выражение всегда будет упрощено.

Пример:

```scala
inline def update(delta: Int) =
  inline if delta >= 0 then increaseBy(delta)
  else decreaseBy(-delta)
```

Вызов `update(22)` будет переписан на `increaseBy(22)`. 
Но если бы `update` вызывали со значением, не являющимся константой времени компиляции, 
мы бы получили ошибку времени компиляции, как показано ниже:

```
|  inline if delta >= 0 then ???
  |  ^
  |  cannot reduce inline if
  |   its condition
  |     delta >= 0
  |   is not a constant value
  | This location is in code that was inlined at ...
```

В прозрачном встроенном объекте `inline if` принудительно встраивает 
любое встроенное определение в его условие во время проверки типа.

### Встроенные match

`match` выражение в теле определения метода `inline` может иметь префикс модификатора `inline`. 
Если статической информации достаточно для однозначного выбора ветви, 
выражение сокращается до этой ветви и берется тип результата. 
Если нет, возникает ошибка времени компиляции, которая сообщает, что совпадение не может быть уменьшено.

В приведенном ниже примере определяется встроенный метод с одним встроенным выражением соответствия, 
которое выбирает case на основе его статического типа:

```scala
transparent inline def g(x: Any): Any =
  inline x match
    case x: String => (x, x) // Tuple2[String, String](x, x)
    case x: Double => x

g(1.0d) // Has type 1.0d which is a subtype of Double
g("test") // Has type (String, String)
```

`x` проверяется статически, и встроенное совпадение сокращается, 
возвращая соответствующее значение (со специализированным типом, потому что `g` объявлен `transparent`). 
В этом примере выполняется простой тест типа над объектом проверки. 
Тип может иметь более богатую структуру, как простой ADT ниже. 
`toInt` соответствует структуре числа в [Чёрч-кодировке](https://en.wikipedia.org/wiki/Church_encoding) 
и вычисляет соответствующее целое число.

```scala
trait Nat
case object Zero extends Nat
case class Succ[N <: Nat](n: N) extends Nat

transparent inline def toInt(n: Nat): Int =
  inline n match
    case Zero     => 0
    case Succ(n1) => toInt(n1) + 1

inline val natTwo = toInt(Succ(Succ(Zero)))
val intTwo: 2 = natTwo
```

Предполагается, что `natTwo` имеет одноэлементный тип `2`.

### Детали

Дополнительные сведения о семантике `inline` [см. в документе](https://dl.acm.org/doi/10.1145/3426426.3428486)


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/metaprogramming/inline.html)
