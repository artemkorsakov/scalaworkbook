---
layout: docs
title: "Моделирование данных в ООП и ФП"
---

## OOP Domain Modeling

При написании кода в стиле ООП двумя основными инструментами для инкапсуляции данных являются _traits_ и _classes_.

### Traits

Scala traits можно использовать как простые интерфейсы, но они также могут содержать абстрактные и конкретные методы и поля, 
и они могут иметь параметры, как и классы. 
Классы и объекты могут расширять несколько traits.

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

Класс `Dog` может расширить все три trait-а, определяя абстрактный метод `speak`:

```scala mdoc
class Dog(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Woof!"
```

Класс также может переопределять методы trait-ов. Рассмотрим пример класса `Cat`:

```scala mdoc
class Cat(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
```

В результате получим:

```scala mdoc:silent
val dog = Dog("Rover")
val cat = Cat("Morris")
```
```scala mdoc
dog.speak()
dog.startRunning()
dog.stopRunning()
cat.speak()
cat.startRunning()      
cat.stopRunning()    
```


### Classes

Классы используются в программировании в стиле ООП. Вот пример класса, который моделирует "человека". 
В ООП поля обычно изменяемы, поэтому `firstName` и `lastName` объявляются как var:

```scala mdoc:silent
class Person(var firstName: String, var lastName: String):
  def fullName() = s"$firstName $lastName"
val p = Person("John", "Stephens")
```
```scala mdoc
p.fullName()
p.lastName = "Legend"
p.fullName()
```

## FP Domain Modeling

### Enums

Описание

### Case classes

Описание