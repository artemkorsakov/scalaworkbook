---
layout: docs
title: "Пересечение типов"
---

## {{page.title}}

Используемый для типов оператор `&` создает так называемый тип пересечения (_intersection type_). 
Тип `A & B` представляет собой значения, которые одновременно относятся как к типу `A`, так и к типу `B`. 
Например, в следующем примере используется тип пересечения `Resettable & Growable[String]`:

```scala
trait Resettable:
  def reset(): Unit

trait Growable[A]:
  def add(a: A): Unit

def f(x: Resettable & Growable[String]): Unit =
  x.reset()
  x.add("first")
```

В методе `f` в этом примере параметр `x` должен быть как `Resettable`, так и `Growable[String]`.

Все члены типа пересечения `A` и `B` являются типом `A` и типом `B`. 
Следовательно, как показано, `Resettable & Growable[String]` имеет методы `reset` и `add`.

Пересечение типов может быть полезно для структурного описания требований.
В примере выше для `f` мы прямо заявляем, что нас устраивает любое значение для `x`, 
если оно является подтипом как `Resettable`, так и `Growable`. 
Нет необходимости создавать номинальный вспомогательный trait, подобный следующему:

```scala
trait Both[A] extends Resettable, Growable[A]
def f(x: Both[String]): Unit
```

Существует важное различие между двумя вариантами определения `f`: 
в то время как оба позволяют вызывать `f` с экземплярами `Both`, 
только первый позволяет передавать экземпляры, которые являются подтипами `Resettable` и `Growable[String]`, 
но не `Both[String]`.

> Обратите внимание, что `&` коммутативно: `A & B` имеет тот же тип, что и `B & A`.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-intersection.html)
