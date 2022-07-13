---
layout: dp
title: "Abstract Factory"
section: dp
prev: index
---

## {{page.title}}

#### Описание

Цель паттерна:
Предоставить интерфейс для создания семейств связанных или зависимых объектов без указания конкретных классов.

Допустим, необходимо создать библиотеку графического интерфейса, 
которая должна работать на разных платформах, таких как Microsoft Windows или Mac OSX. 
Чтобы поддерживать собственный внешний вид на каждой платформе, например, для графического окна, 
сохраняя при этом переносимость клиентского кода между платформами, 
клиентам должен быть доступен только интерфейс окна. 
Обычно окно состоит из нескольких виджетов, некоторые из которых могут зависеть от конкретной платформы. 
Что именно и как создается конкретное окно, абстрагируется от клиентского кода абстрактной фабрикой. 
Это позволяет изменять код создания объектов без изменения клиентского кода. 
Поскольку клиент не знает о конкретных классах, в клиенте не вводятся зависимости от платформы. 
Казалось бы, можно изменить реализации окна и связанных с ним виджетов 
и предоставить новые, если они соответствуют абстрактному интерфейсу. 
Обычно фабрика создает семейство продуктов, 
в наших настройках графического интерфейса это могут быть окна, меню и т.д. 
Важной проблемой является то, что мы не должны смешивать классы, зависящие от платформы, 
так как это может привести к ошибкам во время выполнения. 
Конкретные фабрики чаще всего реализуются в виде singleton-ов.

#### Диаграмма

![Абстрактная фабрика](https://upload.wikimedia.org/wikipedia/commons/9/9d/Abstract_factory_UML.svg)

#### Пример

`trait WindowFactory` определяет интерфейс для фабрики. Он содержит типы `aWindow` и `aScrollbar`. 
Эти типы сверху ограничены trait-ми и должны быть доработаны на конкретных фабриках. 
Код создания экземпляра, общий для конкретных фабрик, может быть повторно использован в подклассах, 
если они ссылаются только на определенные абстрактные типы. 
Абстрактные продукты - это оба trait-а, вложенных в фабричный признак, то есть `Window` и `Scrollbar`. 
Любой конкретный продукт должен расширяться их. 
Абстрактные фабричные методы `createWindow` и `createScrollbar` 
скрывают фактический код создания экземпляра от клиентов.

```scala mdoc
trait WindowFactory:
  type aWindow <: Window
  type aScrollbar <: Scrollbar

  def createWindow(s: aScrollbar): aWindow
  def createScrollbar(): aScrollbar

  trait Window(s: aScrollbar)
  trait Scrollbar
```

Ниже показано, как можно расширить нашу абстрактную фабрику с помощью конкретной фабрики. 
Конкретная фабрика в данном примере - это объект singleton, содержащий protected nested классы. 
Это конкретная реализация. Поскольку они protected, они скрыты от клиентов.

```scala mdoc
object VistaFactory extends WindowFactory:
  type aWindow = VistaWindow
  type aScrollbar = VistaScrollbar

  def createWindow(s: aScrollbar) = VistaWindow(s)
  def createScrollbar() = new VistaScrollbar

  val scrollbar: aScrollbar = new VistaScrollbar
  val window: aWindow = VistaWindow(scrollbar)

  protected class VistaWindow(s: aScrollbar) extends Window(s)
  protected class VistaScrollbar extends Scrollbar
```






---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%90%D0%B1%D1%81%D1%82%D1%80%D0%B0%D0%BA%D1%82%D0%BD%D0%B0%D1%8F_%D1%84%D0%B0%D0%B1%D1%80%D0%B8%D0%BA%D0%B0_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
