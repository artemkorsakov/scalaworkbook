---
layout: docsplus
title: "Каррирование"
section: scala
prev: methods/by-name-parameter
next: methods/vararg-parameters
---

## {{page.title}}

В методе можно указывать несколько групп параметров. При указании только части групп параметров возвращается
частично определенная функция. Пример:

```scala mdoc
def sum(a: Int)(b: Int): Int =
  a + b

def add2(b: Int): Int = sum(2)(b)

sum(42)(42)
add2(42)
```


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
