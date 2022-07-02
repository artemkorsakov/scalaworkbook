---
layout: typeclass
title: "Traverse"
section: typeclass
prev: monad/foldable
next: monad/applicative
---

## {{page.title}}

Для множества `S` и операции `+` говориться, что `(S, +)` является полугруппой (_semigroup_),
если она удовлетворяет следующим свойствам для любых `x, y, z ∈ S`:
- Closure (закрытость): `x + y ∈ S`
- Associativity (ассоциативность): `(x + y) + z = x + (y + z)`

Также говориться, что `S` образует полугруппу относительно `+`.


### Примеры traversable


### Реализации traversable в различных библиотеках


---

**References:**
- [Tour of Scala](https://tourofscala.com/scala/traversable)
