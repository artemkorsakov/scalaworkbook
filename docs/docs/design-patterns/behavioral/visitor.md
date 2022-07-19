---
layout: dp
title: "Visitor"
section: dp
prev: behavioral/strategy
---

## {{page.title}}

#### Назначение

Представление операции, которая должна быть выполнена над элементами структуры объекта. 
Visitor позволяет определить новую операцию без изменения классов элементов, над которыми она работает.

#### Диаграмма

![Visitor](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/VisitorDiagram.svg/515px-VisitorDiagram.svg.png?uselang=ru)

#### Пример

```scala mdoc:silent
trait Expr
case class Num(n: Int) extends Expr
case class Sum(l: Expr, r: Expr) extends Expr

def prettyPrint(e: Expr): Unit =
  e match
    case Num(n) => print(n)
    case Sum(l, r) =>
      prettyPrint(l)
      print(" + ")
      prettyPrint(r)

def eval(e: Expr): Int =
  e match
    case Num(n)    => n
    case Sum(l, r) => eval(l) + eval(r)
```

```scala mdoc
val e1 = Sum(Sum(Num(1), Num(2)), Num(3))
prettyPrint(e1)
print(eval(e1))
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%81%D0%B5%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
