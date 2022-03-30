---
layout: docs
title: "Моделирование данных в ООП и ФП"
---

## {{page.title}}

## OOP Domain Modeling

При написании кода в стиле ООП двумя основными инструментами для инкапсуляции данных являются _traits_ и _classes_.

## FP Domain Modeling

При написании кода в стиле FP можно использовать такие конструкции:
- Enums
- Case classes
- Traits

### Enums

Конструкция `enum` - отличный способ моделирования алгебраических типов данных. Например:

```scala mdoc
enum CrustSize:
  case Small, Medium, Large
```

`enum` можно использовать в матчинге и условиях:

```scala mdoc
import CrustSize.*
val currentCrustSize = Small
currentCrustSize match
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")
if currentCrustSize == Small then println("Small crust size")
```

Ещё один пример `enum`-а:

```scala mdoc
enum Nat:
  case Zero
  case Succ(pred: Nat)
```

### Case classes

Scala `case class` позволяет моделировать концепции с неизменяемыми структурами данных.
`case class` обладает всеми функциональными возможностями класса, 
а также имеет встроенные дополнительные функции, которые делают их полезными для функционального программирования. 

`case class` имеет следующие эффекты и преимущества:
- Параметры конструктора `case class` по умолчанию являются общедоступными полями `val`, поэтому поля являются неизменяемыми, а методы доступа генерируются для каждого параметра.
- Генерируется метод `unapply`, который позволяет использовать `case class` в `match` выражениях.
- В классе создается метод `copy`, который позволяет создавать копии объекта без изменения исходного объекта.
- генерируются методы `equals` и `hashCode` для проверки структурного равенства.
- генерируется метод `toString`, который полезен для отладки.

Этот код демонстрирует несколько функций `case class`:

```scala mdoc:reset
case class Person(name: String, vocation: String)
val p = Person("Reginald Kenneth Dwight", "Singer")
p.name
```
```scala mdoc:fail
p.name = "Joe"
```
```scala mdoc
val p2 = p.copy(name = "Elton John")
```
