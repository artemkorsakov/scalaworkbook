---
layout: dp
title: "Chain of Responsibility"
section: dp
prev: behavioral/template-method
next: behavioral/command
---

## {{page.title}}

#### Назначение

Поведенческий шаблон проектирования, предназначенный для организации в системе уровней ответственности.
Избегайте связывания отправителя запроса с его получателем, 
предоставляя более чем одному объекту возможность обработать запрос. 
Цепляйте принимающие объекты и передайте запрос по цепочке, пока объект не обработает его. 

Идея шаблона состоит в том, чтобы отделить отправителей и получателей сообщения. 
Шаблон позволяет определить точного получателя сообщения во время выполнения.

#### Диаграмма

![Chain of Responsibility](https://upload.wikimedia.org/wikipedia/ru/a/ae/Chain.png)

#### Пример

```scala mdoc:silent
trait Handler[T]:
  var successor: Option[Handler[T]] = None

  def handleRequest(r: T): Unit =
    if handlingCriteria(r) then doThis(r)
    else successor.foreach(_.handleRequest(r))

  def doThis(v: T): Unit = ()
  def handlingCriteria(request: T): Boolean = false

end Handler
```

```scala mdoc:silent
class Sensor extends Handler[Int]:
  var value = 0
  def changeValue(v: Int): Unit =
    value = v
    handleRequest(value)

class Display1 extends Handler[Int]:
  def show(v: Int): Unit = println(s"Display1 prints $v")
  override def doThis(v: Int): Unit = show(v)
  override def handlingCriteria(v: Int): Boolean = v < 4
```

Другое решение, специфичный для шаблона код хранится в отдельном trait.

```scala mdoc:silent
class Display2:
  def show(v: Int): Unit = println(s"Display2 prints $v")

trait Display2Handler extends Display2 with Handler[Int]:
  override def doThis(v: Int): Unit = show(v)
  override def handlingCriteria(v: Int): Boolean = v >= 4
```

```scala mdoc
val sensor = new Sensor
val display1 = new Display1
val display2 = new Display2 with Display2Handler
sensor.successor = Some(display1)
display1.successor = Some(display2)
sensor.changeValue(2)
sensor.changeValue(4)
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A6%D0%B5%D0%BF%D0%BE%D1%87%D0%BA%D0%B0_%D0%BE%D0%B1%D1%8F%D0%B7%D0%B0%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9)
