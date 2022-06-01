---
layout: docsplus
title: "Сопоставление"
prev: details/type-test
next: concurrency
---

## Сопоставление с образцом

Экстракторы
Экстракторы — это объекты, которые предоставляют метод unapplyили unapplySeq:

def unapply[A](x: T)(implicit x: B): U
def unapplySeq[A](x: T)(implicit x: B): U
Экстракторы, раскрывающие метод unapply, называются экстракторами с фиксированной арностью, которые работают с шаблонами фиксированной арности. Экстракторы, раскрывающие метод unapplySeq, называются экстракторами с переменным числом переменных, что позволяет использовать шаблоны с переменным числом переменных.


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/changed-features/pattern-matching.html)
