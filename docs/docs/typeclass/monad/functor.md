---
layout: typeclass
title: "Functor"
prev: monad
next: monad/foldable
---

## {{page.title}}

Функтор — это преобразование из категории `A` в категорию `B`. 
Такие преобразования часто изображаются стрелкой: `A -> B` (или через метод `map`).

Функтор (F) в теории категорий должен следовать нескольким правилам:
- Все элементы `A` должны иметь результат в `B` 
- Identity (тождественность): Если определен метод идентификации `id` такой, что: `id(a) == a`, 
тогда `id(F) == F.map(id)`. 
- Composition (композиция): Если определены два метода `f` и `g`, тогда `F.map(f).map(g) == F.map(g(f(_)))`.


### Примеры функторов


### Реализации функторов в различных библиотеках


---

**References:**
- [Tour of Scala](https://tourofscala.com/scala/functor)
- [Algebird](https://twitter.github.io/algebird/typeclasses/functor.html)
