---
layout: dp
title: "State"
section: dp
prev: behavioral/observer
next: behavioral/strategy
---

## {{page.title}}

#### Назначение

Позволить объекту изменить свое поведение при изменении его внутреннего состояния. Объект изменит свой класс. 
Паттерн состояния актуален, когда поведение объекта зависит от его внутреннего состояния.

#### Диаграмма

![State](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/State_Design_Pattern_UML_Class_Diagram.svg/475px-State_Design_Pattern_UML_Class_Diagram.svg.png)

#### Пример

```scala mdoc:silent
class Context:
  private var currentState: State = State1

  def operation(): Unit = currentState.operation()

  trait State:
    def operation(): Unit

  private object State1 extends State:
    def operation(): Unit =
      println("State1")
      currentState = State2

  private object State2 extends State:
    def operation(): Unit =
      println("State2")
      currentState = State1

end Context
```

```scala mdoc
val c = new Context
c.operation()
c.operation()
c.operation()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
