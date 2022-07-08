---
layout: docsplus
title: "Параметры функции"
section: scala
prev: functions/anonymous
next: functions/eta
---

## {{page.title}}

Вернемся к примеру из предыдущего раздела:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
```

Анонимной функцией является следующая часть: `(i: Int) => i * 2`

Причина, по которой она называется анонимной (_anonymous_), заключается в том, 
что она не присваивается переменной и, следовательно, не имеет имени.

Однако анонимная функция, также известная как функциональный литерал (_function literal_), 
может быть назначена переменной для создания функциональной переменной (_function variable_):

```scala
val double = (i: Int) => i * 2
```

Код выше создает функциональную переменную с именем `double`. 
В этом выражении исходный литерал функции находится справа от символа `=`, а новое имя переменной - слева.
Список параметров функции подчеркнут:

```scala
val double = (i: Int) => i * 2
             --------
```

Как и список параметров для метода, список параметров функции означает, 
что функция `double` принимает один параметр с типом `Int` и именем `i`. 
Как можно видеть ниже, `double` имеет тип `Int => Int`, что означает, 
что он принимает один параметр `Int` и возвращает `Int`:

```scala mdoc:silent
val double = (i: Int) => i * 2
// double: Int => Int = ...
```

#### Вызов метода

Функция `double` может быть вызвана так:

```scala mdoc
val x = double(2)
```

`double` также можно передать в вызов `map`:

```scala mdoc
List(1, 2, 3).map(double)
```

Кроме того, когда есть другие функции типа `Int => Int`:

```scala mdoc:silent
val triple = (i: Int) => i * 3
```

можно сохранить их в `List` или `Map`:

```scala mdoc:silent
val functionList: List[Int => Int] = List(double, triple)
val functionMap: Map[String, Int => Int] = Map(
  "2x" -> double,
  "3x" -> triple
)
```

`functionList` имеет тип `List[Int => Int]`, `functionMap` - `Map[String, Int => Int]`.


### Ключевые моменты

Ключевые моменты:
- чтобы создать функциональную переменную, достаточно присвоить имя переменной функциональному литералу
- когда есть функция, с ней можно обращаться как с любой другой переменной, то есть как со `String` или `Int` переменной

А благодаря улучшенной функциональности [Eta Expansion](eta) в Scala 3 с методами можно обращаться точно так же.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/fun-intro.html)
- [Scala3 book, Function Variables](https://docs.scala-lang.org/scala3/book/fun-function-variables.html)
