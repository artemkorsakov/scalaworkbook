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

#### Параметризованные перечисления

Перечисления могут иметь параметры конструктора:

```scala mdoc:silent
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

#### Методы, определенные для enum

Значения enum соответствуют уникальным целым числам. 
Целое число, связанное со значением перечисления, возвращается методом `ordinal`:

```scala mdoc
val red = Color.Red
red.ordinal
```

Сопутствующий объект перечисления определяет также три служебных метода. 
Метод `valueOf` получает значение enum по его имени.
Метод `values` возвращает все значения enum, определенные в перечислении, в виде `Array`. 
Метод `fromOrdinal` получает значение перечисления по его порядковому (`Int`) значению.

```scala mdoc:silent
Color.valueOf("Blue")
Color.values
Color.fromOrdinal(0)
```

#### Перечисления могут содержать параметры и методы:

В перечисление можно добавить свои собственные определения. Пример:

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) = otherMass * surfaceGravity
  
  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  case Mars    extends Planet(6.421e+23, 3.3972e6)
  case Jupiter extends Planet(1.9e+27,   7.1492e7)
  case Saturn  extends Planet(5.688e+26, 6.0268e7)
  case Uranus  extends Planet(8.686e+25, 2.5559e7)
  case Neptune extends Planet(1.024e+26, 2.4746e7)
end Planet
```

#### Сопутствующий объект

Также возможно определить явный сопутствующий объект для перечисления:

```scala
object Planet:
  def main(args: Array[String]) =
    val earthWeight = args(0).toDouble
    val mass = earthWeight / Earth.surfaceGravity
    for p <- values do
      println(s"Your weight on $p is ${p.surfaceWeight(mass)}")
end Planet
```

#### Ограничения для enum case

Объявления case-enum аналогичны вторичным конструкторам: 
их область действия находится за пределами шаблона enum, несмотря на то, что они объявлены внутри него. 
Это означает, что объявления case enum не могут получить доступ к внутренним членам класса enum.

Точно так же объявления case enum не могут напрямую ссылаться на члены сопутствующего объекта перечисления, 
даже если они импортированы (напрямую или путем переименования). 
Например:

```scala
import Planet.*
enum Planet(mass: Double, radius: Double):
  private final val (mercuryMass, mercuryRadius) = (3.303e+23, 2.4397e6)

  case Mercury extends Planet(mercuryMass, mercuryRadius)             // нет доступа
  case Venus   extends Planet(venusMass, venusRadius)                 // невалидная ссылка
  case Earth   extends Planet(Planet.earthMass, Planet.earthRadius)   // ok
object Planet:
  private final val (venusMass, venusRadius) = (4.869e+24, 6.0518e6)
  private final val (earthMass, earthRadius) = (5.976e+24, 6.37814e6)
end Planet
```

Поля, на которые ссылается `Mercury`, невидимы.
А на поля, на которые ссылается `Venus`, нельзя ссылаться напрямую (используя `import Planet.*`). 
Необходимо использовать косвенную ссылку, например, продемонстрированную с помощью `Earth`.

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
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/enums/enums.html)
