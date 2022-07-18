---
layout: dp
title: "Iterator"
section: dp
prev: behavioral/command
next: behavioral/mediator
---

## {{page.title}}

#### Назначение

Предоставление способа последовательного доступа к элементам агрегатного объекта 
без раскрытия его базового представления.

#### Диаграмма

![Iterator](https://upload.wikimedia.org/wikipedia/commons/1/13/Iterator_UML_class_diagram.svg)

#### Пример

```scala mdoc
trait Iterator[A]:
  def first: A

  def next: A

  def isDone: Boolean

  def currentItem: A
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%98%D1%82%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
