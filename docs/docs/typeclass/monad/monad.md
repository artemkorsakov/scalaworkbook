---
layout: typeclass
title: "Monad"
section: typeclass
prev: monad/applicative
---

## {{page.title}}

Монада (_monad_) - это `Functor` и `Applicative` с дополнительной функцией: `flatten` (сведение: `F[F[A]] -> F[A]`). 
Что позволяет определить `flatMap` — `map`, за которой следует `flatten`.

Для `Monad` должны соблюдаться следующие законы:
- identities:
  - `flatMap(apply(x))(fn) == fn(x)`
  - `flatMap(m)(apply _) == m`
- associativity на flatMap:
  - `flatMap(flatMap(m)(f))(g) == flatMap(m) { x => flatMap(f(x))(g) }`


### Примеры монад


### Реализации монад в различных библиотеках


---

**References:**
- [Tour of Scala](https://tourofscala.com/scala/monad)
- [Algebird](https://twitter.github.io/algebird/typeclasses/monad.html)
