---
layout: dp
title: "Factory Method"
section: dp
prev: creational
next: creational/abstract-factory
---

## {{page.title}}

#### Назначение

Определение интерфейса для создания объекта, в котором подклассы решают, какой класс создавать. 
Фабричный метод позволяет классу отложить создание экземпляра для подклассов.
Фабричные методы обычно используются, когда класс не может предвидеть класс объектов, которые он должен создать.

#### Диаграмма

![Factory Method](https://upload.wikimedia.org/wikipedia/ru/f/f0/FactoryMethodPattern.png)

#### Пример

```scala mdoc
trait Document:
  def open(): Unit
  def close(): Unit

trait Application:
  type D <: Document
  def createDocument: D
```

Использование паттерна фабричный метод:

```scala mdoc
class ElectronicDocument extends Document:
  def open(): Unit = println("Open an e-doc")
  def close(): Unit = println("Close an e-doc")

object ElectronicApplication extends Application:
  type D = ElectronicDocument
  def createDocument: D = new ElectronicDocument

ElectronicApplication.createDocument.open()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A4%D0%B0%D0%B1%D1%80%D0%B8%D1%87%D0%BD%D1%8B%D0%B9_%D0%BC%D0%B5%D1%82%D0%BE%D0%B4_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
