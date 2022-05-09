---
layout: docsplus
title: "Case classes"
prev: enums
next: oop
---

## Case classes и Case objects

### Case classes

Scala `case class` позволяет моделировать концепции с неизменяемыми структурами данных.
`case class` обладает всеми функциональными возможностями класса,
а также имеет встроенные дополнительные функции, которые делают их полезными для функционального программирования.

`case class` имеет следующие эффекты и преимущества:
- Параметры конструктора `case class` по умолчанию являются общедоступными полями `val`, 
поэтому поля являются неизменяемыми, а методы доступа генерируются для каждого параметра.
- Генерируется метод `unapply`, который позволяет использовать `case class` в `match` выражениях.
- В классе создается метод `copy`, который позволяет создавать копии объекта без изменения исходного объекта.
- генерируются методы `equals` и `hashCode` для проверки структурного равенства, что позволяет использовать экземпляры `case class` в `Map`.
- генерируется метод `toString`, который полезен для отладки.

Этот код демонстрирует несколько функций `case class`:

```scala mdoc:reset
case class Person(name: String, vocation: String)
val person = Person("Reginald Kenneth Dwight", "Singer")
person.name
```

Необходимо помнить, что поля в `case class`-е неизменяемые:

```scala
person.name = "Joe" // error: Reassignment to val name
```

Остальные возможности продемонстрированы в коде:

```scala mdoc
println(person)
person match
  case Person(n, r) => println("name is " + n)
val elton = Person("Elton John", "Singer")
person == elton

case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
```

#### Поддержка функционального программирования

Как уже упоминалось ранее, `case class`-ы поддерживают функциональное программирование (ФП):
- ФП избегает изменения структур данных. Поэтому поля конструктора по умолчанию имеют значение `val`. 
Поскольку экземпляры `case class` не могут быть изменены, ими можно легко делиться, не опасаясь мутаций или условий гонки.
- вместо изменения экземпляра можно использовать метод `copy` в качестве шаблона для создания нового 
(потенциально измененного) экземпляра. Этот процесс можно назвать "обновлением по мере копирования".
- наличие автоматически сгенерированного метода `unapply` позволяет использовать `case class` в сопоставлении шаблонов.


### Case objects

`Case object`-ы относятся к объектам так же, как `case class`-ы относятся к классам: 
они предоставляют ряд автоматически генерируемых методов, чтобы сделать их более мощными.
`Case object`-ы особенно полезны тогда, когда необходим одноэлементный объект, 
который нуждается в небольшой дополнительной функциональности, 
например, для использования с сопоставлением шаблонов в выражениях match.

`Case object`-ы полезны, когда необходимо передавать неизменяемые сообщения. 
Например, представим проект музыкального проигрывателя, и создадим набор команд или сообщений:

```scala
sealed trait Message
case class PlaySong(name: String) extends Message
case class IncreaseVolume(amount: Int) extends Message
case class DecreaseVolume(amount: Int) extends Message
case object StopPlaying extends Message
```

Затем в других частях кода можно написать методы, которые используют сопоставление с образцом 
для обработки входящего сообщения 
(при условии, что методы `playSong`, `changeVolume` и `stopPlayingSong` определены где-то еще):

```scala
def handleMessages(message: Message): Unit = message match
  case PlaySong(name)         => playSong(name)
  case IncreaseVolume(amount) => changeVolume(amount)
  case DecreaseVolume(amount) => changeVolume(-amount)
  case StopPlaying            => stopPlayingSong()
```


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
