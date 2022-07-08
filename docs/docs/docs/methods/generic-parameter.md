---
layout: docsplus
title: "Generic параметры"
section: scala
prev: methods/vararg-parameters
next: methods/extension-methods
---

## {{page.title}}

Так же как и у обобщенных классов, у методов есть полиморфизм по типу, 
с таким же синтаксисом (параметр типа указывается в квадратных скобках сразу после названия метода).

Пример:

```scala mdoc
def listOfDuplicates[A](x: A, length: Int): List[A] =
  if length < 1 then Nil
  else x :: listOfDuplicates(x, length - 1)

listOfDuplicates[Int](3, 4)
listOfDuplicates("La", 8)
```

Метод `listOfDuplicates` принимает параметр типа `A` и параметры значений `x` и `length`. 
Значение `x` имеет тип `A`. Если `length < 1` возвращается пустой список. 
В противном случае `x` добавляется к списку, возвращаемому через рекурсивный вызовов с `length - 1`. 
(Обратите внимание, что `::` означает добавление элемента слева к списку справа).

В первом вызове метода явно указывается параметр типа - `[Int]`. 
Поэтому первым аргументом должен быть `Int` и тип возвращаемого значения будет `List[Int]`.

Во втором вызове показано, что не обязательно всегда явно указывать параметр типа. 
Часто компилятор сам может вывести тип исходя из контекста или типа передаваемых аргументов. 
В этом варианте `"La"` - это `String`, поэтому компилятор знает, что `A` должен быть `String`.


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
