---
layout: dp
title: "Facade"
section: dp
prev: structural/decorator
next: structural/flyweight
---

## {{page.title}}

#### Назначение

Предоставление унифицированного интерфейса набору интерфейсов в подсистеме. 
`Facade` определяет высокоуровневый интерфейс, упрощающий использование подсистемы

#### Диаграмма

![Facade](https://upload.wikimedia.org/wikipedia/commons/5/56/UML_DP_Fa%C3%A7ade.png?uselang=ru)

#### Пример

```scala mdoc:silent
trait Facade:
  type A <: SubSystemA
  type B <: SubSystemB
  protected val subA: A
  protected val subB: B
  def foo(): Unit = subB.foo(subA)
  protected class SubSystemA
  protected class SubSystemB:
    def foo(sub: SubSystemA): Unit = println("Calling foo")
end Facade

object FacadeA extends Facade:
  type A = SubSystemA
  type B = SubSystemB
  val subA: A = new SubSystemA
  val subB: B = new SubSystemB
end FacadeA
```

```scala mdoc
FacadeA.foo()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A4%D0%B0%D1%81%D0%B0%D0%B4_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
