---
layout: dp
title: "Decorator"
section: dp
prev: structural/composite
next: structural/facade
---

## {{page.title}}

#### Назначение

Динамически прикреплять дополнительные обязанности к объекту. 
Декораторы предоставляют гибкую альтернативу подклассам для расширения функциональности.

#### Диаграмма

![Decorator](https://upload.wikimedia.org/wikipedia/ru/0/00/Decorator_template.png)

#### Пример

```scala mdoc:silent
trait Component:
  def draw(): Unit

class TextView(var s: String) extends Component:
  def draw(): Unit = println(s"Drawing..$s")

trait EncapsulateTextView(c: TextView) extends Component:
  def draw(): Unit = c.draw()

trait BorderDecorator extends Component:
  abstract override def draw(): Unit =
    super.draw()
    drawBorder()
  def drawBorder(): Unit =
    println("Drawing border")

trait ScrollDecorator extends Component:
  abstract override def draw(): Unit =
    scrollTo()
    super.draw()
  def scrollTo(): Unit = println("Scrolling..")
```

```scala mdoc
val tw = new TextView("foo")
val etw1 = new EncapsulateTextView(tw) with BorderDecorator with ScrollDecorator
etw1.draw()
tw.s = "bar"
val etw2 = new EncapsulateTextView(tw) with ScrollDecorator with BorderDecorator
etw2.draw()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%94%D0%B5%D0%BA%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
