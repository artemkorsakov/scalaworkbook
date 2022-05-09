---
layout: docsplus
title: "Traits"
prev: companion-objects
next: abstract-class
---

## {{page.title}}

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


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
