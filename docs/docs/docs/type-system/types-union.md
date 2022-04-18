---
layout: docs
title: "Объединение типов"
---

## {{page.title}}

Используемый для типов `|` оператор создает так называемый тип объединения (_union type_). 
Тип `А | B` представляет значения, которые относятся **либо** к типу A``, **либо** к типу `B`.

В следующем примере метод `help` принимает параметр с именем `id` типа объединения `Username | Password`, 
который может быть либо `Username`, либо `Password`:

```scala
case class Username(name: String)
case class Password(hash: Hash)

def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
    // ещё код ...
```

`help` реализуется используя pattern matching.

Этот код является гибким и типобезопасным решением. 
Если попытаться передать тип, отличный от `Username` или `Password`, компилятор пометит это как ошибку:

```scala
help("hi")   // error: Found: ("hi" : String)
             //        Required: Username | Password         
```

Ошибка также будет получена, если попытаться добавить `case` в выражение `match`, 
которое не соответствует типам `Username` или `Password`:

```scala
case 1.0 => ???   // ERROR: this line won’t compile
```

#### Альтернатива объединенным типам




---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-union.html)
