---
layout: typeclass
title: "Semigroup"
section: typeclass
prev: semigroup
next: semigroup/monoid
---

## {{page.title}}

Для множества `S` и операции `+` говориться, что `(S, +)` является полугруппой (_semigroup_), 
если она удовлетворяет следующим свойствам для любых `x, y, z ∈ S`:
- Closure (замыкание): `x + y ∈ S`
- Associativity (ассоциативность): `(x + y) + z = x + (y + z)`

Также говориться, что _S образует полугруппу относительно +_.


### Примеры полугрупп

- Строки образуют полугруппу при конкатенации


### Реализации полугрупп в различных библиотеках



---

**References:**
- [Algebird](https://twitter.github.io/algebird/typeclasses/semigroup.html)
