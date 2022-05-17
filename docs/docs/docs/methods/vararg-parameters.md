---
layout: docsplus
title: "Variable Arguments"
prev: methods/partially-applied-functions
next: methods/generic-parameter
---

## Методы с неопределенным количеством параметров

Метод может иметь неопределенное количество параметров одного типа.
Они указываются с помощью синтаксиса `T*`. Пример:

```scala mdoc
def printAll(args: String*): Unit =
  args.foreach(println)

printAll("Adam")
printAll("Adam", "Bob")
printAll("Adam", "Bob", "Celin")
printAll("Adam", "Bob", "Celin", "David")
```


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
