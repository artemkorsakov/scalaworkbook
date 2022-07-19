---
layout: dp
title: "Template Method"
section: dp
prev: behavioral/interpreter
next: behavioral/chain-of-responsibility
---

## {{page.title}}

#### Назначение

Определить скелет алгоритма в операции, отложив некоторые шаги на подклассы. 
Шаблонный метод позволяет подклассам переопределять определенные шаги алгоритма без изменения структуры алгоритма.

#### Диаграмма

![Template Method](https://upload.wikimedia.org/wikipedia/commons/5/52/Template_Method_UML.svg?uselang=ru)

#### Пример

```scala mdoc
trait Template extends (Unit => Int):
  def subStepA(): Unit
  def subStepB: Int
  def apply: Int =
    subStepA()
    subStepB
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BC%D0%B5%D1%82%D0%BE%D0%B4_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
