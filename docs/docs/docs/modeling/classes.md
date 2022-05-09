---
layout: docsplus
title: "Classes"
prev: ../modeling
next: objects
---

## {{page.title}}

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


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
