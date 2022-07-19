---
layout: dp
title: "Observer"
section: dp
prev: behavioral/memento
next: behavioral/state
---

## {{page.title}}

#### Назначение

Определение зависимости "один ко многим" между объектами, 
чтобы при изменении состояния одного объекта все его иждивенцы уведомлялись и обновлялись автоматически.

Шаблон также известен как публикация/подписка, что указывает на структуру шаблона: 
объект играет роль издателя, любое количество объектов может подписаться на издателя, 
тем самым получая уведомление всякий раз, когда в издателе происходит определенное событие. 
Обычно издатель передает свой экземпляр в уведомлении. 
Это позволяет подписчику запрашивать у издателя любую соответствующую информацию, 
например, чтобы иметь возможность синхронизировать состояние.

#### Диаграмма

![Observer](https://upload.wikimedia.org/wikipedia/commons/b/bd/Observer_UML_smal.png?uselang=ru)

#### Пример

```scala mdoc:silent
trait Subject[T] { self: T =>
  import scala.collection.mutable
  private val observers: mutable.ListBuffer[T => Unit] =
    mutable.ListBuffer.empty[T => Unit]

  def subscribe(obs: T => Unit): Unit =
    observers.addOne(obs)

  def unsubscribe(obs: T => Unit): Unit =
    observers.subtractOne(obs)

  protected def publish(): Unit = observers.foreach(obs => obs(self))
}
```

```scala mdoc:silent
trait Sensor(val label: String):
  var value: Double = _
  def changeValue(v: Double): Unit = value = v

// Pattern specific code
trait SensorSubject extends Sensor with Subject[Sensor]:
  override def changeValue(v: Double): Unit =
    super.changeValue(v)
    publish()

class Display(label: String):
  def notify(s: Sensor): Unit =
    println(s"$label ${s.label} ${s.value}")
```

```scala mdoc
val s1: SensorSubject = new Sensor("s1") with SensorSubject
val d1: Display = new Display("d1")
val d2: Display = new Display("d2")
s1.subscribe(d1.notify)
s1.subscribe(d2.notify)
s1.changeValue(10)
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
