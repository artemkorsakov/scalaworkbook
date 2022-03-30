---
layout: docs
title: "Инструменты"
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

Эти примеры показывают, как в Scala легко объявить класс.

В примере выше все параметры классов определены как поля `var`, что означает, что они изменяемы. 
Если необходимо, чтобы они были неизменяемыми, можно создать их как `val` или использовать case class.

Новый экземпляр класса создается следующим образов 
(без ключевого слова new, благодаря [универсальным apply методам](https://docs.scala-lang.org/scala3/reference/other-new-features/creator-applications.html)):

```scala mdoc
val p = Person("Robert Allen Zimmerman", "Harmonica Player")
```

Если у вас есть экземпляр класса, такого как `p`, вы можете получить доступ к его полям, 
которые в этом примере являются параметрами конструктора:

```scala mdoc
p.name
p.vocation
```

Как уже упоминалось, все эти параметры были созданы как поля `var`, поэтому их можно изменять:

```scala mdoc
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
Это особенно полезно, когда параметры имеют одинаковый тип:

```scala mdoc
Socket(10_000, 10_001)
Socket(timeout = 10_000, linger = 10_001)
Socket(linger = 10_000, timeout = 10_001)
```

#### Вспомогательные конструкторы

Можно определить класс так, чтобы у него было несколько конструкторов, чтобы его можно было создавать разными способами. 
Например, предположим, что нужно иметь возможность создавать экземпляр `Student` тремя способами:
- с именем и государственным ID (1)
- с именем, государственным ID и дополнительной датой подачи заявления (2)
- с именем, государственным ID и студенческим ID (3)

Пример описания класса с тремя этими конструкторами:

```scala mdoc
import java.time.*

// [1] основной конструктор
class Student(
  var name: String,
  var govtId: String
):
  private var _applicationDate: Option[LocalDate] = None
  private var _studentId: Int = 0

  // [2] конструктор с датой подачи заявления
  def this(
    name: String,
    govtId: String,
    applicationDate: LocalDate
  ) =
    this(name, govtId)
    _applicationDate = Some(applicationDate)

  // [3] конструктор со студенческим id
  def this(
    name: String,
    govtId: String,
    studentId: Int
  ) =
    this(name, govtId)
    _studentId = studentId
```

Класс имеет три конструктора, заданные пронумерованными комментариями в коде.
Эти конструкторы могут быть вызваны следующим образом:

```scala mdoc
Student("Mary", "123")
Student("Mary", "123", LocalDate.now)
Student("Mary", "123", 456)
```

Для возможности создания классов различными способами можно использовать как параметры по умолчанию, 
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

```scala mdoc:reset:fail
import StringUtils.{truncate, containsWhitespace}
truncate("Charles Carmichael", 7)    
containsWhitespace("Captain Awesome") 
isNullOrEmpty("Morgan Grimes")  
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
Аналогично, соответствующий класс называется сопутствующим классом объекта (_companion class_). Сопутствующий класс или объект может получить доступ к закрытым членам своего сопутствующего класса.

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

  // a one-arg factory method
  def apply(name: String): Person =
    val p = new Person
    p.name = name
    p

  // a two-arg factory method
  def apply(name: String, age: Int): Person =
    val p = new Person
    p.name = name
    p.age = age
    p

end Person

val joe = Person("Joe")
val fred = Person("Fred", 29)
```

### Traits

`traits` можно использовать как простые интерфейсы, но они также могут содержать абстрактные и конкретные методы и поля,
и они могут иметь параметры, как и классы.
Классы и объекты могут расширять несколько `traits`.

Рассмотрим пример:

```scala mdoc
trait Speaker:
  def speak(): String
trait TailWagger:
  def startTail(): Unit = println("tail is wagging")
  def stopTail(): Unit = println("tail is stopped")
trait Runner:
  def startRunning(): Unit = println("I’m running")
  def stopRunning(): Unit = println("Stopped running") 
```

Класс `Dog` может расширить все три `trait`-а, определяя абстрактный метод `speak`:

```scala mdoc:silent
class Dog(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Woof!"
val dog = Dog("Rover")  
```

Класс также может переопределять методы `trait`-ов. Рассмотрим пример класса `Cat`:

```scala mdoc:silent
class Cat(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
val cat = Cat("Morris")  
```

В результате получим:

```scala mdoc
dog.speak()
dog.startRunning()
dog.stopRunning()
cat.speak()
cat.startRunning()      
cat.stopRunning()    
```




---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)