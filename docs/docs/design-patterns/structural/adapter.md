---
layout: dp
title: "Adapter"
section: dp
prev: structural
next: structural/bridge
---

## {{page.title}}

#### Назначение

Преобразовать интерфейс класса в другой интерфейс, ожидаемый клиентами. 
Адаптер позволяет классам работать вместе, что иначе было бы невозможно из-за несовместимых интерфейсов.

#### Диаграмма

![Adapter](https://upload.wikimedia.org/wikipedia/ru/0/04/Adapter_pattern.svg)

#### Пример

Решение Scala сочетает в себе большинство преимуществ адаптера класса и адаптера объекта в одном решении.

```scala mdoc:silent
trait Target:
  def f(): Unit

class Adaptee:
  def g(): Unit = println("g")

trait Adapter { self: Target with Adaptee =>
  def f(): Unit = g()
}
```

```scala mdoc
val adapter = new Adaptee with Adapter with Target
adapter.f()
adapter.g()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%90%D0%B4%D0%B0%D0%BF%D1%82%D0%B5%D1%80_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
