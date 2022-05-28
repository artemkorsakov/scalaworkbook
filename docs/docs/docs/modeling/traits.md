---
layout: docsplus
title: "Traits"
prev: modeling/companion-objects
next: modeling/abstract-class
---

## {{page.title}}

Если провести аналогию с Java, то Scala `trait` похож на интерфейс в Java 8+.
`trait`-ы могут содержать:
- абстрактные методы и поля
- конкретные методы и поля
- могут иметь параметры конструктора, как и классы

В базовом использовании `trait` может использоваться как интерфейс, 
определяющий только абстрактные члены, которые будут реализованы другими классами:

```scala mdoc:silent
trait Employee:
  def id: Int
  def firstName: String
  def lastName: String 
```

`traits` также могут содержать определенные методы:

```scala mdoc:silent
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
```
```scala mdoc:silent
trait HasTail:
  def tailColor: String
  def wagTail() = println("Tail is wagging")
  def stopTail() = println("Tail is stopped")
```

Классы и объекты могут расширять несколько `traits`, что позволяет с их помощью создавать небольшие модули.

```scala mdoc:silent
class IrishSetter(name: String) extends HasLegs, HasTail:
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
```

В классе `IrishSetter` реализованы все абстрактные параметры и методы, поэтому можно создать его экземпляр:

```scala mdoc
val d = IrishSetter("Big Red")
```

Класс также может переопределять методы `trait`-ов при необходимости.

Аргументы `trait` оцениваются непосредственно перед его инициализацией.

### Особенности при расширении trait с параметрами конструктора

Одна потенциальная проблема с параметрами `trait` заключается в том, как предотвратить двусмысленность. 
Например, можно попробовать выполнить расширение `Greeting` дважды с разными параметрами:

```scala mdoc:silent
trait Greeting(val name: String):
  def msg = s"How are you, $name"

class C extends Greeting("Bob"):
  println(msg)
```

```scala mdoc:fail
class D extends C, Greeting("Bill") 
```

На самом деле эта программа не скомпилируется, потому что она нарушает второе правило для параметров `trait`:
1. Если класс `C` расширяет параметризованный `trait` `T`, а его суперкласс — нет, то `C` должен передать аргументы в `T`.
2. Если класс `C` расширяет параметризованный `trait` `T` и его суперкласс тоже, то `C` не должен передавать аргументы в `T`.
3. `trait`-ы никогда не должны передавать аргументы родительским `trait`-ам.

Вот трейт, расширяющий параметризованный трейт `Greeting`.

```scala mdoc:silent
trait FormalGreeting extends Greeting:
  override def msg = s"How do you do, $name"
```

Правильный способ создания класса `E`, расширяющего оба - `Greeting` и `FormalGreeting` (в любом порядке) - такой:

```scala mdoc:silent
class E extends Greeting("Bob"), FormalGreeting
```

```scala mdoc
(new C).msg
(new E).msg
```

### Trait-ы с параметрами контекста

Правило "требуется явное расширение" ослабляется, если отсутствующий `trait` содержит [только параметры контекста](@DOC@abstractions/ca-using). 
В этом случае ссылка на трейт неявно вставляется как дополнительный родитель с выводимыми аргументами. 
Например, вот вариант `Greeting`, где адресат является параметром контекста типа `ImpliedName`:

```scala mdoc:silent
case class ImpliedName(name: String):
  override def toString = name

trait ImpliedGreeting(using val iname: ImpliedName):
  def msg = s"How are you, $iname"

trait ImpliedFormalGreeting extends ImpliedGreeting:
  override def msg = s"How do you do, $iname"

class F(using iname: ImpliedName) extends ImpliedFormalGreeting
```

Определение `F` в последней строке неявно расширяется до

```scala
class F(using iname: ImpliedName) extends
  Object,
  ImpliedGreeting(using iname),
  ImpliedFormalGreeting(using iname)
```

Обратите внимание на вставленную ссылку на `ImpliedFormalGreeting` - родительский `trait ImpliedGreeting`, 
которая не упоминалась явно.

```scala mdoc
given ImpliedName: ImpliedName("Bob")
(new F).msg
```


### Transparent traits

Trait-ы используются в двух случаях:
- как примеси для других классов и trait-ов
- как типы констант, определений или параметров

Некоторые trait-ы используются преимущественно в первой роли, и обычно их нежелательно видеть в выводимых типах. 
Примером может служить [`trait Product`](https://scala-lang.org/api/3.x/scala/Product.html), 
который компилятор добавляет в качестве примеси к каждому case class-у или case object-у. 
В Scala 2 этот родительский trait иногда делает выводимые типы более сложными, чем они должны быть. 
Пример:

```scala
trait Kind
case object Var extends Kind
case object Val extends Kind
val x = Set(if condition then Val else Var)
```

Здесь предполагаемый тип `x` равен `Set[Kind & Product & Serializable]`, 
тогда как можно было бы надеяться, что это будет `Set[Kind]`. 
Основания для выделения именно этого типа следующие:
- тип условного оператора, приведенного выше, является [типом объединения](@DOC@type-system/types-union) `Val | Var`.
- тип объединения расширяется в выводе типа до наименьшего супертипа, который не является типом объединения. 
В примере - это тип `Kind & Product & Serializable`, так как все три trait-а являются trait-ами обоих `Val` и `Var`. 
Таким образом, этот тип становится предполагаемым типом элемента набора.

Scala 3 позволяет помечать trait примеси как `transparent`, что означает, что он может быть подавлен при выводе типа. 
Вот пример, который повторяет строки приведенного выше кода, но теперь с новым `transparent trait S` вместо `Product`:

```scala
transparent trait S
trait Kind
object Var extends Kind, S
object Val extends Kind, S
val x = Set(if condition then Val else Var)
```

Теперь `x` предположил тип `Set[Kind]`. Общий `transparent trait S` не появляется в выводимом типе.

#### Прозрачные trait-ы

Trait-ы [scala.Product](https://scala-lang.org/api/3.x/scala/Product.html), 
[java.io.Serializable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Serializable.html)
и [java.lang.Comparable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Comparable.html) 
автоматически считаются `transparent`.
Другие трейты превращаются в `transparent trait` с помощью модификатора `transparent`. 

Как правило, `transparent trait` — это trait-ы, влияющие на реализацию наследуемых классов, 
и trait-ы, которые сами по себе обычно не используются как типы. 
Два примера из стандартной библиотеки коллекций:
- [IterableOps](https://scala-lang.org/api/3.x/scala/collection/IterableOps.html), 
который предоставляет реализации методов для [Iterable](https://scala-lang.org/api/3.x/scala/collection/Iterable.html).
- [StrictOptimizedSeqOps](https://scala-lang.org/api/3.x/scala/collection/StrictOptimizedSeqOps.html), 
который оптимизирует некоторые из этих реализаций для последовательностей с эффективной индексацией.

Как правило, любой trait, расширяемый рекурсивно, является хорошим кандидатом на объявление `transparent`.

Правила вывода типов говорят, что `transparent trait` удаляются из пересечений, где это возможно.


---

**References:**
- [Scala3 book, domain modeling tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala3 book, taste modeling](https://docs.scala-lang.org/scala3/book/taste-modeling.html)
- [Scala3 book, taste objects](https://docs.scala-lang.org/scala3/book/taste-objects.html)
- [Scala3, Reference](https://docs.scala-lang.org/scala3/reference/other-new-features/trait-parameters.html)
- [Scala3, Transparent Traits](https://docs.scala-lang.org/scala3/reference/other-new-features/transparent-traits.html)
