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

Ещё пример:

```scala mdoc
val arr = Array(0, 1, 2, 3)
val lst = List(arr*)

def printList(lst: List[Int]): Unit =
  lst match
    case List(0, 1, xs*) => println(xs)
    case List(1, _*) => println("Starts with 1")
    case _ => println("Error")

printList(lst)
printList(lst.tail)
```


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/changed-features/vararg-splices.html)
