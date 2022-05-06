---
layout: docsplus
title: "Методы расширения"
prev: ./ca-given-imports
next: ./ca-type-classes
---

## {{page.title}}

Методы расширения (_extension methods_) позволяют добавлять методы к типу после его определения, 
т.е. позволяют добавлять новые методы в закрытые классы. 
Например, предположим, что кто-то другой создал класс `Circle`:

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

Теперь представим, что необходим метод `circumference`, но нет возможности изменить исходный код `Circle`. 
До того как концепция вывода терминов была введена в языки программирования, 
единственное, что можно было сделать, это написать метод в отдельном классе или объекте, подобном этому:

```scala
object CircleHelpers:
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
```

Затем этот метод можно было использовать следующим образом:

```scala
val aCircle = Circle(2, 3, 5)

CircleHelpers.circumference(aCircle)
```

Методы расширения позволяют создать метод `circumference` для работы с экземплярами `Circle`:

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
```

В этом коде:
- `Circle` — это тип, к которому будет добавлен метод расширения `circumference`
- Синтаксис `c: Circle` позволяет ссылаться на переменную `c` в методах расширения

Затем в коде метод `circumference` можно использовать так же, как если бы он был изначально определен в классе `Circle`:

```scala
aCircle.circumference
```

#### Импорт методов расширения

Представим, что `circumference` определен в пакете `lib` - его можно импортировать с помощью

```scala
import lib.circumference

aCircle.circumference
```

Если импорт отсутствует, то компилятор выводит подробное сообщение об ошибке, 
подсказывая возможный импорт, например так:

```scala
value circumference is not a member of Circle, but could be made available as an extension method.

The following import might fix the problem:

  import lib.circumference
```

### Обсуждение

Ключевое слово `extension` объявляет о намерении определить один или несколько методов расширения для типа, 
заключенного в круглые скобки. 
Чтобы определить для типа несколько методов расширения, используется следующий синтаксис:

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/ca-extension-methods.html)
