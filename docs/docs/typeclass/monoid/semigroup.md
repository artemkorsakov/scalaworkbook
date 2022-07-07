---
layout: typeclass
title: "Semigroup"
prev: monoid
next: monoid/monoid
---

## {{page.title}}

`(S, +)` является полугруппой (_semigroup_) для множества `S` и операции `+`, 
если удовлетворяет следующим свойствам для любых `x, y, z ∈ S`:
- Closure (замыкание): `x + y ∈ S`
- Associativity (ассоциативность): `(x + y) + z = x + (y + z)`

Также говорится, что _S образует полугруппу относительно +_.


### Примеры полугрупп

- Строки образуют полугруппу при конкатенации


### Реализации полугрупп в различных библиотеках



---

**References:**
- [Algebird](https://twitter.github.io/algebird/typeclasses/semigroup.html)
