---
layout: docsplus
title: "Queue"
section: scala
prev: collections/tuple
next: collections/methods
---

## {{page.title}}

[Очередь (`Queue`)](https://scala-lang.org/api/3.x/scala/collection/immutable/Queue.html) - 
это последовательность с [FIFO (первым пришёл — первым ушёл)](https://ru.wikipedia.org/wiki/FIFO). 
Элемент добавляется в очередь с помощью метода `enqueue` (или `enqueueAll` - для добавления коллекции в очередь) 
и достается из очереди используя метод `dequeue`. 
Эти операции выполняются за постоянное время.

Вот как можно создать пустую неизменяемую очередь:

```scala mdoc
import scala.collection.immutable.Queue
val empty = Queue[Int]()
val has1 = empty.enqueue(1)
val has123 = has1.enqueueAll(List(2, 3))
val (element, has23) = has123.dequeue
```

Обратите внимание, что `dequeue` возвращает пару, состоящую из удаленного элемента и остальной части очереди.

[Изменяемая очередь](https://scala-lang.org/api/3.x/scala/collection/mutable/Queue.html)


---

**References:**
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
