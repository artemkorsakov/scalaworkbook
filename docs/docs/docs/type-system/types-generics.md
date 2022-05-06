---
layout: docsplus
title: "Generics типы"
prev: ./types-inferred
next: ./types-intersection
---

## {{page.title}}

Универсальные (generic) классы (или trait-ы) принимают тип в качестве параметра в квадратных скобках `[...]`.
Для обозначения параметров типа согласно конвенции Scala используется одна заглавная буква (например, `A`). 
Затем этот тип можно использовать внутри класса по мере необходимости 
для параметров экземпляра метода или для возвращаемых типов:

```scala mdoc:silent
// здесь мы объявляем параметр типа A
//          v
class Stack[A]:
  private var elements: List[A] = Nil
  //                         ^
  //  здесь мы ссылаемся на этот тип
  //          v
  def push(x: A): Unit = { elements = elements.prepended(x) }
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```

Эта реализация класса `Stack` принимает любой тип в качестве параметра. 
Прелесть дженериков состоит в том, что теперь можно создавать `Stack[Int]`, `Stack[String]` и т. д., 
что позволяет повторно использовать реализацию `Stack` для произвольных типов элементов.

Пример создания и использования `Stack[Int]`:

```scala mdoc:silent
val stack = Stack[Int]
stack.push(1)
stack.push(2)
```
```scala mdoc
println(stack.pop())
println(stack.pop())
```

> Подробности о том, как выразить ковариантность с помощью универсальных типов, см. в разделе ["Ковариантность"](types-variance).


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-generics.html)
