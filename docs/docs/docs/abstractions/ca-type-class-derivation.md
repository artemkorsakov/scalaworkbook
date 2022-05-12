---
layout: docsplus
title: "Type Class Derivation"
prev: abstractions/ca-type-classes
next: abstractions/ca-multiversal-equality
---

## {{page.title}}

Type class derivation - это способ автоматического создания экземпляров `given` классов типов, 
которые удовлетворяют некоторым простым условиям. 
Класс типов в этом смысле — это любой trait 
или класс с параметром типа, определяющим тип, над которым выполняется операция. 
Общие примеры: `Eq`, `Ordering` или `Show`. 
Пример, для следующего алгебраического типа данных (ADT) `Tree`:

```scala
enum Tree[T] derives Eq, Ordering, Show:
  case Branch(left: Tree[T], right: Tree[T])
  case Leaf(elem: T)
```

Предложение `derives` создает следующие экземпляры `given` 
для классов типов `Eq`, `Ordering` и `Show` в сопутствующем объекте `Tree`:

```scala
given [T: Eq]       : Eq[Tree[T]]    = Eq.derived
given [T: Ordering] : Ordering[Tree] = Ordering.derived
given [T: Show]     : Show[Tree]     = Show.derived
```

Говорится, что `Tree` - это производный тип (_deriving type_), 
а экземпляры `Eq`, `Ordering` и `Show` являются производными экземплярами (_derived instances_).

### Типы вспомогательных derives предложений

Все типы данных могут содержать предложение `derives`. 
В этом документе основное внимание уделяется типам данных, 
для которых также доступен given экземпляр класса типа `Mirror`. 
Экземпляры класса типа Mirror автоматически генерируются компилятором для,
- enums и enum cases
- case classes и case objects
- sealed классы или trait-ы, которые содержат в качестве потомков только case classes и case objects

Экземпляры класса типа `Mirror` предоставляют информацию на уровне типа о компонентах и маркировке типа. 
Они также обеспечивают минимальную инфраструктуру уровня терминов, 
позволяющую библиотекам более высокого уровня обеспечивать всестороннюю поддержку деривации.

```scala
sealed trait Mirror:

  /** the type being mirrored */
  type MirroredType

  /** the type of the elements of the mirrored type */
  type MirroredElemTypes

  /** The mirrored *-type */
  type MirroredMonoType

  /** The name of the type */
  type MirroredLabel <: String

  /** The names of the elements of the type */
  type MirroredElemLabels <: Tuple

object Mirror:

  /** The Mirror for a product type */
  trait Product extends Mirror:

    /** Create a new instance of type `T` with elements
     *  taken from product `p`.
     */
    def fromProduct(p: scala.Product): MirroredMonoType

  trait Sum extends Mirror:

    /** The ordinal number of the case class of `x`.
     *  For enums, `ordinal(x) == x.ordinal`
     */
    def ordinal(x: MirroredMonoType): Int

end Mirror
```

Типы продуктов (т.е. case классы и case объекты, а также enum case) имеют зеркала, 
которые являются подтипами `Mirror.Product`. 
Типы суммы (т.е. закрытый (`sealed`) класс или trait-ы с дочерними продуктами и перечисления) имеют зеркала, 
которые являются подтипами `Mirror.Sum`.

Для `Tree` ADT, описанного выше, следующие экземпляры `Mirror` будут автоматически предоставлены компилятором:

```scala
// Mirror for Tree
new Mirror.Sum:
  type MirroredType = Tree
  type MirroredElemTypes[T] = (Branch[T], Leaf[T])
  type MirroredMonoType = Tree[_]
  type MirroredLabel = "Tree"
  type MirroredElemLabels = ("Branch", "Leaf")

  def ordinal(x: MirroredMonoType): Int = x match
    case _: Branch[_] => 0
    case _: Leaf[_] => 1

// Mirror for Branch
new Mirror.Product:
  type MirroredType = Branch
  type MirroredElemTypes[T] = (Tree[T], Tree[T])
  type MirroredMonoType = Branch[_]
  type MirroredLabel = "Branch"
  type MirroredElemLabels = ("left", "right")

  def fromProduct(p: Product): MirroredMonoType =
    new Branch(...)

// Mirror for Leaf
new Mirror.Product:
  type MirroredType = Leaf
  type MirroredElemTypes[T] = Tuple1[T]
  type MirroredMonoType = Leaf[_]
  type MirroredLabel = "Leaf"
  type MirroredElemLabels = Tuple1["elem"]

  def fromProduct(p: Product): MirroredMonoType =
    new Leaf(...)
```

Обратите внимание на следующие свойства типов `Mirror`:
- Свойства кодируются с использованием типов, а не терминов. 
Это означает, что они не влияют на время выполнения, если не используются, 
а также что они являются функцией времени компиляции для использования со средствами метапрограммирования Scala 3.
- Типы `MirroredType` и `MirroredElemTypes` соответствуют типам данных, экземпляром которых является зеркало. 
Это позволяет `Mirrors` поддерживать ADT всех видов.
- Нет отдельного типа представления для сумм или произведений 
(т.е. нет типа `HList` или `Coproduct`, как в версиях Shapeless для Scala 2). 
Вместо этого набор дочерних типов типа данных представлен обычным, возможно, параметризованным типом кортежа. 
Средства метапрограммирования Scala 3 можно использовать для работы с этими типами кортежей как есть, 
а поверх них можно создавать библиотеки более высокого уровня.
- Как для типов произведения, так и для суммы, 
элементы `MirroredElemTypes` располагаются в порядке определения 
(т.е. `Branch[T]` предшествуют `Leaf[T]`, потому что они определены раньше в исходном файле). 
Это означает, что в этом отношении оно отличается от общего представления Shapeless для ADT в Scala 2, 
где конструкторы упорядочены в алфавитном порядке по именам.
- Методы `ordinal` и `fromProduct` определяются в терминах того `MirroredMonoType`, 
который получается из `MirroredType` с подстановочными знаками в его параметров типа.

### Классы типов, поддерживающие автоматическую деривиацию

Trait или класс могут появиться в предложении `derives`, 
если его сопутствующий объект определяет метод с именем `derived`. 
Сигнатура и реализация `derived` метода для класса типов `TC[_]` произвольны, 
но обычно имеют следующую форму:

```scala
import scala.deriving.Mirror

def derived[T](using Mirror.Of[T]): TC[T] = ...
```

То есть метод `derived` принимает контекстный параметр типа `Mirror` (некоторого подтипа), 
который определяет форму производного типа `T`, и вычисляет реализацию класса типа в соответствии с этой формой. 
Это все, что поставщик ADT с предложением `derives` должен знать о порождении экземпляра класса типов.

Обратите внимание, что методы `derived` могут косвенно иметь параметры контекста `Mirror` 
(например, иметь аргумент контекста, который, в свою очередь, имеет параметр контекста `Mirror`, 
или вообще не иметь 
(например, они могут использовать какой-то совершенно другой механизм, предоставленный пользователем, 
например, с помощью макросов Scala 3 или runtime reflection)).
Ожидается, что наиболее распространенными будут (прямые или непрямые) реализации `Mirror`.

Авторы классов типов, скорее всего, будут использовать производные библиотеки более высокого уровня 
или универсальные библиотеки программирования для реализации методов `derived`. 
Пример того, как метод `derived` может быть реализован с использованием только средств низкого уровня, описанных выше, 
и общих возможностей метапрограммирования Scala 3, приведен ниже. 
Не предполагается, что авторы классов типов обычно будут реализовывать метод `derived` таким образом, 
однако это пошаговое руководство можно рассматривать 
как руководство для авторов библиотек деривации более высокого уровня
(для полностью проработанного примера о такой библиотеке см. [Shapeless 3](https://github.com/typelevel/shapeless-3)).

#### Как написать метод derived класса типов, используя низкоуровневые механизмы

Низкоуровневый метод, который будет использоваться для реализации метода `derived` класса типа в этом примере, 
использует три новые конструкции уровня типа в Scala 3: 
встроенные методы (_inline methods_), 
встроенные совпадения (_inline matches_)
и неявный поиск через `summonInline` или `summonFrom`. 
Учитывая это определение класса типа `Eq`:

```scala
trait Eq[T]:
  def eqv(x: T, y: T): Boolean
```

нужно реализовать метод `Eq.derived` для сопутствующего объекта `Eq`, 
который создает экземпляр `given` для `Eq[T]` заданного `Mirror[T]`. 
Вот возможная реализация:

```scala
import scala.deriving.Mirror

inline given derived[T](using m: Mirror.Of[T]): Eq[T] =
  val elemInstances = summonAll[m.MirroredElemTypes]           // (1)
  inline m match                                               // (2)
    case s: Mirror.SumOf[T]     => eqSum(s, elemInstances)
    case p: Mirror.ProductOf[T] => eqProduct(p, elemInstances)
```

Обратите внимание, что `derived` определяется как `inline given`. 
Это означает, что метод будет расширен в местах вызова 
(например, компилятор сгенерировал определения экземпляров в сопутствующих объектах ADT, 
которые содержат `derived Eq` предложение), 
а также, что его можно будет использовать рекурсивно, если необходимо, 
для вычисления экземпляров для дочерних элементов.

Тело этого метода (1) сначала материализует экземпляры `Eq` для всех дочерних типов типа, 
для которого создается экземпляр. 
Это либо все ветви типа суммы, либо все поля типа продукта. 
Реализация summonAllis inlineи использует конструкцию Scala 3 summonInlineдля сбора экземпляров в виде List,

```scala
inline def summonAll[T <: Tuple]: List[Eq[_]] =
  inline erasedValue[T] match
    case _: EmptyTuple => Nil
    case _: (t *: ts) => summonInline[Eq[t]] :: summonAll[ts]
```


#### Как написать метод derived класса типов, используя макросы


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html)
- [Scala 3 Reference, Derivation macros](https://docs.scala-lang.org/scala3/reference/contextual/derivation-macro.html)

