---
layout: docsplus
title: "Enums"
prev: modeling/abstract-class
next: modeling/case-class
---

## {{page.title}}

Перечисление (an enumeration) может быть использовано для определения типа, 
состоящего из конечного набора именованных значений 
(в разделе, [посвященном моделированию ФП](fp), будут показаны дополнительные возможности `enums`). 
Базовые перечисления используются для определения наборов констант, таких как месяцы в году, дни в неделе, 
направления, такие как север/юг/восток/запад, и многое другое.

В качестве примера, рассмотрим перечисления, определяющие наборы атрибутов, связанных с пиццами:

```scala mdoc:silent
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

Для использования в коде `enum` необходимо импортировать:

```scala mdoc:silent
import CrustSize.*
val currentCrustSize = Small
```

Значения `enum`-ов можно сравнивать и использовать в матчинге:

```scala mdoc
if (currentCrustSize == Small)
  println("If you buy a large pizza, you'll get a prize!")
currentCrustSize match
  case Small => println("small")
  case Medium => println("medium")
  case Large => println("large")
```

#### Дополнительные возможности enums

Перечисления могут иметь параметры конструктора:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

а также содержать параметры и методы:

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) = otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // more planets here ...
```

#### Совместимость с Java enums

Если необходимо использовать определенные в Scala перечисления в качестве перечислений Java, 
можно сделать это, расширив класс `java.lang.Enum` (который импортируется по умолчанию) следующим образом:

```scala
enum Color extends Enum[Color] { case Red, Green, Blue }
```

Параметр типа берется из определения Java `enum` и должен совпадать с типом перечисления. 
Нет необходимости предоставлять аргументы конструктора (как определено в документах Java API) для `java.lang.Enum` 
при его расширении — компилятор генерирует их автоматически.

После определения `Color` его можно использовать так же, как если бы использовался Java `enum`:

```scala
Color.Red.compareTo(Color.Green)
```


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
