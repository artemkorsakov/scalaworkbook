---
layout: typeclass
title: "Applicative"
prev: monad/traverse
next: monad/monad
---

## {{page.title}}

`Applicative` расширяет `Functor` и позволяет работать с несколькими «ящиками».
Он реализует операцию `applicate` 
(также встречаются названия `join`, `sequence`, `joinWith`, `ap` - названия взаимозаменяемы), 
которая объединяет `F[A => B]` и `F[A]` в `F[B]`.

Для `Applicative` должны соблюдаться следующие законы:
- `map(apply(x))(f) == apply(f(x))`
- `join(apply(x), apply(y)) == apply((x, y))`

### Примеры Applicative


### Реализации Applicative в различных библиотеках


---

**References:**
- [Tour of Scala](https://tourofscala.com/scala/applicative)
- [Algebird](https://twitter.github.io/algebird/typeclasses/applicative.html)
