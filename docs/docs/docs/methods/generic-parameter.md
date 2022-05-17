---
layout: docsplus
title: "Generic параметры"
prev: methods/vararg-parameters
next: methods/extension-methods
---

## {{page.title}}

Методы могут быть обобщенными. Пример:

```scala mdoc
def pack[A](a: A): List[A] =
  List(a)

pack[Int](42)
pack[String]("word")
```


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
