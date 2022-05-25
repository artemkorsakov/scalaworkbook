---
layout: docsplus
title: "Reflection"
prev: metaprogramming/runtime-staging
next: metaprogramming/tasty-inspection
---

## {{page.title}}

API отражения обеспечивает более сложное и полное представление о структуре кода. 
Оно обеспечивает представление типизированных абстрактных синтаксических деревьев и их свойств, 
таких как типы, символы, позиции и комментарии.

API можно использовать в макросах, а также для проверки [файлов TASTy](@DOC@metaprogramming/tasty-inspection).

### Как использовать API

API отражения определен в типе `Quotes` как `reflect`. 
Фактический экземпляр зависит от текущей области, 
в которой используются цитаты или сопоставление с образцом в цитатах. 
Следовательно, каждый метод макроса получает `Quotes` в качестве дополнительного аргумента. 
Поскольку `Quotes` является контекстным, для доступа к его членам нужно либо назвать параметр, либо вызвать его. 
Следующее определение из стандартной библиотеки подробно описывает канонический способ доступа к ней:

```scala
package scala.quoted

transparent inline def quotes(using inline q: Quotes): q.type = q
```

Можно использовать `scala.quoted.quotes` для импорта текущей Quotes в область видимости:

```scala
import scala.quoted.* // Import `quotes`, `Quotes`, and `Expr`

def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.* // Import `Tree`, `TypeRepr`, `Symbol`, `Position`, .....
  val tree: Tree = ...
  ...
```

Это позволит импортировать все типы и модули (с методами расширения) API.


### Как ориентироваться в API

Полный API можно найти в [документации по API для `scala.quoted.Quotes.reflectModule`](https://scala-lang.org/api/3.x/scala/quoted/Quotes$reflectModule.html). 

Наиболее важным элементом на странице является дерево иерархии, 
которое обеспечивает синтетический обзор отношений подтипов типов в API. 
Для каждого типа `Foo` в дереве:
- трейт `FooMethods` содержит методы, доступные для типа `Foo`
- трейт `FooModule` содержит статические методы, доступные для объекта `Foo`. 
В частности, здесь находятся конструкторы (`apply`/`copy`) и `unapply` метод, 
предоставляющий экстракторы, необходимые для сопоставления с образцом.
- Для всех типов `Upper` таких как `Foo <: Upper`, методы, определенные в `UpperMethods`, также доступны для `Foo`

Например, `TypeBounds`, подтип `TypeRepr`, представляет дерево типов в форме `T >: L <: U`: 
тип `T`, который является надтипом `L` и подтипом `U`. 
В `TypeBoundsMethods` есть методы `low` и `hi`, которые позволяют получить доступ к представлениям `L` и `U`. 
В `TypeBoundsModule`, доступен `unapply` метод, который позволяет написать:

```scala
def f(tpe: TypeRepr) =
  tpe match 
    case TypeBounds(l, u) =>
```

Поскольку `TypeBounds <: TypeRepr`, все методы, определенные в `TypeReprMethods`, доступны для значений `TypeBounds`:

```scala
def f(tpe: TypeRepr) =
  tpe match
    case tpe: TypeBounds =>
      val low = tpe.low
      val hi  = tpe.hi
```


### Связь с выражением/типом






---

**References:**
- [Scala 3 Guide](https://docs.scala-lang.org/scala3/guides/macros/reflection.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/metaprogramming/reflection.html)
