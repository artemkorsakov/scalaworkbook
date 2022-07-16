---
layout: dp
title: "Builder"
section: dp
prev: creational/abstract-factory
next: creational/prototype
---

## {{page.title}}

#### Назначение

Отделение построения сложного объекта от его представления, 
чтобы один и тот же процесс построения мог создавать разные представления.

#### Диаграмма

![Builder](https://upload.wikimedia.org/wikipedia/ru/2/28/Builder.gif)

#### Пример

```scala mdoc
class Pizza(var dough: String = "", var sauce: String = "", var topping: String = ""):
  def outputReceipt(): Unit =
    println(s"Dough: $dough\nSauce: $sauce\nTopping: $topping")
trait PizzaBuilder:
  private var maybePizza: Option[Pizza] = None
  
  def getPizza: Pizza = maybePizza.getOrElse(throw new Exception("Pizza has not been created yet"))
  
  def createPizza(): Unit =
    maybePizza = Some(new Pizza)
    
  def buildDough(dough: String): Unit =
    getPizza.dough = dough
    
  def buildSauce(sauce: String): Unit =
    getPizza.sauce = sauce
    
  def buildTopping(topping: String): Unit =
    getPizza.topping = topping
end PizzaBuilder
```

Использование паттерна строитель:

```scala mdoc
object HawaiianPizzaBuilder extends PizzaBuilder:
  def createHawaiianPizza(): Pizza =
    createPizza()
    buildDough("cross")
    buildSauce("mild")
    buildTopping("ham+pineapple")
    getPizza
object SpicyPizzaBuilder extends PizzaBuilder:
  def createSpicyPizza(): Pizza =
    createPizza()
    buildDough("pan baked")
    buildSauce("hot")
    buildTopping("pepperoni+salami")
    getPizza
HawaiianPizzaBuilder.createHawaiianPizza().outputReceipt()
SpicyPizzaBuilder.createSpicyPizza().outputReceipt()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
