---
layout: docsplus
title: "ArraySeq"
prev: collections/lazylist
next: collections/vector
---

## {{page.title}}

Списки очень эффективны в алгоритмах которые активно использует `head`. 
Получение, добавление и удаление к переднему (`head`) элементу списка занимает постоянное время, 
в то время как доступ или изменение остальных элементов в списке занимает линейное время.

[Последовательный массив (ArraySeq)](https://scala-lang.org/api/3.x/scala/collection/immutable/ArraySeq.html) - 
это тип коллекции, который решает проблему неэффективности случайного доступа к спискам.

`ArraySeq` позволяют получить доступ к любому элементу коллекции за постоянное время, 
из-за чего проще создавать эффективные алгоритмы.

`ArraySeq`-ы создаются и изменяются также, как и любые другие последовательности.

```scala mdoc
val arr = scala.collection.immutable.ArraySeq(1, 2, 3)
val arr2 = arr :+ 4
arr2(0)
```

`ArraySeq`-ы являются immutable, поэтому нельзя изменять элементы непосредственно в коллекции. 
Однако операции `updated`, `appended` и `prepended` создают новые `ArraySeq`-ы, 
которые отличаются от базового `ArraySeq` только в одном элементе:

```scala mdoc
arr.updated(2, 4)
arr
```

Как видно из последней строки выше, вызов `updated` не влияет на исходный `ArraySeq` `arr`.

`ArraySeq`-ы хранят свои элементы в приватном массиве. 
Таким образом достигается компактное представление и обеспечивается быстрый индексированный доступ к элементам, 
но обновление или добавление одного элемента занимает линейное время, 
так как требует создания другого массива и копирования всех элементов исходного.

[Изменяемый ArraySeq](https://scala-lang.org/api/3.x/scala/collection/mutable/ArraySeq.html)


---

**References:**
- [Scala, Immutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [Scala, Mutable collections](https://docs.scala-lang.org/ru/overviews/collections-2.13/concrete-mutable-collection-classes.html)
