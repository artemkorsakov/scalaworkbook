---
layout: dp
title: "Memento"
section: dp
prev: behavioral/mediator
next: behavioral/observer
---

## {{page.title}}

#### Назначение

Не нарушая инкапсуляцию, захватить и вывести наружу внутреннее состояние объекта, 
чтобы объект можно было позже восстановить в это состояние.

#### Диаграмма

![Memento](https://upload.wikimedia.org/wikipedia/commons/1/18/Memento_design_pattern.png?uselang=ru)

#### Пример

```scala mdoc
trait Originator:
  def createMemento: Memento

  def setMemento(m: Memento): Unit

  trait Memento:
    def getState: Originator
    def setState(originator: Originator): Unit
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A5%D1%80%D0%B0%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
