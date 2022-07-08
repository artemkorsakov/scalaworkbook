---
layout: docsplus
title: "Параметры по умолчанию"
section: scala
prev: methods/method-features
next: methods/named-parameters
---

## {{page.title}}

В параметрах метода можно указывать значения по умолчанию. 
В этом примере значения по умолчанию заданы как для `timeout`, так и для `protocol`:

```scala mdoc:silent
def makeConnection(timeout: Int = 5_000, protocol: String = "http") =
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
```

Поскольку параметры имеют значения по умолчанию, метод можно вызвать следующими способами:

```scala mdoc
makeConnection()                
makeConnection(2_000)          
makeConnection(3_000, "https")
```

Ключевые моменты:
- в первом примере метод вызывается без аргументов, 
поэтому он использует значения параметров по умолчанию: `5_000` и `http`
- во втором примере для значения `timeout` указано `2_000` -
оно используется вместе со значением по умолчанию для `protocol`
- в третьем примере указаны значения для обоих параметров, поэтому используются именно они

Обратите внимание, что при использовании значений параметров по умолчанию создается впечатление, 
что используются три разных переопределенных метода.


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
