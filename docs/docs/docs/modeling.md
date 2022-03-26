---
layout: docs
title: "Моделирование данных в ООП и ФП"
---

## {{page.title}}

## OOP Domain Modeling

При написании кода в стиле ООП двумя основными инструментами для инкапсуляции данных являются _traits_ и _classes_.

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


### Classes

Классы используются для разработки в стиле ООП. Вот пример класса, который моделирует "человека". 

```scala mdoc
class Person(firstName: String, lastName: String):
  override def toString: String = s"$firstName $lastName"
Person("John", "Stephens")
```

## FP Domain Modeling

При написании кода в стиле FP можно использовать такие конструкции:
- Enums
- Case classes
- Traits

### Enums

Конструкция `enum` - отличный способ моделирования алгебраических типов данных. Например:

```scala mdoc
enum CrustSize:
  case Small, Medium, Large
```

`enum` можно использовать в матчинге и условиях:

```scala mdoc
import CrustSize.*
val currentCrustSize = Small
currentCrustSize match
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")
if currentCrustSize == Small then println("Small crust size")
```

Ещё один пример `enum`-а:

```scala mdoc
enum Nat:
  case Zero
  case Succ(pred: Nat)
```

### Case classes

Scala `case class` позволяет моделировать концепции с неизменяемыми структурами данных.
`case class` обладает всеми функциональными возможностями класса, 
а также имеет встроенные дополнительные функции, которые делают их полезными для функционального программирования. 

`case class` имеет следующие эффекты и преимущества:
- Параметры конструктора `case class` по умолчанию являются общедоступными полями `val`, поэтому поля являются неизменяемыми, а методы доступа генерируются для каждого параметра.
- Генерируется метод `unapply`, который позволяет использовать `case class` в `match` выражениях.
- В классе создается метод `copy`, который позволяет создавать копии объекта без изменения исходного объекта.
- генерируются методы `equals` и `hashCode` для проверки структурного равенства.
- генерируется метод `toString`, который полезен для отладки.

Этот код демонстрирует несколько функций `case class`:

```scala mdoc:reset
case class Person(name: String, vocation: String)
val p = Person("Reginald Kenneth Dwight", "Singer")
p.name
```
```scala mdoc:fail
p.name = "Joe"
```
```scala mdoc
val p2 = p.copy(name = "Elton John")
```

---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
