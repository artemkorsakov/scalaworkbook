---
layout: docs
title: "Методы в коллекциях"
---

## {{page.title}}



#### TEMP

```scala mdoc
(1 to 5).toList
(1 to 10 by 2).toList
(1 until 5).toList
List.range(1, 5)
List.range(1, 10, 3)
```



### Методы List-а

В следующих примерах показаны некоторые методы, которые можно вызвать для `List`.
Все методы функциональные - это означает, что они не изменяют коллекцию, для которой вызываются,
а вместо этого возвращают новую коллекцию с обновленными элементами.

```scala mdoc
val a = List(10, 20, 30, 40, 10)
a.drop(2)              
a.dropWhile(_ < 25)
a.filter(_ < 25)   
a.slice(2,4)     
a.tail                   
a.take(3)              
a.takeWhile(_ < 30)    
```
```scala mdoc
val b = List(List(1,2), List(3,4))
b.flatten                          
```
```scala mdoc
val nums = List("one", "two")
nums.map(_.toUpperCase)
nums.flatMap(_.toUpperCase)
```

Эти примеры показывают, как методы `foldLeft` и `reduceLeft` используются для суммирования значений в последовательности целых чисел:

```scala mdoc
val firstTen = (1 to 10).toList
firstTen.reduceLeft(_ + _)        
firstTen.foldLeft(100)(_ + _) // 100 - начальное значение
```

Описание всех методов классов коллекции можно найти в [API документации](https://scala-lang.org/api/3.x/).




---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-collections.html)
- [Scala3 book, Collections Methods](https://docs.scala-lang.org/scala3/book/collections-methods.html)
