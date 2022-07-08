---
layout: docsplus
title: "Companion objects"
section: scala
prev: modeling/objects
next: modeling/traits
---

## {{page.title}}

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


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
