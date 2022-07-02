---
layout: typeclass
title: "Fordable"
section: typeclass
prev: monad/functor
next: monad/traverse
---

## {{page.title}}

Для множества `S` и операции `+` говориться, что `(S, +)` является полугруппой (_semigroup_),
если она удовлетворяет следующим свойствам для любых `x, y, z ∈ S`:
- Closure (закрытость): `x + y ∈ S`
- Associativity (ассоциативность): `(x + y) + z = x + (y + z)`

Также говориться, что `S` образует полугруппу относительно `+`.


### Примеры полугрупп

- Строки образуют полугруппу при конкатенации


### Реализации полугрупп в различных библиотеках



---

**References:**
- [Algebird](https://twitter.github.io/algebird/typeclasses/semigroup.html)
