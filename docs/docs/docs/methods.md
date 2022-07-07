---
layout: docsplus
title: "Методы"
section: scala
prev: modeling/fp
next: methods/method-features
---

## {{page.title}}

Scala `classes`, `case classes`, `case objects`, `traits`, `enums`, и `objects` могут содержать методы.
Кроме того, они могут быть определены вне любой из перечисленных конструкций.
Методы являются определениями "верхнего уровня", поскольку не вложены в другое определение. 
Проще говоря, методы теперь могут быть определены где угодно.

В Scala методы обладают множеством особенностей, в том числе:
- [Несколько групп параметров (partially-applied functions)](@DOC@methods/partially-applied-functions)
- [Методы с неопределенным количеством параметров (vararg parameters)](@DOC@methods/vararg-parameters)
- [Параметры по имени (by-name parameters)](@DOC@methods/by-name-parameter)
- [Функция в качестве параметра](@DOC@functions)
- [Generic параметры](@DOC@methods/generic-parameter)
- [Значения параметров по умолчанию](@DOC@methods/default-parameters)
- [Контекстные параметры](@DOC@abstractions/ca-using)
- [inline методы](@DOC@metaprogramming/inline)
- и многое другое

---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/methods-intro.html)
