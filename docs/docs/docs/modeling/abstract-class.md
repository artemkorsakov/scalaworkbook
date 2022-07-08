---
layout: docsplus
title: "Абстрактные классы"
section: scala
prev: modeling/traits
next: modeling/enums
---

## {{page.title}}

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


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
