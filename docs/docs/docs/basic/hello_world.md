---
layout: docs
title: "Hello world"
---

Запуск main метода в Scala:

``` scala
@main def hello = println("Hello, world!")
```

Метод main компилится в отдельный класс на уровне пакета с именем класса равным имени метода.

```scala
package workbook.basic

object DoesntMatterWhatTheNameOfTheObjectIs:
  @main def hello = println("Hello, scala!")
```

В примере выше скопилируется класс `workbook.basic.hello.class`
