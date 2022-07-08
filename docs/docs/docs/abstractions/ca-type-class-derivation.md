---
layout: docsplus
title: "Type Class Derivation"
section: scala
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
Экземпляры класса типа `Mirror` автоматически генерируются компилятором для,
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
который получается из `MirroredType` с подстановочными знаками в его параметрах типа.

### Классы типов, поддерживающие автоматическую деривиацию

Trait или класс могут появиться в предложении `derives`, 
если их сопутствующий объект определяет метод с именем `derived`. 
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
Реализация `summonAll` - `inline` и использует конструкцию Scala 3 `summonInline` для сбора экземпляров в виде `List`:

```scala
inline def summonAll[T <: Tuple]: List[Eq[_]] =
  inline erasedValue[T] match
    case _: EmptyTuple => Nil
    case _: (t *: ts) => summonInline[Eq[t]] :: summonAll[ts]
```

с экземплярами для дочерних элементов метод `derived` использует `inline match` для отправки методов, 
которые могут создавать экземпляры либо для сумм, либо для произведений (2). 
Обратите внимание, что поскольку `derived` - `inline` совпадение будет разрешено во время компиляции, 
и только левая часть совпадающего случая будет встроена в сгенерированный код с уточненными типами, 
выявленными в результате совпадения.

В случае суммы, `eqSum`, используются `ordinal` runtime значения аргументов `eqv`, 
чтобы сначала проверить, относятся ли два значения к одному и тому же подтипу ADT (3), 
а затем, если подтипы совпадают, 
для дальнейшей проверки на равенство на основе экземпляра `Eq` 
для соответствующего подтипа ADT с помощью вспомогательного метода `check` (4).

```scala
import scala.deriving.Mirror

def eqSum[T](s: Mirror.SumOf[T], elems: List[Eq[_]]): Eq[T] =
  new Eq[T]:
    def eqv(x: T, y: T): Boolean =
      val ordx = s.ordinal(x)                            // (3)
      (s.ordinal(y) == ordx) && check(elems(ordx))(x, y) // (4)
```

В случае продукта `eqProduct` мы проверяем runtime значения аргументов `eqv` на равенство 
как продукты на основе экземпляров `Eq` для полей типа данных (5):

```scala
import scala.deriving.Mirror

def eqProduct[T](p: Mirror.ProductOf[T], elems: List[Eq[_]]): Eq[T] =
  new Eq[T]:
    def eqv(x: T, y: T): Boolean =
      iterator(x).zip(iterator(y)).zip(elems.iterator).forall {  // (5)
        case ((x, y), elem) => check(elem)(x, y)
      }
```

Собрав все это вместе, получается следующая полная реализация:

```scala
import scala.deriving.*
import scala.compiletime.{erasedValue, summonInline}

inline def summonAll[T <: Tuple]: List[Eq[_]] =
  inline erasedValue[T] match
    case _: EmptyTuple => Nil
    case _: (t *: ts) => summonInline[Eq[t]] :: summonAll[ts]

trait Eq[T]:
  def eqv(x: T, y: T): Boolean

object Eq:
  given Eq[Int] with
    def eqv(x: Int, y: Int) = x == y

  def check(elem: Eq[_])(x: Any, y: Any): Boolean =
    elem.asInstanceOf[Eq[Any]].eqv(x, y)

  def iterator[T](p: T) = p.asInstanceOf[Product].productIterator

  def eqSum[T](s: Mirror.SumOf[T], elems: => List[Eq[_]]): Eq[T] =
    new Eq[T]:
      def eqv(x: T, y: T): Boolean =
        val ordx = s.ordinal(x)
        (s.ordinal(y) == ordx) && check(elems(ordx))(x, y)

  def eqProduct[T](p: Mirror.ProductOf[T], elems: => List[Eq[_]]): Eq[T] =
    new Eq[T]:
      def eqv(x: T, y: T): Boolean =
        iterator(x).zip(iterator(y)).zip(elems.iterator).forall {
          case ((x, y), elem) => check(elem)(x, y)
        }

  inline given derived[T](using m: Mirror.Of[T]): Eq[T] =
    lazy val elemInstances = summonAll[m.MirroredElemTypes]
    inline m match
      case s: Mirror.SumOf[T]     => eqSum(s, elemInstances)
      case p: Mirror.ProductOf[T] => eqProduct(p, elemInstances)
end Eq
```

Получившийся результат можно проверить относительно простого ADT, например:

```scala
enum Opt[+T] derives Eq:
  case Sm(t: T)
  case Nn

@main def test(): Unit =
  import Opt.*
  val eqoi = summon[Eq[Opt[Int]]]
  assert(eqoi.eqv(Sm(23), Sm(23)))
  assert(!eqoi.eqv(Sm(23), Sm(13)))
  assert(!eqoi.eqv(Sm(23), Nn))
```

В этом случае код, сгенерированный встроенным расширением для derived экземпляра `Eq` для `Opt`, 
после небольшой доработки выглядит следующим образом:

```scala
given derived$Eq[T](using eqT: Eq[T]): Eq[Opt[T]] =
  eqSum(
    summon[Mirror[Opt[T]]],
    List(
      eqProduct(summon[Mirror[Sm[T]]], List(summon[Eq[T]])),
      eqProduct(summon[Mirror[Nn.type]], Nil)
    )
  )
```

Можно использовать альтернативные подходы к определению derived методов. 
Например, более агрессивно встроенные варианты с использованием макросов Scala 3, 
хотя и более используемы авторами классов типов, чем в приведенном выше примере, 
могут создавать код для классов типов наподобие `Eq`, который устраняет все артефакты абстракции 
(например, дочерние экземпляры `List`-а в приведенном выше примере)
и генерировать код, который неотличим от того, что программист мог бы написать вручную. 
В качестве третьего примера, используя библиотеку более высокого уровня, такую как Shapeless, 
автор класса типов может определить эквивалентный derived метод как:

```scala
given eqSum[A](using inst: => K0.CoproductInstances[Eq, A]): Eq[A] with
  def eqv(x: A, y: A): Boolean = inst.fold2(x, y)(false)(
    [t] => (eqt: Eq[t], t0: t, t1: t) => eqt.eqv(t0, t1)
  )

given eqProduct[A](using inst: K0.ProductInstances[Eq, A]): Eq[A] with
  def eqv(x: A, y: A): Boolean = inst.foldLeft2(x, y)(true: Boolean)(
    [t] => (acc: Boolean, eqt: Eq[t], t0: t, t1: t) =>
      Complete(!eqt.eqv(t0, t1))(false)(true)
  )

inline def derived[A](using gen: K0.Generic[A]): Eq[A] =
  gen.derive(eqProduct, eqSum)
```

Описанная здесь структура позволяет использовать все три этих подхода, не навязывая ни один из них.

#### Получение экземпляров в другом месте

Иногда требуется создать экземпляр класса типов для ADT после того, как ADT определен, 
без возможности изменения кода самого ADT. 
Для этого просто определите экземпляр, используя метод `derived` класса типа в правой части. 
Например, для реализации `Ordering` для определения `Option`:

```scala
given [T: Ordering]: Ordering[Option[T]] = Ordering.derived
```

Предполагая, что у метода `Ordering.derived` есть контекстный параметр типа `Mirror[T]`, 
сгенерированным компилятором экземпляр `Mirror` для `Option` будет достаточен, 
а вывод экземпляра будет расширен в правой части этого определения так же, 
как экземпляр, определенный в сопутствующих объектах ADT.

#### Как написать метод derived класса типов, используя макросы

Ниже демонстрируется, как реализовать derived метод класса типа, используя только макросы. 
Мы следуем тому же примеру deriving экземпляров `Eq` 
и для простоты поддерживаем тип `Product`, например класс case `Person`. 
Низкоуровневый метод, который будет использовать для реализации метода `derived`, 
использует кавычки, соединения как выражений, так и типов, 
а также `scala.quoted.Expr.summon` метод, эквивалентный методу `summonFrom`. 
Первый подходит для использования в контексте кавычек, используемых в макросах.

Как и в исходном коде, определение класса типа такое же:

```scala
trait Eq[T]:
  def eqv(x: T, y: T): Boolean
```

нам нужно реализовать метод `Eq.derived` для сопутствующего объекта `Eq`, 
который создает quoted экземпляр для `Eq[T]`. 
Вот возможная подпись:

```scala
given derived[T: Type](using Quotes): Expr[Eq[T]]
```

и для сравнения дадим ту же подпись, что и у нас с `inline`:

```scala
inline given derived[T]: (m: Mirror.Of[T]) => Eq[T] = ???
```

Обратите внимание, что поскольку тип используется на последующем этапе, его необходимо поднять до `Type` 
с помощью соответствующей привязки контекста. 
Кроме того, мы не можем вызвать quoted `Mirror` внутри тела `derived`, мы можем опустить его из подписи. 
Тело метода `derived` показано ниже:

```scala
given derived[T: Type](using Quotes): Expr[Eq[T]] =
  import quotes.reflect.*

  val ev: Expr[Mirror.Of[T]] = Expr.summon[Mirror.Of[T]].get

  ev match
    case '{ $m: Mirror.ProductOf[T] { type MirroredElemTypes = elementTypes }} =>
      val elemInstances = summonAll[elementTypes]
      val eqProductBody: (Expr[T], Expr[T]) => Expr[Boolean] = (x, y) =>
        elemInstances.zipWithIndex.foldLeft(Expr(true: Boolean)) {
          case (acc, (elem, index)) =>
            val e1 = '{$x.asInstanceOf[Product].productElement(${Expr(index)})}
            val e2 = '{$y.asInstanceOf[Product].productElement(${Expr(index)})}
            '{ $acc && $elem.asInstanceOf[Eq[Any]].eqv($e1, $e2) }
        }

      '{ eqProduct((x: T, y: T) => ${eqProductBody('x, 'y)}) }

  // case for Mirror.ProductOf[T]
  // ...
```

Обратите внимание, что в этом `inline` случае 
можно просто написать `summonAll[m.MirroredElemTypes]` внутри встроенного метода, 
но здесь, поскольку это необходимо `Expr.summon`, можно извлечь типы элементов в виде макроса. 
Находясь внутри макроса, нашей первой реакцией было бы написать приведенный ниже код. 
Поскольку путь внутри аргумента типа нестабилен, его нельзя использовать:

```scala
'{
  summonAll[$m.MirroredElemTypes]
}
```

Вместо этого мы извлекаем тип кортежа для типов элементов, 
используя сопоставление с образцом по кавычкам и, более конкретно, уточненный тип:

```scala
case '{ $m: Mirror.ProductOf[T] { type MirroredElemTypes = elementTypes }} => ...
```

Ниже показана реализация `summonAll` в виде макроса. 
Предполагается, что given экземпляры для примитивных типов существуют.

```scala
def summonAll[T: Type](using Quotes): List[Expr[Eq[_]]] =
   Type.of[T] match
      case '[String *: tpes] => '{ summon[Eq[String]] } :: summonAll[tpes]
      case '[Int *: tpes]    => '{ summon[Eq[Int]] }    :: summonAll[tpes]
      case '[tpe *: tpes]    => derived[tpe] :: summonAll[tpes]
      case '[EmptyTuple]     => Nil
```

Еще одно отличие тела `derived` здесь от тела с `inline` заключается в том, 
что с макросами нужно синтезировать тело кода во время макрорасширения. 
Это обоснование функции `eqProductBody`. 
Предполагая, что мы вычисляем равенство двух `Persons`, определенных с case классом, 
который содержит имя типа `String` и возраст типа `Int`, 
проверка на равенство, которую хотим сгенерировать, выглядит следующим образом:

```scala
true
   && Eq[String].eqv(x.productElement(0),y.productElement(0))
   && Eq[Int].eqv(x.productElement(1), y.productElement(1))
```

#### Вызов производного метода внутри макроса

Следуя правилам [макросов](@DOC@metaprogramming), мы создаем два метода. 
Первый, в котором размещается соединение верхнего уровня `eqv`, и второй - реализация. 
В качестве альтернативы показанного ниже, можно вызвать метод `eqv` напрямую. 
`eqGen` может вызвать деривацию.

```scala
extension [T](inline x: T)
   inline def === (inline y: T)(using eq: Eq[T]): Boolean = eq.eqv(x, y)

inline given eqGen[T]: Eq[T] = ${ Eq.derived[T] }
```

Обратите внимание, что используется синтаксис inline метода, 
и можно сравнивать экземпляры, `Sm(Person("Test", 23)) === Sm(Person("Test", 24))`, например, для следующих двух типов:

```scala
case class Person(name: String, age: Int)

enum Opt[+T]:
   case Sm(t: T)
   case Nn
```

Полный код показан ниже:

```scala
import scala.deriving.*
import scala.quoted.*


trait Eq[T]:
   def eqv(x: T, y: T): Boolean

object Eq:
   given Eq[String] with
      def eqv(x: String, y: String) = x == y

   given Eq[Int] with
      def eqv(x: Int, y: Int) = x == y

   def eqProduct[T](body: (T, T) => Boolean): Eq[T] =
      new Eq[T]:
         def eqv(x: T, y: T): Boolean = body(x, y)

   def eqSum[T](body: (T, T) => Boolean): Eq[T] =
      new Eq[T]:
         def eqv(x: T, y: T): Boolean = body(x, y)

   def summonAll[T: Type](using Quotes): List[Expr[Eq[_]]] =
      Type.of[T] match
         case '[String *: tpes] => '{ summon[Eq[String]] } :: summonAll[tpes]
         case '[Int *: tpes]    => '{ summon[Eq[Int]] }    :: summonAll[tpes]
         case '[tpe *: tpes]    => derived[tpe] :: summonAll[tpes]
         case '[EmptyTuple]     => Nil

   given derived[T: Type](using q: Quotes): Expr[Eq[T]] =
      import quotes.reflect.*

      val ev: Expr[Mirror.Of[T]] = Expr.summon[Mirror.Of[T]].get

      ev match
         case '{ $m: Mirror.ProductOf[T] { type MirroredElemTypes = elementTypes }} =>
            val elemInstances = summonAll[elementTypes]
            val eqProductBody: (Expr[T], Expr[T]) => Expr[Boolean] = (x, y) =>
               elemInstances.zipWithIndex.foldLeft(Expr(true: Boolean)) {
                  case (acc, (elem, index)) =>
                     val e1 = '{$x.asInstanceOf[Product].productElement(${Expr(index)})}
                     val e2 = '{$y.asInstanceOf[Product].productElement(${Expr(index)})}

                     '{ $acc && $elem.asInstanceOf[Eq[Any]].eqv($e1, $e2) }
               }
            '{ eqProduct((x: T, y: T) => ${eqProductBody('x, 'y)}) }

         case '{ $m: Mirror.SumOf[T] { type MirroredElemTypes = elementTypes }} =>
            val elemInstances = summonAll[elementTypes]
            val eqSumBody: (Expr[T], Expr[T]) => Expr[Boolean] = (x, y) =>
               val ordx = '{ $m.ordinal($x) }
               val ordy = '{ $m.ordinal($y) }

               val elements = Expr.ofList(elemInstances)
               '{ $ordx == $ordy && $elements($ordx).asInstanceOf[Eq[Any]].eqv($x, $y) }

         '{ eqSum((x: T, y: T) => ${eqSumBody('x, 'y)}) }
   end derived
end Eq

object Macro3:
   extension [T](inline x: T)
      inline def === (inline y: T)(using eq: Eq[T]): Boolean = eq.eqv(x, y)

   inline given eqGen[T]: Eq[T] = ${ Eq.derived[T] }
```


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html)
- [Scala 3 Reference, Derivation macros](https://docs.scala-lang.org/scala3/reference/contextual/derivation-macro.html)

