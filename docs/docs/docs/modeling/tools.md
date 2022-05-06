---
layout: docsplus
title: "Инструменты"
prev: ../modeling
next: oop
---

## {{page.title}}

В Scala 3 есть множество различных конструкций для моделирования:
- Классы (Classes)
- Объекты (Objects)
- Сопутствующие объекты (Companion objects)
- Трейты (Traits)
- Абстрактные классы (Abstract classes)
- Перечисления (Enums)
- Case classes
- Case objects

В этом разделе кратко представлена каждая из этих языковых конструкций.

### Classes

Как и в других языках, класс в Scala — это шаблон для создания экземпляров объекта. 
Вот несколько примеров классов:

```scala mdoc:silent
class Person(var name: String, var vocation: String)
class Book(var title: String, var author: String, var year: Int)
class Movie(var name: String, var director: String, var year: Int)
```

Эти примеры показывают, как в Scala объявляются классы.

В примере выше все параметры классов определены как поля `var`, что означает, что они изменяемы. 
Если необходимо, чтобы они были неизменяемыми, можно определить их как `val` или использовать case class.

Новый экземпляр класса создается следующим образом 
(без ключевого слова `new`, благодаря [универсальным `apply` методам](https://docs.scala-lang.org/scala3/reference/other-new-features/creator-applications.html)):

```scala mdoc:silent
val p = Person("Robert Allen Zimmerman", "Harmonica Player")
```

Если есть экземпляр класса, такого как `p`, то можно получить доступ к его полям, 
которые в этом примере являются параметрами конструктора:

```scala mdoc
p.name
p.vocation
```

Как уже упоминалось, все эти параметры были созданы как поля `var`, поэтому их можно изменять:

```scala mdoc:silent
p.name = "Bob Dylan"
p.vocation = "Musician"
```

#### Поля и методы

Классы также могут иметь методы и дополнительные поля, не являющиеся частью конструкторов. 
Они определены в теле класса. Тело инициализируется как часть конструктора по умолчанию:

```scala mdoc:reset
class Person(var firstName: String, var lastName: String):
  println("initialization begins")
  val fullName = s"$firstName $lastName"

  def printFullName: Unit =
    println(fullName)

  printFullName
  println("initialization ends")
```

Пример демонстрирует, как происходит инициализация класса:

```scala mdoc
val john = Person("John", "Doe")
john.printFullName
```

Классы также могут расширять `trait`-ы и абстрактные классы, которые будут рассмотрены в специальных разделах ниже.

#### Параметры по умолчанию

Параметры конструктора класса также могут иметь значения по умолчанию:

```scala mdoc
class Socket(val timeout: Int = 5_000, val linger: Int = 5_000):
  override def toString = s"timeout: $timeout, linger: $linger"
```

Отличительной особенностью этой функции является то, что она позволяет пользователям кода создавать классы 
различными способами, как если бы у класса были альтернативные конструкторы:

```scala mdoc
Socket()                
Socket(2_500)           
Socket(10_000, 10_000)  
Socket(timeout = 10_000)
Socket(linger = 10_000)
```

При создании нового экземпляра класса также можно использовать именованные параметры. 
Это приветствуется и особенно полезно, когда параметры имеют одинаковый тип:

```scala mdoc
Socket(10_000, 10_001)
Socket(timeout = 10_000, linger = 10_001)
Socket(linger = 10_000, timeout = 10_001)
```

#### Вспомогательные конструкторы

В классе можно определить несколько конструкторов. 
Например, предположим, что нужно определить три конструктора класса `Student`:
- с именем и государственным ID (1)
- с именем, государственным ID и датой подачи заявления (2)
- с именем, государственным ID и студенческим ID (3)

Пример описания класса с тремя этими конструкторами:

```scala mdoc
import java.time.*
class Student(var name: String, var govtId: String): // [1] основной конструктор
  private var _applicationDate: Option[LocalDate] = None
  private var _studentId: Int = 0

  def this(name: String, govtId: String, applicationDate: LocalDate) =   // [2] конструктор с датой подачи заявления
    this(name, govtId)
    _applicationDate = Some(applicationDate)

  def this(name: String, govtId: String, studentId: Int) =   // [3] конструктор со студенческим id
    this(name, govtId)
    _studentId = studentId
```

Эти конструкторы могут быть вызваны следующим образом:

```scala mdoc:silent
Student("Mary", "123")
Student("Mary", "123", LocalDate.now)
Student("Mary", "123", 456)
```

Для возможности создания классов несколькими способами можно использовать как параметры по умолчанию, 
так и несколько конструкторов, как в примере выше.

### Objects

В Scala ключевое слово `object` создает одноэлементный объект (singleton).
Другими словами, объект определяет класс, который имеет ровно один экземпляр.
Он инициализируется лениво, когда ссылаются на его элементы, аналогично `lazy val`.
Объекты в Scala позволяют группировать методы и поля в одном пространстве имен,
аналогично тому, как используются статические члены класса в Java, Javascript (ES6) или `@staticmethod` в Python.

Объекты имеют несколько применений:
- Они используются для создания коллекций служебных методов.
- _companion object_ - это объект, имеющий то же имя, что и класс, с которым он совместно использует файл.
  В этой ситуации класс называется _companion class_.
- Они используются для имплементации `traits` для создания модулей.

Объявление объекта аналогично объявлению класса. 
Вот пример объекта `StringUtils`, который содержит набор методов для работы со строками:

```scala mdoc:silent
object StringUtils:
  def truncate(s: String, length: Int): String = s.take(length)
  def containsWhitespace(s: String): Boolean = s.matches(".*\\s.*")
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
```

Поскольку `StringUtils` является одноэлементным, его методы могут вызываться непосредственно в объекте:

```scala mdoc
StringUtils.truncate("Chuck Bartowski", 5)
```

Импорт в Scala очень гибкий и позволяет импортировать все члены объекта:

```scala mdoc
import StringUtils.*
truncate("Chuck Bartowski", 5)
containsWhitespace("Sarah Walker")
isNullOrEmpty("John Casey")
```

Можно импортировать только часть методов:

```scala
import StringUtils.{truncate, containsWhitespace}
truncate("Charles Carmichael", 7)    
containsWhitespace("Captain Awesome") 
isNullOrEmpty("Morgan Grimes")  // Not found: isNullOrEmpty (error)
```

Объекты также могут иметь поля, к которым можно обратиться, как к статистическим методам:

```scala mdoc
object MathConstants:
  val PI = 3.14159
  val E = 2.71828
println(MathConstants.PI)
```

### Companion objects

Объект, который имеет то же имя, что и класс, и объявлен в том же файле, что и класс, 
называется "сопутствующим объектом" (_companion object_). 
Аналогично, соответствующий класс называется сопутствующим классом объекта (_companion class_). 
Сопутствующий класс или объект может получить доступ к закрытым членам своего "соседа".

Сопутствующие объекты используются для методов и значений, 
которые не являются специфичными для экземпляров сопутствующего класса. 

В следующем примере класс `Circle` содержит метод с именем `area`, который специфичен для каждого экземпляра.
А его сопутствующий объект содержит метод с именем `calculateArea`, 
который (а) не специфичен для экземпляра и (б) доступен для каждого экземпляра:

```scala mdoc:silent
import scala.math.*
case class Circle(radius: Double):
  import Circle.*
  def area: Double = calculateArea(radius)
object Circle:
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
val circle = Circle(5.0)
```
```scala mdoc
circle.area
```

В этом примере метод `area`, доступный для каждого экземпляра `Circle`, использует метод `calculateArea`, 
определенный в сопутствующем объекте. 
Кроме того, поскольку `calculateArea` является закрытым, к нему нельзя получить доступ с помощью другого кода, 
но, как показано, его могут видеть экземпляры класса `Circle`.

#### Другие виды использования сопутствующих объектов

Сопутствующие объекты могут использоваться для нескольких целей:
- их можно использовать для группировки "статических" методов в пространстве имен, как в примере выше
  - эти методы могут быть `public` или `private`
  - если бы `calculateArea` был `public`, к нему можно было бы получить доступ из любого места как `Circle.calculateArea`
- они могут содержать методы `apply`, которые — благодаря некоторому синтаксическому сахару — 
работают как фабричные методы для создания новых экземпляров
- они могут содержать методы `unapply`, которые используются для деконструкции объектов, 
например, с помощью pattern matching

Вот краткий обзор того, как методы `apply` можно использовать в качестве фабричных методов для создания новых объектов:

```scala mdoc:reset
class Person:
  var name = ""
  var age = 0
  override def toString = s"$name is $age years old"
object Person:

  def apply(name: String): Person = // a one-arg factory method
    val p = new Person
    p.name = name
    p

  def apply(name: String, age: Int): Person =   // a two-arg factory method
    val p = new Person
    p.name = name
    p.age = age
    p
end Person
val joe = Person("Joe")
val fred = Person("Fred", 29)
```

### Traits

Если провести аналогию с Java, то Scala `trait` похож на интерфейс в Java 8+.
`trait`-ы могут содержать:
- абстрактные методы и поля
- конкретные методы и поля
- могут иметь параметры конструктора, как и классы

В базовом использовании `trait` может использоваться как интерфейс, 
определяющий только абстрактные члены, которые будут реализованы другими классами:

```scala mdoc:silent
trait Employee:
  def id: Int
  def firstName: String
  def lastName: String 
```

`traits` также могут содержать определенные методы:

```scala mdoc:silent
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
```
```scala mdoc:silent
trait HasTail:
  def tailColor: String
  def wagTail() = println("Tail is wagging")
  def stopTail() = println("Tail is stopped")
```

Классы и объекты могут расширять несколько `traits`, что позволяет с их помощью создавать небольшие модули.

```scala mdoc:silent
class IrishSetter(name: String) extends HasLegs, HasTail:
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
```

В классе `IrishSetter` реализованы все абстрактные параметры и методы, поэтому можно создать его экземпляр:

```scala mdoc
val d = IrishSetter("Big Red")
```

Класс также может переопределять методы `trait`-ов при необходимости.

### Абстрактные классы

Когда необходимо написать класс, но известно, что в нем будут абстрактные члены, можно создать либо `trait`, 
либо абстрактный класс. 
В большинстве случаев желательно использовать `trait`, но исторически сложилось так, что было две ситуации, 
когда предпочтительнее использование абстрактного класса:
- необходимо создать базовый класс, который принимает аргументы конструктора
- код будет вызван из Java-кода

#### Базовый класс, который принимает аргументы конструктора

До Scala 3, когда базовому классу нужно было принимать аргументы конструктора, он объявлялся как абстрактный класс:

```scala
abstract class Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

Однако в Scala 3 `trait`-ы могут иметь параметры, так что теперь в той же ситуации можно использовать `trait`-ы:

```scala
trait Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

`trait`-ы более гибки в составлении, потому что можно смешивать (наследовать) несколько `trait`-ов, 
но только один класс.
В большинстве случаев `trait`-ы следует предпочитать классам и абстрактным классам. 
Правило выбора состоит в том, чтобы использовать классы всякий раз, 
когда необходимо создавать экземпляры определенного типа, 
и `trait`-ы, когда желательно разложить и повторно использовать поведение.

### Enums

Перечисление (an enumeration) может быть использовано для определения типа, 
состоящего из конечного набора именованных значений 
(в разделе, [посвященном моделированию ФП](fp), будут показаны дополнительные возможности `enums`). 
Базовые перечисления используются для определения наборов констант, таких как месяцы в году, дни в неделе, 
направления, такие как север/юг/восток/запад, и многое другое.

В качестве примера, рассмотрим перечисления, определяющие наборы атрибутов, связанных с пиццами:

```scala mdoc:silent
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

Для использования в коде `enum` необходимо импортировать:

```scala mdoc:silent
import CrustSize.*
val currentCrustSize = Small
```

Значения `enum`-ов можно сравнивать и использовать в матчинге:

```scala mdoc
if (currentCrustSize == Small)
  println("If you buy a large pizza, you'll get a prize!")
currentCrustSize match
  case Small => println("small")
  case Medium => println("medium")
  case Large => println("large")
```

#### Дополнительные возможности enums

Перечисления могут иметь параметры конструктора:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

а также содержать параметры и методы:

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) = otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // more planets here ...
```

#### Совместимость с Java enums

Если необходимо использовать определенные в Scala перечисления в качестве перечислений Java, 
можно сделать это, расширив класс `java.lang.Enum` (который импортируется по умолчанию) следующим образом:

```scala
enum Color extends Enum[Color] { case Red, Green, Blue }
```

Параметр типа берется из определения Java `enum` и должен совпадать с типом перечисления. 
Нет необходимости предоставлять аргументы конструктора (как определено в документах Java API) для `java.lang.Enum` 
при его расширении — компилятор генерирует их автоматически.

После определения `Color` его можно использовать так же, как если бы использовался Java `enum`:

```scala
Color.Red.compareTo(Color.Green)
```

### Case classes

Scala `case class` позволяет моделировать концепции с неизменяемыми структурами данных.
`case class` обладает всеми функциональными возможностями класса,
а также имеет встроенные дополнительные функции, которые делают их полезными для функционального программирования.

`case class` имеет следующие эффекты и преимущества:
- Параметры конструктора `case class` по умолчанию являются общедоступными полями `val`, 
поэтому поля являются неизменяемыми, а методы доступа генерируются для каждого параметра.
- Генерируется метод `unapply`, который позволяет использовать `case class` в `match` выражениях.
- В классе создается метод `copy`, который позволяет создавать копии объекта без изменения исходного объекта.
- генерируются методы `equals` и `hashCode` для проверки структурного равенства, что позволяет использовать экземпляры `case class` в `Map`.
- генерируется метод `toString`, который полезен для отладки.

Этот код демонстрирует несколько функций `case class`:

```scala mdoc:reset
case class Person(name: String, vocation: String)
val person = Person("Reginald Kenneth Dwight", "Singer")
person.name
```

Необходимо помнить, что поля в `case class`-е неизменяемые:

```scala
person.name = "Joe" // error: Reassignment to val name
```

Остальные возможности продемонстрированы в коде:

```scala mdoc
println(person)
person match
  case Person(n, r) => println("name is " + n)
val elton = Person("Elton John", "Singer")
person == elton

case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
```

#### Поддержка функционального программирования

Как уже упоминалось ранее, `case class`-ы поддерживают функциональное программирование (ФП):
- ФП избегает изменения структур данных. Поэтому поля конструктора по умолчанию имеют значение `val`. 
Поскольку экземпляры `case class` не могут быть изменены, ими можно легко делиться, не опасаясь мутаций или условий гонки.
- вместо изменения экземпляра можно использовать метод `copy` в качестве шаблона для создания нового 
(потенциально измененного) экземпляра. Этот процесс можно назвать "обновлением по мере копирования".
- наличие автоматически сгенерированного метода `unapply` позволяет использовать `case class` в сопоставлении шаблонов.


### Case objects

`Case object`-ы относятся к объектам так же, как `case class`-ы относятся к классам: 
они предоставляют ряд автоматически генерируемых методов, чтобы сделать их более мощными.
`Case object`-ы особенно полезны тогда, когда необходим одноэлементный объект, 
который нуждается в небольшой дополнительной функциональности, 
например, для использования с сопоставлением шаблонов в выражениях match.

`Case object`-ы полезны, когда необходимо передавать неизменяемые сообщения. 
Например, представим проект музыкального проигрывателя, и создадим набор команд или сообщений:

```scala
sealed trait Message
case class PlaySong(name: String) extends Message
case class IncreaseVolume(amount: Int) extends Message
case class DecreaseVolume(amount: Int) extends Message
case object StopPlaying extends Message
```

Затем в других частях кода можно написать методы, которые используют сопоставление с образцом 
для обработки входящего сообщения 
(при условии, что методы `playSong`, `changeVolume` и `stopPlayingSong` определены где-то еще):

```scala
def handleMessages(message: Message): Unit = message match
  case PlaySong(name)         => playSong(name)
  case IncreaseVolume(amount) => changeVolume(amount)
  case DecreaseVolume(amount) => changeVolume(-amount)
  case StopPlaying            => stopPlayingSong()
```

---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
