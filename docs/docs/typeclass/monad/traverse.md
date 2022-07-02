---
layout: typeclass
title: "Traverse"
section: typeclass
prev: monad/foldable
next: monad/applicative
---

## {{page.title}}

Предположим, что есть два функтора `F` и `G`.
`Traversable` позволяет менять местами "обертку" функторов между собой, 
т.е. реализует операцию `traverse` = `F[G[A]] -> G[F[A]]`


### Примеры traversable


### Реализации traversable в различных библиотеках


---

**References:**
- [Tour of Scala](https://tourofscala.com/scala/traversable)
