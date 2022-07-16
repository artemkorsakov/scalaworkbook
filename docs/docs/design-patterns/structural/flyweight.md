---
layout: dp
title: "Flyweight"
section: dp
prev: structural/facade
next: structural/proxy
---

## {{page.title}}

#### Назначение

Использование совместного использования для эффективной поддержки большого количества мелких объектов.
Оптимизация работы с памятью путём предотвращения создания экземпляров элементов, имеющих общую сущность.

#### Диаграмма

![Flyweight](https://upload.wikimedia.org/wikipedia/commons/e/ee/Flyweight.gif)

#### Пример

Flyweight используется для уменьшения затрат при работе с большим количеством мелких объектов. 
При проектировании Flyweight необходимо разделить его свойства на внешние и внутренние. 
Внутренние свойства всегда неизменны, тогда как внешние могут отличаться в зависимости от места 
и контекста применения и должны быть вынесены за пределы приспособленца.

Flyweight дополняет шаблон Factory Method таким образом, 
что при обращении клиента к Factory Method для создания нового объекта 
ищет уже созданный объект с такими же параметрами, что и у требуемого, и возвращает его клиенту. 
Если такого объекта нет, то фабрика создаст новый.

```scala mdoc:silent
trait FlyWeightFactory[T1, T2] extends Function[T1, T2]:
  import scala.collection.mutable
  private val pool = mutable.Map.empty[T1, T2]

  def createFlyWeight(intrinsic: T1): T2

  def apply(index: T1): T2 =
    pool.getOrElseUpdate(index, createFlyWeight(index))

  def update(index: T1, elem: T2): Unit =
    pool(index) = elem

end FlyWeightFactory
```

```scala mdoc:silent
class Character(char: Char):
  import scala.util.Random
  private lazy val state = Random.nextInt()
  def draw(): Unit =
    println(s"drawing character - $char, state - $state")

object CharacterFactory extends FlyWeightFactory[Char, Character]:
  def createFlyWeight(c: Char) = new Character(c)
```

```scala mdoc
val f1 = CharacterFactory('a')
val f2 = CharacterFactory('b')
val f3 = CharacterFactory('a')
val f4 = new Character('a')
f1.draw()
f2.draw()
f3.draw()
f4.draw()
```

Обратите внимание, что `f1` и `f3` указывают на один и тот же общий объект-приспособленец.


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%BB%D0%B5%D0%BD%D0%B5%D1%86_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
