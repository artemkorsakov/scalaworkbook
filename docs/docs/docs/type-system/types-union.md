---
layout: docsplus
title: "Объединение типов"
section: scala
prev: type-system/types-intersection
next: type-system/types-adts
---

## {{page.title}}

Используемый для типов `|` оператор создает так называемый тип объединения (_union type_). 
Тип `А | B` представляет значения, которые относятся **либо** к типу `A`, **либо** к типу `B`.

В следующем примере метод `help` принимает параметр с именем `id` типа объединения `Username | Password`, 
который может быть либо `Username`, либо `Password`:

```scala
case class Username(name: String)
case class Password(hash: Hash)

def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // ...
```

`help` реализуется используя pattern matching.

Этот код является гибким и типобезопасным решением. 
Если попытаться передать тип, отличный от `Username` или `Password`, компилятор пометит это как ошибку:

```scala
help("hi")   // error: Found: ("hi" : String)
             //        Required: Username | Password         
```

Ошибка также будет получена, если попытаться добавить `case` в выражение `match`, 
которое не соответствует типам `Username` или `Password`:

```scala
case 1.0 => ???   // ERROR: this line won’t compile
```

#### Альтернатива объединенным типам

Как показано, объединенные типы могут использоваться для представления вариантов нескольких разных типов, 
не требуя, чтобы эти типы были частью специально созданной иерархии классов.

##### Предварительное планирование иерархии классов

Другие языки требуют предварительного планирования иерархии классов, как показано в следующем примере:

```scala
trait UsernameOrPassword
case class Username(name: String) extends UsernameOrPassword
case class Password(hash: Hash) extends UsernameOrPassword
def help(id: UsernameOrPassword) = ...
```

Предварительное планирование не очень хорошо масштабируется, поскольку, 
например, требования пользователей API могут быть непредсказуемыми. 
Кроме того, загромождение иерархии типов маркерами типа `UsernameOrPassword` затрудняет чтение кода.

##### Теговые объединения

Другой альтернативой является задание отдельного типа перечисления, например:

```scala
enum UsernameOrPassword:
  case IsUsername(u: Username)
  case IsPassword(p: Password)
```

Перечисление `UsernameOrPassword` представляет собой помеченное объединение `Username` и `Password`. 
Однако этот способ моделирования объединения требует явной упаковки и распаковки, 
и, например, `Username` не является подтипом `UsernameOrPassword`.

#### Вывод типов объединения

Компилятор присваивает типу объединения выражение, только если такой тип явно задан. 
Например, рассмотрим такие значения:

```scala mdoc:invisible
case class Username(name: String)
case class Password(hash: Int)
```
```scala mdoc
val name = Username("Eve")   
val password = Password(123) 
```

В этом примере показано, как можно использовать тип объединения при привязке переменной к результату выражения `if`/`else`:

```scala mdoc
val a = if (true) name else password
val b: Password | Username = if (true) name else password
```

Типом `a` является `Object`, который является супертипом `Username` и `Password`, 
но не наименьшим супертипом, `Password | Username`. 
Если необходим наименьший супертип, его нужно указать явно, как это делается для `b`.

> Типы объединения являются двойственными типам пересечения. 
> И как `&` с типами пересечения, `|` также коммутативен: `A | B` того же типа, что и `B | А`.

### Детали

#### Взаимодействие в сопоставлении с образцом

`|` также используется при сопоставлении шаблонов с отдельными альтернативами шаблонов 
и имеет более низкий приоритет, чем `:` используемый в типизированных шаблонах.
Это означает, что:

`case _: A | B => ...`

эквивалентен:

`case (_: A) | B => ...`

, а не:

`case _: (A | B) => ...`


#### Правила подтипа

Правила подтипа:
- `A` всегда является подтипом `A | B` для всех `A`, `B`
- если `A <: C` и `B <: C`, тогда `A | B <: C`
- `|` является коммутативным и ассоциативным подобно `&`:
```
A | B =:= B | A
A | (B | C) =:= (A | B) | C
```
- `&` является дистрибутивным по `|`:
```
A & (B | C) =:= A & B | A & C
```

Из этих правил следует, что наименьшая верхняя граница (**LUB** - _least upper bound_) 
множества типов есть объединение этих типов. 

#### Мотивация

Основная причина введения типов объединения в Scala заключается в том, 
что они позволяют гарантировать, что для каждого набора типов всегда можно сформировать конечный **LUB**. 

Кроме того, типы объединения являются полезной конструкцией при попытке дать типы 
существующим API с динамической типизацией, 
поэтому они являются [неотъемлемой частью TypeScript](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) 
и даже [частично реализованы в Scala.js](https://github.com/scala-js/scala-js/blob/main/library/src/main/scala/scala/scalajs/js/Union.scala).

#### Соединение типа union

В некоторых ситуациях, описанных ниже, тип объединения может потребовать расшириться до типа, 
не являющегося объединением, 
для этой цели мы определяем соединение типа объединения `T1 | ... | Tn` 
как наименьший тип пересечения экземпляров базовых классов `T1,..., Tn`. 
Обратите внимание, что типы объединения могут по-прежнему отображаться как аргументы типа в результирующем типе, 
это гарантирует, что объединение всегда конечно.

Дано:

```scala
trait C[+T]
trait D
trait E
class A extends C[A] with D
class B extends C[B] with D with E
```

Объединение `A | B` - это `C[A | B] & D`.

#### Вывод типа

При выводе типа результата определения (переменной или метода - `val`, `var`, `def`), 
если тип, который собираемся вывести, является типом объединения, он заменяется объединением. 

Пример:

```scala
import scala.collection.mutable.ListBuffer
val x = ListBuffer(Right("foo"), Left(0))
val y: ListBuffer[Either[Int, String]] = x
```

Этот код проходит проверку типов, потому что аргумент предполагаемого типа `ListBuffer` в правой части `x` - 
`Left[Int, Nothing] | Right[Nothing, String]` - был расширен до `Either[Int, String]`. 
Если бы компилятор не сделал этого расширения, последняя строка не проходила бы проверку типов, 
потому что `ListBuffer` инвариантен в своем аргументе.

#### Элементы

Элементы типа union являются элементами его объединения.

Пример

Следующий код не проходит проверку типов, так как метод `hello` не является членом `AnyRef`, 
который является объединением `A | B`.

```
trait A { def hello: String }
trait B { def hello: String }

def test(x: A | B) = x.hello // error: value `hello` is not a member of A | B
```

С другой стороны, допускается следующее:

```scala mdoc:silent:reset
trait D
trait E
trait C { def hello: String }
trait A extends C with D
trait B extends C with E

def test(x: A | B) = x.hello // ok, т.к. `hello` - элемент объединения A | B, который является подтипом C
```

При этом необходимо отметить, что в метод `test` нельзя передать экземпляр `С`, 
потому что `A | B` - подтип `C`, но не наоборот:

```scala mdoc:silent
val a: A = new A:
  def hello = "Hello, A!"
val b: B = new B:
  def hello = "Hello, B!"
```

```scala mdoc
test(a)
test(b)
```

```scala mdoc:fail
val c: C = new C:
  def hello = "Hello, C!"
test(c)
```

#### Проверка полноты в сопоставлении с образцом

Если селектор совпадения с образцом является типом объединения, 
совпадение считается исчерпывающим, если охватываются все части объединения.

Пример:

```scala
trait A { def hello: String }
trait B { def hello: String }

def matching(x: A | B): String =
  x match
    case a: A => a.hello
    case b: B => b.hello
    case c: C => c.hello // Лишнее

-- [E030] Match case Unreachable Warning: --------------------------------------
5 |    case c: C => c.hello
  |         ^^^^   |         Unreachable case
```

#### Стирание типов

Стертый тип для `A | B` является наименьшей верхней границей (_erased least upper bound_) стираемых типов `A` и `B`. 
Цитата из документации `TypeErasure#erasedLub`, стертый **LUB** вычисляется следующим образом:
- если оба аргумента являются массивами объектов, **LUB** - массив стертых **LUB** типов элементов
- если оба аргумента являются массивами одних и тех же примитивов, **LUB** - массив этого примитива
- если один аргумент — массив примитивов, а другой — массив объектов, **LUB** - `Object`
- если один аргумент является массивом, **LUB** - `Object`
- в противном случае общий суперкласс или trait `S` классов аргументов со следующими двумя свойствами:
  - `S` минимален: никакой другой общий суперкласс или признак не происходит от `S`.
  - `S` является последним: в линеаризации первого типа аргумента `|A|` 
нет минимальных общих суперклассов или трейтов, которые идут после `S`.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-union.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/new-types/union-types.html)
- [Scala 3 Reference, Details](https://docs.scala-lang.org/scala3/reference/new-types/union-types-spec.html)
