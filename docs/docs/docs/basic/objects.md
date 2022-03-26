---
layout: docs
title: "Singleton objects"
---

В Scala ключевое слово `object` создает одноэлементный объект (singleton). 
Другими словами, объект определяет класс, который имеет ровно один экземпляр.

Объекты имеют несколько применений:
- Они используются для создания коллекций служебных методов.
- _companion object_ - это объект, имеющий то же имя, что и класс, с которым он совместно использует файл. 
В этой ситуации класс называется _companion class_.
- Они используются для имплементации `traits` для создания _modules_.

## "Полезные" методы

Поскольку объект является одноэлементным, к его методам можно получить доступ, как к статическим методам в классе Java. 
Например, этот объект `StringUtils` содержит небольшую коллекцию методов, связанных со строками:

```scala mdoc:silent
object StringUtils:
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
  def leftTrim(s: String): String = s.replaceAll("^\\s+", "")
  def rightTrim(s: String): String = s.replaceAll("\\s+$", "")
```

Поскольку `StringUtils` является одноэлементным, его методы могут вызываться непосредственно в объекте:

```scala mdoc
StringUtils.isNullOrEmpty("")
StringUtils.isNullOrEmpty("a")
```

## Companion objects

Сопутствующий класс или объект может получить доступ к закрытым членам своего сопутствующего соседа. 
Сопутствующий объект (companion objects) используется для методов и значений, которые не являются специфичными для экземпляров сопутствующего класса.

Пример демонстрирует, как метод `area` в сопутствующем классе может получить доступ 
к приватному методу `calculateArea` в его сопутствующем объекте:

```scala mdoc:silent
import scala.math.*
class Circle(radius: Double):
  import Circle.*
  def area: Double = calculateArea(radius)
object Circle:
  private def calculateArea(radius: Double): Double =
    Pi * pow(radius, 2.0)
val circle = Circle(5.0)
```
```scala mdoc
circle.area
```

## Создание модулей из traits

Объекты также могут быть использованы для реализации `traits` для создания модулей. 
Эта техника использует два `trait`-а и объединяет их для создания конкретного объекта:

```scala mdoc
trait AddService:
  def add(a: Int, b: Int) = a + b
trait MultiplyService:
  def multiply(a: Int, b: Int) = a * b
object MathService extends AddService, MultiplyService
import MathService.*
add(1,1)
multiply(2,2)
```
