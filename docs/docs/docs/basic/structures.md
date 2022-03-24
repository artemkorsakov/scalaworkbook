---
layout: docs
title: "Основные конструкции"
---

### Конструкции в Scala

#### Запуск main метода в Scala:

```scala
@main def hello = println("Hello, world!")
```

Метод `hello` компилится в отдельный класс на уровне пакета с именем класса равным имени метода.
В один файл можно добавлять несколько main методов с различными именами.

#### if/else

```scala mdoc
def detect(x: Int) = 
  if x < 0 then
    println("negative")
  else if x == 0 then
    println("zero")
  else
    println("positive")
detect(-1)    
detect(0) 
detect(1) 
```

#### for loops and expressions

```scala mdoc:silent
val ints = List(1, 2, 3, 4, 5)
```
```scala mdoc
for i <- ints do print(s"$i ")
```

Можно добавлять условия:

```scala mdoc
for
  i <- ints
  if i > 2
do
  print(s"$i ")
```

А также несколько переменных:
```scala mdoc
for
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
do
  println(s"i = $i, j = $j")
```

Замена `do` на `yield` позволяет вычислять выражения:

```scala mdoc:silent
val fruits = List("apple", "banana", "lime", "orange")
```
```scala mdoc
for
  f <- fruits
  if f.length > 4
yield
  f.capitalize
```

#### match expressions

Сопоставление с шаблоном:

```scala mdoc
case class Person(name: String)
def getQuote(p: Person): String = p match
  case Person(name) if name == "Fred" =>
    s"$name says, Yubba dubba doo"
  case Person("Bam Bam") => // или даже так
    "Bam Bam says, Bam bam!"
  case _ => "Watch the Flintstones!"
getQuote(Person("Fred"))
getQuote(Person("Bam Bam"))
getQuote(Person("Aaron")) 
```

#### try/catch/finally

Перехват исключений:

```scala mdoc
def parseInt(s: String): Option[Int] = 
  try
    Some(s.toInt)
  catch
    case nfe: NumberFormatException => 
      println("Got a NumberFormatException.")
      None
  finally
    println("Clean up your resources here.")
parseInt("1")
parseInt("one")
```

#### while loops

```scala mdoc
var x = 1
while
  x < 3
do
  println(x)
  x += 1
```

В Scala не приветствуется использование изменяемых переменных `var`, поэтому следует избегать использования `while`.
Вместо этого можно создать вспомогательный метод:

```scala mdoc
def loop(x: Int): Unit =
  if x < 3 then
    println(x)
    loop(x + 1)  
loop(1)
```
