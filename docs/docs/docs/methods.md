---
layout: docs
title: "Методы"
---

## {{page.title}}

Scala `classes`, `case classes`, `traits`, `enums`, и `objects` могут содержать методы. 
Синтаксис простого метода выглядит следующим образом:

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // здесь тело метода
```

Несколько примеров:

```scala mdoc
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
sum(1, 2)
concatenate("foo", "bar")
```

В параметрах методов можно указывать дефолтные значения:

```scala mdoc
def makeConnection(url: String, timeout: Int = 5000): Unit =
  println(s"url=$url, timeout=$timeout")
makeConnection("https://localhost") 
makeConnection("https://localhost", 2500) 
```

Также можно использовать именованные параметры:

```scala mdoc
makeConnection(url = "https://localhost", timeout = 2500)
```

Именованные параметры особенно полезны, когда несколько параметров метода имеют один и тот же тип. 
На первый взгляд, можно задаться вопросом, какие параметры установлены в значение `true` или `false`:

```scala
engage(true, true, true, false)
```

Гораздо более понятным выглядит использование именованных переменных:

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```

## Расширяемые методы

Extension methods позволяют добавлять новые методы в закрытые классы. 
Пример добавления двух методов в класс `String`:

```scala mdoc
extension (s: String)
  def hello: String = s"Hello, ${s.capitalize}!"
  def aloha: String = s"Aloha, ${s.capitalize}!"
"world".hello
"friend".aloha
```

Ключевое слово `extension` объявляет о намерении определить один или несколько методов расширения для параметра, 
заключенного в круглые скобки. 
Как показано в примере выше, параметры типа `String` затем могут быть использованы в теле методов расширения.

В следующем примере показано, как добавить метод `makeInt` в класс `String`. 
Здесь `makeInt` принимает параметр с именем `radix`. 
Код не учитывает возможные ошибки преобразования строки в целое число, но, пропуская эту деталь, примеры показывают, как это работает:

```scala mdoc
extension (s: String)
  def makeInt(radix: Int): Int = Integer.parseInt(s, radix)
"1".makeInt(2)
"10".makeInt(2)
"100".makeInt(2)
```

---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-methods.html)
